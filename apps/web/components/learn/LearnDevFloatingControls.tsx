'use client';

import type { LearnModule } from '@/data/learn/types';
import { LearnDevNavigator } from '@/components/learn/LearnDevNavigator';
import { cn } from '@/lib/utils';

interface LearnDevFloatingControlsProps {
  module: LearnModule;
  activeStepIndex: number;
  onJump: (stepIndex: number) => void;
  onSkip: () => void;
  disabled?: boolean;
  showSkip?: boolean;
  jumpMenuOpen: boolean;
  onJumpMenuOpenChange: (open: boolean) => void;
  /** Shift left when a right-side panel (e.g. reference) is open on desktop. */
  insetRightPx?: number;
}

export function LearnDevFloatingControls({
  module,
  activeStepIndex,
  onJump,
  onSkip,
  disabled = false,
  showSkip = true,
  jumpMenuOpen,
  onJumpMenuOpenChange,
  insetRightPx = 32,
}: LearnDevFloatingControlsProps) {
  return (
    <div
      className="fixed bottom-[5.75rem] z-50 hidden md:flex flex-col items-end gap-2 transition-[right] duration-150 ease-out"
      style={{ right: insetRightPx }}
      aria-label="Development tools"
    >
      <p className="font-body text-[10px] font-semibold uppercase tracking-wide text-warning/80 pointer-events-none select-none">
        Dev · ⌘⇧←/→
      </p>
      <div className="flex flex-col items-end gap-2">
        {showSkip && (
          <button
            type="button"
            onClick={onSkip}
            disabled={disabled}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed',
              'border-warning/50 bg-bg-surface text-warning shadow-raised',
              'hover:border-warning hover:bg-warning/10 transition-colors',
              'disabled:opacity-50 disabled:pointer-events-none'
            )}
            aria-label="Skip step — fill recommended answer"
            title="Development only — skip step (fill recommended answer)"
          >
            <SkipIcon />
          </button>
        )}
        <LearnDevNavigator
          module={module}
          activeStepIndex={activeStepIndex}
          onJump={onJump}
          disabled={disabled}
          variant="fab"
          open={jumpMenuOpen}
          onOpenChange={onJumpMenuOpenChange}
        />
      </div>
    </div>
  );
}

function SkipIcon() {
  return (
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
      <path d="M5 4v16" />
      <path d="M9 12h10" />
      <path d="M17 8l4 4-4 4" />
    </svg>
  );
}
