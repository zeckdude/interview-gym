import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const memoize = getExport<<T extends unknown[], R>(fn: (...args: T) => R) => (...args: T) => R>(exports, 'memoize');

    // Test 1: caches results
    let calls = 0;
    const sq = memoize((n: number) => { calls++; return n * n; });
    sq(5); sq(5); sq(5);
    const test1 = calls === 1 && sq(5) === 25;

    // Test 2: different args get different cache entries
    sq(6);
    const test2 = calls === 2 && sq(6) === 36;

    // Test 3: multi-arg caching
    let calls2 = 0;
    const add = memoize((a: number, b: number) => { calls2++; return a + b; });
    add(1, 2); add(1, 2); add(2, 1);
    const test3 = calls2 === 2; // (1,2) cached, (2,1) is different

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'Same args return cached result (called once)', expected: '1 call, result=25', actual: `${calls} call(s), result=${sq(5)}`, passed: test1 },
        { description: 'Different args call function again', expected: '2 total calls', actual: `${calls} calls`, passed: test2 },
        { description: 'Argument order matters for cache key', expected: '2 calls for (1,2) and (2,1)', actual: `${calls2} calls`, passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
