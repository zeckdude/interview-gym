import { describe, expect, it } from 'vitest';
import {
  splitIntoSentences,
  getCachedNarration,
  cacheNarration,
} from '@/lib/video-explanation';

describe('splitIntoSentences', () => {
  it('splits on sentence boundaries', () => {
    const result = splitIntoSentences('Hello world. How are you? Fine!');
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0]).toContain('Hello');
  });

  it('handles empty string', () => {
    expect(splitIntoSentences('')).toEqual([]);
  });
});

describe('narration cache', () => {
  it('caches and retrieves narration in browser', () => {
    localStorage.clear();
    expect(getCachedNarration('be-01')).toBeNull();
    cacheNarration('be-01', 'Hello from the coach.');
    expect(getCachedNarration('be-01')).toBe('Hello from the coach.');
  });
});
