'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'ig-learn-reference-width';
const DESKTOP_BREAKPOINT_PX = 1024;
const DEFAULT_WIDTH_RATIO = 0.5;
const MIN_WIDTH_PX = 360;
const MAX_WIDTH_RATIO = 0.85;

function clampPanelWidth(px: number, viewportWidth: number): number {
  const max = Math.max(MIN_WIDTH_PX, viewportWidth * MAX_WIDTH_RATIO);
  return Math.min(Math.max(px, MIN_WIDTH_PX), max);
}

function readStoredWidth(viewportWidth: number): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = Number.parseInt(raw, 10);
      if (!Number.isNaN(parsed)) {
        return clampPanelWidth(parsed, viewportWidth);
      }
    }
  } catch {
    /* ignore */
  }
  return clampPanelWidth(viewportWidth * DEFAULT_WIDTH_RATIO, viewportWidth);
}

export function useReferencePanelLayout(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);
  const [panelWidthPx, setPanelWidthPx] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT_PX}px)`);
    const syncDesktop = () => setIsDesktop(mq.matches);
    syncDesktop();
    mq.addEventListener('change', syncDesktop);

    setPanelWidthPx(readStoredWidth(window.innerWidth));

    const onResize = () => {
      setPanelWidthPx((prev) =>
        prev === null ? readStoredWidth(window.innerWidth) : clampPanelWidth(prev, window.innerWidth)
      );
    };
    window.addEventListener('resize', onResize);

    return () => {
      mq.removeEventListener('change', syncDesktop);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const persistWidth = useCallback((px: number) => {
    const clamped = clampPanelWidth(px, window.innerWidth);
    setPanelWidthPx(clamped);
    try {
      localStorage.setItem(STORAGE_KEY, String(Math.round(clamped)));
    } catch {
      /* ignore */
    }
  }, []);

  const startResize = useCallback(
    (clientX: number) => {
      if (!isDesktop || panelWidthPx === null) return;
      dragRef.current = { startX: clientX, startWidth: panelWidthPx };
      setIsDragging(true);
    },
    [isDesktop, panelWidthPx]
  );

  const moveResize = useCallback(
    (clientX: number) => {
      const drag = dragRef.current;
      if (!drag) return;
      const delta = drag.startX - clientX;
      persistWidth(drag.startWidth + delta);
    },
    [persistWidth]
  );

  const endResize = useCallback(() => {
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: PointerEvent) => moveResize(e.clientX);
    const onUp = () => endResize();

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [isDragging, moveResize, endResize]);

  useEffect(() => {
    if (!isDragging) return;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const resolvedWidth = panelWidthPx ?? 0;
  const contentShiftPx = open && isDesktop ? resolvedWidth : 0;

  return {
    open,
    setOpen,
    isDesktop,
    isDragging,
    panelWidthPx: resolvedWidth,
    contentShiftPx,
    startResize,
  };
}
