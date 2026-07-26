// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const withFakeNow = getExport<(...args: unknown[]) => unknown>(exports, 'withFakeNow');

    const cases = [
      {
        description: "uses fake now",
        run: () => Boolean(withFakeNow(1000, () => Date.now()) === 1000),
        expected: 'true',
        actual: () => String(withFakeNow(1000, () => Date.now()) === 1000),
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
