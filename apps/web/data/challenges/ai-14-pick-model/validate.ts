// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const pickModel = getExport<(...args: unknown[]) => unknown>(exports, 'pickModel');

    const cases = [
      {
        description: "picks large model",
        run: () => pickModel("high", {"small":"mini","medium":"base","large":"pro"}) === "pro",
        expected: "pro",
        actual: () => String(pickModel("high", {"small":"mini","medium":"base","large":"pro"})),
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
