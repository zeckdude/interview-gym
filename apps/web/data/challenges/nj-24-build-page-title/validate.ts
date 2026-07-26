// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const buildPageTitle = getExport<(...args: unknown[]) => unknown>(exports, 'buildPageTitle');

    const cases = [
      {
        description: "joins all parts",
        run: () => buildPageTitle("Pricing", "Product", "Acme") === "Pricing | Product | Acme",
        expected: "Pricing | Product | Acme",
        actual: () => String(buildPageTitle("Pricing", "Product", "Acme")),
      },
      {
        description: "skips empty section",
        run: () => buildPageTitle("Home", "", "Acme") === "Home | Acme",
        expected: "Home | Acme",
        actual: () => String(buildPageTitle("Home", "", "Acme")),
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
