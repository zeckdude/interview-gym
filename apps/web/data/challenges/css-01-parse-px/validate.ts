// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const parsePx = getExport<(...args: unknown[]) => unknown>(exports, 'parsePx');

    const cases = [
      {
        description: "parses px value",
        run: () => parsePx("16px") === 16,
        expected: 16,
        actual: () => String(parsePx("16px")),
      },
      {
        description: "rejects invalid",
        run: () => parsePx("1em") === null,
        expected: null,
        actual: () => String(parsePx("1em")),
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
