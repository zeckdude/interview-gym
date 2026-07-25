import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  factor?: number;
}

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const retryWithBackoff = getExport<
      <T>(fn: () => Promise<T>, opts?: RetryOptions) => Promise<T>
    >(exports, 'retryWithBackoff');

    // Test 1: succeeds immediately
    let attempts1 = 0;
    const r1 = await retryWithBackoff(async () => { attempts1++; return 'ok'; }, { initialDelayMs: 1 });
    const test1 = r1 === 'ok' && attempts1 === 1;

    // Test 2: retries and succeeds
    let attempts2 = 0;
    const r2 = await retryWithBackoff(async () => {
      attempts2++;
      if (attempts2 < 3) throw new Error('fail');
      return 'success';
    }, { maxRetries: 3, initialDelayMs: 1, factor: 1 });
    const test2 = r2 === 'success' && attempts2 === 3;

    // Test 3: throws after max retries
    let threw = false;
    try {
      await retryWithBackoff(async () => { throw new Error('always fails'); }, { maxRetries: 2, initialDelayMs: 1 });
    } catch {
      threw = true;
    }
    const test3 = threw;

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'Returns result immediately on first success', expected: '"ok", 1 attempt', actual: `"${r1}", ${attempts1} attempt(s)`, passed: test1 },
        { description: 'Retries until success (3 attempts)', expected: '"success", 3 attempts', actual: `"${r2}", ${attempts2} attempts`, passed: test2 },
        { description: 'Throws error after max retries exceeded', expected: 'throws', actual: threw ? 'threw' : 'did not throw', passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
