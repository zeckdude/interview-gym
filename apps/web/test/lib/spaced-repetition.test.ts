import { describe, it, expect } from 'vitest';
import {
  calculateNextReview,
  applyDifficultyCap,
  qualityFromAttempt,
  DIFFICULTY_MAX_INTERVAL,
} from '@/lib/spaced-repetition';

describe('SM-2 Spaced Repetition', () => {
  it('returns interval of 1 day on first repetition', () => {
    const result = calculateNextReview(4, 0, 1, 2.5);
    expect(result.intervalDays).toBe(1);
    expect(result.repetitions).toBe(1);
  });

  it('returns interval of 2 days on second repetition', () => {
    const result = calculateNextReview(4, 1, 1, 2.5);
    expect(result.intervalDays).toBe(2);
    expect(result.repetitions).toBe(2);
  });

  it('multiplies by ease factor on third+ repetition', () => {
    const result = calculateNextReview(4, 2, 2, 2.5);
    expect(result.repetitions).toBe(3);
    expect(result.intervalDays).toBe(Math.round(2 * 2.5));
  });

  it('resets on quality below 3', () => {
    const result = calculateNextReview(1, 5, 21, 2.5);
    expect(result.repetitions).toBe(0);
    expect(result.intervalDays).toBe(1);
  });

  it('never lets ease factor drop below 1.3', () => {
    const result = calculateNextReview(3, 5, 10, 1.3);
    expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it('sets nextReviewAt roughly intervalDays ahead', () => {
    const before = Date.now();
    const result = calculateNextReview(5, 0, 1, 2.5);
    const after = Date.now();
    const expectedMin = before + result.intervalDays * 86400000 - 1000;
    const expectedMax = after + result.intervalDays * 86400000 + 1000;
    expect(result.nextReviewAt.getTime()).toBeGreaterThanOrEqual(expectedMin);
    expect(result.nextReviewAt.getTime()).toBeLessThanOrEqual(expectedMax);
  });
});

describe('applyDifficultyCap', () => {
  it('caps advanced challenge interval at 2 days', () => {
    expect(applyDifficultyCap(100, 'advanced')).toBe(DIFFICULTY_MAX_INTERVAL.advanced);
  });

  it('caps intermediate challenge interval at 4 days', () => {
    expect(applyDifficultyCap(100, 'intermediate')).toBe(DIFFICULTY_MAX_INTERVAL.intermediate);
  });

  it('caps easy challenge interval at 7 days', () => {
    expect(applyDifficultyCap(100, 'easy')).toBe(DIFFICULTY_MAX_INTERVAL.easy);
  });

  it('does not increase intervals below the cap', () => {
    expect(applyDifficultyCap(1, 'advanced')).toBe(1);
  });

  it('defaults unknown difficulty to 7-day cap', () => {
    expect(applyDifficultyCap(20, 'unknown')).toBe(7);
  });
});

describe('qualityFromAttempt', () => {
  it('returns 4 when passed', () => {
    expect(qualityFromAttempt(true)).toBe(4);
  });

  it('returns 1 when failed', () => {
    expect(qualityFromAttempt(false)).toBe(1);
  });
});
