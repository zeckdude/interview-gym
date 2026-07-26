import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs13PipeValue: Lesson = {
  id: 'lesson-ts-13-pipe-value',
  title: 'Pipe Value Through Functions',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ts-13-pipe-value'],
  estimatedMinutes: 10,
  concepts: ["composition","pipeline"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Pipe Value Through Functions** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** composition, pipeline
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function pipe(value, fns) {
  return fns.reduce((acc, fn) => fn(acc), value);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **composition**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-13-pipe-value',
    prompt: `Implement \`pipe\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function pipe(value, fns) {
  // Implement this function
  
}`,
      typescript: `function pipe(value: number, fns: Array<(n: number) => number>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function pipe(value, fns) {
  return fns.reduce((acc, fn) => fn(acc), value);
}`,
      typescript: `function pipe(value: number, fns: Array<(n: number) => number>) {
  return fns.reduce((acc, fn) => fn(acc), value);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'pipe');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('pipe', 'return Boolean(pipe(3, [(x) => x + 1, (x) => x * 2]) === 8)');
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
    { label: 'Pipe Value Through Functions', url: 'https://developer.mozilla.org/' }
  ],
};
