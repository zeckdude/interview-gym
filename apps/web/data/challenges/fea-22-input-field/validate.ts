// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createInputField = getExport<(...args: unknown[]) => unknown>(exports, 'createInputField');

    const cases = [
      {
        description: "notifies subscribers on change",
        run: () => Boolean((function () {
                  const field = createInputField('');
                  let seen = '';
                  field.subscribe((v) => { seen = v; });
                  field.setValue('hello');
                  return field.getValue() === 'hello' && seen === 'hello';
                })()),
        expected: 'true',
        actual: () => String((function () {
                  const field = createInputField('');
                  let seen = '';
                  field.subscribe((v) => { seen = v; });
                  field.setValue('hello');
                  return field.getValue() === 'hello' && seen === 'hello';
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
