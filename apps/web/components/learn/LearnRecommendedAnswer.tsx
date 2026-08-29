'use client';

import { cn } from '@/lib/utils';

interface LearnRecommendedAnswerProps {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

/** Disclosure toggle for peeking at the recommended answer without copying EP's checkbox pattern. */
export function LearnRecommendedAnswer({
  open,
  onToggle,
  children,
  className,
}: LearnRecommendedAnswerProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-2 font-body text-sm font-semibold text-text-secondary hover:text-brand transition-colors group"
        aria-expanded={open}
      >
        <span
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-md border border-border-strong bg-bg-surface text-xs transition-colors',
            'group-hover:border-brand/50',
            open && 'border-brand bg-brand/10 text-brand'
          )}
          aria-hidden
        >
          {open ? '−' : '+'}
        </span>
        {open ? 'Hide recommended answer' : 'Show recommended answer'}
      </button>
      {open && (
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 space-y-2">
          <p className="font-body text-xs font-bold uppercase tracking-wide text-brand">
            Recommended answer
          </p>
          {children}
        </div>
      )}
    </div>
  );
}
