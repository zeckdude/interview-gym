// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createMock = getExport<(...args: unknown[]) => unknown>(exports, 'createMock');

    const cases = [
      {
        description: "records call args",
        run: () => Boolean((() => { const m = createMock(); m(1,2); return m.calls.length === 1 && m.calls[0][0] === 1; })()),
        expected: 'true',
        actual: () => String((() => { const m = createMock(); m(1,2); return m.calls.length === 1 && m.calls[0][0] === 1; })()),
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
