// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const assertNever = getExport<(...args: unknown[]) => unknown>(exports, 'assertNever');

    const cases = [
      {
        description: "throws on value",
        run: () => {
          try { assertNever("bad"); return false; } catch { return true; }
        },
        expected: 'throws',
        actual: () => 'no throw',
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
