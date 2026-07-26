// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const chunkText = getExport<(...args: unknown[]) => unknown>(exports, 'chunkText');

    const cases = [
      {
        description: "splits text",
        run: () => JSON.stringify(chunkText("abcdef", 2)) === JSON.stringify(["ab","cd","ef"]),
        expected: ["ab","cd","ef"],
        actual: () => JSON.stringify(chunkText("abcdef", 2)),
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
