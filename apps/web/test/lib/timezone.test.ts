import { describe, expect, it } from 'vitest';
import {
  getHourInTimezone,
  getDayOfWeekInTimezone,
  getStartOfDayInTimezone,
} from '@/lib/timezone';

describe('timezone helpers', () => {
  it('getHourInTimezone returns local hour', () => {
    const date = new Date('2024-06-10T15:00:00Z');
    expect(getHourInTimezone(date, 'UTC')).toBe(15);
    expect(getHourInTimezone(date, 'America/Los_Angeles')).toBe(8);
  });

  it('getDayOfWeekInTimezone returns Monday=1 style day', () => {
    // 2024-06-10 is Monday
    const monday = new Date('2024-06-10T12:00:00Z');
    expect(getDayOfWeekInTimezone(monday, 'UTC')).toBe(1);
  });

  it('getStartOfDayInTimezone returns a Date at local midnight', () => {
    const now = new Date('2024-06-10T20:30:00Z');
    const start = getStartOfDayInTimezone(now, 'UTC');
    expect(start.toISOString()).toBe('2024-06-10T00:00:00.000Z');
  });
});
