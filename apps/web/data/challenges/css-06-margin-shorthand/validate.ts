// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const parseMargin = getExport<(...args: unknown[]) => unknown>(exports, 'parseMargin');

    const cases = [
      {
        description: "expands four-value shorthand",
        run: () => JSON.stringify(parseMargin("1px 2px 3px 4px")) === JSON.stringify({"top":"1px","right":"2px","bottom":"3px","left":"4px"}),
        expected: {"top":"1px","right":"2px","bottom":"3px","left":"4px"},
        actual: () => JSON.stringify(parseMargin("1px 2px 3px 4px")),
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
