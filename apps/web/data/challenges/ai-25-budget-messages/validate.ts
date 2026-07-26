// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const budgetContext = getExport<(...args: unknown[]) => unknown>(exports, 'budgetContext');

    const cases = [
      {
        description: "keeps recent within budget",
        run: () => JSON.stringify(budgetContext(["aaaa","bbbbbbbb"], 3)) === JSON.stringify(["bbbbbbbb"]),
        expected: ["bbbbbbbb"],
        actual: () => JSON.stringify(budgetContext(["aaaa","bbbbbbbb"], 3)),
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
