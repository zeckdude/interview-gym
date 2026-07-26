// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const snapshotValue = getExport<(...args: unknown[]) => unknown>(exports, 'snapshotValue');

    const cases = [
      {
        description: "pretty prints json",
        run: () => snapshotValue({"a":1}) === "{\n  \"a\": 1\n}",
        expected: "{\n  \"a\": 1\n}",
        actual: () => String(snapshotValue({"a":1})),
      }
    ];

    const results = cases.map((c) => {
      const passed = c.run();
      return {
        description: c.description,
        expected: String(c.expected),
        actual: passed ? String(c.expected) : String(c.actual()),
        passed,
      };
    });

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
