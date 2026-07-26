// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const stripChainOfThought = getExport<(...args: unknown[]) => unknown>(exports, 'stripChainOfThought');

    const cases = [
      {
        description: "removes thought block",
        run: () => stripChainOfThought("Thought: hidden reasoning\nAnswer: 42") === "Answer: 42",
        expected: "Answer: 42",
        actual: () => String(stripChainOfThought("Thought: hidden reasoning\nAnswer: 42")),
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
