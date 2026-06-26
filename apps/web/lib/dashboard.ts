import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getStartOfWeek } from '@/lib/utils';
import { CATEGORY_TOTALS } from '@/data';

export async function getDashboardData() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      attempts: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    return {
      totalAttempts: 0,
      challengesPassed: 0,
      passRate: 0,
      currentStreak: 0,
      thisWeekAttempts: 0,
      categoryStats: {
        be: { completed: 0, passRate: 0 },
        fe: { completed: 0, passRate: 0 },
        'fe-advanced': { completed: 0, passRate: 0 },
        'be-question': { completed: 0, passRate: 0 },
        'fe-question': { completed: 0, passRate: 0 },
      },
      recentAttempts: [],
    };
  }

  const attempts = user.attempts;
  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter((a) => a.passed);
  const challengesPassed = new Set(
    passedAttempts.map((a) => a.challengeId)
  ).size;
  const passRate =
    totalAttempts > 0
      ? Math.round((passedAttempts.length / totalAttempts) * 100)
      : 0;

  const startOfWeek = getStartOfWeek();
  const thisWeekAttempts = attempts.filter(
    (a) => a.createdAt >= startOfWeek
  ).length;

  const categoryStats = computeCategoryStats(attempts);

  return {
    totalAttempts,
    challengesPassed,
    passRate,
    currentStreak: 0,
    thisWeekAttempts,
    categoryStats,
    recentAttempts: attempts.slice(0, 10),
  };
  } catch {
    return {
      totalAttempts: 0,
      challengesPassed: 0,
      passRate: 0,
      currentStreak: 0,
      thisWeekAttempts: 0,
      categoryStats: {
        be: { completed: 0, passRate: 0 },
        fe: { completed: 0, passRate: 0 },
        'fe-advanced': { completed: 0, passRate: 0 },
        'be-question': { completed: 0, passRate: 0 },
        'fe-question': { completed: 0, passRate: 0 },
      },
      recentAttempts: [],
    };
  }
}

function computeCategoryStats(
  attempts: { challengeId: string; challengeType: string; passed: boolean }[]
) {
  const types = ['be', 'fe', 'fe-advanced', 'be-question', 'fe-question'] as const;

  return Object.fromEntries(
    types.map((type) => {
      const typeAttempts = attempts.filter((a) => a.challengeType === type);
      const passedIds = new Set(
        typeAttempts.filter((a) => a.passed).map((a) => a.challengeId)
      );
      const passRate =
        typeAttempts.length > 0
          ? Math.round(
              (typeAttempts.filter((a) => a.passed).length / typeAttempts.length) *
                100
            )
          : 0;

      return [type, { completed: passedIds.size, passRate }];
    })
  ) as Record<
    keyof typeof CATEGORY_TOTALS,
    { completed: number; passRate: number }
  >;
}

export async function getChallengeAttemptStats() {
  const { userId } = await auth();

  if (!userId) {
    return new Map<string, { count: number; passed: boolean }>();
  }

  try {
    const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { attempts: true },
  });

  if (!user) {
    return new Map<string, { count: number; passed: boolean }>();
  }

  const stats = new Map<string, { count: number; passed: boolean }>();

  for (const attempt of user.attempts) {
    const existing = stats.get(attempt.challengeId) ?? {
      count: 0,
      passed: false,
    };
    stats.set(attempt.challengeId, {
      count: existing.count + 1,
      passed: existing.passed || attempt.passed,
    });
  }

  return stats;
  } catch {
    return new Map<string, { count: number; passed: boolean }>();
  }
}
