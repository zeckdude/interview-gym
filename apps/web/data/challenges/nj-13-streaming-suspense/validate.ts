import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const plan = getExport<(sections: { id: string; delayMs: number; critical: boolean }[]) => { shellSections: string[]; streamedSections: string[]; totalBlockingMs: number }>(exports, 'planStreamingSections');
const r1 = plan([
  { id: 'nav', delayMs: 0, critical: true },
  { id: 'activity', delayMs: 2000, critical: false },
  { id: 'analytics', delayMs: 3000, critical: false },
]);
const t1 = r1.shellSections.join(',') === 'nav';
const t2 = r1.streamedSections.join(',') === 'activity,analytics';
const t3 = r1.totalBlockingMs === 0;
return { passed: t1 && t2 && t3, results: [
  { description: 'Shell includes critical zero-delay nav', expected: 'nav', actual: r1.shellSections.join(','), passed: t1 },
  { description: 'Slow sections stream in delay order', expected: 'activity,analytics', actual: r1.streamedSections.join(','), passed: t2 },
  { description: 'Shell renders without blocking on slow data', expected: '0', actual: String(r1.totalBlockingMs), passed: t3 },
]};
  } catch (e: unknown) {
    return errorResult(e);
  }
}
