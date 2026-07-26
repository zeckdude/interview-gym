// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const assertIncludes = getExport<(...args: unknown[]) => unknown>(exports, 'assertIncludes');

    const cases = [
      {
        description: "finds item",
        run: () => {
          try { assertIncludes([1,2,3], 2); return true; } catch { return false; }
        },
        expected: 'no throw',
        actual: () => 'threw',
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
