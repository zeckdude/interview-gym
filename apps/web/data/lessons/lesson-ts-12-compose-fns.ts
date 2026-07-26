import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs12ComposeFns: Lesson = {
  id: 'lesson-ts-12-compose-fns',
  title: 'Compose Functions',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ts-12-compose-fns'],
  estimatedMinutes: 10,
  concepts: ["higher-order functions","composition"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Compose Functions** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** higher-order functions, composition
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function compose(...fns) {
  return (value) => fns.reduceRight((acc, fn) => fn(acc), value);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **higher-order functions**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-12-compose-fns',
    prompt: `Implement \`compose\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function compose(...fns) {
  // Implement this function
  
}`,
      typescript: `function compose(...fns: Array<(arg: number) => number>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function compose(...fns) {
  return (value) => fns.reduceRight((acc, fn) => fn(acc), value);
}`,
      typescript: `function compose(...fns: Array<(arg: number) => number>) {
  return (value) => fns.reduceRight((acc, fn) => fn(acc), value);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'compose');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('compose', 'return Boolean(compose((x) => x + 1, (x) => x * 2)(3) === 7)');
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
    { label: 'Compose Functions', url: 'https://developer.mozilla.org/' }
  ],
};
