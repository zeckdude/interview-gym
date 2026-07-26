import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSystemDesignChallengeById } from '@/data/system-design';
import type { SystemDesignDialogMessage } from '@/data/types';
import { requireAuthUser } from '@/lib/ai-auth';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';

const messageSchema = z.object({
  role: z.enum(['assistant', 'user']),
  content: z.string(),
});

const requestSchema = z.object({
  challengeId: z.string().min(1),
  sectionSummaries: z.string().min(1),
  sectionScores: z.record(z.number()),
  dialogHistory: z.array(messageSchema),
  exchangeCount: z.number().int().min(0),
});

export async function POST(request: Request) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

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

  const challenge = getSystemDesignChallengeById(parsed.data.challengeId);
  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  try {
    requireApiKey();
  } catch {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  const { sectionSummaries, sectionScores, dialogHistory, exchangeCount } = parsed.data;
  const isWrapUp = exchangeCount >= 4;

  const systemPrompt = `You are a senior staff engineer conducting a system design interview.

The candidate just submitted their design for: ${challenge.title}

Scenario: ${challenge.scenario}

Their design (summarized):
${sectionSummaries}

Their scores: ${JSON.stringify(sectionScores)}

Seed follow-up questions you may draw from:
${challenge.followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Your job:
1. Ask ONE follow-up question at a time. Start with the biggest gap you identified.
2. If they answer well, acknowledge briefly and move to the next question.
3. If they struggle, ask a simpler version that leads them toward the answer.
4. Do NOT give the answer directly — ask questions that help them arrive at it.
5. After 4-5 user exchanges, tell them "Let's wrap up" and provide a brief summary of what you covered.
6. Be direct but encouraging. This is a real interview simulation.

${isWrapUp ? 'The candidate has answered enough follow-ups. Provide a wrap-up summary now — start with "Let\'s wrap up" and summarize strengths, gaps, and what to study next.' : 'Respond with your next follow-up question or brief acknowledgment + next question.'}`;

  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
    ...dialogHistory.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  if (messages.length === 0) {
    messages.push({
      role: 'user',
      content: 'The candidate has submitted their design. Start with your first follow-up question.',
    });
  }

  try {
    const { anthropic } = await import('@/lib/anthropic');

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      system: systemPrompt,
      messages,
    });

    const content =
      response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';

    if (!content) {
      return NextResponse.json({ error: 'Empty AI response' }, { status: 500 });
    }

    const wrappedUp =
      isWrapUp || content.toLowerCase().includes("let's wrap up");

    return NextResponse.json({
      message: content,
      wrappedUp,
    } satisfies { message: string; wrappedUp: boolean });
  } catch (err) {
    console.error('[system-design-dialog] Error:', err);
    return NextResponse.json({ error: 'Failed to generate dialog response' }, { status: 500 });
  }
}

export type { SystemDesignDialogMessage };
