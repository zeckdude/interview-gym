// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const extractCodeBlock = getExport<(...args: unknown[]) => unknown>(exports, 'extractCodeBlock');

    const cases = [
      {
        description: "extracts code fence",
        run: () => extractCodeBlock("```js\nconst x = 1;\n```") === "const x = 1;",
        expected: "const x = 1;",
        actual: () => String(extractCodeBlock("```js\nconst x = 1;\n```")),
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
