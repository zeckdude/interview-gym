import { describe, expect, it } from 'vitest';
import { getAuthoredModuleIds, getLearnModule } from '@/data/learn/modules';

describe('optional Challenge Yourself steps', () => {
  it('every optional step in authored modules has challengeDebrief', () => {
    const missing: string[] = [];

    for (const moduleId of getAuthoredModuleIds()) {
      const mod = getLearnModule(moduleId);
      if (!mod) continue;

      for (const step of mod.steps) {
        if (!step.optional) continue;
        if (step.type !== 'predict-output' && step.type !== 'code-challenge') continue;
        if (!step.challengeDebrief?.gotcha || !step.challengeDebrief.greatSolution || !step.challengeDebrief.watchFor) {
          missing.push(`${moduleId} / ${step.id}`);
        }
      }
    }

    expect(missing).toEqual([]);
  });
});
