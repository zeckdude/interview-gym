import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearLearnModuleStepStorage,
  clearLearnStepStorage,
  hydrateLearnModuleStepStates,
  loadLearnStepState,
  saveLearnStepState,
} from '@/lib/learn/step-storage';

describe('learn step storage', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    clearLearnModuleStepStorage('js-02-variables');
    vi.restoreAllMocks();
  });

  it('saves and loads predict-output answers', () => {
    saveLearnStepState('js-02-variables', 'var-6', {
      predictAnswer: 'Paris 2',
      predictReference: 'Paris 2',
      predictPassed: true,
    });

    expect(loadLearnStepState('js-02-variables', 'var-6')).toEqual({
      predictAnswer: 'Paris 2',
      predictReference: 'Paris 2',
      predictPassed: true,
    });
  });

  it('clears all step storage for a module', () => {
    saveLearnStepState('js-02-variables', 'var-6', { predictAnswer: 'Paris 2' });
    saveLearnStepState('js-02-variables', 'var-8', { code: 'const language = "JavaScript";' });

    clearLearnModuleStepStorage('js-02-variables');

    expect(loadLearnStepState('js-02-variables', 'var-6')).toBeNull();
    expect(loadLearnStepState('js-02-variables', 'var-8')).toBeNull();
  });

  it('clears a single step', () => {
    saveLearnStepState('js-02-variables', 'var-6', { predictAnswer: 'Paris 2' });
    clearLearnStepStorage('js-02-variables', 'var-6');
    expect(loadLearnStepState('js-02-variables', 'var-6')).toBeNull();
  });

  it('hydrates local cache from server states', () => {
    hydrateLearnModuleStepStates('js-02-variables', {
      'var-6': { predictAnswer: 'Paris 2', predictPassed: true },
    });

    expect(loadLearnStepState('js-02-variables', 'var-6')).toEqual({
      predictAnswer: 'Paris 2',
      predictPassed: true,
    });
  });
});
