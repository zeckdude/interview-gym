// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const formatBytes = getExport<(...args: unknown[]) => unknown>(exports, 'formatBytes');

    const cases = [
      {
        description: "formats zero",
        run: () => formatBytes(0) === "0 B",
        expected: "0 B",
        actual: () => String(formatBytes(0)),
      },
      {
        description: "formats kilobytes",
        run: () => formatBytes(1536) === "1.5 KB",
        expected: "1.5 KB",
        actual: () => String(formatBytes(1536)),
      },
      {
        description: "formats megabytes",
        run: () => formatBytes(1048576) === "1 MB",
        expected: "1 MB",
        actual: () => String(formatBytes(1048576)),
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
