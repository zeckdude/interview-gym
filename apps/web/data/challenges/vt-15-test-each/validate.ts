// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const runTestCases = getExport<(...args: unknown[]) => unknown>(exports, 'runTestCases');

    const cases = [
      {
        description: "runs table",
        run: () => Boolean(runTestCases([{ input: 2, expected: 4 }, { input: 3, expected: 9 }], (n) => n * n) === true),
        expected: 'true',
        actual: () => String(runTestCases([{ input: 2, expected: 4 }, { input: 3, expected: 9 }], (n) => n * n) === true),
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
