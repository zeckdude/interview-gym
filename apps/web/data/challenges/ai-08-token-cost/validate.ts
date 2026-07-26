// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const tokenCost = getExport<(...args: unknown[]) => unknown>(exports, 'tokenCost');

    const cases = [
      {
        description: "computes cost",
        run: () => tokenCost(2000, 0.5) === 1,
        expected: 1,
        actual: () => String(tokenCost(2000, 0.5)),
      }
    ];

    const results = cases.map((c) => {
      const passed = c.run();
      return {
        description: c.description,
        expected: String(c.expected),
        actual: passed ? String(c.expected) : String(c.actual()),
        passed,
      };
    });

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
