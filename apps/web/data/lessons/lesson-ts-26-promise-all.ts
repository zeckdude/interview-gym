import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs26PromiseAll: Lesson = {
  id: 'lesson-ts-26-promise-all',
  title: 'Implement promiseAll',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'advanced',
  relatedChallengeIds: ['ts-26-promise-all'],
  estimatedMinutes: 10,
  concepts: ["Promises","async"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Implement promiseAll** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** Promises, async
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function promiseAll(promises) {
  return Promise.all(promises);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **Promises**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-26-promise-all',
    prompt: `Implement \`promiseAll\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function promiseAll(promises) {
  // Implement this function
  
}`,
      typescript: `function promiseAll(promises: Array<Promise<number> | number>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function promiseAll(promises) {
  return Promise.all(promises);
}`,
      typescript: `function promiseAll(promises: Array<Promise<number> | number>) {
  return Promise.all(promises);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'promiseAll');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('promiseAll', 'return Boolean(JSON.stringify(await promiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])) === JSON.stringify([1, 2, 3]))');
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
    { label: 'Implement promiseAll', url: 'https://developer.mozilla.org/' }
  ],
};
