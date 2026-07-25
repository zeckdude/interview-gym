import { describe, expect, it } from 'vitest';
import {
  buildChallengePath,
  buildListPath,
  buildPathWithQuery,
  mergeQueryStrings,
  queryStringFromSearchParams,
} from '@/lib/content-filter-url';

describe('content-filter-url', () => {
  it('extracts list filter params from a record', () => {
    expect(
      queryStringFromSearchParams({
        category: 'fe',
        sub: ['react', 'nextjs'],
        difficulty: 'easy',
        special: 'most-asked',
        foo: 'bar',
      })
    ).toBe('category=fe&sub=react&sub=nextjs&difficulty=easy&special=most-asked');
  });

  it('merges query strings without dropping repeated params', () => {
    expect(mergeQueryStrings('category=fe&sub=react', 'difficulty=easy&review=1')).toBe(
      'category=fe&sub=react&difficulty=easy&review=1'
    );
  });

  it('builds list and detail paths', () => {
    expect(buildListPath('/challenges', 'category=fe&sub=react')).toBe(
      '/challenges?category=fe&sub=react'
    );
    expect(buildChallengePath('be-01', 'category=fe', 'review=1')).toBe(
      '/challenges/be-01?category=fe&review=1'
    );
    expect(buildPathWithQuery('/lessons')).toBe('/lessons');
  });
});
