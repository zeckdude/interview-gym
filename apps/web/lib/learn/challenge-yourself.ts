import type { LearnChallengeDebrief, LearnStep } from '@/data/learn/types';
import { CHALLENGE_YOURSELF_SECTION_TITLE } from '@/data/learn/challenge-yourself';

export { CHALLENGE_YOURSELF_SECTION_TITLE };

export function isChallengeYourselfSection(step: LearnStep): boolean {
  return step.type === 'text' && step.sectionKind === 'challenge-yourself';
}

export function isOptionalLearnStep(step: LearnStep): boolean {
  return step.optional === true;
}

export function getChallengeDebrief(step: LearnStep): LearnChallengeDebrief | undefined {
  if (!isOptionalLearnStep(step)) return undefined;
  if (step.type === 'predict-output' || step.type === 'code-challenge') {
    return step.challengeDebrief;
  }
  return undefined;
}

/** Optional challenge steps ship without hints or reveal — learners solve or skip. */
export function learnStepHintsAllowed(step: LearnStep): boolean {
  if (isOptionalLearnStep(step)) return false;
  return step.type === 'predict-output' || step.type === 'code-challenge' || step.type === 'choice';
}

export function learnStepRevealAllowed(step: LearnStep): boolean {
  if (isOptionalLearnStep(step)) return false;
  return step.type === 'predict-output' || step.type === 'code-challenge';
}
