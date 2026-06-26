/**
 * Computes the current consecutive-day streak from a list of attempt dates.
 * A streak is the number of consecutive calendar days (ending today or yesterday)
 * where at least one attempt was made.
 */
export function computeStreak(attemptDates: Date[]): {
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: Date | null;
} {
  if (attemptDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActivityAt: null };
  }

  // Normalize to YYYY-MM-DD strings in UTC
  const seen = new Set<string>();
  const dateStrings = attemptDates
    .map((d) => d.toISOString().slice(0, 10))
    .filter((s) => {
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    })
    .sort((a, b) => (a > b ? -1 : 1)); // descending

  const lastActivityAt = attemptDates.reduce(
    (max, d) => (d > max ? d : max),
    attemptDates[0]
  );

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().slice(0, 10);

  // Current streak must include today or yesterday (otherwise the streak is broken)
  const mostRecent = dateStrings[0];
  if (mostRecent !== todayStr && mostRecent !== yesterdayStr) {
    return { currentStreak: 0, longestStreak: computeLongestStreak(dateStrings), lastActivityAt };
  }

  // Count backwards from the most recent active day
  let currentStreak = 1;
  let prev = mostRecent;
  for (let i = 1; i < dateStrings.length; i++) {
    const expected = subtractOneDay(prev);
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

function subtractOneDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function computeLongestStreak(sortedDescDates: string[]): number {
  if (sortedDescDates.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sortedDescDates.length; i++) {
    const expected = subtractOneDay(sortedDescDates[i - 1]);
    if (sortedDescDates[i] === expected) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}
