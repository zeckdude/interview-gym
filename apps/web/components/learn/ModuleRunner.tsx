'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LearnDevFloatingControls } from '@/components/learn/LearnDevFloatingControls';
import { LearnDevNavigator } from '@/components/learn/LearnDevNavigator';
import { useLearnDevKeyboardNav } from '@/hooks/useLearnDevKeyboardNav';
import { LearnStepView } from '@/components/learn/LearnStepView';
import {
  LearnReferencePanel,
  useReferencePanelLayout,
} from '@/components/learn/LearnReferencePanel';
import { LearnModuleSettings } from '@/components/learn/LearnModuleSettings';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useLearningPreferences } from '@/hooks/useLearningPreferences';
import type { LearnModule, ModuleProgressView } from '@/data/learn/types';
import {
  getLearnStepSpacing,
  getLearnStepWrapperMargin,
} from '@/lib/learn/step-spacing';
import { getErrorPickerOptions } from '@/lib/learn/learned-errors';
import { isLearnDevToolsEnabled, resolveLearnStepParam, getLearnStepJumpParam } from '@/lib/learn/dev-tools';
import { executeDevStepJump } from '@/lib/learn/dev-step-jump';
import { clearLearnModuleStepStorage, clearLearnStepStorage, hydrateLearnModuleStepStates, type LearnStepStoredState } from '@/lib/learn/step-storage';
import { smoothScrollFullyIntoView } from '@/lib/learn/smooth-scroll';

interface ModuleRunnerProps {
  module: LearnModule;
  initialProgress: ModuleProgressView | null;
  coveredModuleIds: string[];
  initialStepStates: Record<string, LearnStepStoredState>;
}

