import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/ai-auth';
import { getChallengeById } from '@/data';
import { prisma } from '@/lib/prisma';
import { getPersonalBestsForChallenges } from '@/lib/personal-bests';

export async function GET(
  _request: Request,
  { params }: { params: { sessionId: string } }
) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const session = await prisma.simulatorSession.findUnique({
    where: { id: params.sessionId },
    include: {
      challenges: { orderBy: { order: 'asc' } },
    },
  });

  if (!session || session.userId !== authResult.user.id) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const challengeIds = session.challenges.map((c) => c.challengeId);
  const personalBests = await getPersonalBestsForChallenges(
    authResult.user.id,
    challengeIds
  );

  const challenges = session.challenges.map((sc) => {
    const challenge = getChallengeById(sc.challengeId);
    return {
      id: sc.id,
      order: sc.order,
      challengeId: sc.challengeId,
      title: challenge?.title ?? sc.challengeId,
      category: challenge?.category,
      difficulty: challenge?.difficulty,
      passed: sc.passed,
      timeSpentMs: sc.timeSpentMs,
      aiFeedback: sc.aiFeedback,
      personalBestMs: personalBests[sc.challengeId] ?? null,
    };
  });

  return NextResponse.json({
    id: session.id,
    difficulty: session.difficulty,
    category: session.category,
    durationMinutes: session.durationMinutes,
    challengeCount: session.challengeCount,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    totalScore: session.totalScore,
    challenges,
  });
}
