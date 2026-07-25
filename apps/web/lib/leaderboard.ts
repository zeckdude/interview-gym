import { auth } from '@clerk/nextjs/server';
import {
  allChallenges,
  allQuestions,
  CATEGORY_TOTALS,
} from '@/data';
import type { ChallengeDifficulty } from '@/data/types';
import { getChallengeTitle } from '@/lib/challenge-lookup';
import { isCleanPass } from '@/lib/notes';
import { prisma } from '@/lib/prisma';
import { getWeakSpotsForUser } from '@/lib/weak-spots';

const CATEGORY_LABELS: Record<keyof typeof CATEGORY_TOTALS, string> = {
  be: 'Backend Coding',
  fe: 'React Essential',
  'fe-advanced': 'React Advanced',
  nextjs: 'Next.js Coding',
  'be-question': 'Backend Questions',
  'fe-question': 'React Questions',
  'nextjs-question': 'Next.js Questions',
};

export interface CategoryBreakdownRow {
  label: string;
  type: keyof typeof CATEGORY_TOTALS;
  passed: number;
  total: number;
  passRate: number;
  avgTimeMs: number | null;
  bestTimeMs: number | null;
}

export interface ChallengeBestRow {
  challengeId: string;
  title: string;
  difficulty: ChallengeDifficulty;
  challengeType: string;
  passed: boolean;
  cleanPass: boolean;
  attempts: number;
  bestTimeMs: number | null;
  firstPassedAt: string | null;
  isWeakSpot: boolean;
  failedAttempts: number;
}

export interface LeaderboardData {
  overall: {
    totalPassed: number;
    cleanPasses: number;
    totalChallenges: number;
    passRate: number;
    longestStreak: number;
    totalTimeSpentMs: number;
    simulatorSessionsCompleted: number;
    bestSimulatorScore: number | null;
  };
  categoryBreakdown: CategoryBreakdownRow[];
  challengeBests: ChallengeBestRow[];
}

function isCodingType(type: string): boolean {
  return ['be', 'fe', 'fe-advanced'].includes(type);
}

