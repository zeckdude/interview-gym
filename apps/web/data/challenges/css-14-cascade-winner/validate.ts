// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const pickWinningRule = getExport<(...args: unknown[]) => unknown>(exports, 'pickWinningRule');

    const cases = [
      {
        description: "picks highest specificity",
        run: () => JSON.stringify(pickWinningRule([{"selector":".a","specificity":10},{"selector":"#id","specificity":100}])) === JSON.stringify({"selector":"#id","specificity":100}),
        expected: {"selector":"#id","specificity":100},
        actual: () => JSON.stringify(pickWinningRule([{"selector":".a","specificity":10},{"selector":"#id","specificity":100}])),
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
