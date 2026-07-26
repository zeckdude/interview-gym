// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createTabs = getExport<(...args: unknown[]) => unknown>(exports, 'createTabs');

    const cases = [
      {
        description: "switches active tab",
        run: () => Boolean((function () {
                  const tabs = createTabs(['home', 'settings'], 'home');
                  tabs.setActive('settings');
                  return tabs.getActive() === 'settings';
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const tabs = createTabs(['home', 'settings'], 'home');
                  tabs.setActive('settings');
                  return tabs.getActive() === 'settings';
                })()),
      },
      {
        description: "ignores unknown tab ids",
        run: () => Boolean((function () {
                  const tabs = createTabs(['a', 'b'], 'a');
                  tabs.setActive('missing');
                  return tabs.getActive() === 'a';
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const tabs = createTabs(['a', 'b'], 'a');
                  tabs.setActive('missing');
                  return tabs.getActive() === 'a';
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
