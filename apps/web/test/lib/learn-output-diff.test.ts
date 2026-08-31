import { describe, expect, it } from 'vitest';
import { buildOutputDiff, diffOutputTokens } from '@/lib/learn/output-diff';

describe('diffOutputTokens', () => {
  it('marks matching tokens', () => {
    const row = diffOutputTokens("'Paris' 2", "'Paris' 2");
    expect(row.goal.every((s) => s.kind === 'match')).toBe(true);
  });

  it('marks differing numeric tokens', () => {
    const row = diffOutputTokens("'Paris' 2", "'Paris' 3");
    expect(row.yours.some((s) => s.kind === 'diff' && s.text === '3')).toBe(true);
  });
});

describe('buildOutputDiff', () => {
  it('returns one row for single-line output', () => {
    expect(buildOutputDiff('a b', 'a c', 'subtle')).toHaveLength(1);
  });
});
