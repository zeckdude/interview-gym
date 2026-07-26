// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const validateSegmentConfig = getExport<(config: { dynamic?: string; revalidate?: number; runtime?: string }) => { valid: boolean; errors: string[] }>(exports, 'validateSegmentConfig');

    const cases = [
      {
        description: "accepts valid config",
        run: () => JSON.stringify(validateSegmentConfig({"dynamic":"force-static","revalidate":60,"runtime":"edge"})) === JSON.stringify({"valid":true,"errors":[]}),
        expected: {"valid":true,"errors":[]},
        actual: () => JSON.stringify(validateSegmentConfig({"dynamic":"force-static","revalidate":60,"runtime":"edge"})),
      },
      {
        description: "collects multiple errors",
        run: () => JSON.stringify(validateSegmentConfig({"dynamic":"invalid","revalidate":-1,"runtime":"deno"})) === JSON.stringify({"valid":false,"errors":["Invalid dynamic value","revalidate must be a non-negative number","Invalid runtime"]}),
        expected: {"valid":false,"errors":["Invalid dynamic value","revalidate must be a non-negative number","Invalid runtime"]},
        actual: () => JSON.stringify(validateSegmentConfig({"dynamic":"invalid","revalidate":-1,"runtime":"deno"})),
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
