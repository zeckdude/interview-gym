// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const compareSpecificity = getExport<(...args: unknown[]) => unknown>(exports, 'compareSpecificity');

    const cases = [
      {
        description: "id beats class",
        run: () => compareSpecificity(".nav", "#nav") === -90,
        expected: -90,
        actual: () => String(compareSpecificity(".nav", "#nav")),
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
