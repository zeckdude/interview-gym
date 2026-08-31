/**
 * Client-side JavaScript execution for learn path exercises.
 * Captures console.log output for comparison with expected results.
 */

import type { LearnGoalType, LearnOutputFlex } from '@/data/learn/types';
import {
  extractEvalLineFromStack,
  findErrorLineInCode,
} from '@/lib/learn/code-error-line';

export interface RunResult {
  ok: boolean;
  output: string;
  error?: string;
  /** 1-based line in the executed user code, when available. */
  errorLine?: number;
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

const RUNNER_PREFIX = `
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
`;

const RUNNER_SUFFIX = `
      return ${LOG_CAPTURE}.join('\\n');
    `;

/** Lines in the eval wrapper before learner code starts (1-based offset). */
export const LEARN_RUNNER_LINE_OFFSET = RUNNER_PREFIX.split('\n').length - 1;

function resolveRunErrorLine(
  userCode: string,
  error: string,
  stack: string | undefined
): number | undefined {
  const lineCount = userCode.replace(/\r\n/g, '\n').split('\n').length;

  // Parse-time SyntaxErrors: engine stack often points at the *next* line.
  if (/SyntaxError/i.test(error)) {
    const heuristic = findErrorLineInCode(userCode, error);
    if (heuristic != null) return heuristic;
  }

  const stackLine = extractEvalLineFromStack(stack, LEARN_RUNNER_LINE_OFFSET);
  if (stackLine != null && stackLine >= 1 && stackLine <= lineCount) {
    return stackLine;
  }
  return findErrorLineInCode(userCode, error) ?? undefined;
}

export function runLearnCode(userCode: string): RunResult {
  try {
    const wrapped = `${RUNNER_PREFIX}${userCode}${RUNNER_SUFFIX}`;
    const fn = new Function(wrapped);
    const output = fn() as string;
    return { ok: true, output: output ?? '' };
  } catch (e) {
    const { short, full } = formatRunError(e);
    const errorLine = resolveRunErrorLine(
      userCode,
      full,
      e instanceof Error ? e.stack : undefined
    );
    return { ok: false, output: short, error: full, errorLine };
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

export type LogTokenKind = 'string' | 'number' | 'boolean' | 'undefined' | 'null' | 'other';

export interface LogToken {
  display: string;
  kind: LogTokenKind;
}

export const STRING_QUOTES_MESSAGE =
  'Almost, but the answer is a string so it needs quotes.';

export function isQuotedStringToken(token: string): boolean {
  const trimmed = token.trim();
  if (trimmed.length < 2) return false;
  return (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  );
}

export function stripQuotes(token: string): string {
  const trimmed = token.trim();
  if (!isQuotedStringToken(trimmed)) return trimmed;
  return trimmed.slice(1, -1);
}

/** Split a predict answer line into tokens, keeping quoted strings intact. */
export function tokenizePredictAnswerLine(line: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quote: "'" | '"' | null = null;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (quote) {
      current += ch;
      if (ch === quote && line[i - 1] !== '\\') {
        quote = null;
      }
      continue;
    }

    if (ch === "'" || ch === '"') {
      if (current.trim()) {
        tokens.push(current.trim());
        current = '';
      }
      quote = ch;
      current += ch;
      continue;
    }

    if (/\s/.test(ch)) {
      if (current.trim()) {
        tokens.push(current.trim());
        current = '';
      }
      continue;
    }

    current += ch;
  }

  if (current.trim()) {
    tokens.push(current.trim());
  }

  return tokens;
}

/** Align user input tokens to expected console.log argument structure. */
export function parsePredictAnswerLineForStructure(
  line: string,
  refTokens: LogToken[]
): string[] {
  const trimmed = line.trim();
  if (!trimmed) return [];

  if (trimmed.includes(',')) {
    const commaParts = trimmed
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
    if (commaParts.length === refTokens.length) {
      return commaParts;
    }
  }

  const quotedTokens = tokenizePredictAnswerLine(trimmed);
  if (quotedTokens.length === refTokens.length) {
    return quotedTokens;
  }

  if (refTokens.length === 1) {
    return [trimmed];
  }

  return quotedTokens;
}

function parsePredictAnswerTokens(answer: string): string[][] {
  const normalized = normalizeOutput(answer);
  if (!normalized) return [[]];

  if (normalized.includes('\n')) {
    return normalized.split('\n').map((line) => tokenizePredictAnswerLine(line));
  }

  return [tokenizePredictAnswerLine(normalized)];
}

/** Strip user-supplied quotes before comparing logged output text. */
export function normalizePredictAnswerForMatch(raw: string): string {
  const normalized = normalizeOutput(raw);
  if (!normalized) return '';

  const lines = normalized.includes('\n')
    ? normalized.split('\n')
    : [normalized];

  return lines
    .map((line) =>
      tokenizePredictAnswerLine(line)
        .map((token) => (isQuotedStringToken(token) ? stripQuotes(token) : token))
        .join(' ')
    )
    .join('\n');
}

/** Capture console.log output with token types for quote validation. */
export function getPredictOutputStructure(sourceCode: string): LogToken[][] {
  try {
    const wrapped = `
      const ${LOG_CAPTURE} = [];
      const console = {
        log: (...args) => {
          ${LOG_CAPTURE}.push(args.map(a => classifyLogValue(a)));
        },
      };
      function classifyLogValue(v) {
        if (v === undefined) return { display: 'undefined', kind: 'undefined' };
        if (v === null) return { display: 'null', kind: 'null' };
        if (typeof v === 'string') return { display: v, kind: 'string' };
        if (typeof v === 'number') return { display: String(v), kind: 'number' };
        if (typeof v === 'boolean') return { display: String(v), kind: 'boolean' };
        try { return { display: JSON.stringify(v), kind: 'other' }; }
        catch { return { display: String(v), kind: 'other' }; }
      }
      function formatValue(v) {
        return classifyLogValue(v).display;
      }
      ${sourceCode}
      return ${LOG_CAPTURE};
    `;
    const fn = new Function(wrapped);
    return fn() as LogToken[][];
  } catch {
    return [];
  }
}

export function formatQuotedPredictAnswer(structure: LogToken[][]): string {
  return structure
    .map((line) =>
      line
        .map((token) =>
          token.kind === 'string'
            ? `'${token.display.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
            : token.display
        )
        .join(' ')
    )
    .join('\n');
}

/** Format runtime log output for display — strings wrapped in quotes like user answers. */
export function formatQuotedDisplayOutput(
  sourceCode: string | undefined,
  rawOutput: string
): string {
  if (!sourceCode?.trim() || !rawOutput.trim()) return rawOutput;
  if (isErrorLabel(rawOutput)) return rawOutput;

  const structure = getPredictOutputStructure(sourceCode);
  if (structure.length === 0) return rawOutput;

  const quoted = formatQuotedPredictAnswer(structure);
  if (predictOutputsMatch(normalizePredictAnswerForMatch(quoted), rawOutput)) {
    return quoted;
  }

  return rawOutput;
}

export function validatePredictStringQuotes(
  userAnswer: string,
  structure: LogToken[][]
): { ok: true } | { ok: false; message: string } {
  if (structure.length === 0) return { ok: true };

  const userLines = parsePredictAnswerTokens(userAnswer);

  for (let lineIdx = 0; lineIdx < structure.length; lineIdx++) {
    const refTokens = structure[lineIdx];
    const userLine =
      userLines[lineIdx]?.join(' ') ??
      (structure.length === 1 ? normalizeOutput(userAnswer) : '');

    if (!userLine) continue;

    const userTokens = parsePredictAnswerLineForStructure(userLine, refTokens);
    if (userTokens.length !== refTokens.length) continue;

    const contentMatches = userTokens.every((token, i) => {
      const content = isQuotedStringToken(token) ? stripQuotes(token) : token.trim();
      return content === refTokens[i].display;
    });
    if (!contentMatches) continue;

    for (let i = 0; i < refTokens.length; i++) {
      if (refTokens[i].kind !== 'string') continue;
      if (!isQuotedStringToken(userTokens[i])) {
        return { ok: false, message: STRING_QUOTES_MESSAGE };
      }
    }
  }

  return { ok: true };
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

export function resolveOutputFlex(
  stepId?: string,
  outputFlex?: LearnOutputFlex
): LearnOutputFlex | undefined {
  if (outputFlex) return outputFlex;
  if (stepId === 'intro-10') return 'name-then-2026';
  if (stepId === 'intro-errors-4') return 'logged-const-name';
  return undefined;
}

function matchesLoggedConstNameChallenge(userCode: string, actual: string): boolean {
  const output = normalizeOutput(actual);
  if (!output || output.includes('\n')) return false;
  const hasConstName = /\bconst\s+name\s*=/.test(userCode);
  const logsName = /console\.log\s*\(\s*name\s*\)/.test(userCode);
  return hasConstName && logsName;
}

function matchesNameThen2026Challenge(actual: string): boolean {
  const lines = normalizeOutput(actual).split('\n');
  return lines.length === 2 && lines[0].trim().length > 0 && lines[1] === '2026';
}

export function outputsMatchFlexible(
  actual: string,
  expected: string,
  options?: {
    stepId?: string;
    outputFlex?: LearnOutputFlex;
    userCode?: string;
  }
): boolean {
  if (outputsMatch(actual, expected)) return true;

  const flex = resolveOutputFlex(options?.stepId, options?.outputFlex);
  if (flex === 'logged-const-name' && options?.userCode) {
    return matchesLoggedConstNameChallenge(options.userCode, actual);
  }
  if (flex === 'name-then-2026') {
    return matchesNameThen2026Challenge(actual);
  }

  return false;
}

export function getCodeChallengeGoalDisplay(
  expectedOutput: string,
  options?: {
    goalType?: LearnGoalType;
    outputFlex?: LearnOutputFlex;
    stepId?: string;
    displayReferenceCode?: string;
  }
): string {
  const flex = resolveOutputFlex(options?.stepId, options?.outputFlex);
  if (options?.goalType === 'error') return expectedOutput;
  if (flex === 'logged-const-name') {
    return 'Your chosen name';
  }
  if (flex === 'name-then-2026') {
    return 'Your name, then 2026';
  }
  return formatQuotedDisplayOutput(options?.displayReferenceCode ?? '', expectedOutput);
}

function flexibleChallengeFailureMessage(
  outputFlex: LearnOutputFlex,
  actualDisplay: string
): string {
  if (outputFlex === 'logged-const-name') {
    if (/error/i.test(actualDisplay)) {
      return 'Your code still throws an error — declare `const name` with a string value, then log `name`.';
    }
    return 'Declare `const name` with your chosen name and log it with `console.log(name)`.';
  }
  return 'Print your name on line 1 and `2026` on line 2.';
}

export function validateCodeChallenge(
  userCode: string,
  expectedOutput: string,
  stepId?: string,
  goalType: LearnGoalType = 'output',
  /** Code that produces the expected output — used to format string values in feedback messages. */
  displayReferenceCode?: string,
  outputFlex?: LearnOutputFlex
): { passed: boolean; actual: string; message: string } {
  const result = runLearnCode(userCode);
  const actual = result.ok ? result.output : result.error ?? result.output;
  const flex = resolveOutputFlex(stepId, outputFlex);
  const expectedDisplay = getCodeChallengeGoalDisplay(expectedOutput, {
    goalType,
    outputFlex: flex,
    stepId,
    displayReferenceCode,
  });
  const actualDisplay = formatQuotedDisplayOutput(userCode, actual);

  if (goalType === 'error') {
    const passed =
      !result.ok &&
      (predictOutputsMatch(actual, expectedOutput) ||
        predictOutputsMatch(result.output, expectedOutput) ||
        outputsMatchFlexible(actual, expectedOutput, { stepId, outputFlex, userCode }));
    return {
      passed,
      actual,
      message: passed
        ? 'Correct — that error is what we expected!'
        : result.ok
          ? `This ran without error — expected ${expectedDisplay}.`
          : `Wrong error — expected ${expectedDisplay}, got ${actualDisplay}`,
    };
  }

  const passed =
    result.ok &&
    outputsMatchFlexible(result.output, expectedOutput, {
      stepId,
      outputFlex,
      userCode,
    });
  return {
    passed,
    actual: result.ok ? result.output : actual,
    message: passed
      ? 'Correct!'
      : flex
        ? flexibleChallengeFailureMessage(flex, actualDisplay)
        : `Not quite — expected ${expectedDisplay}, got ${actualDisplay}`,
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
): {
  passed: boolean;
  message: string;
  reference: string;
  needsStringQuotes?: boolean;
} {
  const executed = sourceCode ? runLearnCode(sourceCode) : null;
  const reference = executed
    ? executed.ok
      ? executed.output
      : executed.error ?? executed.output
    : getPredictRuntimeReference(sourceCode ?? '', expectedOutput);

  const matchOpts: MatchOptions = { acceptErrorShorthand, stepId };
  const normalizedUser = normalizePredictAnswerForMatch(userAnswer);
  const refIsError = isErrorLabel(reference) || isErrorLabel(expectedOutput);

  const wouldPass =
    predictOutputsMatch(normalizedUser, reference, matchOpts) ||
    predictOutputsMatch(normalizedUser, expectedOutput, matchOpts) ||
    outputsMatchFlexible(normalizedUser, expectedOutput, { stepId });

  if (
    wouldPass &&
    sourceCode &&
    executed?.ok &&
    !refIsError &&
    !(acceptErrorShorthand && normalizeOutput(userAnswer).toLowerCase() === 'error')
  ) {
    const structure = getPredictOutputStructure(sourceCode);
    const quoteCheck = validatePredictStringQuotes(userAnswer, structure);
    if (!quoteCheck.ok) {
      return {
        passed: false,
        message: quoteCheck.message,
        reference,
        needsStringQuotes: true,
      };
    }
  }

  return {
    passed: wouldPass,
    reference,
    message: wouldPass ? 'Correct!' : 'Not quite — try again or use a hint.',
  };
}

export function isErrorExpectedOutput(value: string): boolean {
  return isErrorLabel(value);
}
