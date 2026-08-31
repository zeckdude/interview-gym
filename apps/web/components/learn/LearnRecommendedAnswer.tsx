'use client';

import { cn } from '@/lib/utils';

/** Shared card shell for recommended answers and challenge breakdowns. */
export function LearnDisclosurePanel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-brand/20 bg-brand/5 p-4 space-y-2',
        className
      )}
    >
      <p className="font-body text-xs font-bold uppercase tracking-wide text-brand">
        {title}
      </p>
      {children}
    </div>
  );
}

interface LearnRecommendedAnswerProps {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  /** Label when collapsed. */
  showLabel?: string;
  /** Label when expanded. */
  hideLabel?: string;
  /** Small heading inside the expanded panel. */
  panelTitle?: string;
}

/** Disclosure toggle — used for recommended answers and challenge breakdowns. */
export function LearnRecommendedAnswer({
  open,
  onToggle,
  children,
  className,
  showLabel = 'Show recommended answer',
  hideLabel = 'Hide recommended answer',
  panelTitle = 'Recommended answer',
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
        {open ? hideLabel : showLabel}
      </button>
      {open && (
        <LearnDisclosurePanel title={panelTitle}>{children}</LearnDisclosurePanel>
      )}
    </div>
  );
}
