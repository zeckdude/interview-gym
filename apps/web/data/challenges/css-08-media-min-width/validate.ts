// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const matchesMinWidth = getExport<(...args: unknown[]) => unknown>(exports, 'matchesMinWidth');

    const cases = [
      {
        description: "matches wide viewport",
        run: () => matchesMinWidth(900, 768) === true,
        expected: true,
        actual: () => String(matchesMinWidth(900, 768)),
      },
      {
        description: "rejects narrow viewport",
        run: () => matchesMinWidth(500, 768) === false,
        expected: false,
        actual: () => String(matchesMinWidth(500, 768)),
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
