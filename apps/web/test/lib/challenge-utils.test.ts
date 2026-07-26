import { describe, expect, it } from 'vitest';
import { errorResult, parseHints, makeFsRequire } from '@/data/challenges/_utils';
import {
  getChallengeById,
  getAdjacentChallenge,
  filterChallenges,
  getCategoryLabel,
  CATEGORY_TOTALS,
  allChallenges,
} from '@/data';

describe('challenge _utils', () => {
  it('errorResult wraps an error into a failed ValidationResult', () => {
    const result = errorResult(new Error('boom'));
    expect(result.passed).toBe(false);
    expect(result.results[0].actual).toContain('boom');
  });

  it('parseHints extracts numbered list items', () => {
    const hints = parseHints('1. First hint\n2. Second hint\n\nNot a hint\n3. Third');
    expect(hints).toEqual(['First hint', 'Second hint', 'Third']);
  });

  it('makeFsRequire maps fs module variants', () => {
    const mock = { readdirSync: () => [], promises: { readFile: async () => '' } };
    const req = makeFsRequire(mock);
    expect(req('fs')).toBe(mock);
    expect(req('node:fs')).toBe(mock);
    expect(req('fs/promises')).toBe(mock.promises);
    expect(req('node:fs/promises')).toBe(mock.promises);
    expect(req('path')).toEqual({});
  });
});

describe('data index helpers', () => {
  it('CATEGORY_TOTALS match array lengths', () => {
    const challengeTotal = Object.entries(CATEGORY_TOTALS)
      .filter(([key]) => !key.endsWith('-question'))
      .reduce((sum, [, n]) => sum + n, 0);
    expect(allChallenges).toHaveLength(challengeTotal);
  });

  it('getChallengeById finds known challenges', () => {
    const c = getChallengeById('be-01-list-files');
    expect(c?.title).toBeTruthy();
    expect(getChallengeById('missing')).toBeUndefined();
  });

  it('getAdjacentChallenge walks the live list', () => {
    const first = allChallenges.find((c) => !c.comingSoon)!;
    const next = getAdjacentChallenge(first.id, 'next');
    expect(next).not.toBeNull();
    expect(getAdjacentChallenge(first.id, 'prev')).toBeNull();
  });

  it('filterChallenges filters by category and search', () => {
    const be = filterChallenges('be', '');
    expect(be.every((c) => c.category === 'be')).toBe(true);

    const search = filterChallenges('all', 'list');
    expect(search.every((c) => c.title.toLowerCase().includes('list'))).toBe(true);
  });

  it('getCategoryLabel returns labels', () => {
    expect(getCategoryLabel('be')).toBe('Backend');
    expect(getCategoryLabel('fe')).toBe('Frontend');
    expect(getCategoryLabel('fe-advanced')).toBe('React');
    expect(getCategoryLabel('nextjs')).toBe('Next.js');
    expect(getCategoryLabel('fe-css')).toBe('CSS');
    expect(getCategoryLabel('stack-typescript')).toBe('TypeScript');
  });
});
