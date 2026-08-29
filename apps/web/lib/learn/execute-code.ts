/**
 * Client-side JavaScript execution for learn path exercises.
 * Captures console.log output for comparison with expected results.
 */

import type { LearnGoalType } from '@/data/learn/types';

export interface RunResult {
  ok: boolean;
  output: string;
  error?: string;
}

const LOG_CAPTURE = '__learnLogCapture';

const ERROR_NAME_PATTERN = /^(TypeError|ReferenceError|SyntaxError|RangeError)$/;

function inferErrorName(message: string): string {
  if (message.includes('Assignment to constant variable')) return 'TypeError';
  if (message.includes('before initialization')) return 'ReferenceError';
  if (message.includes('is not defined')) return 'ReferenceError';
  if (message.includes('already been declared') || message.includes('Unexpected')) {
    return 'SyntaxError';
  }
  return 'TypeError';
}

/** Normalize a thrown error into a stable label for matching (e.g. `TypeError`). */
export function formatRunError(e: unknown): { short: string; full: string } {
  const message = e instanceof Error ? e.message : String(e);
  const name =
    e instanceof Error && ERROR_NAME_PATTERN.test(e.name) ? e.name : inferErrorName(message);
  return { short: name, full: `${name}: ${message}` };
}

export function runLearnCode(userCode: string): RunResult {
  try {
    const wrapped = `
      const ${LOG_CAPTURE} = [];
      const console = {
        log: (...args) => {
          ${LOG_CAPTURE}.push(args.map(a => formatValue(a)).join(' '));
        },
      };
      function formatValue(v) {
        if (v === undefined) return 'undefined';
        if (v === null) return 'null';
        if (typeof v === 'string') return v;
        if (typeof v === 'number' || typeof v === 'boolean') return String(v);
        try { return JSON.stringify(v); } catch { return String(v); }
      }
      ${userCode}
      return ${LOG_CAPTURE}.join('\\n');
    `;
    const fn = new Function(wrapped);
    const output = fn() as string;
    return { ok: true, output: output ?? '' };
  } catch (e) {
    const { short, full } = formatRunError(e);
    return { ok: false, output: short, error: full };
  }
}

export function runDemoCode(code: string): RunResult {
  return runLearnCode(code);
}

export function normalizeOutput(raw: string): string {
  return raw.trim().replace(/\r\n/g, '\n');
}

export function isErrorLabel(value: string): boolean {
  const v = normalizeOutput(value).toLowerCase();
  return (
    v === 'error' ||
    v.startsWith('typeerror') ||
    v.startsWith('referenceerror') ||
    v.startsWith('syntaxerror')
  );
}

/** Split user/reference output into comparable lines (newlines or spaces). */
export function outputLines(value: string): string[] {
  const normalized = normalizeOutput(value);
  if (normalized.includes('\n')) {
    return normalized.split('\n').map((l) => l.trim()).filter(Boolean);
  }
  return normalized.split(/\s+/).filter(Boolean);
}

