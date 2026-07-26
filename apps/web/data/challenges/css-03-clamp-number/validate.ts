// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const clamp = getExport<(...args: unknown[]) => unknown>(exports, 'clamp');

    const cases = [
      {
        description: "clamps high value",
        run: () => clamp(20, 0, 10) === 10,
        expected: 10,
        actual: () => String(clamp(20, 0, 10)),
      },
      {
        description: "clamps low value",
        run: () => clamp(-5, 0, 10) === 0,
        expected: 0,
        actual: () => String(clamp(-5, 0, 10)),
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
