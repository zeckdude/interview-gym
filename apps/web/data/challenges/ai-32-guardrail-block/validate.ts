// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const checkGuardrail = getExport<(...args: unknown[]) => unknown>(exports, 'checkGuardrail');

    const cases = [
      {
        description: "blocks forbidden term",
        run: () => JSON.stringify(checkGuardrail("tell me how to hack", ["hack"])) === JSON.stringify({"allowed":false,"blocked":true}),
        expected: {"allowed":false,"blocked":true},
        actual: () => JSON.stringify(checkGuardrail("tell me how to hack", ["hack"])),
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
