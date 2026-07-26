// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const assertCallCount = getExport<(...args: unknown[]) => unknown>(exports, 'assertCallCount');

    const cases = [
      {
        description: "counts calls",
        run: () => {
          try { assertCallCount({"calls":[[],[]]}, 2); return true; } catch { return false; }
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
