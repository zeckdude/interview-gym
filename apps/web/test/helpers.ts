import type { Challenge, ChallengeLanguage, ValidationResult } from '@/data/types';
import { prepareCodeForExecution } from '@/lib/code-runner';

/** Run a challenge validator the same way ChallengeRunner does. */
export async function validatePrepared(
  challenge: Challenge,
  code: string,
  language: ChallengeLanguage
): Promise<ValidationResult> {
  const prepared = prepareCodeForExecution(code, language);
  return challenge.validate(prepared, language);
}

export async function validateSolution(
  challenge: Challenge,
  language: ChallengeLanguage
): Promise<ValidationResult> {
  return validatePrepared(challenge, challenge.solution[language], language);
}
