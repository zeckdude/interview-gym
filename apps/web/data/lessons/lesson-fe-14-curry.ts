import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe14Curry: Lesson = {
  id: 'lesson-fe-14-curry',
  title: 'Curry a Function',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'intermediate',
  sequenceOrder: 21,
  relatedChallengeIds: ['fe-14-curry'],
  estimatedMinutes: 14,
  concepts: ['currying', 'closures', 'partial application'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Currying** transforms \`f(a, b, c)\` into \`f(a)(b)(c)\`. It's a functional programming staple — used in event handlers, config builders, and library APIs. Interviewers test closures and arity tracking.
      `,
    },
    {
      type: 'explanation',
      title: 'How Currying Works',
      content: `
Track how many arguments the original function expects (\`fn.length\`). Return a function that:

- If enough args collected → call \`fn\` with all args
- Otherwise → return another function waiting for more args
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function curry(fn) {
  const arity = fn.length;
  function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...more) => curried(...args, ...more);
  }
  return curried;
}`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
curriedAdd(1)(2)(3);  // 6
curriedAdd(1, 2)(3);  // 6 — args can batch`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**\`fn.length\` ignores rest parameters and defaults** — mention this limitation. For production, libraries use explicit arity metadata.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Curry',
      content: `
**Simple two-argument functions** — \`(a, b) => a + b\` is clearer than currying. Use when partial application genuinely helps API design.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-14-curry',
    prompt: `Implement \`curry(fn)\` — return a curried version that collects arguments until arity is met.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function curry(fn) {
  // Implement this function
  
}`,
      typescript: `function curry(fn: (...args: unknown[]) => unknown) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function curry(fn) {
  const arity = fn.length;
  function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...more) => curried(...args, ...more);
  }
  return curried;
}`,
      typescript: `function curry(fn: (...args: unknown[]) => unknown) {
  const arity = fn.length;
  function curried(...args: unknown[]) {
    if (args.length >= arity) return fn(...args);
    return (...more: unknown[]) => curried(...args, ...more);
  }
  return curried;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'curry');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('curry', `return Boolean((function () {
          const add = (a, b) => a + b;
          const c = curry(add);
          return c(1)(2) === 3 && c(3, 4) === 7;
        })());`);
        return testRunner(result.value)
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check arity and argument collection.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Function.length — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
