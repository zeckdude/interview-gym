import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { getChallengeById } from '@/data';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';
import { prisma } from '@/lib/prisma';

const requestSchema = z.object({
  simulatorChallengeId: z.string().min(1),
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

  const sc = await prisma.simulatorChallenge.findUnique({
    where: { id: parsed.data.simulatorChallengeId },
    include: { session: true },
  });

  if (!sc || sc.session.userId !== authResult.user.id) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  if (sc.aiFeedback) {
    return NextResponse.json({ feedback: sc.aiFeedback });
  }

  const challenge = getChallengeById(sc.challengeId);
  if (!challenge) {
    return NextResponse.json({ error: 'Challenge data not found' }, { status: 404 });
  }

  try {
    requireApiKey();
  } catch {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  const minutes = Math.floor((sc.timeSpentMs ?? 0) / 60000);
  const seconds = Math.floor(((sc.timeSpentMs ?? 0) % 60000) / 1000);

  const systemPrompt = `You are reviewing a coding interview performance for a senior frontend engineer.

Give feedback in exactly this format:
**Performance:** One sentence on how they did overall.
**What worked:** One specific thing they did right (even if they failed).
**To improve:** One specific, actionable thing to work on.
**Key concept:** Name the single most important concept this challenge tests.

Keep it under 100 words total. Be direct, warm, and specific.`;

  const userPrompt = `Challenge: ${challenge.title}
Description: ${challenge.description.slice(0, 800)}
User's code:
\`\`\`
${(sc.code ?? '').slice(0, 2000)}
\`\`\`
Passed: ${sc.passed ?? false}
Time spent: ${minutes} minutes ${seconds} seconds`;

  try {
    const { anthropic } = await import('@/lib/anthropic');

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const feedback =
      response.content[0]?.type === 'text' ? response.content[0].text : '';

    await prisma.simulatorChallenge.update({
      where: { id: sc.id },
      data: { aiFeedback: feedback },
    });

    return NextResponse.json({ feedback });
  } catch (err) {
    console.error('[simulator-feedback]', err);
    return NextResponse.json({ error: 'Failed to generate feedback' }, { status: 500 });
  }
}
