import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt24RunAsyncTests: Lesson = {
  id: 'lesson-vt-24-run-async-tests',
  title: 'Run Async Tests',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'advanced',
  relatedChallengeIds: ['vt-24-run-async-tests'],
  estimatedMinutes: 10,
  concepts: ["async runners"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Run Async Tests** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** async runners
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function runAsyncTests(tests) {
  for (const test of tests) {
      const ok = await test();
      if (!ok) return false;
    }
    return true;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **async runners**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-24-run-async-tests',
    prompt: `Implement \`runAsyncTests\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function runAsyncTests(tests) {
  // Implement this function
  
}`,
      typescript: `function runAsyncTests(tests: Array<() => Promise<boolean>>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function runAsyncTests(tests) {
  for (const test of tests) {
      const ok = await test();
      if (!ok) return false;
    }
    return true;
}`,
      typescript: `function runAsyncTests(tests: Array<() => Promise<boolean>>) {
  for (const test of tests) {
      const ok = await test();
      if (!ok) return false;
    }
    return true;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'runAsyncTests');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('runAsyncTests', 'return Boolean(await runAsyncTests([async () => true, async () => true]))');
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
    { label: 'Run Async Tests', url: 'https://developer.mozilla.org/' }
  ],
};
