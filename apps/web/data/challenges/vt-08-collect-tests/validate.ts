// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const collectTests = getExport<(...args: unknown[]) => unknown>(exports, 'collectTests');

    const cases = [
      {
        description: "all passed",
        run: () => collectTests([{"passed":true},{"passed":true}]) === true,
        expected: true,
        actual: () => String(collectTests([{"passed":true},{"passed":true}])),
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
