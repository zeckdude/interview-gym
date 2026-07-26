import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import { getPlaybookContextForUser } from '@/lib/playbook/db';
import {
  parseAllDraftBlocks,
  resolveDraftSubsectionIds,
  stripDraftBlocks,
} from '@/lib/playbook/draft-parser';
import type { PlaybookIntent } from '@/lib/playbook/playbook-context';
import { AI_MODEL, requireApiKey } from '@/lib/anthropic';
import { prisma } from '@/lib/prisma';

const subsectionSchema = z.object({
  id: z.string(),
  label: z.string(),
  textContent: z.string().nullable().optional(),
});

const requestSchema = z.object({
  sessionKey: z.string().min(1),
  intent: z.enum(['add-entry', 'edit-entry', 'edit-subsection']),
  userMessage: z.string().min(1),
  entryId: z.string().nullable().optional(),
  entryTitle: z.string(),
  category: z.string(),
  categoryLabel: z.string(),
  questionPrompt: z.string().nullable().optional(),
  currentSubsection: z.string().nullable().optional(),
  currentSubsectionId: z.string().nullable().optional(),
  subsections: z.array(subsectionSchema),
  isSeeded: z.boolean().optional(),
  suggestedQuestions: z.array(z.string()).optional(),
});

function normalizeAnthropicMessages(
  messages: { role: 'user' | 'assistant'; content: string }[]
): { role: 'user' | 'assistant'; content: string }[] {
  const normalized: { role: 'user' | 'assistant'; content: string }[] = [];

  for (const message of messages) {
    const content =
      message.role === 'assistant' ? stripDraftBlocks(message.content) : message.content.trim();
    if (!content) continue;

    if (normalized.length === 0 && message.role === 'assistant') continue;

    const last = normalized[normalized.length - 1];
    if (last?.role === message.role) {
      last.content = `${last.content}\n\n${content}`;
      continue;
    }

    normalized.push({ role: message.role, content });
  }

  return normalized;
}

