// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createToggleState = getExport<(...args: unknown[]) => unknown>(exports, 'createToggleState');

    const cases = [
      {
        description: "toggles boolean state",
        run: () => Boolean((function () {
                  const toggle = createToggleState(false);
                  toggle.toggle();
                  return toggle.get() === true;
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const toggle = createToggleState(false);
                  toggle.toggle();
                  return toggle.get() === true;
                })()),
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
