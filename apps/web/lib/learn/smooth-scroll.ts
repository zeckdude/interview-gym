/** Sticky learn header offset — matches `scroll-mt-24` on step anchors. */
export const LEARN_SCROLL_TOP_INSET_PX = 96;

/** Breathing room below the focused element. */
export const LEARN_SCROLL_BOTTOM_PAD_PX = 24;

export type LearnScrollAlign = 'fit' | 'start' | 'end';

type ScrollRect = Pick<DOMRect, 'top' | 'bottom' | 'height'>;

function computeScrollDelta(
  rect: ScrollRect,
  viewportHeight: number,
  align: LearnScrollAlign
): number {
  const topInset = LEARN_SCROLL_TOP_INSET_PX;
  const maxBottom = viewportHeight - LEARN_SCROLL_BOTTOM_PAD_PX;
  const available = maxBottom - topInset;

  if (rect.bottom < topInset) {
    return rect.top - topInset;
  }

  if (rect.top > viewportHeight) {
    return rect.top - topInset;
  }

  if (align === 'end') {
    if (rect.bottom > maxBottom) return rect.bottom - maxBottom;
    if (rect.top < topInset) return rect.top - topInset;
    return 0;
  }

  if (align === 'start') {
    if (rect.top < topInset) return rect.top - topInset;
    if (rect.height <= available && rect.bottom > maxBottom) {
      return rect.bottom - maxBottom;
    }
    return 0;
  }

  // fit — show the whole element when it fits in the viewport
  if (rect.height <= available) {
    if (rect.top < topInset) return rect.top - topInset;
    if (rect.bottom > maxBottom) return rect.bottom - maxBottom;
    return 0;
  }

  // Taller than the viewport — keep the bottom in view (interaction beats context)
  if (rect.bottom > maxBottom) return rect.bottom - maxBottom;
  if (rect.top < topInset) return rect.top - topInset;
  return 0;
}

function unionRect(elements: HTMLElement[]): ScrollRect | null {
  if (elements.length === 0) return null;

  const rects = elements.map((el) => el.getBoundingClientRect());
  const top = Math.min(...rects.map((r) => r.top));
  const bottom = Math.max(...rects.map((r) => r.bottom));

  return { top, bottom, height: bottom - top };
}

/** Smooth-scroll an element into view after layout settles. */
export function smoothScrollIntoView(
  element: HTMLElement | null | undefined,
  block: ScrollLogicalPosition = 'start'
) {
  if (!element || typeof window === 'undefined') return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: 'smooth', block });
    });
  });
}

/**
 * Scroll so `element` is fully visible when it fits in the viewport.
 * Use `end` for new steps (prioritize the interaction area at the bottom).
 */
export function smoothScrollFullyIntoView(
  element: HTMLElement | null | undefined,
  align: LearnScrollAlign = 'fit'
) {
  if (!element || typeof window === 'undefined') return;
  smoothScrollFullyIntoViewElements([element], align);
}

/** Fit every element in the group when possible; otherwise align the group top. */
export function smoothScrollFullyIntoViewElements(
  elements: HTMLElement[],
  align: LearnScrollAlign = 'fit'
) {
  if (typeof window === 'undefined') return;

  const valid = elements.filter((el): el is HTMLElement => el != null);
  if (valid.length === 0) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const rect = unionRect(valid);
      if (!rect) return;

      const viewportHeight = window.innerHeight;
      const available =
        viewportHeight - LEARN_SCROLL_TOP_INSET_PX - LEARN_SCROLL_BOTTOM_PAD_PX;
      const effectiveAlign =
        align === 'fit' && rect.height > available ? 'start' : align;

      const delta = computeScrollDelta(rect, viewportHeight, effectiveAlign);

      if (delta !== 0) {
        window.scrollBy({ top: delta, behavior: 'smooth' });
      }
    });
  });
}

export { computeScrollDelta, unionRect };
