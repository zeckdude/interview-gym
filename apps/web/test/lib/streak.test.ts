import { describe, it, expect, vi, afterEach } from 'vitest';
import { computeStreak, getDateInTimezone } from '@/lib/streak';

describe('getDateInTimezone', () => {
  it('formats a date as YYYY-MM-DD in the given timezone', () => {
    // 2024-01-15T08:00:00Z is still Jan 15 in LA, Jan 15 in UTC
    const date = new Date('2024-01-15T08:00:00Z');
    expect(getDateInTimezone(date, 'UTC')).toBe('2024-01-15');
    expect(getDateInTimezone(date, 'America/Los_Angeles')).toBe('2024-01-15');
  });

  it('handles timezone day boundary (late UTC is previous day in LA)', () => {
    // 2024-01-16T05:00:00Z = Jan 15 evening in America/Los_Angeles
    const date = new Date('2024-01-16T05:00:00Z');
    expect(getDateInTimezone(date, 'UTC')).toBe('2024-01-16');
    expect(getDateInTimezone(date, 'America/Los_Angeles')).toBe('2024-01-15');
  });
});

describe('computeStreak', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns zeros for empty input', () => {
    expect(computeStreak([])).toEqual({
      currentStreak: 0,
      longestStreak: 0,
      lastActivityAt: null,
    });
  });

  it('counts consecutive days ending today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-10T15:00:00Z'));

    const dates = [
      new Date('2024-06-10T12:00:00Z'),
      new Date('2024-06-09T12:00:00Z'),
      new Date('2024-06-08T12:00:00Z'),
    ];
    const result = computeStreak(dates);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it('counts consecutive days ending yesterday', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-10T15:00:00Z'));

    const dates = [
      new Date('2024-06-09T12:00:00Z'),
      new Date('2024-06-08T12:00:00Z'),
    ];
    const result = computeStreak(dates);
    expect(result.currentStreak).toBe(2);
  });

  it('resets current streak if gap is more than 1 day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-10T15:00:00Z'));

    const dates = [
      new Date('2024-06-07T12:00:00Z'),
      new Date('2024-06-06T12:00:00Z'),
      new Date('2024-06-05T12:00:00Z'),
    ];
    const result = computeStreak(dates);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(3);
  });

  it('deduplicates multiple attempts on the same day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-10T15:00:00Z'));

    const dates = [
      new Date('2024-06-10T08:00:00Z'),
      new Date('2024-06-10T14:00:00Z'),
      new Date('2024-06-09T12:00:00Z'),
    ];
    const result = computeStreak(dates);
    expect(result.currentStreak).toBe(2);
  });

  it('tracks longest streak across gaps', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-10T15:00:00Z'));

    const dates = [
      new Date('2024-06-10T12:00:00Z'),
      new Date('2024-06-05T12:00:00Z'),
      new Date('2024-06-04T12:00:00Z'),
      new Date('2024-06-03T12:00:00Z'),
      new Date('2024-06-02T12:00:00Z'),
    ];
    const result = computeStreak(dates);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(4);
  });
});
