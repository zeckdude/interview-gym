import { describe, expect, it } from 'vitest';
import {
  firstNewContentTarget,
  newContentScrollTargets,
  type LearnStepContentScrollRefs,
  type LearnStepContentScrollState,
} from '@/hooks/useScrollToNewActiveStepContent';

const emptyState: LearnStepContentScrollState = {
  hintLevel: 0,
  revealed: false,
  predictResult: null,
  predictFeedbackMessage: null,
  showPredictFeedback: false,
  codeResultPassed: null,
  showRecommended: false,
  optionalFinished: false,
  showDebriefExpanded: false,
  choiceResult: null,
};

function refsWith(
  partial: Partial<Record<keyof LearnStepContentScrollRefs, HTMLElement>>
): LearnStepContentScrollRefs {
  const makeRef = (el?: HTMLElement) => ({ current: el ?? null });
  return {
    predictFeedback: makeRef(partial.predictFeedback),
    predictResult: makeRef(partial.predictResult),
    codeResult: makeRef(partial.codeResult),
    latestHint: makeRef(partial.latestHint),
    reveal: makeRef(partial.reveal),
    recommended: makeRef(partial.recommended),
    debrief: makeRef(partial.debrief),
    choiceFeedback: makeRef(partial.choiceFeedback),
    choiceExplanation: makeRef(partial.choiceExplanation),
  };
}

describe('newContentScrollTargets', () => {
  it('returns feedback and result when validation adds both', () => {
    const feedback = document.createElement('div');
    const result = document.createElement('div');

    const targets = newContentScrollTargets(
      emptyState,
      {
        ...emptyState,
        showPredictFeedback: true,
        predictResult: false,
        predictFeedbackMessage: 'Wrap strings in quotes.',
      },
      refsWith({ predictFeedback: feedback, predictResult: result })
    );

    expect(targets).toEqual([feedback, result]);
  });

  it('returns only the newest hint when hint level increases', () => {
    const hint = document.createElement('div');

    const targets = newContentScrollTargets(
      { ...emptyState, hintLevel: 1 },
      { ...emptyState, hintLevel: 2 },
      refsWith({ latestHint: hint })
    );

    expect(targets).toEqual([hint]);
  });
});

describe('firstNewContentTarget', () => {
  it('returns the topmost target in a group', () => {
    const feedback = document.createElement('div');
    const result = document.createElement('div');

    const target = firstNewContentTarget(
      emptyState,
      {
        ...emptyState,
        showPredictFeedback: true,
        predictResult: false,
        predictFeedbackMessage: 'Wrap strings in quotes.',
      },
      refsWith({ predictFeedback: feedback, predictResult: result })
    );

    expect(target).toBe(feedback);
  });
});
