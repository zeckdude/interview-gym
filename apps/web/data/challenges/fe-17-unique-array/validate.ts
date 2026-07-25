import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const unique = getExport<<T>(arr: T[]) => T[]>(exports, 'unique');
    const uniqueBy = getExport<<T>(arr: T[], keyFn: (item: T) => unknown) => T[]>(exports, 'uniqueBy');

    const r1 = unique([1, 2, 1, 3, 2, 4]);
    const test1 = JSON.stringify(r1) === '[1,2,3,4]';

    const r2 = unique(['a', 'b', 'a', 'c']);
    const test2 = JSON.stringify(r2) === '["a","b","c"]';

    const r3 = uniqueBy([{ id: 1 }, { id: 2 }, { id: 1 }], (x: { id: number }) => x.id);
    const test3 = r3.length === 2 && r3[0].id === 1 && r3[1].id === 2;

    const original = [1, 2, 1];
    unique(original);
    const test4 = JSON.stringify(original) === '[1,2,1]';

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Removes duplicate numbers', expected: '[1,2,3,4]', actual: JSON.stringify(r1), passed: test1 },
        { description: 'Removes duplicate strings', expected: '["a","b","c"]', actual: JSON.stringify(r2), passed: test2 },
        { description: 'uniqueBy deduplicates by key function', expected: '2 items, ids=[1,2]', actual: `${r3.length} items`, passed: test3 },
        { description: 'Does not modify original array', expected: '[1,2,1]', actual: JSON.stringify(original), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
