import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  computeScrollDelta,
  LEARN_SCROLL_BOTTOM_PAD_PX,
  LEARN_SCROLL_TOP_INSET_PX,
  smoothScrollFullyIntoView,
  smoothScrollFullyIntoViewElements,
  smoothScrollIntoView,
  unionRect,
} from '@/lib/learn/smooth-scroll';

describe('computeScrollDelta', () => {
  const viewportHeight = 800;
  const available = viewportHeight - LEARN_SCROLL_TOP_INSET_PX - LEARN_SCROLL_BOTTOM_PAD_PX;

  it('scrolls down when the bottom is clipped but the element fits', () => {
    const rect = {
      top: 500,
      bottom: 790,
      height: 290,
    };

    expect(rect.height).toBeLessThanOrEqual(available);
    expect(computeScrollDelta(rect, viewportHeight, 'fit')).toBe(14);
  });

  it('aligns end to the bottom inset when the element extends below the viewport', () => {
    const rect = { top: 400, bottom: 950, height: 550 };

    expect(computeScrollDelta(rect, viewportHeight, 'end')).toBe(174);
  });

  it('does not scroll when the element already fits', () => {
    const rect = { top: 120, bottom: 300, height: 180 };

    expect(computeScrollDelta(rect, viewportHeight, 'fit')).toBe(0);
  });
});

describe('unionRect', () => {
  it('returns the bounding box spanning all elements', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    a.getBoundingClientRect = () =>
      ({ top: 100, bottom: 180, height: 80 }) as DOMRect;
    b.getBoundingClientRect = () =>
      ({ top: 200, bottom: 320, height: 120 }) as DOMRect;

    expect(unionRect([a, b])).toEqual({
      top: 100,
      bottom: 320,
      height: 220,
    });
  });
});

describe('smoothScrollIntoView', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('scrolls the element into view with smooth behavior', () => {
    const element = document.createElement('div');
    element.scrollIntoView = vi.fn();

    smoothScrollIntoView(element, 'start');

    expect(element.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });
});

describe('smoothScrollFullyIntoViewElements', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    });
    vi.spyOn(window, 'scrollBy').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('scrolls to fit a group when the bottom is clipped', () => {
    const element = document.createElement('div');
    element.getBoundingClientRect = () =>
      ({ top: 500, bottom: 790, height: 290 }) as DOMRect;

    smoothScrollFullyIntoViewElements([element], 'fit');

    expect(window.scrollBy).toHaveBeenCalledWith({
      top: 14,
      behavior: 'smooth',
    });
  });

  it('delegates single elements through smoothScrollFullyIntoView', () => {
    const element = document.createElement('div');
    element.getBoundingClientRect = () =>
      ({ top: 500, bottom: 790, height: 290 }) as DOMRect;

    smoothScrollFullyIntoView(element, 'fit');

    expect(window.scrollBy).toHaveBeenCalled();
  });
});
