// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const assertCallOrder = getExport<(...args: unknown[]) => unknown>(exports, 'assertCallOrder');

    const cases = [
      {
        description: "matches order",
        run: () => assertCallOrder({"calls":[["a"],["b"]]}, ["a","b"]) === true,
        expected: true,
        actual: () => String(assertCallOrder({"calls":[["a"],["b"]]}, ["a","b"])),
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
