// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const promiseAll = getExport<(promises: Array<Promise<number> | number>) => Promise<number[]>>(exports, 'promiseAll');

    const cases = [
      {
        description: "resolves all promises",
        run: async () => Boolean(await JSON.stringify(await promiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])) === JSON.stringify([1, 2, 3])),
        expected: 'true',
        actual: async () => String(await JSON.stringify(await promiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])) === JSON.stringify([1, 2, 3])),
      }
    ];

    const results = [];
    for (const c of cases) {
      const passed = await c.run();
      const actual = passed ? 'true' : await c.actual();
      results.push({
        description: c.description,
        expected: String(c.expected),
        actual,
        passed,
      });
    }

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
