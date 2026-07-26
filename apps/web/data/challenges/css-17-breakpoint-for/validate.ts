// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const getBreakpoint = getExport<(...args: unknown[]) => unknown>(exports, 'getBreakpoint');

    const cases = [
      {
        description: "finds tablet breakpoint",
        run: () => getBreakpoint(820, {"sm":640,"md":768,"lg":1024}) === "md",
        expected: "md",
        actual: () => String(getBreakpoint(820, {"sm":640,"md":768,"lg":1024})),
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
