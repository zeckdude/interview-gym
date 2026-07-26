// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const compose = getExport<(...args: unknown[]) => unknown>(exports, 'compose');

    const cases = [
      {
        description: "composes right-to-left",
        run: () => Boolean(compose((x) => x + 1, (x) => x * 2)(3) === 7),
        expected: 'true',
        actual: () => String(compose((x) => x + 1, (x) => x * 2)(3) === 7),
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
