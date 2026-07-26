// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const exponentialBackoff = getExport<(...args: unknown[]) => unknown>(exports, 'exponentialBackoff');

    const cases = [
      {
        description: "doubles each attempt",
        run: () => exponentialBackoff(2, 100) === 400,
        expected: 400,
        actual: () => String(exponentialBackoff(2, 100)),
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
