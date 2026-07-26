// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const mockSequence = getExport<(...args: unknown[]) => unknown>(exports, 'mockSequence');

    const cases = [
      {
        description: "returns in order",
        run: () => Boolean((() => { const m = mockSequence([1,2]); return m() === 1 && m() === 2; })()),
        expected: 'true',
        actual: () => String((() => { const m = mockSequence([1,2]); return m() === 1 && m() === 2; })()),
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
