import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const fn = getExport<(lines: string[]) => string[]>(exports, 'auditImports');
const r = fn([
  "import Chart from 'heavy-chart'",
  "import fs from 'fs'",
  '<script src="https://analytics.example.com/track.js"></script>',
]);
const t1 = r.includes('dynamic-import');
const t2 = r.includes('server-only-in-client');
const t3 = r.includes('blocking-script');
return { passed: t1&&t2&&t3, results: [
  { description: 'Flags heavy top-level import', expected: 'dynamic-import', actual: r.join(','), passed: t1 },
  { description: 'Flags fs in client bundle', expected: 'server-only-in-client', actual: r.join(','), passed: t2 },
  { description: 'Flags blocking third-party script', expected: 'blocking-script', actual: r.join(','), passed: t3 },
]};
  } catch (e: unknown) {
    return errorResult(e);
  }
}
