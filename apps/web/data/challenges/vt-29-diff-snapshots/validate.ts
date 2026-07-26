// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const diffSnapshots = getExport<(...args: unknown[]) => unknown>(exports, 'diffSnapshots');

    const cases = [
      {
        description: "detects equal snapshots",
        run: () => diffSnapshots({"x":1}, {"x":1}) === true,
        expected: true,
        actual: () => String(diffSnapshots({"x":1}, {"x":1})),
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
