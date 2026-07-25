import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const throttle = getExport<
      (fn: (...args: unknown[]) => void, delay: number) => (...args: unknown[]) => void
    >(exports, 'throttle');

    // Test 1: first call fires immediately
    let count = 0;
    const t = throttle(() => { count++; }, 100);
    t();
    const test1 = count === 1;

    // Test 2: rapid calls are ignored
    t(); t(); t();
    const test2 = count === 1;

    // Test 3: after delay, next call fires
    await sleep(120);
    t();
    const test3 = count === 2;

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'First call fires immediately (leading edge)', expected: '1', actual: String(test1 ? 1 : 0), passed: test1 },
        { description: 'Rapid calls within delay are ignored', expected: '1 (still)', actual: String(count === 2 ? 1 : count), passed: test2 },
        { description: 'Next call after delay fires again', expected: '2', actual: String(count), passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
