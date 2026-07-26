// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const stripRouteGroups = getExport<(...args: unknown[]) => unknown>(exports, 'stripRouteGroups');

    const cases = [
      {
        description: "removes route group folders",
        run: () => stripRouteGroups(["(marketing)","pricing"]) === "pricing",
        expected: "pricing",
        actual: () => String(stripRouteGroups(["(marketing)","pricing"])),
      },
      {
        description: "keeps dynamic segments",
        run: () => stripRouteGroups(["(shop)","[slug]","page"]) === "[slug]/page",
        expected: "[slug]/page",
        actual: () => String(stripRouteGroups(["(shop)","[slug]","page"])),
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
