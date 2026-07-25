import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface FetchOptions {
  cache?: 'force-cache' | 'no-store';
  revalidate?: number;
}

interface FetchResult<T> {
  value: T;
  hit: boolean;
}

interface FetchCache {
  fetch<T>(key: string, fetcher: () => T, options?: FetchOptions): FetchResult<T>;
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createFetchCache = getExport<(clock?: () => number) => FetchCache>(exports, 'createFetchCache');

    let calls = 0;
    const cache1 = createFetchCache();
    const r1 = cache1.fetch('user', () => { calls++; return { id: 1 }; }, {});
    const r2 = cache1.fetch('user', () => { calls++; return { id: 999 }; }, {});
    const test1 = r1.hit === false && r2.hit === true && calls === 1 && r2.value.id === 1;

    let noStoreCalls = 0;
    const cache2 = createFetchCache();
    cache2.fetch('x', () => { noStoreCalls++; return noStoreCalls; }, { cache: 'no-store' });
    cache2.fetch('x', () => { noStoreCalls++; return noStoreCalls; }, { cache: 'no-store' });
    const test2 = noStoreCalls === 2;

    let time = 0;
    const clock = () => time;
    let revalCalls = 0;
    const cache3 = createFetchCache(clock);

    const first = cache3.fetch('page', () => { revalCalls++; return revalCalls; }, { revalidate: 10 });
    const test3 = first.hit === false && revalCalls === 1;

    time = 5000;
    const stillFresh = cache3.fetch('page', () => { revalCalls++; return revalCalls; }, { revalidate: 10 });
    const test4 = stillFresh.hit === true && revalCalls === 1;

    time = 11000;
    const expired = cache3.fetch('page', () => { revalCalls++; return revalCalls; }, { revalidate: 10 });
    const test5 = expired.hit === false && revalCalls === 2;

    return {
      passed: test1 && test2 && test3 && test4 && test5,
      results: [
        { description: 'Second fetch for the same key is a cache hit, fetcher runs once', expected: 'hit: false, then hit: true (1 call)', actual: `hit: ${r1.hit}, then hit: ${r2.hit} (${calls} calls)`, passed: test1 },
        { description: '"no-store" always calls the fetcher fresh', expected: '2 calls', actual: `${noStoreCalls} calls`, passed: test2 },
        { description: 'First fetch with revalidate is a miss', expected: 'hit: false', actual: `hit: ${first.hit}`, passed: test3 },
        { description: 'Fetch within the revalidate window is a hit', expected: 'hit: true, 1 total call', actual: `hit: ${stillFresh.hit}, ${revalCalls} total calls`, passed: test4 },
        { description: 'Fetch after the revalidate window expires is a miss', expected: 'hit: false, 2 total calls', actual: `hit: ${expired.hit}, ${revalCalls} total calls`, passed: test5 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
