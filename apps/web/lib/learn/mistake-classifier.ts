import type { LearnGoalType } from '@/data/learn/types';
import type { MistakeKind } from '@/lib/learn/mistake-kind';
import {
  errorNamesMatch,
  isErrorLabel,
  normalizeLogAnswer,
  normalizeOutput,
  outputLines,
  predictOutputsMatch,
  runLearnCode,
  type MatchOptions,
} from '@/lib/learn/execute-code';

function extractNumbers(value: string): number[] {
  const matches = value.match(/-?\d+(\.\d+)?/g);
  if (!matches) return [];
  return matches.map(Number).filter((n) => !Number.isNaN(n));
}

function tokensMatchStructure(user: string, reference: string): boolean {
  const uParts = normalizeLogAnswer(user).split(/\s+/);
  const rParts = normalizeLogAnswer(reference).split(/\s+/);
  if (uParts.length !== rParts.length) return false;

  return uParts.every((part, i) => {
    const rPart = rParts[i];
    const uIsNum = !Number.isNaN(Number(part));
    const rIsNum = !Number.isNaN(Number(rPart));
    if (uIsNum && rIsNum) return true;
    return part.toLowerCase() === rPart.toLowerCase();
  });
}

export interface ClassifyPredictOptions extends MatchOptions {
  expectsError?: boolean;
}

export function classifyPredictMistake(
  userAnswer: string,
  reference: string,
  expectedOutput: string,
  options: ClassifyPredictOptions = {}
): MistakeKind {
  if (
    predictOutputsMatch(userAnswer, reference, options) ||
    predictOutputsMatch(userAnswer, expectedOutput, options)
  ) {
    return 'correct';
  }

  const u = normalizeOutput(userAnswer);
  const r = normalizeOutput(reference);
  const expected = normalizeOutput(expectedOutput);
  const refIsError = isErrorLabel(r) || isErrorLabel(expected);
  const userIsError = isErrorLabel(u);

  if (refIsError && !userIsError) return 'error_when_output';
  if (!refIsError && userIsError) return 'type_error_expected';

  const uLog = normalizeLogAnswer(u);
  const rLog = normalizeLogAnswer(r);

  const refLines = outputLines(r);
  const userLines = outputLines(u);

  if (refLines.length > 1) {
    if (userLines.length < refLines.length) return 'missing_line';
    if (userLines.length > refLines.length) return 'extra_line';
  }

  if (refLines.length === 1 && userLines.length === 1) {
    const refTokens = refLines[0].split(/\s+/);
    const userTokens = userLines[0].split(/\s+/);
    if (refTokens.length > 1 && refTokens.length === userTokens.length) {
      const refSorted = [...refTokens].sort().join(' ');
      const userSorted = [...userTokens].sort().join(' ');
      if (refSorted === userSorted && refLines[0] !== userLines[0]) {
        return 'wrong_order';
      }
    }
  }

  const refNums = extractNumbers(r);
  const userNums = extractNumbers(u);
  if (
    refNums.length > 0 &&
    userNums.length > 0 &&
    tokensMatchStructure(u, r) &&
    refNums.some((n, i) => userNums[i] !== n)
  ) {
    return 'wrong_numeric_value';
  }

  if (u.includes(',') && !r.includes(',') && uLog !== rLog) {
    return 'comma_separator';
  }

  return 'output_mismatch';
}

export function classifyCodeChallengeMistake(
  userCode: string,
  actual: string,
  expectedOutput: string,
  goalType: LearnGoalType,
  passed: boolean
): MistakeKind {
  if (passed) return 'correct';

  const result = runLearnCode(userCode);
  const expected = normalizeOutput(expectedOutput);
  const actualNorm = normalizeOutput(actual);

  if (goalType === 'error') {
    if (result.ok) return 'output_when_error';
    if (!errorNamesMatch(actualNorm, expected) && !isErrorLabel(actualNorm)) {
      return 'output_when_error';
    }
    if (!errorNamesMatch(actualNorm, expected)) return 'error_when_output';
    return 'output_mismatch';
  }

  if (!result.ok) return 'syntax_error';
  if (!actualNorm.trim()) return 'empty_output';

  const refLines = outputLines(expected);
  const actLines = outputLines(actualNorm);
  if (actLines.length < refLines.length) return 'missing_line';
  if (actLines.length > refLines.length) return 'extra_line';

  return 'output_mismatch';
}

/** Stable fingerprint for logging — no raw user answers stored. */
export function fingerprintAnswer(value: string): string {
  return normalizeLogAnswer(value).slice(0, 120);
}
