// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const trimMessages = getExport<(...args: unknown[]) => unknown>(exports, 'trimMessages');

    const cases = [
      {
        description: "keeps latest messages",
        run: () => JSON.stringify(trimMessages([1,2,3,4], 2)) === JSON.stringify([3,4]),
        expected: [3,4],
        actual: () => JSON.stringify(trimMessages([1,2,3,4], 2)),
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
