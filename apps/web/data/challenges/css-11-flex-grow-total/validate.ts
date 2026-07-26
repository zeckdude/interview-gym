// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const flexGrowTotal = getExport<(...args: unknown[]) => unknown>(exports, 'flexGrowTotal');

    const cases = [
      {
        description: "sums grow factors",
        run: () => flexGrowTotal([{"grow":1},{"grow":2},{"grow":1}]) === 4,
        expected: 4,
        actual: () => String(flexGrowTotal([{"grow":1},{"grow":2},{"grow":1}])),
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
