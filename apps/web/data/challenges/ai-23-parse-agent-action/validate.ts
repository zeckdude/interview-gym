// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const parseAgentAction = getExport<(...args: unknown[]) => unknown>(exports, 'parseAgentAction');

    const cases = [
      {
        description: "parses action line",
        run: () => JSON.stringify(parseAgentAction("Action: search Input: {\"q\":\"vitest\"}")) === JSON.stringify({"action":"search","input":{"q":"vitest"}}),
        expected: {"action":"search","input":{"q":"vitest"}},
        actual: () => JSON.stringify(parseAgentAction("Action: search Input: {\"q\":\"vitest\"}")),
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
