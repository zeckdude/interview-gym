import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  const previousFetch = globalThis.fetch;

  try {
    let fetchCallCount = 0;
    let returnStatus = 200;

    globalThis.fetch = (async (_input: RequestInfo | URL) => {
      fetchCallCount++;
      return {
        ok: returnStatus >= 200 && returnStatus < 300,
        status: returnStatus,
        statusText: returnStatus === 200 ? 'OK' : 'Error',
        json: async () => ({}),
      } as Response;
    }) as typeof fetch;

    const exports = executeUserCode(userCode, () => ({}));
    const fetchWithRetry = getExport<(url: string, opts?: RequestInit, retries?: number) => Promise<Response>>(
      exports,
      'fetchWithRetry'
    );

    fetchCallCount = 0;
    returnStatus = 200;
    const r1 = await fetchWithRetry('/api/data', {}, 2);
    const test1 = r1.ok && fetchCallCount === 1;
    const test1Count = fetchCallCount;

    fetchCallCount = 0;
    returnStatus = 404;
    const r2 = await fetchWithRetry('/not-found', {}, 3);
    const test2 = r2.status === 404 && fetchCallCount === 1;
    const test2Count = fetchCallCount;

    fetchCallCount = 0;
    returnStatus = 503;
    let threw = false;
    try {
      await fetchWithRetry('/flaky', {}, 2);
    } catch {
      threw = true;
    }
    const test3 = threw && fetchCallCount === 3;
    const test3Count = fetchCallCount;

    return {
      passed: test1 && test2 && test3,
      results: [
        {
          description: 'Returns response on first success',
          expected: '1 call, ok=true',
          actual: `${test1Count} calls, ok=${r1.ok}`,
          passed: test1,
        },
        {
          description: 'Does not retry on 404 (client error)',
          expected: '1 call',
          actual: `${test2Count} call(s)`,
          passed: test2,
        },
        {
          description: 'Retries on 503 and throws after all retries',
          expected: 'threw, 3 calls',
          actual: threw ? `threw, fetchCallCount=${test3Count}` : 'did not throw',
          passed: test3,
        },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  } finally {
    globalThis.fetch = previousFetch;
  }
}
