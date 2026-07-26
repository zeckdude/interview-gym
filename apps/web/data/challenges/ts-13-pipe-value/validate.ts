// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const pipe = getExport<(...args: unknown[]) => unknown>(exports, 'pipe');

    const cases = [
      {
        description: "pipes left-to-right",
        run: () => Boolean(pipe(3, [(x) => x + 1, (x) => x * 2]) === 8),
        expected: 'true',
        actual: () => String(pipe(3, [(x) => x + 1, (x) => x * 2]) === 8),
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
