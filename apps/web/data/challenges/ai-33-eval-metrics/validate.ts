// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const computeEvalMetrics = getExport<(...args: unknown[]) => unknown>(exports, 'computeEvalMetrics');

    const cases = [
      {
        description: "computes accuracy",
        run: () => JSON.stringify(computeEvalMetrics([{"expected":"a","actual":"a"},{"expected":"b","actual":"c"}])) === JSON.stringify({"accuracy":0.5,"total":2}),
        expected: {"accuracy":0.5,"total":2},
        actual: () => JSON.stringify(computeEvalMetrics([{"expected":"a","actual":"a"},{"expected":"b","actual":"c"}])),
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
