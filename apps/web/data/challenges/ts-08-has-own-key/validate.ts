// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const hasOwn = getExport<(...args: unknown[]) => unknown>(exports, 'hasOwn');

    const cases = [
      {
        description: "finds own key",
        run: () => hasOwn({"a":1}, "a") === true,
        expected: true,
        actual: () => String(hasOwn({"a":1}, "a")),
      },
      {
        description: "ignores inherited",
        run: () => hasOwn({}, "toString") === true,
        expected: true,
        actual: () => String(hasOwn({}, "toString")),
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
