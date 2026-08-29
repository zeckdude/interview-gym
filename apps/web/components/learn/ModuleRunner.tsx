'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LearnStepView } from '@/components/learn/LearnStepView';
import {
  LearnReferencePanel,
  useReferencePanelLayout,
} from '@/components/learn/LearnReferencePanel';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { LearnModule, ModuleProgressView } from '@/data/learn/types';
import {
  getLearnStepSpacing,
  getLearnStepWrapperMargin,
} from '@/lib/learn/step-spacing';
import { clearLearnModuleStepStorage } from '@/lib/learn/step-storage';

interface ModuleRunnerProps {
  module: LearnModule;
  initialProgress: ModuleProgressView | null;
  coveredModuleIds: string[];
}

export function ModuleRunner({
  module,
  initialProgress,
  coveredModuleIds,
}: ModuleRunnerProps) {
  const router = useRouter();
  const totalSteps = module.steps.length;
  const initialVisible = initialProgress?.status === 'completed'
    ? totalSteps
    : Math.min((initialProgress?.currentStepIndex ?? 0) + 1, totalSteps);

  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const [completed, setCompleted] = useState(initialProgress?.status === 'completed');
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const {
    open: referenceOpen,
    setOpen: setReferenceOpen,
    contentShiftPx,
    panelWidthPx,
    isDesktop,
    isDragging,
    startResize,
  } = useReferencePanelLayout();

  const activeStepRef = useRef<HTMLDivElement>(null);
  const prevVisibleCount = useRef(visibleCount);

  const progressPct = completed ? 100 : Math.round((visibleCount / totalSteps) * 100);
  const hasProgress =
    initialProgress?.status === 'in_progress' || initialProgress?.status === 'completed';

  const handleReset = useCallback(async () => {
    setResetting(true);
    try {
      const res = await fetch(
        `/api/learn/progress?moduleId=${encodeURIComponent(module.id)}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Reset failed');
      clearLearnModuleStepStorage(module.id);
      setResetOpen(false);
      router.push('/');
      router.refresh();
    } finally {
      setResetting(false);
    }
  }, [module.id, router]);

  const persistProgress = useCallback(
    async (stepIndex: number, isComplete: boolean) => {
      setSaving(true);
      try {
        await fetch('/api/learn/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moduleId: module.id,
            stepIndex,
            completed: isComplete,
            timeSpentMs: 5000,
          }),
        });
      } finally {
        setSaving(false);
      }
    },
    [module.id]
  );

  const handleStepComplete = useCallback(
    async (stepIndex: number) => {
      const nextVisible = stepIndex + 2;
      const isComplete = stepIndex >= totalSteps - 1;

      if (isComplete) {
        setVisibleCount(totalSteps);
        setCompleted(true);
        await persistProgress(stepIndex, true);
      } else if (nextVisible > visibleCount) {
        setVisibleCount(nextVisible);
        await persistProgress(stepIndex, false);
      }
    },
    [totalSteps, visibleCount, persistProgress]
  );

  useEffect(() => {
    if (visibleCount <= prevVisibleCount.current) {
      prevVisibleCount.current = visibleCount;
      return;
    }
    prevVisibleCount.current = visibleCount;

    const scrollToActive = () => {
      activeStepRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToActive);
    });
  }, [visibleCount]);

  const mainShiftStyle = {
    marginRight: referenceOpen ? contentShiftPx : 0,
    transition: isDragging ? 'none' : 'margin-right 150ms ease-out',
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative">
      <div
        className="sticky top-0 z-30 bg-bg-surface border-b border-border-subtle px-6 py-4"
        style={mainShiftStyle}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <Link
            href="/"
            className="text-text-secondary hover:text-text-primary text-sm font-body shrink-0"
          >
            ← Path
          </Link>
          <div className="flex-1">
            <p className="font-body text-sm text-text-secondary mb-2 text-center">
              Progress: {progressPct}%
            </p>
            <div className="h-2.5 rounded-full bg-bg-subtle overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <span className="text-text-muted text-sm font-body shrink-0 w-8 text-right">
            {saving ? '…' : ''}
          </span>
          {hasProgress && (
            <button
              type="button"
              onClick={() => setResetOpen(true)}
              className="font-body text-sm font-semibold text-error hover:text-error/80 shrink-0 border border-error/30 hover:border-error/50 rounded-md px-3 py-1.5 transition-colors"
            >
              Reset progress
            </button>
          )}
        </div>
      </div>

      <main className="flex-1 px-6 lg:px-10 py-12" style={mainShiftStyle}>
        <div className="max-w-5xl mx-auto">
          <header className="space-y-4 mb-12">
            <p className="font-body text-sm font-semibold text-brand uppercase tracking-wide">
              Level {module.level} · {module.levelLabel}
            </p>
            <h1 className="font-display font-bold text-4xl lg:text-5xl text-text-primary">
              {module.title}
            </h1>
          </header>

          {module.steps.slice(0, visibleCount).map((step, index) => {
            const isActiveStep = !completed && index === visibleCount - 1;
            const previousStep = index > 0 ? module.steps[index - 1] : undefined;
            const nextStep =
              index < module.steps.length - 1 ? module.steps[index + 1] : undefined;
            const spacing = getLearnStepSpacing(step, previousStep, nextStep);
            const previousSpacing =
              index > 0
                ? getLearnStepSpacing(
                    module.steps[index - 1],
                    index > 1 ? module.steps[index - 2] : undefined,
                    step
                  )
                : null;
            const wrapperMargin = getLearnStepWrapperMargin(spacing, previousSpacing);

            return (
              <div
                key={step.id}
                ref={isActiveStep ? activeStepRef : undefined}
                className={wrapperMargin}
              >
                <LearnStepView
                  step={step}
                  moduleId={module.id}
                  isActive={isActiveStep}
                  isCompleted={completed || index < visibleCount - 1}
                  previousStep={previousStep}
                  spacing={spacing}
                  onComplete={() => void handleStepComplete(index)}
                />
              </div>
            );
          })}

          {completed && (
            <div className="mt-8 rounded-xl bg-success/10 border border-success/30 p-8 space-y-4 text-center">
              <p className="font-display font-bold text-2xl text-text-primary">
                Module complete! ✓
              </p>
              <p className="font-body text-lg text-text-primary">
                Concepts from this module will appear in your review queue for mastery.
              </p>
              <Button onClick={() => router.push('/')}>Back to path →</Button>
            </div>
          )}
        </div>
      </main>

      <LearnReferencePanel
        coveredModuleIds={coveredModuleIds}
        open={referenceOpen}
        onOpenChange={setReferenceOpen}
        isDesktop={isDesktop}
        panelWidthPx={panelWidthPx}
        isDragging={isDragging}
        onResizeStart={startResize}
      />

      <ConfirmDialog
        open={resetOpen}
        title={`Reset "${module.title}"?`}
        message={
          'This will permanently erase your step progress, completion status, review items, and hint history for this module.\n\nThis cannot be undone.'
        }
        confirmLabel="Yes, reset module"
        destructive
        loading={resetting}
        onConfirm={() => void handleReset()}
        onCancel={() => {
          if (!resetting) setResetOpen(false);
        }}
      />
    </div>
  );
}
