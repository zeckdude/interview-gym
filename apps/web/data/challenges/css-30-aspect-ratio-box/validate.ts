// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const heightFromAspectRatio = getExport<(...args: unknown[]) => unknown>(exports, 'heightFromAspectRatio');

    const cases = [
      {
        description: "computes height",
        run: () => heightFromAspectRatio(160, 1.7777777777777777) === 90,
        expected: 90,
        actual: () => String(heightFromAspectRatio(160, 1.7777777777777777)),
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
