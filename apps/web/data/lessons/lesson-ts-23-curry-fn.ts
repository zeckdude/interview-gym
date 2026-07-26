import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs23CurryFn: Lesson = {
  id: 'lesson-ts-23-curry-fn',
  title: 'Curry a Function',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'advanced',
  relatedChallengeIds: ['ts-23-curry-fn'],
  estimatedMinutes: 10,
  concepts: ["currying","closures"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Curry a Function** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** currying, closures
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function curry(fn) {
  return function curried(...args) {
      if (args.length >= fn.length) return fn(...args);
      return (...next) => curried(...args, ...next);
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **currying**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-23-curry-fn',
    prompt: `Implement \`curry\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function curry(fn) {
  // Implement this function
  
}`,
      typescript: `function curry(fn: (...args: number[]) => number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function curry(fn) {
  return function curried(...args) {
      if (args.length >= fn.length) return fn(...args);
      return (...next) => curried(...args, ...next);
    };
}`,
      typescript: `function curry(fn: (...args: number[]) => number) {
  return function curried(...args) {
      if (args.length >= fn.length) return fn(...args);
      return (...next) => curried(...args, ...next);
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'curry');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('curry', 'return Boolean(curry((a, b, c) => a + b + c)(1)(2)(3) === 6)');
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
    { label: 'Curry a Function', url: 'https://developer.mozilla.org/' }
  ],
};
