import type { LearnStep } from '@/data/learn/types';

export const CODE_PROBLEM_INTRO_TITLE = "Here's a code problem:";

export type LearnStepSpacing = 'standalone' | 'group-start' | 'group-end';

function isInteractiveStep(step: LearnStep): boolean {
  return (
    step.type === 'code-demo' ||
    step.type === 'predict-output' ||
    step.type === 'choice' ||
    step.type === 'code-challenge'
  );
}

/** Short explainer text that introduces the next code step. */
export function isTeachingIntroText(step: LearnStep): boolean {
  return step.type === 'text' && !step.title;
}

export function isCodeProblemIntro(step: LearnStep | undefined): boolean {
  return step?.type === 'text' && step.title === CODE_PROBLEM_INTRO_TITLE;
}

function pairsWithNext(step: LearnStep, next: LearnStep | undefined): boolean {
  if (!next || !isInteractiveStep(next)) return false;
  return isTeachingIntroText(step) || isCodeProblemIntro(step);
}

function pairsWithPrevious(
  step: LearnStep,
  previousStep: LearnStep | undefined
): boolean {
  if (!previousStep) return false;
  return pairsWithNext(previousStep, step);
}

export function getLearnStepSpacing(
  step: LearnStep,
  previousStep?: LearnStep,
  nextStep?: LearnStep
): LearnStepSpacing {
  const withNext = pairsWithNext(step, nextStep);
  const withPrev = pairsWithPrevious(step, previousStep);

  if (withNext) return 'group-start';
  if (withPrev) return 'group-end';
  return 'standalone';
}

/** Top margin for a step wrapper based on the prior step's spacing role. */
export function getLearnStepWrapperMargin(
  spacing: LearnStepSpacing,
  previousSpacing: LearnStepSpacing | null
): string {
  if (previousSpacing === 'group-start') return 'mt-8';
  return previousSpacing === null ? '' : 'mt-8';
}

export function learnStepSectionClass(spacing: LearnStepSpacing): string {
  const base = 'scroll-mt-24';

  if (spacing === 'group-start') {
    return `${base} space-y-5 border-0`;
  }

  if (spacing === 'group-end') {
    return `${base} space-y-6 pb-10 mb-8 border-b border-border-subtle last:border-0 last:mb-0 pt-2`;
  }

  return `${base} space-y-6 pb-10 mb-8 border-b border-border-subtle last:border-0 last:mb-0`;
}
