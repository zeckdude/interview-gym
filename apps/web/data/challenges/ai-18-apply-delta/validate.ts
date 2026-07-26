// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const applyStreamDelta = getExport<(...args: unknown[]) => unknown>(exports, 'applyStreamDelta');

    const cases = [
      {
        description: "appends delta",
        run: () => applyStreamDelta("Hello", " world") === "Hello world",
        expected: "Hello world",
        actual: () => String(applyStreamDelta("Hello", " world")),
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
