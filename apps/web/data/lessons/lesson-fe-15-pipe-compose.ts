import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe15PipeCompose: Lesson = {
  id: 'lesson-fe-15-pipe-compose',
  title: 'Pipe & Compose',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'intermediate',
  sequenceOrder: 22,
  relatedChallengeIds: ['fe-15-pipe-compose'],
  estimatedMinutes: 13,
  concepts: ['pipe', 'compose', 'reduce', 'function composition'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Data pipelines transform values through steps: parse → validate → format. **pipe** (left-to-right) and **compose** (right-to-left) are how functional libraries chain transformations without nested calls.
      `,
    },
    {
      type: 'explanation',
      title: 'How Pipe & Compose Work',
      content: `
- **pipe(f, g, h)(x)** → \`h(g(f(x)))\` — read left to right
- **compose(f, g, h)(x)** → \`f(g(h(x)))\` — apply right to left

Implement with \`reduce\` and \`reduceRight\`.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}

function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `const double = (x) => x * 2;
const addOne = (x) => x + 1;
pipe(double, addOne)(3);    // 7
compose(addOne, double)(3); // 7`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**Mixing up pipe vs compose direction** — pipe is L→R (like Unix pipes), compose is R→L (math notation).
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Pipe',
      content: `
**Long imperative sequences with side effects** — pipe works best on pure transforms. Mixed async steps need different patterns.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-15-pipe-compose',
    prompt: `Implement \`pipe(...fns)\` — apply functions left-to-right, returning a new function.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function pipe(...fns) {
  // Implement this function
  
}`,
      typescript: `function pipe(...fns: Array<(x: unknown) => unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}`,
      typescript: `function pipe(...fns: Array<(x: unknown) => unknown>) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'pipe');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('pipe', `return Boolean((function () {
          const double = (x) => x * 2;
          const addOne = (x) => x + 1;
          return pipe(double, addOne)(3) === 7;
        })());`);
        return testRunner(result.value)
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — pipe should apply left-to-right.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Array.prototype.reduce — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
