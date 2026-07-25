import type { Streak } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/** Returns YYYY-MM-DD in the given IANA timezone. */
export function getDateInTimezone(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function subtractDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function daysBetween(fromDateStr: string, toDateStr: string): number {
  const from = new Date(fromDateStr + 'T12:00:00Z').getTime();
  const to = new Date(toDateStr + 'T12:00:00Z').getTime();
  return Math.round((to - from) / 86400000);
}

function getMondayUtc(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diff);
  return d.toISOString().slice(0, 10);
}

async function resetWeeklyFreezesIfNeeded(streak: Streak): Promise<Streak> {
  const currentMonday = getMondayUtc(new Date());
  const lastResetMonday = getMondayUtc(streak.lastFreezeResetAt);

  if (currentMonday !== lastResetMonday) {
    return prisma.streak.update({
      where: { id: streak.id },
      data: {
        freezesAvailable: 1,
        lastFreezeResetAt: new Date(),
      },
    });
  }
  return streak;
}

export async function getOrCreateStreak(userId: string): Promise<Streak> {
  let streak = await prisma.streak.findUnique({ where: { userId } });
  if (!streak) {
    streak = await prisma.streak.create({ data: { userId } });
  }
  return resetWeeklyFreezesIfNeeded(streak);
}

export interface StreakCheckResult {
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: Date | null;
  freezesAvailable: number;
  needsFreezeDecision: boolean;
  missedDate: string | null;
}

export async function checkAndBreakStreak(
  userId: string,
  timezone: string
): Promise<StreakCheckResult> {
  let streak = await getOrCreateStreak(userId);
  const today = getDateInTimezone(new Date(), timezone);

  if (!streak.lastActivityAt) {
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityAt: null,
      freezesAvailable: streak.freezesAvailable,
      needsFreezeDecision: false,
      missedDate: null,
    };
  }

  const lastActivityDate = getDateInTimezone(streak.lastActivityAt, timezone);
  const gap = daysBetween(lastActivityDate, today);

  if (gap <= 1) {
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityAt: streak.lastActivityAt,
      freezesAvailable: streak.freezesAvailable,
      needsFreezeDecision: false,
      missedDate: null,
    };
  }

  const missedDate = subtractDays(today, 1);

  if (gap === 2 && streak.freezesAvailable > 0 && streak.freezeAppliedFor !== missedDate) {
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityAt: streak.lastActivityAt,
      freezesAvailable: streak.freezesAvailable,
      needsFreezeDecision: true,
      missedDate,
    };
  }

  if (streak.currentStreak > 0) {
    streak = await prisma.streak.update({
      where: { id: streak.id },
      data: { currentStreak: 0, freezeAppliedFor: null },
    });
  }

  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    lastActivityAt: streak.lastActivityAt,
    freezesAvailable: streak.freezesAvailable,
    needsFreezeDecision: false,
    missedDate: null,
  };
}

export async function updateStreak(userId: string, timezone: string): Promise<Streak> {
  let streak = await getOrCreateStreak(userId);
  await checkAndBreakStreak(userId, timezone);

  streak = (await prisma.streak.findUnique({ where: { userId } })) ?? streak;

  const now = new Date();
  const today = getDateInTimezone(now, timezone);
  const lastActivityDate = streak.lastActivityAt
    ? getDateInTimezone(streak.lastActivityAt, timezone)
    : null;

  if (lastActivityDate === today) {
    return streak;
  }

  let newStreak = streak.currentStreak;

  if (!lastActivityDate) {
    newStreak = 1;
  } else {
    const gap = daysBetween(lastActivityDate, today);
    const yesterday = subtractDays(today, 1);

    if (lastActivityDate === yesterday) {
      newStreak = streak.currentStreak + 1;
    } else if (gap === 2 && streak.freezeAppliedFor === yesterday) {
      newStreak = streak.currentStreak + 1;
    } else {
      newStreak = 1;
    }
  }

  const longestStreak = Math.max(streak.longestStreak, newStreak);

  return prisma.streak.update({
    where: { id: streak.id },
    data: {
      currentStreak: newStreak,
      longestStreak,
      lastActivityAt: now,
      freezeAppliedFor: null,
    },
  });
}

export async function useStreakFreeze(userId: string, timezone: string): Promise<Streak | null> {
  const streak = await getOrCreateStreak(userId);
  const today = getDateInTimezone(new Date(), timezone);
  const missedDate = subtractDays(today, 1);

  if (streak.freezesAvailable <= 0) return null;
  if (!streak.lastActivityAt) return null;

  const lastActivityDate = getDateInTimezone(streak.lastActivityAt, timezone);
  const gap = daysBetween(lastActivityDate, today);

  if (gap !== 2) return null;

  return prisma.streak.update({
    where: { id: streak.id },
    data: {
      freezesAvailable: streak.freezesAvailable - 1,
      freezesUsed: streak.freezesUsed + 1,
      freezeAppliedFor: missedDate,
    },
  });
}

/** Legacy helper — computes streak from attempt dates (UTC). Kept for backwards compat during migration. */
export function computeStreak(attemptDates: Date[]): {
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: Date | null;
} {
  if (attemptDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActivityAt: null };
  }

  const seen = new Set<string>();
  const dateStrings = attemptDates
    .map((d) => d.toISOString().slice(0, 10))
    .filter((s) => {
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    })
    .sort((a, b) => (a > b ? -1 : 1));

  const lastActivityAt = attemptDates.reduce(
    (max, d) => (d > max ? d : max),
    attemptDates[0]
  );

  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayStr = subtractDays(todayStr, 1);

  const mostRecent = dateStrings[0];
  if (mostRecent !== todayStr && mostRecent !== yesterdayStr) {
    return { currentStreak: 0, longestStreak: computeLongestStreak(dateStrings), lastActivityAt };
  }

  let currentStreak = 1;
  let prev = mostRecent;
  for (let i = 1; i < dateStrings.length; i++) {
    const expected = subtractDays(prev, 1);
    if (dateStrings[i] === expected) {
      currentStreak++;
      prev = dateStrings[i];
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak: computeLongestStreak(dateStrings),
    lastActivityAt,
  };
}

function computeLongestStreak(sortedDescDates: string[]): number {
  if (sortedDescDates.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sortedDescDates.length; i++) {
    const expected = subtractDays(sortedDescDates[i - 1], 1);
    if (sortedDescDates[i] === expected) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}
