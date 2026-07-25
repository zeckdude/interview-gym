import { prisma } from '@/lib/prisma';
import { getChallengeById } from '@/data';

export interface TimePressureAnalytics {
  avgTimedPassRate: number;
  avgUntimedPassRate: number;
  difference: number;
  fastestCategory: string;
  slowestCategory: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  be: 'Backend',
  fe: 'Frontend Essential',
  'fe-advanced': 'FE Advanced',
};

export async function computeTimePressureAnalytics(
  userId: string
): Promise<TimePressureAnalytics | null> {
  const [simulatorChallenges, regularAttempts] = await Promise.all([
    prisma.simulatorChallenge.findMany({
      where: {
        session: { userId, completedAt: { not: null } },
        passed: { not: null },
      },
      select: { passed: true, timeSpentMs: true, challengeId: true },
    }),
    prisma.attempt.findMany({
      where: {
        userId,
        challengeType: { in: ['be', 'fe', 'fe-advanced'] },
      },
      select: { passed: true, challengeType: true, timeSpentMs: true },
    }),
  ]);

  if (simulatorChallenges.length === 0 && regularAttempts.length === 0) {
    return null;
  }

  const timedPassed = simulatorChallenges.filter((c) => c.passed).length;
  const timedTotal = simulatorChallenges.length;
  const avgTimedPassRate = timedTotal > 0 ? (timedPassed / timedTotal) * 100 : 0;

  const untimedPassed = regularAttempts.filter((a) => a.passed).length;
  const untimedTotal = regularAttempts.length;
  const avgUntimedPassRate = untimedTotal > 0 ? (untimedPassed / untimedTotal) * 100 : 0;

  const difference = avgTimedPassRate - avgUntimedPassRate;

  // Category timing from simulator challenges only
  const categoryTimes: Record<string, number[]> = {};
  for (const sc of simulatorChallenges) {
    if (!sc.passed || !sc.timeSpentMs) continue;
    const challenge = getChallengeById(sc.challengeId);
    if (!challenge) continue;
    const cat = challenge.category;
    if (!categoryTimes[cat]) categoryTimes[cat] = [];
    categoryTimes[cat].push(sc.timeSpentMs);
  }

  const categoryAvgs = Object.entries(categoryTimes).map(([cat, times]) => ({
    cat,
    avg: times.reduce((a, b) => a + b, 0) / times.length,
  }));

  let fastestCategory = 'N/A';
  let slowestCategory = 'N/A';

  if (categoryAvgs.length > 0) {
    categoryAvgs.sort((a, b) => a.avg - b.avg);
    fastestCategory = CATEGORY_LABELS[categoryAvgs[0].cat] ?? categoryAvgs[0].cat;
    slowestCategory =
      CATEGORY_LABELS[categoryAvgs[categoryAvgs.length - 1].cat] ??
      categoryAvgs[categoryAvgs.length - 1].cat;
  }

  return {
    avgTimedPassRate: Math.round(avgTimedPassRate),
    avgUntimedPassRate: Math.round(avgUntimedPassRate),
    difference: Math.round(difference),
    fastestCategory,
    slowestCategory,
  };
}
