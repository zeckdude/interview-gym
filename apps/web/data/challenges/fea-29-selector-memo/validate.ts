// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createSelectorMemo = getExport<(...args: unknown[]) => unknown>(exports, 'createSelectorMemo');

    const cases = [
      {
        description: "memoizes by argument reference",
        run: () => Boolean((function () {
                  let calls = 0;
                  const sum = createSelectorMemo((a, b) => { calls += 1; return a + b; });
                  sum(1, 2);
                  sum(1, 2);
                  return calls === 1 && sum(1, 2) === 3;
                })()),
        expected: 'true',
        actual: () => String((function () {
                  let calls = 0;
                  const sum = createSelectorMemo((a, b) => { calls += 1; return a + b; });
                  sum(1, 2);
                  sum(1, 2);
                  return calls === 1 && sum(1, 2) === 3;
                })()),
      }
    ];

    const results = cases.map((c) => {
      const passed = c.run();
      return {
        description: c.description,
        expected: String(c.expected),
        actual: passed ? 'true' : String(c.actual()),
        passed,
      };
    });

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
