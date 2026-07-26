// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const groupBy = getExport<(...args: unknown[]) => unknown>(exports, 'groupBy');

    const cases = [
      {
        description: "groups by parity",
        run: () => Boolean(JSON.stringify(groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? 'even' : 'odd'))) === JSON.stringify({ odd: [1, 3], even: [2, 4] })),
        expected: 'true',
        actual: () => String(JSON.stringify(groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? 'even' : 'odd'))) === JSON.stringify({ odd: [1, 3], even: [2, 4] })),
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
