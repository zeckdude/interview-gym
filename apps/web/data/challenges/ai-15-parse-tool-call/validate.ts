// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const parseToolCall = getExport<(...args: unknown[]) => unknown>(exports, 'parseToolCall');

    const cases = [
      {
        description: "parses tool payload",
        run: () => JSON.stringify(parseToolCall("{\"name\":\"search\",\"arguments\":{\"q\":\"vitest\"}}")) === JSON.stringify({"name":"search","arguments":{"q":"vitest"}}),
        expected: {"name":"search","arguments":{"q":"vitest"}},
        actual: () => JSON.stringify(parseToolCall("{\"name\":\"search\",\"arguments\":{\"q\":\"vitest\"}}")),
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
