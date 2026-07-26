// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const gridColumnCount = getExport<(...args: unknown[]) => unknown>(exports, 'gridColumnCount');

    const cases = [
      {
        description: "counts tracks",
        run: () => gridColumnCount("1fr 1fr 1fr") === 3,
        expected: 3,
        actual: () => String(gridColumnCount("1fr 1fr 1fr")),
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
