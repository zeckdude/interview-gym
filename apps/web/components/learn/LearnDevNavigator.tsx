'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { LearnModule } from '@/data/learn/types';
import { getLearnStepDevSummary } from '@/lib/learn/dev-tools';
import { cn } from '@/lib/utils';

interface LearnDevNavigatorProps {
  module: LearnModule;
  activeStepIndex: number;
  onJump: (stepIndex: number) => void;
  disabled?: boolean;
  variant?: 'inline' | 'fab';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const fabButtonClass = cn(
  'flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed',
  'border-warning/50 bg-bg-surface text-warning shadow-raised',
  'hover:border-warning hover:bg-warning/10 transition-colors',
  'disabled:opacity-50 disabled:pointer-events-none'
);

export function LearnDevNavigator({
  module,
  activeStepIndex,
  onJump,
  disabled = false,
  variant = 'inline',
  open: openProp,
  onOpenChange,
}: LearnDevNavigatorProps) {
  const [openUncontrolled, setOpenUncontrolled] = useState(false);
  const open = openProp ?? openUncontrolled;
  const setOpen = onOpenChange ?? setOpenUncontrolled;
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const options = useMemo(
    () => module.steps.map((step, index) => getLearnStepDevSummary(step, index)),
    [module.steps]
  );
  const active = options[activeStepIndex];
  const menuOpensAbove = variant === 'fab';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      activeItemRef.current?.scrollIntoView({ block: 'center' });
    });
  }, [open, activeStepIndex]);

  const toggleButton =
    variant === 'fab' ? (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={fabButtonClass}
        aria-expanded={open}
        aria-label={
          active
            ? `Jump to step — currently on step ${active.stepNumber}`
            : 'Jump to step'
        }
        title="Development only — jump to any step (⌘⇧←/→)"
      >
        <JumpIcon stepNumber={active?.stepNumber} />
      </button>
    ) : (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="font-body text-xs sm:text-sm font-semibold text-warning border border-dashed border-warning/50 hover:border-warning rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-50 max-w-[10rem] truncate"
        aria-expanded={open}
        title="Development only — jump to any step in this module"
      >
        Jump {active ? `· ${active.stepNumber}` : ''} ▾
      </button>
    );

  return (
    <div className={cn('relative', variant === 'fab' && 'shrink-0')}>
      {toggleButton}

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close step jump menu"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              'absolute right-0 z-50 w-[min(100vw-2rem,22rem)] max-h-[min(70vh,24rem)] overflow-y-auto rounded-xl border-2 border-warning/40 bg-bg-surface shadow-modal p-2',
              menuOpensAbove ? 'bottom-full mb-2' : 'top-full mt-2'
            )}
          >
            {options.map((option, index) => {
              const selected = index === activeStepIndex;
              return (
                <button
                  key={module.steps[index]!.id}
                  ref={selected ? activeItemRef : undefined}
                  type="button"
                  disabled={disabled}
                  aria-current={selected ? 'step' : undefined}
                  onClick={() => {
                    onJump(index);
                    setOpen(false);
                  }}
                  className={cn(
                    'w-full text-left rounded-lg px-3 py-2.5 transition-colors',
                    selected
                      ? 'bg-warning/15 border-2 border-warning ring-2 ring-warning/25 shadow-sm'
                      : 'border border-transparent hover:bg-bg-subtle'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        'font-body text-sm font-bold leading-snug',
                        selected ? 'text-warning' : 'text-text-primary'
                      )}
                    >
                      {option.stepNumber}. {option.title}
                    </p>
                    {selected && (
                      <span className="shrink-0 font-body text-[10px] font-bold uppercase tracking-wide text-warning bg-warning/20 rounded px-1.5 py-0.5">
                        Current
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      'font-body text-xs leading-relaxed mt-1',
                      selected ? 'text-text-primary' : 'text-text-secondary'
                    )}
                  >
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function JumpIcon({ stepNumber }: { stepNumber?: number }) {
  return (
    <span className="relative flex items-center justify-center">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4 6h16M4 12h10M4 18h16" />
        <path d="M18 8l3 4-3 4" />
      </svg>
      {stepNumber != null && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[1rem] rounded-full bg-warning px-1 text-[10px] font-bold leading-4 text-bg-base">
          {stepNumber}
        </span>
      )}
    </span>
  );
}