export async function getLeaderboardData(): Promise<LeaderboardData> {
  const { userId } = await auth();
  if (!userId) return emptyLeaderboardData();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      attempts: true,
      personalBests: true,
      streak: true,
      simulatorSessions: true,
    },
  });

  if (!user) {
    return emptyLeaderboardData();
  }

  const weakSpots = await getWeakSpotsForUser(user.id);
  const weakSpotMap = Object.fromEntries(
    weakSpots.map((s) => [s.challengeId, s.failedAttempts])
  );

  const totalChallenges = Object.values(CATEGORY_TOTALS).reduce((a, b) => a + b, 0);
  const passedIds = new Set(
    user.attempts.filter((a) => a.passed).map((a) => a.challengeId)
  );
  const totalPassed = passedIds.size;
  const cleanPassedIds = new Set(
    user.attempts
      .filter((a) => a.passed && !a.hintUsed)
      .map((a) => a.challengeId)
  );
  const totalAttempts = user.attempts.length;
  const passRate =
    totalAttempts > 0
      ? Math.round(
          (user.attempts.filter((a) => a.passed).length / totalAttempts) * 100
        )
      : 0;

  const totalTimeSpentMs = user.attempts.reduce(
    (sum, a) => sum + (a.timeSpentMs ?? 0),
    0
  );

  const completedSessions = user.simulatorSessions.filter((s) => s.completedAt);
  const bestSimulatorScore =
    completedSessions.length > 0
      ? Math.max(...completedSessions.map((s) => s.totalScore ?? 0))
      : null;

  const personalBestMap = Object.fromEntries(
    user.personalBests.map((b) => [b.challengeId, b.bestTimeMs])
  );

  const categoryBreakdown = (
    Object.keys(CATEGORY_TOTALS) as (keyof typeof CATEGORY_TOTALS)[]
  ).map((type) => {
    const typeAttempts = user.attempts.filter((a) => a.challengeType === type);
    const typePassedIds = new Set(
      typeAttempts.filter((a) => a.passed).map((a) => a.challengeId)
    );
    const typePassRate =
      typeAttempts.length > 0
        ? Math.round(
            (typeAttempts.filter((a) => a.passed).length / typeAttempts.length) *
              100
          )
        : 0;

    let avgTimeMs: number | null = null;
    let bestTimeMs: number | null = null;

    if (isCodingType(type)) {
      const passingWithTime = typeAttempts.filter(
        (a) => a.passed && a.timeSpentMs != null
      );
      if (passingWithTime.length > 0) {
        avgTimeMs = Math.round(
          passingWithTime.reduce((sum, a) => sum + (a.timeSpentMs ?? 0), 0) /
            passingWithTime.length
        );
      }

      const bestsForType = user.personalBests.filter((b) => {
        const attempt = typeAttempts.find((a) => a.challengeId === b.challengeId);
        return attempt != null;
      });
      if (bestsForType.length > 0) {
        bestTimeMs = Math.min(...bestsForType.map((b) => b.bestTimeMs));
      }
    }

    return {
      label: CATEGORY_LABELS[type],
      type,
      passed: typePassedIds.size,
      total: CATEGORY_TOTALS[type],
      passRate: typePassRate,
      avgTimeMs,
      bestTimeMs,
    };
  });

  const challengeBests: ChallengeBestRow[] = [];

  for (const challenge of allChallenges.filter((c) => !c.comingSoon)) {
    const typeAttempts = user.attempts.filter((a) => a.challengeId === challenge.id);
    const passed = typeAttempts.some((a) => a.passed);
    const firstPass = typeAttempts.find((a) => a.passed);

    challengeBests.push({
      challengeId: challenge.id,
      title: challenge.title,
      difficulty: challenge.difficulty,
      challengeType: challenge.category,
      passed,
      cleanPass: isCleanPass(user.attempts, challenge.id),
      attempts: typeAttempts.length,
      bestTimeMs: personalBestMap[challenge.id] ?? null,
      firstPassedAt: firstPass?.createdAt.toISOString() ?? null,
      isWeakSpot: challenge.id in weakSpotMap,
      failedAttempts: weakSpotMap[challenge.id] ?? 0,
    });
  }

  for (const question of allQuestions) {
    const typeAttempts = user.attempts.filter((a) => a.challengeId === question.id);
    const passed = typeAttempts.some((a) => a.passed);
    const firstPass = typeAttempts.find((a) => a.passed);

    challengeBests.push({
      challengeId: question.id,
      title: getChallengeTitle(question.id),
      difficulty: question.difficulty,
      challengeType: question.category,
      passed,
      cleanPass: isCleanPass(user.attempts, question.id),
      attempts: typeAttempts.length,
      bestTimeMs: null,
      firstPassedAt: firstPass?.createdAt.toISOString() ?? null,
      isWeakSpot: question.id in weakSpotMap,
      failedAttempts: weakSpotMap[question.id] ?? 0,
    });
  }

  return {
    overall: {
      totalPassed,
      cleanPasses: cleanPassedIds.size,
      totalChallenges,
      passRate,
      longestStreak: user.streak?.longestStreak ?? 0,
      totalTimeSpentMs,
      simulatorSessionsCompleted: completedSessions.length,
      bestSimulatorScore,
    },
    categoryBreakdown,
    challengeBests,
  };
}

