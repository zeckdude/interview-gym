// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const resolveVar = getExport<(...args: unknown[]) => unknown>(exports, 'resolveVar');

    const cases = [
      {
        description: "resolves var()",
        run: () => resolveVar("var(--brand)", {"--brand":"#ff6b35"}) === "#ff6b35",
        expected: "#ff6b35",
        actual: () => String(resolveVar("var(--brand)", {"--brand":"#ff6b35"})),
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
