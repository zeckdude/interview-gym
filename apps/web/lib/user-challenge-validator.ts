import type { ChallengeLanguage, ValidationResult } from '@/data/types';
import { executeUserCode } from '@/lib/execute-code';
import { errorResult } from '@/data/challenges/_utils';

function getExportedFunctions(exports: Record<string, unknown>): string[] {
  return Object.keys(exports).filter((key) => typeof exports[key] === 'function');
}

async function callFn(fn: unknown): Promise<unknown> {
  if (typeof fn !== 'function') return fn;
  const result = (fn as () => unknown)();
  return result instanceof Promise ? await result : result;
}

function serialize(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * Best-effort validator for AI-generated challenges.
 * Runs user code and compares exported function outputs against the AI solution.
 */
export async function validateUserChallenge(
  userCode: string,
  solutionCode: string,
  _language: ChallengeLanguage
): Promise<ValidationResult> {
  const requireFn = () => ({});

  let solutionExports: Record<string, unknown>;
  let userExports: Record<string, unknown>;

  try {
    solutionExports = executeUserCode(solutionCode, requireFn);
  } catch (e) {
    return {
      passed: false,
      results: [
        {
          description: 'Solution code error (internal)',
          expected: 'Valid solution',
          actual: String(e),
          passed: false,
        },
      ],
    };
  }

  try {
    userExports = executeUserCode(userCode, requireFn);
  } catch (e) {
    return errorResult(e);
  }

  const fnNames = getExportedFunctions(solutionExports);

  if (fnNames.length === 0) {
    const solutionStr = serialize(solutionExports);
    const userStr = serialize(userExports);
    return {
      passed: solutionStr === userStr,
      results: [
        {
          description: 'Module exports match solution',
          expected: solutionStr.slice(0, 200),
          actual: userStr.slice(0, 200),
          passed: solutionStr === userStr,
        },
      ],
    };
  }

  const results = [];
  let allPassed = true;

  for (const name of fnNames) {
    if (typeof userExports[name] !== 'function') {
      allPassed = false;
      results.push({
        description: `Export "${name}" is a function`,
        expected: 'function',
        actual: typeof userExports[name] === 'undefined' ? 'undefined' : typeof userExports[name],
        passed: false,
      });
      continue;
    }

    try {
      const expected = await callFn(solutionExports[name]);
      const actual = await callFn(userExports[name]);
      const passed = serialize(expected) === serialize(actual);
      if (!passed) allPassed = false;
      results.push({
        description: `${name}() output matches solution`,
        expected: serialize(expected).slice(0, 200),
        actual: serialize(actual).slice(0, 200),
        passed,
      });
    } catch (e) {
      allPassed = false;
      results.push({
        description: `${name}() runs without error`,
        expected: 'No error',
        actual: String(e),
        passed: false,
      });
    }
  }

  return { passed: allPassed, results };
}
