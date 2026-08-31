import { type RefObject, useEffect, useRef } from 'react';
import { smoothScrollFullyIntoViewElements } from '@/lib/learn/smooth-scroll';

export interface LearnStepContentScrollRefs {
  predictFeedback: RefObject<HTMLElement | null>;
  predictResult: RefObject<HTMLElement | null>;
  codeResult: RefObject<HTMLElement | null>;
  latestHint: RefObject<HTMLElement | null>;
  reveal: RefObject<HTMLElement | null>;
  recommended: RefObject<HTMLElement | null>;
  debrief: RefObject<HTMLElement | null>;
  choiceFeedback: RefObject<HTMLElement | null>;
  choiceExplanation: RefObject<HTMLElement | null>;
}

export interface LearnStepContentScrollState {
  hintLevel: number;
  revealed: boolean;
  predictResult: boolean | null;
  predictFeedbackMessage: string | null;
  showPredictFeedback: boolean;
  codeResultPassed: boolean | null;
  showRecommended: boolean;
  optionalFinished: boolean;
  showDebriefExpanded: boolean;
  choiceResult: boolean | null;
}

export function newContentScrollTargets(
  prev: LearnStepContentScrollState,
  next: LearnStepContentScrollState,
  refs: LearnStepContentScrollRefs
): HTMLElement[] {
  const predictFeedbackNew =
    next.showPredictFeedback &&
    !!next.predictFeedbackMessage &&
    (!prev.showPredictFeedback || prev.predictFeedbackMessage !== next.predictFeedbackMessage);

  const predictResultNew =
    next.showPredictFeedback &&
    next.predictResult !== null &&
    prev.predictResult === null;

  const codeResultNew =
    next.codeResultPassed !== null && prev.codeResultPassed === null;

  const hintAdded = next.hintLevel > prev.hintLevel;

  const revealNew = next.revealed && !prev.revealed;

  const debriefNew = next.optionalFinished && !prev.optionalFinished;

  const debriefExpanded = next.showDebriefExpanded && !prev.showDebriefExpanded;

  const recommendedOpened = next.showRecommended && !prev.showRecommended;

  const choiceFeedbackNew =
    next.choiceResult !== null && prev.choiceResult === null;

  const choiceExplanationNew =
    next.choiceResult === false &&
    prev.choiceResult !== false;

  /** DOM order — collect every element in the newly added group. */
  const ordered: Array<{ isNew: boolean; el: HTMLElement | null }> = [
    { isNew: predictFeedbackNew, el: refs.predictFeedback.current },
    { isNew: predictResultNew, el: refs.predictResult.current },
    { isNew: choiceFeedbackNew, el: refs.choiceFeedback.current },
    { isNew: codeResultNew, el: refs.codeResult.current },
    { isNew: hintAdded, el: refs.latestHint.current },
    { isNew: choiceExplanationNew, el: refs.choiceExplanation.current },
    { isNew: revealNew, el: refs.reveal.current },
    { isNew: recommendedOpened, el: refs.recommended.current },
    { isNew: debriefNew || debriefExpanded, el: refs.debrief.current },
  ];

  return ordered
    .filter((entry) => entry.isNew && entry.el)
    .map((entry) => entry.el!);
}

/** @deprecated Use {@link newContentScrollTargets} — returns the first target only. */
export function firstNewContentTarget(
  prev: LearnStepContentScrollState,
  next: LearnStepContentScrollState,
  refs: LearnStepContentScrollRefs
): HTMLElement | null {
  return newContentScrollTargets(prev, next, refs)[0] ?? null;
}

/**
 * When inline content appears on the active learn step, scroll to the topmost
 * element in that addition so the learner can read through the group in order.
 */
export function useScrollToNewActiveStepContent(
  stepId: string,
  isActive: boolean,
  state: LearnStepContentScrollState,
  refs: LearnStepContentScrollRefs
) {
  const skipNextRef = useRef(true);
  const stepIdRef = useRef(stepId);
  const prevStateRef = useRef(state);

  if (stepIdRef.current !== stepId) {
    stepIdRef.current = stepId;
    skipNextRef.current = true;
    prevStateRef.current = state;
  }

  useEffect(() => {
    if (!isActive) {
      prevStateRef.current = state;
      return;
    }

    if (skipNextRef.current) {
      skipNextRef.current = false;
      prevStateRef.current = state;
      return;
    }

    const targets = newContentScrollTargets(prevStateRef.current, state, refs);
    prevStateRef.current = state;

    if (targets.length > 0) {
      smoothScrollFullyIntoViewElements(targets, 'fit');
    }
  });
}
