// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const filterNullish = getExport<(...args: unknown[]) => unknown>(exports, 'filterNullish');

    const cases = [
      {
        description: "removes null and undefined",
        run: () => JSON.stringify(filterNullish([1,null,2,null,3])) === JSON.stringify([1,2,3]),
        expected: [1,2,3],
        actual: () => JSON.stringify(filterNullish([1,null,2,null,3])),
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
