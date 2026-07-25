import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const groupBy = getExport<<T>(arr: T[], keyFn: (item: T) => string) => Record<string, T[]>>(exports, 'groupBy');

    // Test 1: groups by object property
    const people = [
      { name: 'Alice', dept: 'Eng' },
      { name: 'Bob', dept: 'Design' },
      { name: 'Carol', dept: 'Eng' },
    ];
    const r1 = groupBy(people, (p) => p.dept);
    const test1 = r1.Eng?.length === 2 && r1.Design?.length === 1;

    // Test 2: groups numbers by parity
    const r2 = groupBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? 'even' : 'odd'));
    const test2 = JSON.stringify(r2.odd) === '[1,3,5]' && JSON.stringify(r2.even) === '[2,4]';

    // Test 3: preserves order within groups
    const r3 = groupBy(['a', 'b', 'a', 'c', 'b'], (s) => s);
    const test3 = r3.a?.length === 2 && r3.b?.length === 2 && r3.c?.length === 1;

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'Groups objects by property', expected: 'Eng: 2, Design: 1', actual: `Eng:${r1.Eng?.length}, Design:${r1.Design?.length}`, passed: test1 },
        { description: 'Groups numbers by parity', expected: 'odd:[1,3,5], even:[2,4]', actual: `odd:${JSON.stringify(r2.odd)}, even:${JSON.stringify(r2.even)}`, passed: test2 },
        { description: 'Preserves insertion order within groups', expected: 'a:2, b:2, c:1', actual: `a:${r3.a?.length}, b:${r3.b?.length}, c:${r3.c?.length}`, passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
