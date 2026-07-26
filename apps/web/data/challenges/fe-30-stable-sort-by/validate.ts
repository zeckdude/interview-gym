// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const stableSortBy = getExport<(...args: unknown[]) => unknown>(exports, 'stableSortBy');

    const cases = [
      {
        description: "preserves order for equal keys",
        run: () => Boolean((function () {
                  const items = [{ name: 'a', score: 1 }, { name: 'b', score: 1 }, { name: 'c', score: 0 }];
                  const sorted = stableSortBy(items, (x) => x.score);
                  return sorted.map((x) => x.name).join(',') === 'c,a,b';
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const items = [{ name: 'a', score: 1 }, { name: 'b', score: 1 }, { name: 'c', score: 0 }];
                  const sorted = stableSortBy(items, (x) => x.score);
                  return sorted.map((x) => x.name).join(',') === 'c,a,b';
                })()),
      }
    ];

    const results = cases.map((c) => {
      const passed = c.run();
      return {
        description: c.description,
        expected: String(c.expected),
        actual: passed ? 'true' : String(c.actual()),
        passed,
      };
    });

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
