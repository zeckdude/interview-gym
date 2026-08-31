import { describe, expect, it } from 'vitest';
import type { LearnStep } from '@/data/learn/types';
import { CHALLENGE_YOURSELF_SECTION_TITLE } from '@/data/learn/challenge-yourself';
import {
  getChallengeDebrief,
  isChallengeYourselfSection,
  isOptionalLearnStep,
  learnStepHintsAllowed,
  learnStepRevealAllowed,
} from '@/lib/learn/challenge-yourself';
import { learnStepSectionClass } from '@/lib/learn/step-spacing';

describe('challenge-yourself helpers', () => {
  const sectionIntro: LearnStep = {
    id: 'cy-intro',
    type: 'text',
    conceptTags: ['types'],
    title: CHALLENGE_YOURSELF_SECTION_TITLE,
    sectionKind: 'challenge-yourself',
    content: 'Optional hard problems.',
  };

  const optionalPredict: LearnStep = {
    id: 'cy-1',
    type: 'predict-output',
    conceptTags: ['typeof'],
    optional: true,
    code: 'console.log(typeof typeof 1);',
    expectedOutput: 'string',
  };

  const requiredChallenge: LearnStep = {
    id: 'ch-1',
    type: 'code-challenge',
    conceptTags: ['const'],
    prompt: 'Log hello',
    setupCode: '',
    starterCode: '',
    solutionCode: "console.log('hello');",
    expectedOutput: 'hello',
  };

  it('detects Challenge Yourself section intros', () => {
    expect(isChallengeYourselfSection(sectionIntro)).toBe(true);
    expect(isChallengeYourselfSection(optionalPredict)).toBe(false);
  });

  it('detects optional steps', () => {
    expect(isOptionalLearnStep(optionalPredict)).toBe(true);
    expect(isOptionalLearnStep(requiredChallenge)).toBe(false);
  });

  it('disables hints and reveal on optional steps', () => {
    expect(learnStepHintsAllowed(optionalPredict)).toBe(false);
    expect(learnStepRevealAllowed(optionalPredict)).toBe(false);
    expect(learnStepHintsAllowed(requiredChallenge)).toBe(true);
    expect(learnStepRevealAllowed(requiredChallenge)).toBe(true);
  });

  it('styles Challenge Yourself sections with dashed warning border', () => {
    expect(learnStepSectionClass('standalone', sectionIntro)).toContain('border-dashed');
    expect(learnStepSectionClass('standalone', sectionIntro)).toContain('border-warning');
  });

  it('returns challengeDebrief on optional interactive steps', () => {
    const withDebrief: LearnStep = {
      ...optionalPredict,
      challengeDebrief: {
        gotcha: 'trap',
        greatSolution: 'reasoning',
        watchFor: 'habit',
      },
    };
    expect(getChallengeDebrief(withDebrief)).toBeDefined();
    expect(getChallengeDebrief(requiredChallenge)).toBeUndefined();
  });
});
