import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cn,
  formatDuration,
  formatTimeCompact,
  formatRelativeTime,
  getStartOfWeek,
} from '@/lib/utils';

describe('utils', () => {
  it('cn merges class names', () => {
    expect(cn('px-2', 'py-1')).toContain('px-2');
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('formatDuration handles null and short/long times', () => {
    expect(formatDuration(null)).toBe('—');
    expect(formatDuration(45000)).toBe('45s');
    expect(formatDuration(125000)).toBe('2m 5s');
  });

  it('formatTimeCompact formats m:ss', () => {
    expect(formatTimeCompact(undefined)).toBe('—');
    expect(formatTimeCompact(125000)).toBe('2:05');
  });

  it('formatRelativeTime returns relative labels', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-10T12:00:00Z'));

    expect(formatRelativeTime(new Date('2024-06-10T11:59:30Z'))).toBe('Just now');
    expect(formatRelativeTime(new Date('2024-06-10T11:30:00Z'))).toBe('30m ago');
    expect(formatRelativeTime(new Date('2024-06-10T08:00:00Z'))).toBe('4h ago');
    expect(formatRelativeTime(new Date('2024-06-08T12:00:00Z'))).toBe('2d ago');

    vi.useRealTimers();
  });

  it('getStartOfWeek returns Monday at midnight', () => {
    vi.useFakeTimers();
    // Wednesday
    vi.setSystemTime(new Date('2024-06-12T15:00:00'));
    const start = getStartOfWeek();
    expect(start.getDay()).toBe(1);
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
