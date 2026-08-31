import { describe, expect, it, vi, beforeEach } from 'vitest';
import { moduleIntroduction } from '@/data/learn/modules/js-01-introduction';
import { moduleVariables } from '@/data/learn/modules/js-02-variables';
import {
  buildRecommendedStepState,
  executeDevStepJump,
} from '@/lib/learn/dev-step-jump';
import {
  clearLearnStepStorage,
  loadLearnStepState,
  saveLearnStepStateLocal,
} from '@/lib/learn/step-storage';

vi.mock('@/lib/learn/step-sync', () => ({
  deleteStepStateOnServer: vi.fn().mockResolvedValue(undefined),
  isLearnStepMilestone: vi.fn(() => true),
  queueStepStateSync: vi.fn(),
  migrateLocalOnlyStepStates: vi.fn(),
  flushStepStateSync: vi.fn(),
}));

describe('buildRecommendedStepState', () => {
  it('returns null for text and code-demo steps', () => {
    const textStep = moduleIntroduction.steps[0]!;
    const demoStep = moduleIntroduction.steps[2]!;
    expect(buildRecommendedStepState(textStep)).toBeNull();
    expect(buildRecommendedStepState(demoStep)).toBeNull();
  });

  it('builds passed predict-output state without revealing in title fields', () => {
    const step = moduleIntroduction.steps.find((s) => s.id === 'intro-5')!;
    const state = buildRecommendedStepState(step);
    expect(state?.predictPassed).toBe(true);
    expect(state?.predictAnswer).toBeTruthy();
    expect(state?.predictReference).toBeTruthy();
  });

  it('builds passed choice state with correct index', () => {
    const step = moduleVariables.steps.find((s) => s.type === 'choice');
    if (!step || step.type !== 'choice') return;
    const state = buildRecommendedStepState(step);
    expect(state?.choicePassed).toBe(true);
    expect(state?.choiceIndex).toBe(step.correctIndex);
  });
});

describe('executeDevStepJump', () => {
  const moduleId = 'js-01-introduction';
  const steps = moduleIntroduction.steps;

  beforeEach(() => {
    for (const step of steps) {
      clearLearnStepStorage(moduleId, step.id);
    }
  });

  it('clears target step and all subsequent steps on any jump', () => {
    saveLearnStepStateLocal(moduleId, 'intro-5', { predictPassed: true, predictAnswer: '6' });
    saveLearnStepStateLocal(moduleId, 'intro-7', { codePassed: true, code: 'x' });
    saveLearnStepStateLocal(moduleId, 'intro-10', { codePassed: true, code: 'y' });

    const targetIndex = steps.findIndex((s) => s.id === 'intro-7');
    executeDevStepJump({
      moduleId,
      steps,
      fromIndex: targetIndex,
      targetIndex,
      coveredModuleIds: [moduleId],
    });

    expect(loadLearnStepState(moduleId, 'intro-5')).toEqual({ predictPassed: true, predictAnswer: '6' });
    expect(loadLearnStepState(moduleId, 'intro-7')).toBeNull();
    expect(loadLearnStepState(moduleId, 'intro-10')).toBeNull();
  });

  it('fills recommended answers when skipping ahead', () => {
    const fromIndex = steps.findIndex((s) => s.id === 'intro-5');
    const targetIndex = steps.findIndex((s) => s.id === 'intro-9');

    const result = executeDevStepJump({
      moduleId,
      steps,
      fromIndex,
      targetIndex,
      coveredModuleIds: [moduleId],
    });

    expect(result.filledStepIds).toContain('intro-5');
    expect(result.filledStepIds).toContain('intro-7');
    expect(result.clearedStepIds).toContain('intro-9');

    const predictState = loadLearnStepState(moduleId, 'intro-5');
    expect(predictState?.predictPassed).toBe(true);

    expect(loadLearnStepState(moduleId, 'intro-9')).toBeNull();
  });

  it('does not fill when jumping backward', () => {
    const earlyIndex = steps.findIndex((s) => s.id === 'intro-3');
    saveLearnStepStateLocal(moduleId, 'intro-5', { predictPassed: true, predictAnswer: 'cleared' });

    executeDevStepJump({
      moduleId,
      steps,
      fromIndex: 8,
      targetIndex: earlyIndex,
      coveredModuleIds: [moduleId],
    });

    expect(loadLearnStepState(moduleId, 'intro-5')).toBeNull();
    expect(loadLearnStepState(moduleId, 'intro-3')).toBeNull();
  });
});
