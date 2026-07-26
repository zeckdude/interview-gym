// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const pxToRem = getExport<(...args: unknown[]) => unknown>(exports, 'pxToRem');

    const cases = [
      {
        description: "converts pixels",
        run: () => pxToRem(32, 16) === 2,
        expected: 2,
        actual: () => String(pxToRem(32, 16)),
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
