import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface VirtualListResult<T> {
  startIndex: number;
  endIndex: number;
  visibleItems: T[];
  offsetY: number;
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const getVisibleItems = getExport<<T>(opts: {
      items: T[];
      itemHeight: number;
      viewportHeight: number;
      scrollTop: number;
    }) => VirtualListResult<T>>(exports, 'getVisibleItems');

    const items = Array.from({ length: 100 }, (_, i) => ({ id: i }));

    // Test 1: at scroll=0, renders from beginning
    const r1 = getVisibleItems({ items, itemHeight: 50, viewportHeight: 200, scrollTop: 0 });
    const test1 = r1.startIndex === 0 && r1.offsetY === 0;

    // Test 2: scrolled down, startIndex is nonzero
    const r2 = getVisibleItems({ items, itemHeight: 50, viewportHeight: 200, scrollTop: 200 });
    const test2 = r2.startIndex > 0 && r2.startIndex <= 4 && r2.offsetY === r2.startIndex * 50;

    // Test 3: visibleItems matches startIndex:endIndex slice
    const test3 = r2.visibleItems.length === r2.endIndex - r2.startIndex;

    // Test 4: does not render all 100 items
    const test4 = r1.visibleItems.length < 100;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'At scrollTop=0, starts at index 0', expected: 'startIndex=0, offsetY=0', actual: `startIndex=${r1.startIndex}, offsetY=${r1.offsetY}`, passed: test1 },
        { description: 'When scrolled, startIndex > 0 and offsetY = startIndex * itemHeight', expected: 'startIndex>0, offsetY matches', actual: `startIndex=${r2.startIndex}, offsetY=${r2.offsetY}`, passed: test2 },
        { description: 'visibleItems length matches endIndex - startIndex', expected: String(r2.endIndex - r2.startIndex), actual: String(r2.visibleItems.length), passed: test3 },
        { description: 'Only renders a window of items, not all 100', expected: '<100', actual: String(r1.visibleItems.length), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