export function normalizeLogAnswer(raw: string): string {
  return normalizeOutput(raw)
    .replace(/,\s+/g, ' ')
    .replace(/\s+,/g, ' ')
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function errorNamesMatch(userAnswer: string, reference: string): boolean {
  const u = normalizeOutput(userAnswer);
  const r = normalizeOutput(reference);

  if (u.toLowerCase() === 'error' && isErrorLabel(r)) return true;
  if (r.toLowerCase() === 'error' && isErrorLabel(u)) return true;

  const errorPrefixes = ['TypeError', 'ReferenceError', 'SyntaxError'] as const;
  for (const prefix of errorPrefixes) {
    if (r === prefix && u.startsWith(prefix)) return true;
    if (u === prefix && r.startsWith(prefix)) return true;
    if (r.startsWith(`${prefix}:`) && u.startsWith(prefix)) return true;
    if (u.startsWith(`${prefix}:`) && r.startsWith(prefix)) return true;
  }

  return false;
}

export interface MatchOptions {
  acceptErrorShorthand?: boolean;
  stepId?: string;
}

/**
 * Compare a predicted answer to reference output.
 * Accepts multiline answers, space-separated tokens, comma-separated guesses,
 * error shorthand (`error`), and error-name prefixes.
 */
export function predictOutputsMatch(
  userAnswer: string,
  reference: string,
  options: MatchOptions = {}
): boolean {
  const u = normalizeOutput(userAnswer);
  const r = normalizeOutput(reference);

  if (u === r) return true;

  if (options.acceptErrorShorthand && u.toLowerCase() === 'error' && isErrorLabel(r)) {
    return true;
  }

  if (errorNamesMatch(u, r)) return true;

  const uLog = normalizeLogAnswer(u);
  const rLog = normalizeLogAnswer(r);
  if (uLog === rLog) return true;

  if (!Number.isNaN(Number(u)) && !Number.isNaN(Number(r)) && Number(u) === Number(r)) {
    return true;
  }

  const refLines = outputLines(r);
  const userLines = outputLines(u);

  if (refLines.length > 1 && userLines.length === refLines.length) {
    return refLines.every((line, i) => line === userLines[i]);
  }

  if (refLines.length > 1 && userLines.length === 1) {
    return uLog === normalizeLogAnswer(refLines.join(' '));
  }

  return false;
}

export function outputsMatch(actual: string, expected: string): boolean {
  return predictOutputsMatch(actual, expected);
}

export function outputsMatchFlexible(
  actual: string,
  expected: string,
  stepId?: string
): boolean {
  if (outputsMatch(actual, expected)) return true;

  if (stepId === 'intro-10') {
    const lines = normalizeOutput(actual).split('\n');
    if (lines.length === 2 && lines[0].length > 0 && lines[1] === '2026') {
      return true;
    }
  }

  return false;
}

export function validateCodeChallenge(
  userCode: string,
  expectedOutput: string,
  stepId?: string,
  goalType: LearnGoalType = 'output'
): { passed: boolean; actual: string; message: string } {
  const result = runLearnCode(userCode);
  const actual = result.ok ? result.output : result.error ?? result.output;

  if (goalType === 'error') {
    const passed =
      !result.ok &&
      (predictOutputsMatch(actual, expectedOutput) ||
        predictOutputsMatch(result.output, expectedOutput) ||
        outputsMatchFlexible(actual, expectedOutput, stepId));
    return {
      passed,
      actual,
      message: passed
        ? 'Correct — that error is what we expected!'
        : result.ok
          ? `This ran without error — expected ${JSON.stringify(expectedOutput)}.`
          : `Wrong error — expected ${JSON.stringify(expectedOutput)}, got ${JSON.stringify(actual)}`,
    };
  }

  const passed = outputsMatchFlexible(result.output, expectedOutput, stepId);
  return {
    passed,
    actual: result.output,
    message: passed
      ? 'Correct!'
      : `Not quite — expected ${JSON.stringify(expectedOutput)}, got ${JSON.stringify(result.output)}`,
  };
}

export function getPredictRuntimeReference(sourceCode: string, fallback: string): string {
  const result = runLearnCode(sourceCode);
  if (!result.ok) return result.error ?? result.output;
  return fallback;
}

export function validatePredictOutput(
  userAnswer: string,
  expectedOutput: string,
  stepId?: string,
  sourceCode?: string,
  acceptErrorShorthand?: boolean
): { passed: boolean; message: string; reference: string } {
  const executed = sourceCode ? runLearnCode(sourceCode) : null;
  const reference = executed
    ? executed.ok
      ? executed.output
      : executed.error ?? executed.output
    : getPredictRuntimeReference(sourceCode ?? '', expectedOutput);

  const matchOpts: MatchOptions = { acceptErrorShorthand, stepId };

  const passed =
    predictOutputsMatch(userAnswer, reference, matchOpts) ||
    predictOutputsMatch(userAnswer, expectedOutput, matchOpts) ||
    outputsMatchFlexible(userAnswer, expectedOutput, stepId);

  return {
    passed,
    reference,
    message: passed ? 'Correct!' : 'Not quite — try again or use a hint.',
  };
}

export function isErrorExpectedOutput(value: string): boolean {
  return isErrorLabel(value);
}
