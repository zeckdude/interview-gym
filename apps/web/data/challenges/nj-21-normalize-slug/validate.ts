// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const normalizeSlug = getExport<(...args: unknown[]) => unknown>(exports, 'normalizeSlug');

    const cases = [
      {
        description: "lowercases and hyphenates",
        run: () => normalizeSlug("Hello World") === "hello-world",
        expected: "hello-world",
        actual: () => String(normalizeSlug("Hello World")),
      },
      {
        description: "strips special characters",
        run: () => normalizeSlug("  Foo & Bar!!  ") === "foo-bar",
        expected: "foo-bar",
        actual: () => String(normalizeSlug("  Foo & Bar!!  ")),
      },
      {
        description: "collapses multiple hyphens",
        run: () => normalizeSlug("a---b") === "a-b",
        expected: "a-b",
        actual: () => String(normalizeSlug("a---b")),
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
