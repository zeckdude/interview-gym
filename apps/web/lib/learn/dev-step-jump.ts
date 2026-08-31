/**
 * Dev-only step jump: fill skipped steps with recommended answers, clear target+.
 */

import type { LearnModule, LearnStep } from '@/data/learn/types';
import { combineLearnCode } from '@/lib/learn/code-error-line';
import {
  formatQuotedPredictAnswer,
  getPredictOutputStructure,
  getPredictRuntimeReference,
  isErrorExpectedOutput,
  runLearnCode,
} from '@/lib/learn/execute-code';
import {
  findLearnErrorOptionForReference,
  getErrorPickerOptions,
  type LearnErrorOption,
} from '@/lib/learn/learned-errors';
import {
  clearLearnStepStorageLocal,
  saveLearnStepStateLocal,
  type LearnStepStoredState,
} from '@/lib/learn/step-storage';

function stepExpectsError(step: LearnStep): boolean {
  if (step.type === 'predict-output') {
    return Boolean(step.expectsError || isErrorExpectedOutput(step.expectedOutput));
  }
  if (step.type === 'code-challenge') {
    return step.goalType === 'error';
  }
  if (step.type === 'code-demo') {
    return Boolean(step.expectsError || isErrorExpectedOutput(step.expectedOutput));
  }
  return false;
}

/** Build persisted state that matches the dev "Skip step" recommended answer. */
export function buildRecommendedStepState(
  step: LearnStep,
  availableLearnErrors: LearnErrorOption[] = []
): LearnStepStoredState | null {
  if (step.type === 'text' || step.type === 'review-gate' || step.type === 'code-demo') {
    return null;
  }

  if (step.type === 'predict-output') {
    const reference = getPredictRuntimeReference(step.code, step.expectedOutput);
    const expectsError = stepExpectsError(step);
    const matchingError = findLearnErrorOptionForReference(
      reference,
      step.expectedOutput,
      availableLearnErrors
    );
    const structure = getPredictOutputStructure(step.code);
    const quotedAnswer =
      !expectsError && structure.length > 0
        ? formatQuotedPredictAnswer(structure)
        : reference || step.expectedOutput;
    const answer = expectsError ? (matchingError?.label ?? reference) : quotedAnswer;

    return {
      predictAnswer: answer,
      predictReference: reference,
      predictPassed: true,
      predictsError: expectsError,
      selectedErrorId: matchingError?.id ?? null,
    };
  }

  if (step.type === 'code-challenge') {
    const fullCode = combineLearnCode(step.setupCode, step.solutionCode);
    const ran = runLearnCode(fullCode);
    const actual =
      step.goalType === 'error'
        ? step.expectedOutput
        : ran.output || step.expectedOutput;

    return {
      code: fullCode,
      codeActual: actual,
      codePassed: true,
      codeMessage: 'Correct!',
    };
  }

  if (step.type === 'choice') {
    return {
      choiceIndex: step.correctIndex,
      choicePassed: true,
    };
  }

  return null;
}

export interface DevStepJumpResult {
  filledStepIds: string[];
  clearedStepIds: string[];
}

export interface DevStepJumpOptions {
  moduleId: string;
  steps: LearnModule['steps'];
  fromIndex: number;
  targetIndex: number;
  coveredModuleIds: string[];
}

/**
 * When skipping ahead (target > from), fill recommended answers on [from, target).
 * Always clear persisted state for [target, end).
 *
 * Uses local cache only (no remote sync) so dev jumps stay instant like Skip step.
 */
export function executeDevStepJump(options: DevStepJumpOptions): DevStepJumpResult {
  const { moduleId, steps, fromIndex, targetIndex, coveredModuleIds } = options;
  const filledStepIds: string[] = [];
  const clearedStepIds: string[] = [];

  if (targetIndex > fromIndex) {
    for (let index = fromIndex; index < targetIndex; index++) {
      const step = steps[index];
      if (!step) continue;

      const availableLearnErrors = getErrorPickerOptions(
        moduleId,
        index,
        steps,
        coveredModuleIds,
        step.type === 'predict-output' ? step : undefined
      );
      const state = buildRecommendedStepState(step, availableLearnErrors);
      if (state) {
        saveLearnStepStateLocal(moduleId, step.id, state);
      }
      filledStepIds.push(step.id);
    }
  }

  for (let index = targetIndex; index < steps.length; index++) {
    const step = steps[index];
    if (!step) continue;
    clearLearnStepStorageLocal(moduleId, step.id);
    clearedStepIds.push(step.id);
  }

  return { filledStepIds, clearedStepIds };
}
