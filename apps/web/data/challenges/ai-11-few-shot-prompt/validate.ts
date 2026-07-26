// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const buildFewShot = getExport<(...args: unknown[]) => unknown>(exports, 'buildFewShot');

    const cases = [
      {
        description: "formats examples",
        run: () => buildFewShot([{"q":"2+2","a":"4"}]) === "Q: 2+2\nA: 4",
        expected: "Q: 2+2\nA: 4",
        actual: () => String(buildFewShot([{"q":"2+2","a":"4"}])),
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
