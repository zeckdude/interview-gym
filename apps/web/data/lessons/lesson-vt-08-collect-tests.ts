import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt08CollectTests: Lesson = {
  id: 'lesson-vt-08-collect-tests',
  title: 'Collect Test Results',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'easy',
  relatedChallengeIds: ['vt-08-collect-tests'],
  estimatedMinutes: 10,
  concepts: ["test runners"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Collect Test Results** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** test runners
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function collectTests(results) {
  return results.every((r) => r.passed);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **test runners**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-08-collect-tests',
    prompt: `Implement \`collectTests\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function collectTests(results) {
  // Implement this function
  
}`,
      typescript: `function collectTests(results: Array<{ passed: boolean }>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function collectTests(results) {
  return results.every((r) => r.passed);
}`,
      typescript: `function collectTests(results: Array<{ passed: boolean }>) {
  return results.every((r) => r.passed);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'collectTests');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('collectTests', 'return Boolean(collectTests([{"passed":true},{"passed":true}]) === true)');
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
    { label: 'Collect Test Results', url: 'https://developer.mozilla.org/' }
  ],
};
