import type { MiniChallengeResult } from './types';

export function runUserCode<T>(
  userCode: string,
  exportName: string
): { passed: false; feedback: string } | { passed: true; value: T } {
  try {
    const fn = new Function(`${userCode}\nreturn ${exportName};`);
    return { passed: true, value: fn() as T };
  } catch (e) {
    return {
      passed: false,
      feedback: `Your code threw an error: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

export function testCases(
  tests: Array<{ actual: unknown; expected: unknown; label?: string }>
): MiniChallengeResult {
  for (const test of tests) {
    if (test.actual !== test.expected) {
      const label = test.label ?? 'Test';
      return {
        passed: false,
        feedback: `${label} failed — expected ${JSON.stringify(test.expected)}, got ${JSON.stringify(test.actual)}`,
      };
    }
  }
  return { passed: true, feedback: 'Perfect! All tests passed. ✓' };
}
