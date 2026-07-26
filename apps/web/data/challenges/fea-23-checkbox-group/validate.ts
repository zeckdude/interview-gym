// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createCheckboxGroup = getExport<(...args: unknown[]) => unknown>(exports, 'createCheckboxGroup');

    const cases = [
      {
        description: "tracks selected ids",
        run: () => Boolean((function () {
                  const group = createCheckboxGroup(['a']);
                  group.toggle('b');
                  group.toggle('a');
                  const ids = group.getSelected().sort().join(',');
                  return ids === 'b';
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const group = createCheckboxGroup(['a']);
                  group.toggle('b');
                  group.toggle('a');
                  const ids = group.getSelected().sort().join(',');
                  return ids === 'b';
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
