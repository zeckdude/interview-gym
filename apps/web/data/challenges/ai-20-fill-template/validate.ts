// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const fillTemplate = getExport<(...args: unknown[]) => unknown>(exports, 'fillTemplate');

    const cases = [
      {
        description: "fills placeholders",
        run: () => fillTemplate("Hello {name}", {"name":"Sam"}) === "Hello Sam",
        expected: "Hello Sam",
        actual: () => String(fillTemplate("Hello {name}", {"name":"Sam"})),
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
