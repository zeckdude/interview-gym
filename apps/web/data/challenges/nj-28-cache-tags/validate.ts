// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const computeCacheTags = getExport<(...args: unknown[]) => unknown>(exports, 'computeCacheTags');

    const cases = [
      {
        description: "builds tags from resource",
        run: () => JSON.stringify(computeCacheTags({"type":"post","id":"42","tenantId":"acme"})) === JSON.stringify(["app","type:post","post:42","tenant:acme"]),
        expected: ["app","type:post","post:42","tenant:acme"],
        actual: () => JSON.stringify(computeCacheTags({"type":"post","id":"42","tenantId":"acme"})),
      },
      {
        description: "always includes app tag",
        run: () => JSON.stringify(computeCacheTags({})) === JSON.stringify(["app"]),
        expected: ["app"],
        actual: () => JSON.stringify(computeCacheTags({})),
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
