import { getDateInTimezone } from '@/lib/streak';

/** Hour (0–23) in the given IANA timezone. */
export function getHourInTimezone(date: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false,
  }).formatToParts(date);

  const hour = parts.find((p) => p.type === 'hour')?.value ?? '0';
  return parseInt(hour, 10) === 24 ? 0 : parseInt(hour, 10);
}

/** Day of week (0 = Sunday, 1 = Monday, …) in the given IANA timezone. */
export function getDayOfWeekInTimezone(date: Date, timezone: string): number {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
  }).format(date);

  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return map[weekday] ?? 0;
}

/** UTC Date representing midnight at the start of today in the given timezone. */
export function getStartOfDayInTimezone(now: Date, timezone: string): Date {
  const dateStr = getDateInTimezone(now, timezone);

  let low = now.getTime() - 48 * 3600000;
  let high = now.getTime();

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const midDate = getDateInTimezone(new Date(mid), timezone);
    if (midDate < dateStr) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return new Date(low);
}
