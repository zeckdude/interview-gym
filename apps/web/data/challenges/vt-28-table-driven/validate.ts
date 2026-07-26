// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const runTable = getExport<(...args: unknown[]) => unknown>(exports, 'runTable');

    const cases = [
      {
        description: "runs all rows",
        run: () => Boolean(runTable([{ n: 2 }, { n: 4 }], (row) => row.n % 2 === 0) === true),
        expected: 'true',
        actual: () => String(runTable([{ n: 2 }, { n: 4 }], (row) => row.n % 2 === 0) === true),
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
