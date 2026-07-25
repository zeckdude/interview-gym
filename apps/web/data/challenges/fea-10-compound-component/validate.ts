import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createAccordion = getExport<() => {
      addPanel(id: string): void;
      expand(id: string): void;
      collapse(id: string): void;
      isExpanded(id: string): boolean;
      getExpandedIds(): string[];
    }>(exports, 'createAccordion');

    const acc = createAccordion();
    acc.addPanel('a');
    acc.addPanel('b');

    const test1 = !acc.isExpanded('a') && !acc.isExpanded('b');

    acc.expand('a');
    const test2 = acc.isExpanded('a') && !acc.isExpanded('b');

    acc.expand('b');
    const test3 = !acc.isExpanded('a') && acc.isExpanded('b');

    acc.collapse('b');
    const test4 = !acc.isExpanded('b') && acc.getExpandedIds().length === 0;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Panels start collapsed', expected: 'both collapsed', actual: `a=${acc.isExpanded('a')}, b=${acc.isExpanded('b')}`, passed: test1 },
        { description: 'expand(a) expands only a', expected: 'a=true, b=false', actual: `${test2 ? 'ok' : 'fail'}`, passed: test2 },
        { description: 'expand(b) collapses a, expands b', expected: 'a=false, b=true', actual: `${test3 ? 'ok' : 'fail'}`, passed: test3 },
        { description: 'collapse(b) leaves none expanded', expected: '[]', actual: JSON.stringify(acc.getExpandedIds()), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
