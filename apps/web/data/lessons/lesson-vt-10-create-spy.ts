import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt10CreateSpy: Lesson = {
  id: 'lesson-vt-10-create-spy',
  title: 'Create Spy',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'easy',
  relatedChallengeIds: ['vt-10-create-spy'],
  estimatedMinutes: 10,
  concepts: ["spies"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Create Spy** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** spies
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createSpy(fn) {
  const calls = [];
    return (...args) => { calls.push(args); return fn(...args); };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **spies**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-10-create-spy',
    prompt: `Implement \`createSpy\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function createSpy(fn) {
  // Implement this function
  
}`,
      typescript: `function createSpy(fn) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createSpy(fn) {
  const calls = [];
    return (...args) => { calls.push(args); return fn(...args); };
}`,
      typescript: `function createSpy(fn) {
  const calls = [];
    return (...args) => { calls.push(args); return fn(...args); };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createSpy');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createSpy', 'return Boolean(createSpy((a,b)=>a+b)(2,3) === 5)');
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
    { label: 'Create Spy', url: 'https://developer.mozilla.org/' }
  ],
};
