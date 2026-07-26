// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const memoize = getExport<(...args: unknown[]) => unknown>(exports, 'memoize');

    const cases = [
      {
        description: "caches repeated calls",
        run: () => Boolean((() => { let c = 0; const f = memoize((n) => { c++; return n * 2; }); f(5); f(5); return f(5) === 10 && c === 1; })()),
        expected: 'true',
        actual: () => String((() => { let c = 0; const f = memoize((n) => { c++; return n * 2; }); f(5); f(5); return f(5) === 10 && c === 1; })()),
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
