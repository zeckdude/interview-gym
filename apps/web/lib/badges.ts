import { BADGE_DEFINITIONS, type BadgeDefinition } from '@/data/badges';
import { CATEGORY_TOTALS } from '@/data';
import { getChallengeDifficulty } from '@/lib/challenge-lookup';
import {
  applyDifficultyCap,
  calculateNextReview,
  qualityFromAttempt,
} from '@/lib/spaced-repetition';
import { prisma } from '@/lib/prisma';

export interface AwardedBadge {
  slug: string;
  name: string;
  emoji: string;
  description: string;
}

export async function checkAndAwardBadges(userId: string): Promise<AwardedBadge[]> {
  const [existingBadges, attempts, streak, lessonProgress] = await Promise.all([
    prisma.badge.findMany({ where: { userId }, select: { slug: true } }),
    prisma.attempt.findMany({ where: { userId } }),
    prisma.streak.findUnique({ where: { userId } }),
    prisma.lessonProgress.findMany({ where: { userId, completed: true } }),
  ]);

  const earnedSlugs = new Set(existingBadges.map((b) => b.slug));
  const newlyAwarded: AwardedBadge[] = [];

  const passedAttempts = attempts.filter((a) => a.passed);
  const totalAttempts = attempts.length;
  const passedByChallenge = new Map<string, boolean>();
  for (const a of passedAttempts) {
    passedByChallenge.set(a.challengeId, true);
  }

  const passedByType = new Map<string, Set<string>>();
  for (const a of passedAttempts) {
    const set = passedByType.get(a.challengeType) ?? new Set();
    set.add(a.challengeId);
    passedByType.set(a.challengeType, set);
  }

  const passedCountForTypes = (types: string[]) =>
    types.reduce((sum, type) => sum + (passedByType.get(type)?.size ?? 0), 0);

  const checks: Array<{ slug: string; condition: boolean }> = [
    { slug: 'first-pass', condition: passedAttempts.length >= 1 },
    { slug: 'first-lesson', condition: lessonProgress.length >= 1 },

    { slug: 'streak-3', condition: (streak?.currentStreak ?? 0) >= 3 },
    { slug: 'streak-5', condition: (streak?.currentStreak ?? 0) >= 5 },
    { slug: 'streak-7', condition: (streak?.currentStreak ?? 0) >= 7 },
    { slug: 'streak-14', condition: (streak?.currentStreak ?? 0) >= 14 },

    { slug: 'attempts-10', condition: totalAttempts >= 10 },
    { slug: 'attempts-25', condition: totalAttempts >= 25 },
    { slug: 'attempts-50', condition: totalAttempts >= 50 },
    { slug: 'attempts-100', condition: totalAttempts >= 100 },

    {
      slug: 'all-be-passed',
      condition:
        passedCountForTypes(['be', 'be-nodejs']) >= CATEGORY_TOTALS['be-nodejs'],
    },
    {
      slug: 'all-fe-passed',
      condition:
        passedCountForTypes(['fe', 'stack-javascript', 'fe-web-apis']) >=
        CATEGORY_TOTALS['stack-javascript'] + CATEGORY_TOTALS['fe-web-apis'],
    },
    {
      slug: 'all-advanced-passed',
      condition: (passedByType.get('fe-advanced')?.size ?? 0) >= CATEGORY_TOTALS['fe-advanced'],
    },
    {
      slug: 'all-questions-passed',
      condition:
        (passedByType.get('be-question')?.size ?? 0) +
          (passedByType.get('fe-question')?.size ?? 0) >=
        CATEGORY_TOTALS['be-question'] + CATEGORY_TOTALS['fe-question'],
    },
    {
      slug: 'full-sweep',
      condition:
        passedCountForTypes(['be', 'be-nodejs']) >= CATEGORY_TOTALS['be-nodejs'] &&
        passedCountForTypes(['fe', 'stack-javascript', 'fe-web-apis']) >=
          CATEGORY_TOTALS['stack-javascript'] + CATEGORY_TOTALS['fe-web-apis'] &&
        (passedByType.get('fe-advanced')?.size ?? 0) >= CATEGORY_TOTALS['fe-advanced'] &&
        (passedByType.get('be-question')?.size ?? 0) +
          (passedByType.get('fe-question')?.size ?? 0) >=
          CATEGORY_TOTALS['be-question'] + CATEGORY_TOTALS['fe-question'],
    },
    {
      slug: 'speed-demon',
      condition: attempts.some(
        (a) =>
          a.passed &&
          a.timeSpentMs !== null &&
          a.timeSpentMs <= 180000 &&
          getChallengeDifficulty(a.challengeId, a.challengeType) === 'advanced'
      ),
    },
    {
      slug: 'freeze-used',
      condition: (streak?.freezesUsed ?? 0) >= 1,
    },
  ];

  for (const { slug, condition } of checks) {
    if (condition && !earnedSlugs.has(slug)) {
      const def = BADGE_DEFINITIONS.find((b) => b.slug === slug);
      if (!def) continue;

      await prisma.badge.create({
        data: {
          userId,
          slug: def.slug,
          name: def.name,
          description: def.description,
          emoji: def.emoji,
        },
      });

      newlyAwarded.push({
        slug: def.slug,
        name: def.name,
        emoji: def.emoji,
        description: def.description,
      });
      earnedSlugs.add(slug);
    }
  }

  return newlyAwarded;
}

export async function updateSpacedRepetition(
  userId: string,
  challengeId: string,
  challengeType: string,
  difficulty: string,
  passed: boolean
): Promise<void> {
  const quality = qualityFromAttempt(passed);
  const existing = await prisma.spacedRepetitionItem.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
  });

  const result = calculateNextReview(
    quality,
    existing?.repetitions ?? 0,
    existing?.intervalDays ?? 1,
    existing?.easeFactor ?? 2.5
  );

  const cappedInterval = applyDifficultyCap(result.intervalDays, difficulty);
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + cappedInterval);

  await prisma.spacedRepetitionItem.upsert({
    where: { userId_challengeId: { userId, challengeId } },
    create: {
      userId,
      challengeId,
      challengeType,
      difficulty,
      lastReviewedAt: new Date(),
      nextReviewAt,
      intervalDays: cappedInterval,
      easeFactor: result.easeFactor,
      repetitions: result.repetitions,
    },
    update: {
      challengeType,
      difficulty,
      lastReviewedAt: new Date(),
      nextReviewAt,
      intervalDays: cappedInterval,
      easeFactor: result.easeFactor,
      repetitions: result.repetitions,
    },
  });
}

export async function getUserTimezone(userId: string): Promise<string> {
  const prefs = await prisma.userPreferences.findUnique({ where: { userId } });
  return prefs?.timezone ?? 'America/Los_Angeles';
}

export type { BadgeDefinition };
