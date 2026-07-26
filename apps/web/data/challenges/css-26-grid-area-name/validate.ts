// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const parseGridArea = getExport<(...args: unknown[]) => unknown>(exports, 'parseGridArea');

    const cases = [
      {
        description: "parses area shorthand",
        run: () => JSON.stringify(parseGridArea("header / sidebar")) === JSON.stringify({"rowStart":"header","colStart":"sidebar"}),
        expected: {"rowStart":"header","colStart":"sidebar"},
        actual: () => JSON.stringify(parseGridArea("header / sidebar")),
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
