import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { getPlaybookContextForUser } from '@/lib/playbook/db';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';
import { prisma } from '@/lib/prisma';

const requestSchema = z.object({
  contextId: z.string().min(1),
  name: z.string().min(1),
  title: z.string().optional(),
  linkedInUrl: z.string().optional(),
  linkedInText: z.string().optional(),
  interviewerId: z.string().optional(),
  companyName: z.string().optional(),
});

interface InterviewerResearchResult {
  publicPresence: string[];
  careerSummary: string;
  interests: string[];
  connections: string[];
  rapportPoints: { point: string; howToUse: string }[];
}

function parseResearchJson(rawText: string): InterviewerResearchResult | null {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]) as InterviewerResearchResult;
  } catch {
    return null;
  }
}

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

  try {
    requireApiKey();
  } catch {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  const context = await prisma.simulatorCompanyContext.findFirst({
    where: { id: parsed.data.contextId, userId: authResult.user.id },
  });

  if (!context) {
    return NextResponse.json({ error: 'Company context not found' }, { status: 404 });
  }

  const { profileSummary, criteriaSummary } = await getPlaybookContextForUser(authResult.user.id);
  const { name, title, linkedInUrl, linkedInText, interviewerId, companyName } = parsed.data;

  const researchPrompt = `Research this interviewer for an interview candidate who will be meeting with them.

Interviewer name: ${name}
Title: ${title ?? 'unknown'}
Company: ${companyName ?? context.companyName ?? 'unknown'}
LinkedIn URL: ${linkedInUrl ?? 'not provided'}
LinkedIn profile text (raw): ${linkedInText ?? 'not provided'}

Candidate's background for comparison:
${profileSummary}
${criteriaSummary}

Do the following:
1. Search the web for this person — look for articles they've written, talks they've given,
   podcasts they've appeared on, GitHub, Twitter/X, or anything public
2. If LinkedIn text was provided, extract: career history, education, skills, interests,
   recommendations received/given
3. Identify connections between this interviewer and the candidate:
   - Shared professional experiences or companies
   - Similar career trajectory or background
   - Shared technologies or interests
   - Shared geography
   - Shared values or communication style signals
4. Surface 3-5 rapport-building talking points the candidate could naturally weave in

Format as JSON:
{
  "publicPresence": ["what you found about them publicly"],
  "careerSummary": "brief career overview",
  "interests": ["professional interests and passions"],
  "connections": ["specific connections with the candidate"],
  "rapportPoints": [
    {
      "point": "the connection",
      "howToUse": "how the candidate could naturally bring this up"
    }
  ]
}`;

  try {
    const { anthropic } = await import('@/lib/anthropic');
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS * 2,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
      messages: [{ role: 'user', content: researchPrompt }],
    });

    const textBlocks = response.content.filter((b) => b.type === 'text');
    const rawText = textBlocks.map((b) => (b.type === 'text' ? b.text : '')).join('\n');

    const research = parseResearchJson(rawText);
    if (!research) {
      return NextResponse.json({ error: 'Failed to parse research response' }, { status: 500 });
    }

    const rapportPoints = research.rapportPoints.map(
      (r) => `${r.point} — ${r.howToUse}`
    );

    const researchSummary = [
      research.careerSummary,
      '',
      'Public presence:',
      ...research.publicPresence.map((p) => `• ${p}`),
      '',
      'Connections:',
      ...research.connections.map((c) => `• ${c}`),
    ].join('\n');

    let interviewer;
    if (interviewerId) {
      interviewer = await prisma.simulatorInterviewer.update({
        where: { id: interviewerId },
        data: {
          name,
          title,
          linkedInUrl,
          linkedInText,
          researchSummary,
          rapportPoints,
          researchedAt: new Date(),
        },
      });
    } else {
      interviewer = await prisma.simulatorInterviewer.create({
        data: {
          contextId: context.id,
          name,
          title,
          linkedInUrl,
          linkedInText,
          researchSummary,
          rapportPoints,
          researchedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ research, interviewer });
  } catch (err) {
    console.error('[research-interviewer] Error:', err);
    return NextResponse.json({ error: 'Failed to research interviewer' }, { status: 500 });
  }
}
