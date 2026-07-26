import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { getPlaybookContextForUser } from '@/lib/playbook/db';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';

const requestSchema = z.object({
  questionPrompt: z.string().optional(),
  subsectionLabel: z.string().min(1),
  userAnswer: z.string().min(1),
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

  try {
    requireApiKey();
  } catch {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  const { profileSummary, criteriaSummary } = await getPlaybookContextForUser(authResult.user.id);
  const { questionPrompt, subsectionLabel, userAnswer } = parsed.data;

  const coachingPrompt = `You are an interview coach helping a senior frontend engineer prepare for technical interviews.

Candidate background: ${profileSummary}
Target roles: ${criteriaSummary}

The candidate just recorded this answer to the prompt: "${questionPrompt ?? 'General interview question'}"
Section: "${subsectionLabel}"
Their answer: "${userAnswer}"

Your job:
1. Reformulate their answer as clean bullet points — detailed enough to convey the full story, not so concise that the substance is lost
2. Identify any gaps or missed opportunities and ask a specific follow-up question to get more information
3. Push them to be BOLD and CONFIDENT — if they're being too humble or vague, call it out and show them a stronger version
4. Wherever applicable, push them to include business impact, metrics, or outcomes — "we built X" is weak; "we built X which reduced Y by Z%" is compelling
5. If their answer is insufficient, tell them exactly what's missing and why it matters in interviews
6. Never let them undersell themselves — if they did something impressive, make sure the answer sounds impressive

Format your response as:
**Stronger version:** [bullet point reformulation]
**What to add:** [specific follow-up question if something is missing]
**Coach's note:** [1 sentence of direct feedback — be honest, be encouraging, push them]

Keep it concise. Max 200 words total.`;

  try {
    const { anthropic } = await import('@/lib/anthropic');
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      messages: [{ role: 'user', content: coachingPrompt }],
    });

    const feedback =
      response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';

    if (!feedback) {
      return NextResponse.json({ error: 'Empty coaching response' }, { status: 500 });
    }

    const strongerMatch = feedback.match(/\*\*Stronger version:\*\*\s*([\s\S]*?)(?=\*\*What to add:|\*\*Coach's note:|$)/i);
    const strongerVersion = strongerMatch?.[1]?.trim() ?? feedback;

    return NextResponse.json({ feedback, strongerVersion });
  } catch (err) {
    console.error('[playbook-coach] Error:', err);
    return NextResponse.json({ error: 'Failed to generate coaching' }, { status: 500 });
  }
}
