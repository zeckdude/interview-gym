'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useMostAskedOptional } from '@/components/providers/MostAskedProvider';
import type { CuratedMostAsked, MostAskedItemType } from '@/lib/most-asked';
import { cn } from '@/lib/utils';

interface MostAskedMenuProps {
  itemType: MostAskedItemType;
  itemId: string;
  curated: CuratedMostAsked;
  className?: string;
}

export function MostAskedBadge({
  mostAsked,
  isPersonalOverride = false,
  reason,
  className,
}: {
  mostAsked: boolean;
  isPersonalOverride?: boolean;
  reason?: string;
  className?: string;
}) {
  if (!mostAsked) return null;

  return (
    <span
      className={cn(
        'bg-error-light text-error text-xs font-body font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1',
        className
      )}
      title={
        isPersonalOverride
          ? 'Marked as Most Asked by you'
          : reason ?? 'Commonly asked in senior interviews'
      }
    >
      🔥 Most Asked
      {isPersonalOverride && <span className="opacity-70">· You</span>}
    </span>
  );
}

export function MostAskedMenu({ itemType, itemId, curated, className }: MostAskedMenuProps) {
  const { isSignedIn } = useAuth();
  const mostAsked = useMostAskedOptional();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  if (!isSignedIn || !mostAsked) return null;

  const effective = mostAsked.getEffective(itemType, itemId, curated);
  const hasOverride = mostAsked.hasOverride(itemType, itemId);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-label="Most Asked options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="w-8 h-8 rounded-md border border-border-subtle bg-bg-subtle text-text-secondary hover:text-text-primary hover:border-brand/40 transition-colors font-body text-lg leading-none"
      >
        ⋯
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-20 min-w-[220px] rounded-lg border border-border-subtle bg-bg-surface shadow-modal p-2 space-y-1"
        >
          {curated.reason && effective.mostAsked && !effective.isPersonalOverride && (
            <p className="font-body text-xs text-text-secondary px-3 py-2 border-b border-border-subtle mb-1 leading-relaxed">
              {curated.reason}
            </p>
          )}

          {!effective.mostAsked ? (
            <button
              type="button"
              role="menuitem"
              className="w-full text-left px-3 py-2 rounded-md font-body text-sm text-text-primary hover:bg-bg-subtle transition-colors"
              onClick={async () => {
                await mostAsked.setMostAsked(itemType, itemId, true);
                setOpen(false);
              }}
            >
              Mark as Most Asked
            </button>
          ) : (
            <button
              type="button"
              role="menuitem"
              className="w-full text-left px-3 py-2 rounded-md font-body text-sm text-text-primary hover:bg-bg-subtle transition-colors"
              onClick={async () => {
                await mostAsked.setMostAsked(itemType, itemId, false);
                setOpen(false);
              }}
            >
              Remove Most Asked
            </button>
          )}

          {hasOverride && (
            <button
              type="button"
              role="menuitem"
              className="w-full text-left px-3 py-2 rounded-md font-body text-sm text-text-secondary hover:bg-bg-subtle transition-colors"
              onClick={async () => {
                await mostAsked.resetMostAsked(itemType, itemId);
                setOpen(false);
              }}
            >
              Reset to default
            </button>
          )}
        </div>
      )}
    </div>
  );
}
