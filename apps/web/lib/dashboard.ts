import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getUserTimezone } from '@/lib/badges';
import { checkAndBreakStreak } from '@/lib/streak';
import { getStartOfWeek } from '@/lib/utils';
import { getNotesForChallenges } from '@/lib/notes';
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
        badges: {
          orderBy: { earnedAt: 'desc' },
          take: 3,
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
        categoryStats: emptyCategoryStats(),
        recentAttempts: [],
        recentBadges: [],
        reviewItems: [],
      };
    }

    const attempts = user.attempts;
    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter((a) => a.passed);
    const challengesPassed = new Set(passedAttempts.map((a) => a.challengeId)).size;
    const passRate =
      totalAttempts > 0 ? Math.round((passedAttempts.length / totalAttempts) * 100) : 0;

    const startOfWeek = getStartOfWeek();
    const thisWeekAttempts = attempts.filter((a) => a.createdAt >= startOfWeek).length;

    const timezone = await getUserTimezone(user.id);
    const streakResult = await checkAndBreakStreak(user.id, timezone);

    const now = new Date();
    const dueItems = await prisma.spacedRepetitionItem.findMany({
      where: {
        userId: user.id,
        nextReviewAt: { lte: now },
      },
      orderBy: { nextReviewAt: 'asc' },
      take: 10,
    });

    const { getChallengeTitle, getCategoryLabel, getChallengeHref } = await import(
      '@/lib/challenge-lookup'
    );

    const noteMap = await getNotesForChallenges(
      user.id,
      dueItems.map((item) => item.challengeId)
    );

    const reviewItems = dueItems.map((item) => {
      const overdueMs = now.getTime() - item.nextReviewAt.getTime();
      const overdueDays = Math.max(0, Math.floor(overdueMs / 86400000));
      return {
        challengeId: item.challengeId,
        challengeTitle: getChallengeTitle(item.challengeId),
        category: getCategoryLabel(item.challengeType),
        difficulty: item.difficulty,
        overdueDays,
        href: getChallengeHref(item.challengeId, item.challengeType),
        hasNote: noteMap.has(item.challengeId),
      };
    });

    const cleanPasses = new Set(
      attempts
        .filter((a) => a.passed && !a.hintUsed)
        .map((a) => a.challengeId)
    ).size;

    return {
      totalAttempts,
      challengesPassed,
      passRate,
      cleanPasses,
      currentStreak: streakResult.currentStreak,
      thisWeekAttempts,
      categoryStats: computeCategoryStats(attempts),
      recentAttempts: attempts.slice(0, 10),
      recentBadges: user.badges.map((b) => ({
        slug: b.slug,
        name: b.name,
        emoji: b.emoji,
        description: b.description,
        earnedAt: b.earnedAt.toISOString(),
      })),
      reviewItems,
      needsFreezeDecision: streakResult.needsFreezeDecision,
      freezesAvailable: streakResult.freezesAvailable,
    };
  } catch {
    return {
      totalAttempts: 0,
      challengesPassed: 0,
      passRate: 0,
      currentStreak: 0,
      thisWeekAttempts: 0,
      categoryStats: emptyCategoryStats(),
      recentAttempts: [],
      recentBadges: [],
      reviewItems: [],
    };
  }
}

function emptyCategoryStats(): Record<
  keyof typeof CATEGORY_TOTALS,
  { completed: number; passRate: number }
> {
  return Object.fromEntries(
    Object.keys(CATEGORY_TOTALS).map((key) => [key, { completed: 0, passRate: 0 }])
  ) as Record<keyof typeof CATEGORY_TOTALS, { completed: number; passRate: number }>;
}

const LEGACY_CHALLENGE_TYPE_ALIASES: Partial<
  Record<string, keyof typeof CATEGORY_TOTALS>
> = {
  be: 'be-nodejs',
  fe: 'stack-javascript',
};

function normalizeChallengeType(
  challengeType: string
): keyof typeof CATEGORY_TOTALS | null {
  if (challengeType in CATEGORY_TOTALS) {
    return challengeType as keyof typeof CATEGORY_TOTALS;
  }
  return LEGACY_CHALLENGE_TYPE_ALIASES[challengeType] ?? null;
}

function computeCategoryStats(
  attempts: { challengeId: string; challengeType: string; passed: boolean }[]
) {
  const stats = emptyCategoryStats();

  for (const type of Object.keys(CATEGORY_TOTALS) as Array<keyof typeof CATEGORY_TOTALS>) {
    const typeAttempts = attempts.filter((attempt) => {
      const normalized = normalizeChallengeType(attempt.challengeType);
      return normalized === type;
    });
    const passedIds = new Set(typeAttempts.filter((a) => a.passed).map((a) => a.challengeId));
    stats[type] = {
      completed: passedIds.size,
      passRate:
        typeAttempts.length > 0
          ? Math.round(
              (typeAttempts.filter((a) => a.passed).length / typeAttempts.length) * 100
            )
          : 0,
    };
  }

  return stats;
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
