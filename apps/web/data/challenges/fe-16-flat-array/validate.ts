import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const flatten = getExport<(arr: unknown[], depth?: number) => unknown[]>(exports, 'flatten');

    const r1 = flatten([1, [2, [3, [4]]]]);
    const test1 = JSON.stringify(r1) === '[1,2,3,4]';

    const r2 = flatten([1, [2, [3, [4]]]], 1);
    const test2 = JSON.stringify(r2) === '[1,2,[3,[4]]]';

    const r3 = flatten([1, [2, [3, [4]]]], 2);
    const test3 = JSON.stringify(r3) === '[1,2,3,[4]]';

    const r4 = flatten([1, 2, 3]);
    const test4 = JSON.stringify(r4) === '[1,2,3]';

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Fully flattens by default (Infinity depth)', expected: '[1,2,3,4]', actual: JSON.stringify(r1), passed: test1 },
        { description: 'depth=1 flattens one level', expected: '[1,2,[3,[4]]]', actual: JSON.stringify(r2), passed: test2 },
        { description: 'depth=2 flattens two levels', expected: '[1,2,3,[4]]', actual: JSON.stringify(r3), passed: test3 },
        { description: 'Already-flat array returned unchanged', expected: '[1,2,3]', actual: JSON.stringify(r4), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
