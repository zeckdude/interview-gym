import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const addDelegatedListener = getExport<
      (parent: Element, eventType: string, selector: string, handler: (el: Element, event: Event) => void) => () => void
    >(exports, 'addDelegatedListener');

    // Build a mock DOM
    let listenerCount = 0;
    const mockTarget = {
      closest: (sel: string) => sel === '.item' ? mockTarget : null,
    };
    const mockEvent = { target: mockTarget } as unknown as Event;

    const listeners: Array<(e: Event) => void> = [];
    const mockParent = {
      addEventListener: (_type: string, fn: (e: Event) => void) => {
        listenerCount++;
        listeners.push(fn);
      },
      removeEventListener: (_type: string, fn: (e: Event) => void) => {
        const idx = listeners.indexOf(fn);
        if (idx >= 0) listeners.splice(idx, 1);
      },
      contains: () => true,
    } as unknown as Element;

    // Test 1: attaches exactly one listener to parent
    let handlerCallCount = 0;
    const cleanup = addDelegatedListener(mockParent, 'click', '.item', () => { handlerCallCount++; });
    const test1 = listenerCount === 1;

    // Test 2: handler fires when matching child triggers event
    listeners.forEach((fn) => fn(mockEvent));
    const test2 = handlerCallCount === 1;

    // Test 3: cleanup removes the listener
    cleanup();
    const test3 = listeners.length === 0;

    // Test 4: returns a function
    const test4 = typeof cleanup === 'function';

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Attaches exactly 1 listener to parent', expected: '1', actual: String(listenerCount), passed: test1 },
        { description: 'Handler fires when matching child triggers event', expected: '1 call', actual: `${handlerCallCount} call(s)`, passed: test2 },
        { description: 'Cleanup function removes the listener', expected: '0 listeners remaining', actual: `${listeners.length} remaining`, passed: test3 },
        { description: 'Returns a cleanup function', expected: 'function', actual: typeof cleanup, passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
