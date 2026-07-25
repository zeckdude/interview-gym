import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { getChallengeById } from '@/data';
import { prisma } from '@/lib/prisma';
import { updatePersonalBest } from '@/lib/personal-bests';

const submitSchema = z.object({
  simulatorChallengeId: z.string().min(1),
  code: z.string(),
  language: z.enum(['javascript', 'typescript']),
  passed: z.boolean(),
  timeSpentMs: z.number().int().nonnegative(),
});

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
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
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
    return NextResponse.json({ error: 'Session already completed' }, { status: 400 });
  }

  const sc = session.challenges.find((c) => c.id === parsed.data.simulatorChallengeId);
  if (!sc) {
    return NextResponse.json({ error: 'Challenge not found in session' }, { status: 404 });
  }

  await prisma.simulatorChallenge.update({
    where: { id: sc.id },
    data: {
      code: parsed.data.code,
      language: parsed.data.language,
      passed: parsed.data.passed,
      timeSpentMs: parsed.data.timeSpentMs,
    },
  });

  const challenge = getChallengeById(sc.challengeId);
  if (challenge) {
    await updatePersonalBest(
      authResult.user.id,
      sc.challengeId,
      parsed.data.timeSpentMs,
      parsed.data.passed
    );

    await prisma.attempt.create({
      data: {
        userId: authResult.user.id,
        challengeId: sc.challengeId,
        challengeType: challenge.category,
        language: parsed.data.language,
        code: parsed.data.code,
        passed: parsed.data.passed,
        timeSpentMs: parsed.data.timeSpentMs,
      },
    });
  }

  const currentIndex = session.challenges.findIndex((c) => c.id === sc.id);
  const nextChallenge = session.challenges[currentIndex + 1] ?? null;
  const isLast = currentIndex === session.challenges.length - 1;

  return NextResponse.json({
    success: true,
    isLast,
    nextSimulatorChallengeId: nextChallenge?.id ?? null,
    nextChallengeId: nextChallenge?.challengeId ?? null,
  });
}
