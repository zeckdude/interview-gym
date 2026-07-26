// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const relevanceScore = getExport<(...args: unknown[]) => unknown>(exports, 'relevanceScore');

    const cases = [
      {
        description: "counts keyword hits",
        run: () => relevanceScore("react state hooks", ["react","hooks"]) === 2,
        expected: 2,
        actual: () => String(relevanceScore("react state hooks", ["react","hooks"])),
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
