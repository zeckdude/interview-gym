// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const isDynamicSegment = getExport<(...args: unknown[]) => unknown>(exports, 'isDynamicSegment');

    const cases = [
      {
        description: "detects dynamic segment",
        run: () => isDynamicSegment("[slug]") === true,
        expected: true,
        actual: () => String(isDynamicSegment("[slug]")),
      },
      {
        description: "detects catch-all",
        run: () => isDynamicSegment("[...slug]") === true,
        expected: true,
        actual: () => String(isDynamicSegment("[...slug]")),
      },
      {
        description: "static segment returns false",
        run: () => isDynamicSegment("about") === false,
        expected: false,
        actual: () => String(isDynamicSegment("about")),
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
