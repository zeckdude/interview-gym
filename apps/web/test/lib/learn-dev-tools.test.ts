import { describe, expect, it } from 'vitest';
import { getAuthoredModuleIds, getLearnModule } from '@/data/learn/modules';
import { moduleIntroduction } from '@/data/learn/modules/js-01-introduction';
import {
  buildLearnModuleStepUrlForIndex,
  getLearnStepDevLabel,
  getLearnStepDevSummary,
  isLearnDevToolsEnabled,
  resolveLearnStepParam,
} from '@/lib/learn/dev-tools';

describe('isLearnDevToolsEnabled', () => {
  it('is enabled only when NODE_ENV is development', () => {
    expect(isLearnDevToolsEnabled()).toBe(process.env.NODE_ENV === 'development');
  });
});

describe('learn dev step navigation', () => {
  const steps = moduleIntroduction.steps;

  it('resolves 1-based numeric step params', () => {
    expect(resolveLearnStepParam(steps, '7')).toBe(6);
    expect(resolveLearnStepParam(steps, '1')).toBe(0);
    expect(resolveLearnStepParam(steps, '0')).toBeNull();
    expect(resolveLearnStepParam(steps, String(steps.length + 1))).toBeNull();
  });

  it('resolves step id params', () => {
    expect(resolveLearnStepParam(steps, 'intro-7')).toBe(6);
    expect(resolveLearnStepParam(steps, 'intro-errors-4')).toBe(
      steps.findIndex((s) => s.id === 'intro-errors-4')
    );
    expect(resolveLearnStepParam(steps, 'missing-step')).toBeNull();
  });

  it('builds deeplink urls with step ids', () => {
    expect(buildLearnModuleStepUrlForIndex('js-01-introduction', steps, 6)).toBe(
      '/learn/js-01-introduction?step=intro-7'
    );
  });

  it('derives readable labels from step content', () => {
    const predictStep = steps.find((s) => s.id === 'intro-5')!;
    expect(getLearnStepDevLabel(predictStep, 4)).toContain('Predict: arithmetic output');

    const challengeStep = steps.find((s) => s.id === 'intro-7')!;
    expect(getLearnStepDevLabel(challengeStep, 6)).toContain('Challenge: print a string');
  });

  it('returns title and description for dev jump menu', () => {
    const predictStep = steps.find((s) => s.id === 'intro-5')!;
    const summary = getLearnStepDevSummary(predictStep, 4);
    expect(summary.title).toBe('Predict: arithmetic output');
    expect(summary.description).toContain('expression');
    expect(summary.description).not.toContain('10 - 4');
  });

  it('prefers devTitle and devDescription when set on a step', () => {
    const labeled = {
      ...steps[0]!,
      devTitle: 'Welcome intro',
      devDescription: 'Module overview for testers.',
    };
    const summary = getLearnStepDevSummary(labeled, 0);
    expect(summary.title).toBe('Welcome intro');
    expect(summary.description).toBe('Module overview for testers.');
  });

  it('does not leak answers in fallback descriptions', () => {
    const unlabeledPredict = {
      id: 'test-predict',
      type: 'predict-output' as const,
      conceptTags: ['typeof'],
      code: `console.log(typeof null);`,
      expectedOutput: 'object',
      expectsError: false,
    };
    const summary = getLearnStepDevSummary(unlabeledPredict, 0);
    expect(summary.description).not.toContain('object');
    expect(summary.description).not.toContain('typeof null');
  });
});

describe('authored learn module dev labels', () => {
  it('every step in authored modules has devTitle and devDescription', () => {
    const missing: string[] = [];

    for (const moduleId of getAuthoredModuleIds()) {
      const module = getLearnModule(moduleId)!;
      for (const step of module.steps) {
        if (!step.devTitle?.trim() || !step.devDescription?.trim()) {
          missing.push(`${moduleId}/${step.id}`);
        }
      }
    }

    expect(missing).toEqual([]);
  });
});
