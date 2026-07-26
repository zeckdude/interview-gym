// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const assertThrows = getExport<(...args: unknown[]) => unknown>(exports, 'assertThrows');

    const cases = [
      {
        description: "detects thrown error",
        run: () => Boolean(assertThrows(() => { throw new Error('boom'); }) === true),
        expected: 'true',
        actual: () => String(assertThrows(() => { throw new Error('boom'); }) === true),
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
