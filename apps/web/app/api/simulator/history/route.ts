import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/ai-auth';
import { getChallengeById } from '@/data';
import { prisma } from '@/lib/prisma';
import { computeTimePressureAnalytics } from '@/lib/time-pressure-analytics';

export async function GET() {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const sessions = await prisma.simulatorSession.findMany({
    where: {
      userId: authResult.user.id,
      completedAt: { not: null },
    },
    orderBy: { startedAt: 'desc' },
    include: {
      challenges: { orderBy: { order: 'asc' } },
    },
  });

  const history = sessions.map((s) => {
    const passed = s.challenges.filter((c) => c.passed).length;
    const total = s.challenges.length;
    return {
      id: s.id,
      startedAt: s.startedAt,
      completedAt: s.completedAt,
      difficulty: s.difficulty,
      category: s.category,
      durationMinutes: s.durationMinutes,
      totalScore: s.totalScore,
      passed,
      total,
      challenges: s.challenges.map((sc) => {
        const challenge = getChallengeById(sc.challengeId);
        return {
          id: sc.id,
          challengeId: sc.challengeId,
          title: challenge?.title ?? sc.challengeId,
          difficulty: challenge?.difficulty,
          category: challenge?.category,
          order: sc.order,
          passed: sc.passed,
          timeSpentMs: sc.timeSpentMs,
          aiFeedback: sc.aiFeedback,
        };
      }),
    };
  });

  const analytics = await computeTimePressureAnalytics(authResult.user.id);

  const scoreTrend = sessions
    .slice(0, 10)
    .reverse()
    .map((s) => ({
      date: s.startedAt,
      score: s.totalScore ?? 0,
    }));

  return NextResponse.json({ history, analytics, scoreTrend });
}
