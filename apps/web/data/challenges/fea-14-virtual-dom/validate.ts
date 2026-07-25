import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface VNode { type: string; props: Record<string, unknown>; children: never[]; text?: string; }
type Patch = { type: string; key?: string; oldValue?: unknown; newValue?: unknown; oldText?: string; newText?: string };

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const diff = getExport<(a: VNode, b: VNode) => Patch[]>(exports, 'diff');

    const base: VNode = { type: 'div', props: {}, children: [] };

    // Test 1: same node → no patches
    const p1 = diff({ ...base, props: { class: 'a' } }, { ...base, props: { class: 'a' } });
    const test1 = p1.length === 0;

    // Test 2: prop change → UPDATE_PROPS
    const p2 = diff({ ...base, props: { class: 'a' } }, { ...base, props: { class: 'b' } });
    const test2 = p2.some(p => p.type === 'UPDATE_PROPS' && p.key === 'class');

    // Test 3: type change → REPLACE
    const p3 = diff({ ...base, type: 'div' }, { ...base, type: 'span' });
    const test3 = p3.length === 1 && p3[0].type === 'REPLACE';

    // Test 4: removed prop → REMOVE
    const p4 = diff({ ...base, props: { id: 'x', class: 'a' } }, { ...base, props: { id: 'x' } });
    const test4 = p4.some(p => p.type === 'REMOVE' && p.key === 'class');

    // Test 5: added prop → ADD
    const p5 = diff({ ...base, props: {} }, { ...base, props: { id: 'new' } });
    const test5 = p5.some(p => p.type === 'ADD' && p.key === 'id');

    return {
      passed: test1 && test2 && test3 && test4 && test5,
      results: [
        { description: 'Same props → no patches', expected: '[]', actual: JSON.stringify(p1), passed: test1 },
        { description: 'Changed prop → UPDATE_PROPS', expected: 'UPDATE_PROPS for class', actual: `${test2 ? 'found' : 'not found'}`, passed: test2 },
        { description: 'Type change → REPLACE', expected: '[{type:REPLACE}]', actual: p3[0]?.type ?? 'none', passed: test3 },
        { description: 'Removed prop → REMOVE', expected: 'REMOVE for class', actual: `${test4 ? 'found' : 'not found'}`, passed: test4 },
        { description: 'Added prop → ADD', expected: 'ADD for id', actual: `${test5 ? 'found' : 'not found'}`, passed: test5 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
