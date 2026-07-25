import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface VNode { type: string; props: Record<string, unknown>; }
interface Patch { type: string; path: string; value?: unknown; }

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const diff = getExport<(o: VNode, n: VNode) => Patch[]>(exports, 'diff');

    // Test 1: no change = no patches
    const r1 = diff(
      { type: 'div', props: { className: 'box' } },
      { type: 'div', props: { className: 'box' } }
    );
    const test1 = r1.length === 0;

    // Test 2: prop update
    const r2 = diff(
      { type: 'div', props: { className: 'box' } },
      { type: 'div', props: { className: 'box active' } }
    );
    const test2 = r2.some((p) => p.type === 'UPDATE' && p.value === 'box active');

    // Test 3: type change = REPLACE
    const r3 = diff(
      { type: 'div', props: {} },
      { type: 'span', props: {} }
    );
    const test3 = r3.some((p) => p.type === 'REPLACE');

    // Test 4: prop removal
    const r4 = diff(
      { type: 'div', props: { id: 'foo', className: 'bar' } },
      { type: 'div', props: { id: 'foo' } }
    );
    const test4 = r4.some((p) => p.type === 'REMOVE' && p.path.includes('className'));

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'No change → no patches', expected: '0 patches', actual: `${r1.length} patches`, passed: test1 },
        { description: 'Changed prop → UPDATE patch', expected: 'UPDATE patch with new value', actual: r2.map((p) => p.type).join(','), passed: test2 },
        { description: 'Different type → REPLACE patch', expected: 'REPLACE patch', actual: r3.map((p) => p.type).join(','), passed: test3 },
        { description: 'Removed prop → REMOVE patch', expected: 'REMOVE className', actual: r4.map((p) => p.type).join(','), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
