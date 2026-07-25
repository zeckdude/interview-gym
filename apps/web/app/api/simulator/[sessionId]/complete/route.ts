import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { getChallengeById } from '@/data';
import { prisma } from '@/lib/prisma';
import { calculateSessionScore } from '@/lib/simulator';
import { updateStreak } from '@/lib/streak';
import { getUserTimezone } from '@/lib/badges';

const completeSchema = z.object({
  earlyExit: z.boolean().optional().default(false),
  pendingSubmissions: z
    .array(
      z.object({
        simulatorChallengeId: z.string(),
        code: z.string().default(''),
        language: z.enum(['javascript', 'typescript']).default('typescript'),
        passed: z.boolean().default(false),
        timeSpentMs: z.number().int().nonnegative().default(0),
      })
    )
    .optional()
    .default([]),
});

async function generateFeedbackForChallenge(
  challengeId: string,
  code: string,
  passed: boolean,
  timeSpentMs: number
): Promise<string> {
  const challenge = getChallengeById(challengeId);
  if (!challenge) return 'Challenge data unavailable.';

  try {
    const { anthropic, AI_MODEL, AI_MAX_TOKENS, requireApiKey } = await import(
      '@/lib/anthropic'
    );
    requireApiKey();

    const minutes = Math.floor(timeSpentMs / 60000);
    const seconds = Math.floor((timeSpentMs % 60000) / 1000);

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
${code.slice(0, 2000)}
\`\`\`
Passed: ${passed}
Time spent: ${minutes} minutes ${seconds} seconds`;

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    return response.content[0]?.type === 'text' ? response.content[0].text : '';
  } catch (err) {
    console.error('[simulator-feedback]', err);
    return passed
      ? '**Performance:** You passed this challenge. **What worked:** Your solution met the requirements. **To improve:** Review for edge cases and cleaner patterns. **Key concept:** See the challenge concepts list.'
      : '**Performance:** This one didn\'t pass. **What worked:** You made an attempt under time pressure. **To improve:** Revisit this challenge in practice mode. **Key concept:** See the challenge concepts list.';
  }
}

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsed = completeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const session = await prisma.simulatorSession.findUnique({
    where: { id: params.sessionId },
    include: { challenges: { orderBy: { order: 'asc' } } },
  });

  if (!session || session.userId !== authResult.user.id) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  if (session.completedAt) {
    return NextResponse.json({
      sessionId: session.id,
      totalScore: session.totalScore,
      alreadyCompleted: true,
    });
  }

  // Save any pending submissions (timer expiry / early exit)
  for (const pending of parsed.data.pendingSubmissions) {
    const sc = session.challenges.find((c) => c.id === pending.simulatorChallengeId);
    if (sc && sc.passed === null) {
      await prisma.simulatorChallenge.update({
        where: { id: sc.id },
        data: {
          code: pending.code,
          language: pending.language,
          passed: pending.passed,
          timeSpentMs: pending.timeSpentMs,
        },
      });
    }
  }

  const updatedChallenges = await prisma.simulatorChallenge.findMany({
    where: { sessionId: session.id },
    orderBy: { order: 'asc' },
  });

  const totalScore = calculateSessionScore(updatedChallenges);

  await prisma.simulatorSession.update({
    where: { id: session.id },
    data: { completedAt: new Date(), totalScore },
  });

  const timezone = await getUserTimezone(authResult.user.id);
  await updateStreak(authResult.user.id, timezone);

  // Fire AI feedback in parallel (don't block response)
  const feedbackPromises = updatedChallenges.map(async (sc) => {
    const feedback = await generateFeedbackForChallenge(
      sc.challengeId,
      sc.code ?? '',
      sc.passed ?? false,
      sc.timeSpentMs ?? 0
    );
    await prisma.simulatorChallenge.update({
      where: { id: sc.id },
      data: { aiFeedback: feedback },
    });
  });

  // Start feedback generation without awaiting in the response
  Promise.all(feedbackPromises).catch((err) =>
    console.error('[simulator-complete] feedback error:', err)
  );

  return NextResponse.json({
    sessionId: session.id,
    totalScore,
    redirectUrl: `/simulator/${session.id}/results`,
  });
}
