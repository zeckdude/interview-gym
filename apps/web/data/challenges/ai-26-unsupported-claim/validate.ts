// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const flagUnverifiedClaims = getExport<(...args: unknown[]) => unknown>(exports, 'flagUnverifiedClaims');

    const cases = [
      {
        description: "flags unknown long terms",
        run: () => flagUnverifiedClaims("React uses quantum mechanics", ["react library"]) === ["quantum","mechanics"],
        expected: ["quantum","mechanics"],
        actual: () => String(flagUnverifiedClaims("React uses quantum mechanics", ["react library"])),
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
