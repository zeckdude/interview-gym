// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const buildSystemPrompt = getExport<(...args: unknown[]) => unknown>(exports, 'buildSystemPrompt');

    const cases = [
      {
        description: "prefixes instructions",
        run: () => buildSystemPrompt("Answer concisely.") === "You are a helpful assistant.\nAnswer concisely.",
        expected: "You are a helpful assistant.\nAnswer concisely.",
        actual: () => String(buildSystemPrompt("Answer concisely.")),
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
