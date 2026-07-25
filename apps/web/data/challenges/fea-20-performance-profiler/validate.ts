import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createProfiler = getExport<(name: string, opts?: { clock?: { now(): number } }) => {
      start(l: string): void; end(l: string): void;
      getMeasurements(): { label: string; duration: number; startTime: number; endTime: number }[];
      getSummary(): { label: string; count: number; totalMs: number; avgMs: number; minMs: number; maxMs: number }[];
    }>(exports, 'createProfiler');

    let time = 0;
    const clock = { now: () => time };
    const p = createProfiler('test', { clock });

    time = 0; p.start('render');
    time = 50; p.end('render');
    time = 100; p.start('render');
    time = 130; p.end('render');

    const measurements = p.getMeasurements();
    const test1 = measurements.length === 2;
    const test2 = measurements[0].duration === 50 && measurements[1].duration === 30;

    const summary = p.getSummary();
    const renderSummary = summary.find(s => s.label === 'render');
    const test3 = renderSummary?.count === 2;
    const test4 = renderSummary?.totalMs === 80 && Math.abs((renderSummary?.avgMs ?? 0) - 40) < 0.01;
    const test5 = renderSummary?.minMs === 30 && renderSummary?.maxMs === 50;

    return {
      passed: test1 && test2 && test3 && test4 && test5,
      results: [
        { description: 'getMeasurements() returns 2 entries', expected: '2', actual: String(measurements.length), passed: test1 },
        { description: 'Durations computed correctly', expected: '50, 30', actual: measurements.map(m => m.duration).join(', '), passed: test2 },
        { description: 'getSummary() groups by label', expected: 'count=2', actual: `count=${renderSummary?.count ?? 0}`, passed: test3 },
        { description: 'totalMs=80, avgMs=40', expected: 'total=80, avg=40', actual: `total=${renderSummary?.totalMs}, avg=${renderSummary?.avgMs}`, passed: test4 },
        { description: 'minMs=30, maxMs=50', expected: 'min=30, max=50', actual: `min=${renderSummary?.minMs}, max=${renderSummary?.maxMs}`, passed: test5 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
