// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const cosineSimilarity = getExport<(...args: unknown[]) => unknown>(exports, 'cosineSimilarity');

    const cases = [
      {
        description: "identical vectors",
        run: () => cosineSimilarity([1,0], [1,0]) === 1,
        expected: 1,
        actual: () => String(cosineSimilarity([1,0], [1,0])),
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