function buildSystemPrompt(
  intent: PlaybookIntent,
  entryTitle: string,
  category: string,
  categoryLabel: string,
  questionPrompt: string | null | undefined,
  currentSubsection: string | null | undefined,
  subsections: { id: string; label: string; textContent?: string | null }[],
  profileSummary: string,
  criteriaSummary: string,
  entriesSummary: string,
  isSeeded: boolean | undefined,
  suggestedQuestions: string[] | undefined
): string {
  const subsectionContent = subsections
    .map((s) => `### ${s.label} (id: ${s.id})\n${s.textContent?.trim() ? s.textContent : '(empty)'}`)
    .join('\n\n');

  const emptySubsections = subsections.filter((s) => !s.textContent?.trim()).map((s) => s.label);
  const filledSubsections = subsections.filter((s) => s.textContent?.trim()).map((s) => s.label);

  const intentInstructions: Record<PlaybookIntent, string> = {
    'add-entry': `The user is ADDING a new "${categoryLabel}" entry. Help them pick or craft an interview question, then build ALL template sections — not just the overview. Suggested questions they can pick from:\n${(suggestedQuestions ?? []).map((q) => `- ${q}`).join('\n')}\n\nTemplate sections to fill: ${subsections.map((s) => s.label).join(', ') || 'Answer'}`,
    'edit-entry': `The user is editing the existing entry "${entryTitle}" (already created — do NOT use target: new-entry).
- Fill or rewrite ANY subsection: ${subsections.map((s) => s.label).join(', ')}
- Add metrics, boldness, or business impact
- Change title or interview question via entry-title / entry-question targets
- When user asks to fill, complete, or fix the entry, draft ALL empty sections in one response
${isSeeded ? 'Note: seeded content — cannot delete entry.' : ''}`,
    'edit-subsection': `The user opened AI coach for ONE subsection only: "${currentSubsection}" in entry "${entryTitle}".
- Your job is to improve ONLY "${currentSubsection}" unless they explicitly ask about another section.
- Other subsections below are CONTEXT ONLY — reference them for consistency but do not rewrite them.
- Default every [DRAFT] block to subsection: ${currentSubsection}.`,
  };

  const focusedSubsectionContent = currentSubsection
    ? subsections.find((s) => s.label === currentSubsection)?.textContent?.trim() ||
      '(empty — no content yet)'
    : null;

  const draftRules =
    intent === 'edit-subsection'
      ? `2. When proposing saveable text, use [DRAFT] blocks for "${currentSubsection}" ONLY:
[DRAFT]
target: subsection
subsection: ${currentSubsection}
content: (proposed text)
[/DRAFT]
3. Do NOT draft other subsections in this session unless the user explicitly requests it.
4. Keep conversational text outside [DRAFT] blocks concise (narrow sidebar).`
      : intent === 'edit-entry'
        ? `2. When proposing saveable text, use one [DRAFT] block per subsection (user reviews all, then clicks Submit to Save):
[DRAFT]
target: subsection
subsection: The Business Need
content: (proposed text — can be multiple sentences)
[/DRAFT]

Repeat for each section you are filling in the same response.

For title/question changes:
[DRAFT]
target: entry-title
content: New Title
[/DRAFT]

3. When user asks to fill, complete, or fix the entry (or "all sections"), output a [DRAFT] block for EVERY empty subsection you can support — not just The Overview.
4. ALWAYS use target: subsection — never target: new-entry.
5. Keep conversational text outside [DRAFT] blocks concise (narrow sidebar).`
        : `2. When proposing saveable text, use one [DRAFT] block per subsection:
[DRAFT]
target: new-entry
title: Entry Title
question: Interview question text
subsection: The Overview
content: (proposed text)
[/DRAFT]
Then [DRAFT] blocks with target: subsection for each remaining template section.

3. Build ALL template sections — not just the overview.
4. Keep conversational text outside [DRAFT] blocks concise (narrow sidebar).`;

  return `You are an interview coach inside Interview Gym's My Playbook. You help the user build compelling interview prep content.

${intentInstructions[intent]}

Entry: "${entryTitle}" (category: ${categoryLabel})
Interview question: ${questionPrompt ?? 'not set yet'}
${currentSubsection ? `Focused subsection: "${currentSubsection}"` : ''}
${focusedSubsectionContent ? `\nText the user wants to work on (${currentSubsection}):\n${focusedSubsectionContent}` : ''}

Candidate background (resume, LinkedIn, and links the user saved in Profile & Goals):
${profileSummary}

Existing playbook entries (do not duplicate these — suggest stories from background not yet captured):
${entriesSummary}

Job search criteria:
${criteriaSummary}

Current entry content:
${subsectionContent || '(new entry — no content yet)'}

Subsection status:
${emptySubsections.length ? `- EMPTY (need drafts): ${emptySubsections.join(', ')}` : '- All subsections have content'}
${filledSubsections.length ? `- Already filled: ${filledSubsections.join(', ')}` : ''}

RULES:
1. Be direct — push for boldness, specifics, and business impact. Call out vague or humble language.
${draftRules}
${intent !== 'edit-subsection' ? '6. If you lack specific facts (exact metrics, dates, team size) for a section, ask 1–3 targeted questions in chat. Still draft sections you CAN infer from resume, LinkedIn, or existing entry content.' : '6. If you lack specific facts for this section, ask 1–3 targeted questions before drafting.'}
7. User can free-chat — don't force question picks.
8. ALWAYS read the candidate's resume and LinkedIn text above. Extract employers, products, projects, tech, and outcomes.
9. When brainstorming entries, propose concrete stories from their background. Do NOT claim you lack details if resume/LinkedIn has them.
10. Cross-reference existing playbook entries — don't duplicate stories already documented.`;
}

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const sessionKey = searchParams.get('sessionKey');
  if (!sessionKey) return NextResponse.json({ error: 'Missing sessionKey' }, { status: 400 });

  const clerkUser = await currentUser();
  const email = getClerkUserEmail(clerkUser);
  if (!email) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  });

  const messages = await prisma.chatMessage.findMany({
    where: { userId: user.id, challengeId: sessionKey },
    orderBy: { createdAt: 'asc' },
    select: { id: true, role: true, content: true, createdAt: true },
  });

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    requireApiKey();
  } catch {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  const clerkUser = await currentUser();
  const email = getClerkUserEmail(clerkUser);
  if (!email) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  });

  const { profileSummary, criteriaSummary, entriesSummary } = await getPlaybookContextForUser(user.id);
  const data = parsed.data;

  const systemPrompt = buildSystemPrompt(
    data.intent,
    data.entryTitle,
    data.category,
    data.categoryLabel,
    data.questionPrompt,
    data.currentSubsection,
    data.subsections,
    profileSummary,
    criteriaSummary,
    entriesSummary,
    data.isSeeded,
    data.suggestedQuestions
  );

  const userContent = data.userMessage.trim();
  if (!userContent) {
    return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
  }

  const priorMessages = await prisma.chatMessage.findMany({
    where: { userId: user.id, challengeId: data.sessionKey },
    orderBy: { createdAt: 'asc' },
    select: { role: true, content: true },
  });

  await prisma.chatMessage.create({
    data: {
      userId: user.id,
      challengeId: data.sessionKey,
      role: 'user',
      content: userContent,
    },
  });

  const anthropicMessages = normalizeAnthropicMessages([
    ...priorMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: userContent },
  ]);

  if (anthropicMessages.length === 0 || anthropicMessages.at(-1)?.role !== 'user') {
    return NextResponse.json({ error: 'Could not build conversation history' }, { status: 400 });
  }

  try {
    const { anthropic } = await import('@/lib/anthropic');
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const rawContent =
      response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';

    if (!rawContent) {
      return NextResponse.json({ error: 'Empty response' }, { status: 500 });
    }

    const drafts = resolveDraftSubsectionIds(parseAllDraftBlocks(rawContent), data.subsections);
    const displayContent = stripDraftBlocks(rawContent);
    const draft = drafts[0] ?? null;

    await prisma.chatMessage.create({
      data: {
        userId: user.id,
        challengeId: data.sessionKey,
        role: 'assistant',
        content: rawContent,
      },
    });

    return NextResponse.json({
      content: displayContent || rawContent,
      draft,
      drafts,
    });
  } catch (err) {
    console.error('[playbook-chat] Error:', err);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
