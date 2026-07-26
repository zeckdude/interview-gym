// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const assertMatches = getExport<(...args: unknown[]) => unknown>(exports, 'assertMatches');

    const cases = [
      {
        description: "matches pattern",
        run: () => Boolean((() => { try { assertMatches('hello@test.com', /^[^@]+@[^@]+$/); return true; } catch { return false; } })()),
        expected: 'true',
        actual: () => String((() => { try { assertMatches('hello@test.com', /^[^@]+@[^@]+$/); return true; } catch { return false; } })()),
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
