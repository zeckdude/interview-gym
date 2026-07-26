// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const assertNoThrow = getExport<(...args: unknown[]) => unknown>(exports, 'assertNoThrow');

    const cases = [
      {
        description: "passes safe fn",
        run: () => Boolean(assertNoThrow(() => { return 1; }) === true),
        expected: 'true',
        actual: () => String(assertNoThrow(() => { return 1; }) === true),
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
