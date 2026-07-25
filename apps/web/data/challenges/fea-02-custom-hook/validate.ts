import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface FetchState<T> { data: T | null; loading: boolean; error: Error | null; }

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createFetchState = getExport<<T>(fetchFn?: unknown) => {
      execute(url: string): Promise<void>;
      getState(): FetchState<T>;
    }>(exports, 'createFetchState');

    // Test 1: initial state
    const mockFetch = async (_url: string) => ({
      json: async () => [{ id: 1 }],
    });
    const fetcher = createFetchState(mockFetch as unknown as typeof fetch);
    const s0 = fetcher.getState();
    const test1 = s0.loading === false && s0.data === null && s0.error === null;

    // Test 2: resolves with data
    await fetcher.execute('/api/test');
    const s1 = fetcher.getState();
    const test2 = s1.loading === false && s1.data !== null && s1.error === null;

    // Test 3: error state on failure
    const failFetch = async () => { throw new Error('network error'); };
    const errorFetcher = createFetchState(failFetch as unknown as typeof fetch);
    await errorFetcher.execute('/api/fail');
    const s2 = errorFetcher.getState();
    const test3 = s2.error !== null && s2.loading === false && s2.data === null;

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'Initial state is { data: null, loading: false, error: null }', expected: 'all null/false', actual: JSON.stringify(s0), passed: test1 },
        { description: 'After successful fetch, data is set', expected: 'data set, loading false', actual: `loading=${s1.loading}, data=${s1.data ? 'set' : 'null'}`, passed: test2 },
        { description: 'On fetch error, error state is set', expected: 'error set, loading false', actual: `error=${s2.error ? 'set' : 'null'}, loading=${s2.loading}`, passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
