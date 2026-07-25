import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const fn = getExport<(todos: { id: string; text: string; pending?: boolean }[], draft: { id: string; text: string }) => { id: string; text: string; pending?: boolean }[]>(exports, 'applyOptimisticAdd');
const r = fn([{ id:'1', text:'a' }], { id:'tmp', text:'b' });
const t1 = r.length === 2;
const t2 = r[0].text === 'b' && r[0].pending === true;
return { passed: t1&&t2, results: [
  { description: 'Prepends optimistic todo', expected: 'length 2', actual: String(r.length), passed: t1 },
  { description: 'Marks draft as pending', expected: 'pending true on first', actual: JSON.stringify(r[0]), passed: t2 },
]};
  } catch (e: unknown) {
    return errorResult(e);
  }
}