export function ModuleRunner({
  module,
  initialProgress,
  coveredModuleIds,
  initialStepStates,
}: ModuleRunnerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');
  const totalSteps = module.steps.length;
  const devToolsEnabled = isLearnDevToolsEnabled();

  const progressBasedVisible =
    initialProgress?.status === 'completed'
      ? totalSteps
      : Math.min((initialProgress?.currentStepIndex ?? 0) + 1, totalSteps);

  const [visibleCount, setVisibleCount] = useState(progressBasedVisible);
  const [completed, setCompleted] = useState(initialProgress?.status === 'completed');
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [stepResetKeys, setStepResetKeys] = useState<Record<string, number>>({});
  const [backing, setBacking] = useState(false);
  const [devSkipNonce, setDevSkipNonce] = useState(0);
  const [devJumpMenuOpen, setDevJumpMenuOpen] = useState(false);
  const { settings: learningSettings } = useLearningPreferences(module.id);
  const {
    open: referenceOpen,
    setOpen: setReferenceOpen,
    contentShiftPx,
    panelWidthPx,
    isDesktop,
    isDragging,
    startResize,
  } = useReferencePanelLayout();

  const prevVisibleCount = useRef(visibleCount);
  const lastAppliedStepParam = useRef<string | null>(null);
  const progressFromIndexRef = useRef(Math.max(0, progressBasedVisible - 1));
  const activeStepRef = useRef<HTMLDivElement>(null);

  const scrollToActiveStep = useCallback(() => {
    smoothScrollFullyIntoView(activeStepRef.current, 'end');
  }, []);

  const bumpStepResetKeys = useCallback((stepIds: string[]) => {
    if (stepIds.length === 0) return;
    setStepResetKeys((prev) => {
      const next = { ...prev };
      for (const stepId of stepIds) {
        next[stepId] = (next[stepId] ?? 0) + 1;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    hydrateLearnModuleStepStates(module.id, initialStepStates);
  }, [module.id, initialStepStates]);

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

  const persistProgressQuiet = useCallback(
    (stepIndex: number, isComplete: boolean) => {
      void fetch('/api/learn/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: module.id,
          stepIndex,
          completed: isComplete,
          timeSpentMs: 5000,
        }),
      }).catch(() => {
        /* non-blocking — dev jump already updated UI */
      });
    },
    [module.id]
  );

  const runDevStepJump = useCallback(
    (targetIndex: number, fromIndex: number) => {
      executeDevStepJump({
        moduleId: module.id,
        steps: module.steps,
        fromIndex,
        targetIndex,
        coveredModuleIds,
      });

      setCompleted(false);
      setVisibleCount(targetIndex + 1);
      persistProgressQuiet(Math.max(0, targetIndex - 1), false);
    },
    [coveredModuleIds, module.id, module.steps, persistProgressQuiet]
  );

  const progressPct = completed ? 100 : Math.round((visibleCount / totalSteps) * 100);
  const hasProgress =
    initialProgress?.status === 'in_progress' || initialProgress?.status === 'completed';
  const activeStepIndex = completed ? Math.max(0, totalSteps - 1) : visibleCount - 1;

  const jumpToStep = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= totalSteps) return;

      const fromIndex = completed ? Math.max(0, totalSteps - 1) : Math.max(0, visibleCount - 1);
      runDevStepJump(targetIndex, fromIndex);

      const param = getLearnStepJumpParam(module.steps, targetIndex);
      lastAppliedStepParam.current = param;
      router.replace(
        `/learn/${encodeURIComponent(module.id)}?step=${encodeURIComponent(param)}`,
        { scroll: false }
      );
    },
    [completed, module.id, module.steps, router, runDevStepJump, totalSteps, visibleCount]
  );

  const handleDevSkip = useCallback(() => {
    setDevSkipNonce((nonce) => nonce + 1);
  }, []);

  useLearnDevKeyboardNav({
    enabled: devToolsEnabled,
    activeStepIndex,
    totalSteps,
    onJump: (index) => void jumpToStep(index),
    disabled: saving || backing || resetOpen,
    jumpMenuOpen: devJumpMenuOpen,
  });

  useEffect(() => {
    if (!devToolsEnabled || !stepParam) return;

    const targetIndex = resolveLearnStepParam(module.steps, stepParam);
    if (targetIndex == null) return;
    if (lastAppliedStepParam.current === stepParam) return;

    const isInitialUrlJump = lastAppliedStepParam.current === null;
    lastAppliedStepParam.current = stepParam;

    const fromIndex = isInitialUrlJump
      ? progressFromIndexRef.current
      : completed
        ? Math.max(0, totalSteps - 1)
        : Math.max(0, visibleCount - 1);

    void runDevStepJump(targetIndex, fromIndex);
  }, [
    completed,
    devToolsEnabled,
    module.steps,
    runDevStepJump,
    stepParam,
    totalSteps,
    visibleCount,
  ]);

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

  const canStepBack = completed || visibleCount > 1;

  const handleStepBack = useCallback(async () => {
    if (!canStepBack || backing) return;

    const targetIndex = completed ? totalSteps - 1 : visibleCount - 2;
    if (targetIndex < 0) return;

    const targetStep = module.steps[targetIndex];
    if (!targetStep) return;

    setBacking(true);
    try {
      clearLearnStepStorage(module.id, targetStep.id);
      setStepResetKeys((prev) => ({
        ...prev,
        [targetStep.id]: (prev[targetStep.id] ?? 0) + 1,
      }));
      setCompleted(false);
      setVisibleCount(targetIndex + 1);
      await persistProgress(Math.max(0, targetIndex - 1), false);

    } finally {
      setBacking(false);
    }
  }, [backing, canStepBack, completed, module.id, module.steps, persistProgress, totalSteps, visibleCount]);

  useEffect(() => {
    if (visibleCount === prevVisibleCount.current) return;
    const grew = visibleCount > prevVisibleCount.current;
    prevVisibleCount.current = visibleCount;

    if (grew) {
      scrollToActiveStep();
    }
  }, [visibleCount, scrollToActiveStep]);

  const mainShiftStyle = {
    marginRight: referenceOpen ? contentShiftPx : 0,
    transition: isDragging ? 'none' : 'margin-right 150ms ease-out',
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative">
      <div
        className="sticky top-0 z-30 bg-bg-surface border-b border-border-subtle"
        style={mainShiftStyle}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 space-y-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="text-text-secondary hover:text-text-primary text-sm font-body shrink-0"
            >
              ← Path
            </Link>
            <div className="flex-1 min-w-0">
              <div className="h-2.5 rounded-full bg-bg-subtle overflow-hidden">
                <div
                  className="h-full bg-brand transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <span className="text-text-primary text-sm font-body font-semibold tabular-nums shrink-0">
              {progressPct}%
            </span>
            {(saving || backing) && (
              <span className="text-text-muted text-sm shrink-0" aria-hidden>
                …
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <LearnModuleSettings moduleId={module.id} />
            {devToolsEnabled && (
              <div className="contents md:hidden">
                <LearnDevNavigator
                  module={module}
                  activeStepIndex={activeStepIndex}
                  onJump={(index) => void jumpToStep(index)}
                  disabled={saving || backing}
                  open={devJumpMenuOpen}
                  onOpenChange={setDevJumpMenuOpen}
                />
                {!completed && (
                  <button
                    type="button"
                    onClick={handleDevSkip}
                    disabled={saving || backing}
                    className="font-body text-xs sm:text-sm font-semibold text-warning border border-dashed border-warning/50 hover:border-warning rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-50"
                    title="Development only — fills the recommended answer and completes this step"
                  >
                    Skip step
                  </button>
                )}
              </div>
            )}
            {canStepBack && (
              <button
                type="button"
                onClick={() => void handleStepBack()}
                disabled={backing || saving}
                className="font-body text-xs sm:text-sm font-semibold text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-strong rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-50"
              >
                ← Back
              </button>
            )}
            {hasProgress && (
              <button
                type="button"
                onClick={() => setResetOpen(true)}
                className="font-body text-xs sm:text-sm font-semibold text-error hover:text-error/80 border border-error/30 hover:border-error/50 rounded-md px-2.5 py-1.5 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
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
                key={`${step.id}-${stepResetKeys[step.id] ?? 0}`}
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
                  learningSettings={learningSettings}
                  availableLearnErrors={getErrorPickerOptions(
                    module.id,
                    index,
                    module.steps,
                    coveredModuleIds,
                    step.type === 'predict-output' ? step : undefined
                  )}
                  devSkipNonce={isActiveStep ? devSkipNonce : undefined}
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

      {devToolsEnabled && (
        <LearnDevFloatingControls
          module={module}
          activeStepIndex={activeStepIndex}
          onJump={(index) => void jumpToStep(index)}
          onSkip={handleDevSkip}
          disabled={saving || backing}
          showSkip={!completed}
          jumpMenuOpen={devJumpMenuOpen}
          onJumpMenuOpenChange={setDevJumpMenuOpen}
          insetRightPx={referenceOpen && isDesktop ? contentShiftPx + 32 : 32}
        />
      )}

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
