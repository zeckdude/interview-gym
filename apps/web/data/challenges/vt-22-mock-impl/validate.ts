// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const mockWithImpl = getExport<(...args: unknown[]) => unknown>(exports, 'mockWithImpl');

    const cases = [
      {
        description: "delegates to impl",
        run: () => Boolean(mockWithImpl((a,b)=>a+b)(2,5) === 7),
        expected: 'true',
        actual: () => String(mockWithImpl((a,b)=>a+b)(2,5) === 7),
      }
    ];

    const results = cases.map((c) => {
      const passed = c.run();
      return {
        description: c.description,
        expected: String(c.expected),
        actual: passed ? 'true' : String(c.actual()),
        passed,
      };
    });

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