function emptyLeaderboardData(): LeaderboardData {
  const categoryBreakdown = (
    Object.keys(CATEGORY_TOTALS) as (keyof typeof CATEGORY_TOTALS)[]
  ).map((type) => ({
    label: CATEGORY_LABELS[type],
    type,
    passed: 0,
    total: CATEGORY_TOTALS[type],
    passRate: 0,
    avgTimeMs: null,
    bestTimeMs: null,
  }));

  const challengeBests: ChallengeBestRow[] = [];

  for (const challenge of allChallenges.filter((c) => !c.comingSoon)) {
    challengeBests.push({
      challengeId: challenge.id,
      title: challenge.title,
      difficulty: challenge.difficulty,
      challengeType: challenge.category,
      passed: false,
      cleanPass: false,
      attempts: 0,
      bestTimeMs: null,
      firstPassedAt: null,
      isWeakSpot: false,
      failedAttempts: 0,
    });
  }

  for (const question of allQuestions) {
    challengeBests.push({
      challengeId: question.id,
      title: getChallengeTitle(question.id),
      difficulty: question.difficulty,
      challengeType: question.category,
      passed: false,
      cleanPass: false,
      attempts: 0,
      bestTimeMs: null,
      firstPassedAt: null,
      isWeakSpot: false,
      failedAttempts: 0,
    });
  }

  const totalChallenges = Object.values(CATEGORY_TOTALS).reduce((a, b) => a + b, 0);

  return {
    overall: {
      totalPassed: 0,
      cleanPasses: 0,
      totalChallenges,
      passRate: 0,
      longestStreak: 0,
      totalTimeSpentMs: 0,
      simulatorSessionsCompleted: 0,
      bestSimulatorScore: null,
    },
    categoryBreakdown,
    challengeBests,
  };
}

export interface ShareProgressData {
  displayName: string;
  passRate: number;
  totalPassed: number;
  totalChallenges: number;
  categoryBreakdown: CategoryBreakdownRow[];
  currentStreak: number;
  badges: { name: string; emoji: string }[];
  bestSimulatorScore: number | null;
}

export async function getShareProgressData(
  token: string
): Promise<ShareProgressData | null> {
  const shareToken = await prisma.shareToken.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          attempts: true,
          personalBests: true,
          streak: true,
          badges: { orderBy: { earnedAt: 'desc' } },
          simulatorSessions: true,
        },
      },
    },
  });

  if (!shareToken) return null;

  const user = shareToken.user;
  const totalChallenges = Object.values(CATEGORY_TOTALS).reduce((a, b) => a + b, 0);
  const passedIds = new Set(
    user.attempts.filter((a) => a.passed).map((a) => a.challengeId)
  );
  const totalAttempts = user.attempts.length;
  const passRate =
    totalAttempts > 0
      ? Math.round(
          (user.attempts.filter((a) => a.passed).length / totalAttempts) * 100
        )
      : 0;

  const completedSessions = user.simulatorSessions.filter((s) => s.completedAt);
  const bestSimulatorScore =
    completedSessions.length > 0
      ? Math.max(...completedSessions.map((s) => s.totalScore ?? 0))
      : null;

  const categoryBreakdown = (
    Object.keys(CATEGORY_TOTALS) as (keyof typeof CATEGORY_TOTALS)[]
  ).map((type) => {
    const typeAttempts = user.attempts.filter((a) => a.challengeType === type);
    const typePassedIds = new Set(
      typeAttempts.filter((a) => a.passed).map((a) => a.challengeId)
    );
    const typePassRate =
      typeAttempts.length > 0
        ? Math.round(
            (typeAttempts.filter((a) => a.passed).length / typeAttempts.length) *
              100
          )
        : 0;

    return {
      label: CATEGORY_LABELS[type],
      type,
      passed: typePassedIds.size,
      total: CATEGORY_TOTALS[type],
      passRate: typePassRate,
      avgTimeMs: null,
      bestTimeMs: null,
    };
  });

  const emailPrefix = user.email.split('@')[0] ?? 'User';
  const displayName =
    emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1).replace(/[._]/g, ' ');

  return {
    displayName,
    passRate,
    totalPassed: passedIds.size,
    totalChallenges,
    categoryBreakdown,
    currentStreak: user.streak?.currentStreak ?? 0,
    badges: user.badges.map((b) => ({ name: b.name, emoji: b.emoji })),
    bestSimulatorScore,
  };
}

export interface WeaknessAnalysisInput {
  totalAttempts: number;
  passRate: number;
  byCategory: Record<string, { passed: number; total: number; passRate: number }>;
  weakSpots: { challengeTitle: string; failedAttempts: number }[];
  strongestCategory: string;
  weakestCategory: string;
  simulatorPassRate: number;
  regularPassRate: number;
  recentTrend: 'improving' | 'declining' | 'stable';
}

