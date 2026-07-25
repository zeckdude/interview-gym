import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const sortBy = getExport<
      <T extends Record<string, unknown>>(arr: T[], key: keyof T, dir?: 'asc' | 'desc') => T[]
    >(exports, 'sortBy');

    const people = [
      { name: 'Carol', age: 25 },
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 22 },
    ];

    // Test 1: sort by name asc
    const r1 = sortBy(people, 'name');
    const test1 = r1[0].name === 'Alice' && r1[1].name === 'Bob' && r1[2].name === 'Carol';

    // Test 2: sort by age desc
    const r2 = sortBy(people, 'age', 'desc');
    const test2 = r2[0].age === 30 && r2[2].age === 22;

    // Test 3: does not mutate original
    const test3 = people[0].name === 'Carol';

    // Test 4: sort numbers
    const nums = [{ n: 3 }, { n: 1 }, { n: 2 }];
    const r4 = sortBy(nums, 'n');
    const test4 = r4[0].n === 1 && r4[2].n === 3;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Sorts by string key ascending', expected: 'Alice, Bob, Carol', actual: r1.map((p) => p.name).join(', '), passed: test1 },
        { description: 'Sorts by number key descending', expected: '30, ..., 22', actual: `${r2[0].age}, ..., ${r2[2].age}`, passed: test2 },
        { description: 'Does not mutate original array', expected: 'Carol first', actual: people[0].name, passed: test3 },
        { description: 'Sorts numbers correctly', expected: '1, 2, 3', actual: r4.map((n) => n.n).join(', '), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
