import { describe, expect, it } from 'vitest';
import { isCleanPass } from '@/lib/notes';

describe('isCleanPass', () => {
  it('returns true when challenge was passed without hint', () => {
    expect(
      isCleanPass(
        [
          { challengeId: 'be-01', passed: true, hintUsed: false },
          { challengeId: 'be-02', passed: true, hintUsed: true },
        ],
        'be-01'
      )
    ).toBe(true);
  });

  it('returns false when pass used a hint', () => {
    expect(
      isCleanPass(
        [{ challengeId: 'be-01', passed: true, hintUsed: true }],
        'be-01'
      )
    ).toBe(false);
  });

  it('returns false when not passed', () => {
    expect(
      isCleanPass(
        [{ challengeId: 'be-01', passed: false, hintUsed: false }],
        'be-01'
      )
    ).toBe(false);
  });

  it('returns false for wrong challenge id', () => {
    expect(
      isCleanPass(
        [{ challengeId: 'be-01', passed: true, hintUsed: false }],
        'fe-01'
      )
    ).toBe(false);
  });
});