export async function buildWeaknessAnalysisInput(
  userId: string
): Promise<WeaknessAnalysisInput> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      attempts: { orderBy: { createdAt: 'desc' } },
      simulatorSessions: true,
    },
  });

  if (!user) {
    return {
      totalAttempts: 0,
      passRate: 0,
      byCategory: {},
      weakSpots: [],
      strongestCategory: 'None yet',
      weakestCategory: 'None yet',
      simulatorPassRate: 0,
      regularPassRate: 0,
      recentTrend: 'stable',
    };
  }

  const weakSpotsRaw = await getWeakSpotsForUser(userId);
  const weakSpots = weakSpotsRaw.map((s) => ({
    challengeTitle: getChallengeTitle(s.challengeId),
    failedAttempts: s.failedAttempts,
  }));

  const totalAttempts = user.attempts.length;
  const passRate =
    totalAttempts > 0
      ? Math.round(
          (user.attempts.filter((a) => a.passed).length / totalAttempts) * 100
        )
      : 0;

  const types = Object.keys(CATEGORY_TOTALS) as (keyof typeof CATEGORY_TOTALS)[];
  const byCategory: WeaknessAnalysisInput['byCategory'] = {};

  for (const type of types) {
    const typeAttempts = user.attempts.filter((a) => a.challengeType === type);
    const passed = new Set(
      typeAttempts.filter((a) => a.passed).map((a) => a.challengeId)
    ).size;
    byCategory[type] = {
      passed,
      total: CATEGORY_TOTALS[type],
      passRate:
        typeAttempts.length > 0
          ? Math.round(
              (typeAttempts.filter((a) => a.passed).length / typeAttempts.length) *
                100
            )
          : 0,
    };
  }

  const categoryRates = types
    .map((type) => ({
      label: CATEGORY_LABELS[type],
      rate: byCategory[type]?.passRate ?? 0,
      attempted: user.attempts.some((a) => a.challengeType === type),
    }))
    .filter((c) => c.attempted);

  const strongestCategory =
    categoryRates.length > 0
      ? categoryRates.reduce((best, c) => (c.rate > best.rate ? c : best)).label
      : 'None yet';
  const weakestCategory =
    categoryRates.length > 0
      ? categoryRates.reduce((worst, c) => (c.rate < worst.rate ? c : worst)).label
      : 'None yet';

  const regularAttempts = user.attempts.filter((a) => a.challengeType !== 'simulator');
  const regularPassRate =
    regularAttempts.length > 0
      ? Math.round(
          (regularAttempts.filter((a) => a.passed).length / regularAttempts.length) *
            100
        )
      : 0;

  const simulatorChallenges = await prisma.simulatorChallenge.findMany({
    where: {
      session: { userId: user.id, completedAt: { not: null } },
    },
  });
  const simulatorPassRate =
    simulatorChallenges.length > 0
      ? Math.round(
          (simulatorChallenges.filter((c) => c.passed).length /
            simulatorChallenges.length) *
            100
        )
      : 0;

  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const recent = user.attempts.filter(
    (a) => now - a.createdAt.getTime() < weekMs
  );
  const previous = user.attempts.filter((a) => {
    const age = now - a.createdAt.getTime();
    return age >= weekMs && age < weekMs * 2;
  });

  const recentRate =
    recent.length > 0
      ? recent.filter((a) => a.passed).length / recent.length
      : null;
  const previousRate =
    previous.length > 0
      ? previous.filter((a) => a.passed).length / previous.length
      : null;

  let recentTrend: WeaknessAnalysisInput['recentTrend'] = 'stable';
  if (recentRate != null && previousRate != null) {
    if (recentRate > previousRate + 0.05) recentTrend = 'improving';
    else if (recentRate < previousRate - 0.05) recentTrend = 'declining';
  }

  return {
    totalAttempts,
    passRate,
    byCategory,
    weakSpots,
    strongestCategory,
    weakestCategory,
    simulatorPassRate,
    regularPassRate,
    recentTrend,
  };
}
