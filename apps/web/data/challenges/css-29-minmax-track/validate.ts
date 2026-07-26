// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const parseMinmax = getExport<(...args: unknown[]) => unknown>(exports, 'parseMinmax');

    const cases = [
      {
        description: "parses minmax",
        run: () => JSON.stringify(parseMinmax("minmax(200px, 1fr)")) === JSON.stringify({"min":"200px","max":"1fr"}),
        expected: {"min":"200px","max":"1fr"},
        actual: () => JSON.stringify(parseMinmax("minmax(200px, 1fr)")),
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
