import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const promiseAll = getExport<<T>(promises: Array<T | Promise<T>>) => Promise<T[]>>(exports, 'promiseAll');

    // Test 1: resolves all in order
    const r1 = await promiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]);
    const test1 = JSON.stringify(r1) === '[1,2,3]';

    // Test 2: empty array
    const r2 = await promiseAll([]);
    const test2 = JSON.stringify(r2) === '[]';

    // Test 3: rejects on failure
    let threw = false;
    try {
      await promiseAll([Promise.resolve('ok'), Promise.reject(new Error('fail'))]);
    } catch {
      threw = true;
    }
    const test3 = threw;

    // Test 4: handles non-promise values
    const r4 = await promiseAll([1, 2, 3]);
    const test4 = JSON.stringify(r4) === '[1,2,3]';

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Resolves all promises in original order', expected: '[1,2,3]', actual: JSON.stringify(r1), passed: test1 },
        { description: 'Empty array resolves with []', expected: '[]', actual: JSON.stringify(r2), passed: test2 },
        { description: 'Rejects immediately when any promise rejects', expected: 'throws', actual: threw ? 'threw' : 'did not throw', passed: test3 },
        { description: 'Non-promise values treated as resolved', expected: '[1,2,3]', actual: JSON.stringify(r4), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
