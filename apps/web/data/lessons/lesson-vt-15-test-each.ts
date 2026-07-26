import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt15TestEach: Lesson = {
  id: 'lesson-vt-15-test-each',
  title: 'Run Test Cases',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'intermediate',
  relatedChallengeIds: ['vt-15-test-each'],
  estimatedMinutes: 10,
  concepts: ["parameterized tests"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Run Test Cases** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** parameterized tests
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function runTestCases(cases, fn) {
  return cases.every((c) => fn(c.input) === c.expected);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **parameterized tests**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-15-test-each',
    prompt: `Implement \`runTestCases\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function runTestCases(cases, fn) {
  // Implement this function
  
}`,
      typescript: `function runTestCases(cases: Array<{ input: number; expected: number }>, fn: (n: number) => number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function runTestCases(cases, fn) {
  return cases.every((c) => fn(c.input) === c.expected);
}`,
      typescript: `function runTestCases(cases: Array<{ input: number; expected: number }>, fn: (n: number) => number) {
  return cases.every((c) => fn(c.input) === c.expected);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'runTestCases');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('runTestCases', 'return Boolean(runTestCases([{ input: 2, expected: 4 }, { input: 3, expected: 9 }], (n) => n * n) === true)');
        const ok = testRunner(result.value);
        return ok
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check the requirements and try again.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Run Test Cases', url: 'https://developer.mozilla.org/' }
  ],
};
