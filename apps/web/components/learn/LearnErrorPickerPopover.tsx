'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import type { LearnErrorOption } from '@/lib/learn/learned-errors';
import { cn } from '@/lib/utils';

interface LearnErrorPickerPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchorRef: RefObject<HTMLElement | null>;
  options: LearnErrorOption[];
  selectedId: string | null;
  wrongId: string | null;
  onSelect: (id: string) => void;
}

interface PopoverPosition {
  top: number;
  left: number;
  maxHeight: number;
  placement: 'below' | 'above';
}

const VIEWPORT_PADDING = 12;
const ANCHOR_GAP = 8;
const MIN_PANEL_HEIGHT = 120;

function computePopoverPosition(
  anchor: DOMRect,
  panelWidth: number
): PopoverPosition {
  const spaceBelow = window.innerHeight - anchor.bottom - VIEWPORT_PADDING;
  const spaceAbove = anchor.top - VIEWPORT_PADDING;
  const openBelow = spaceBelow >= spaceAbove;

  const maxHeight = Math.min(
    320,
    Math.max(MIN_PANEL_HEIGHT, (openBelow ? spaceBelow : spaceAbove) - ANCHOR_GAP)
  );

  const top = openBelow
    ? anchor.bottom + ANCHOR_GAP
    : Math.max(VIEWPORT_PADDING, anchor.top - ANCHOR_GAP - maxHeight);

  let left = anchor.left;
  left = Math.max(
    VIEWPORT_PADDING,
    Math.min(left, window.innerWidth - panelWidth - VIEWPORT_PADDING)
  );

  return {
    top,
    left,
    maxHeight,
    placement: openBelow ? 'below' : 'above',
  };
}

export function LearnErrorPickerPopover({
  open,
  onOpenChange,
  anchorRef,
  options,
  selectedId,
  wrongId,
  onSelect,
}: LearnErrorPickerPopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !mounted || !anchorRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current?.getBoundingClientRect();
      const panel = panelRef.current;
      if (!anchor || !panel) return;

      setPosition(computePopoverPosition(anchor, panel.offsetWidth || 352));
    };

    updatePosition();
    const frame = window.requestAnimationFrame(updatePosition);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, mounted, anchorRef, options.length, selectedId]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onOpenChange(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onOpenChange, anchorRef]);

  if (!open || options.length === 0 || !mounted) return null;

  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Pick an error"
      className={cn(
        'fixed z-[100] w-[min(22rem,calc(100vw-1.5rem))] rounded-xl border-2 border-border-strong bg-bg-surface shadow-modal p-3 space-y-2',
        !position && 'invisible pointer-events-none left-4 top-4'
      )}
      style={
        position
          ? {
              top: position.top,
              left: position.left,
            }
          : undefined
      }
    >
      <p className="font-body text-sm font-semibold text-text-primary px-1">
        Which error?
      </p>
      <div
        className="space-y-2 overflow-y-auto overscroll-contain"
        style={{ maxHeight: position ? Math.max(80, position.maxHeight - 40) : 240 }}
      >
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const isWrong = wrongId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onSelect(option.id);
                onOpenChange(false);
              }}
              className={cn(
                'flex w-full items-start gap-2 rounded-lg border-2 p-3 text-left transition-colors',
                isWrong
                  ? 'border-error/40 bg-error/5'
                  : isSelected
                    ? 'border-cat-fe bg-cat-fe/10'
                    : 'border-border-subtle bg-bg-subtle/50 hover:border-border-strong hover:bg-bg-subtle'
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
                  isSelected ? 'border-cat-fe bg-cat-fe' : 'border-border-strong bg-bg-surface'
                )}
                aria-hidden
              >
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-bg-surface" />}
              </span>
              <span className="font-body text-sm text-text-primary leading-snug">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
