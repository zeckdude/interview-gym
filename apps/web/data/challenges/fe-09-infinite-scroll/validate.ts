import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export async function validate(userCode: string) {
  const previousObserver = globalThis.IntersectionObserver;

  try {
    const state = {
      observedElement: null as Element | null,
      disconnected: false,
      observerCallback: null as ((entries: { isIntersecting: boolean }[]) => void) | null,
    };

    globalThis.IntersectionObserver = class {
      constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
        state.observerCallback = callback;
      }
      observe(el: Element) {
        state.observedElement = el;
      }
      disconnect() {
        state.disconnected = true;
      }
      unobserve() {}
      takeRecords() {
        return [];
      }
      root = null;
      rootMargin = '';
      thresholds = [];
    } as unknown as typeof IntersectionObserver;

    const exports = executeUserCode(userCode, () => ({}));
    const createInfiniteScroller = getExport<
      (opts: { sentinel: Element; onLoadMore: () => Promise<void>; threshold?: number }) => { destroy(): void }
    >(exports, 'createInfiniteScroller');

    const mockSentinel = {} as Element;
    let loadCount = 0;

    const scroller = createInfiniteScroller({
      sentinel: mockSentinel,
      onLoadMore: async () => {
        loadCount++;
      },
      threshold: 0.1,
    });

    const test1 = state.observedElement === mockSentinel;

    if (state.observerCallback) {
      state.observerCallback([{ isIntersecting: true }]);
    }
    await new Promise((r) => setTimeout(r, 20));
    const test2 = loadCount === 1;
    const loadCountAfterIntersect = loadCount;

    loadCount = 0;
    if (state.observerCallback) {
      state.observerCallback([{ isIntersecting: true }]);
      state.observerCallback([{ isIntersecting: true }]);
      state.observerCallback([{ isIntersecting: true }]);
    }
    await new Promise((r) => setTimeout(r, 10));
    const test3 = loadCount <= 1;
    const concurrentLoads = loadCount;

    scroller.destroy();
    const test4 = state.disconnected;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        {
          description: 'Observer watches the sentinel element',
          expected: 'observing sentinel',
          actual: test1 ? 'observing' : 'not observing',
          passed: test1,
        },
        {
          description: 'onLoadMore called when sentinel intersects',
          expected: '1 load',
          actual: `${loadCountAfterIntersect} load(s)`,
          passed: test2,
        },
        {
          description: 'Concurrent loads prevented while loading',
          expected: '≤1 call',
          actual: `${concurrentLoads} call(s)`,
          passed: test3,
        },
        {
          description: 'destroy() disconnects the observer',
          expected: 'disconnected',
          actual: state.disconnected ? 'disconnected' : 'still connected',
          passed: test4,
        },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  } finally {
    globalThis.IntersectionObserver = previousObserver;
  }
}
