// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createToolRegistry = getExport<(...args: unknown[]) => unknown>(exports, 'createToolRegistry');

    const cases = [
      {
        description: "calls registered tool",
        run: () => Boolean((() => { const r = createToolRegistry(); r.register('echo', (x) => x); return r.call('echo', 42) === 42; })()),
        expected: 'true',
        actual: () => String((() => { const r = createToolRegistry(); r.register('echo', (x) => x); return r.call('echo', 42) === 42; })()),
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
