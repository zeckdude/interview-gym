// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const parseTranslateX = getExport<(...args: unknown[]) => unknown>(exports, 'parseTranslateX');

    const cases = [
      {
        description: "reads translateX",
        run: () => parseTranslateX("translateX(12px) rotate(5deg)") === 12,
        expected: 12,
        actual: () => String(parseTranslateX("translateX(12px) rotate(5deg)")),
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
