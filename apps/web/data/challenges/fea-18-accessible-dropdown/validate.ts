import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createDropdown = getExport<(opts: { items: string[]; onSelect: (i: string) => void }) => {
      open(): void; close(): void; isOpen(): boolean;
      navigate(d: 'next' | 'prev'): void; selectCurrent(): void;
      getCurrentIndex(): number; getItems(): string[];
    }>(exports, 'createDropdown');

    let selected = '';
    const dd = createDropdown({ items: ['Apple', 'Banana', 'Cherry'], onSelect: v => { selected = v; } });

    const test1 = !dd.isOpen() && dd.getCurrentIndex() === -1;

    dd.open();
    const test2 = dd.isOpen() && dd.getCurrentIndex() === 0;

    dd.navigate('next');
    const test3 = dd.getCurrentIndex() === 1;

    dd.selectCurrent();
    const test4 = selected === 'Banana' && !dd.isOpen();

    // Test wrapping
    dd.open();
    dd.navigate('prev'); // 0 → 2 (wraps)
    const test5 = dd.getCurrentIndex() === 2;

    return {
      passed: test1 && test2 && test3 && test4 && test5,
      results: [
        { description: 'Initial: closed, index=-1', expected: 'closed, -1', actual: `open=${dd.isOpen()}, idx=${dd.getCurrentIndex()}`, passed: test1 },
        { description: 'open() sets open=true, index=0', expected: 'open=true, idx=0', actual: `${test2 ? 'ok' : 'fail'}`, passed: test2 },
        { description: 'navigate(next) increments index', expected: 'idx=1', actual: `idx=${dd.getCurrentIndex()}`, passed: test3 },
        { description: 'selectCurrent() calls onSelect, closes dropdown', expected: 'Banana, closed', actual: `"${selected}", open=${dd.isOpen()}`, passed: test4 },
        { description: 'navigate(prev) wraps from 0 to last item', expected: 'idx=2', actual: `idx=${dd.getCurrentIndex()}`, passed: test5 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
