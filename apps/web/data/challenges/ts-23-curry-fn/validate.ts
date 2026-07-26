// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const curry = getExport<(...args: unknown[]) => unknown>(exports, 'curry');

    const cases = [
      {
        description: "curries to sum",
        run: () => Boolean(curry((a, b, c) => a + b + c)(1)(2)(3) === 6),
        expected: 'true',
        actual: () => String(curry((a, b, c) => a + b + c)(1)(2)(3) === 6),
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
