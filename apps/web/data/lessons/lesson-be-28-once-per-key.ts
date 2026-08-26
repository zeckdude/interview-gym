import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonBe28OncePerKey: Lesson = {
  id: 'lesson-be-28-once-per-key',
  title: 'Idempotent oncePerKey',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'advanced',
  relatedChallengeIds: ['be-28-once-per-key'],
  estimatedMinutes: 10,
  concepts: ["idempotency","deduplication","closures"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Idempotent oncePerKey** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** idempotency, deduplication, closures
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function oncePerKey() {
  const seen = new Set();
    return (key, fn) => {
      if (seen.has(key)) return false;
      seen.add(key);
      fn();
      return true;
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **idempotency**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-be-28-once-per-key',
    prompt: `Implement \`oncePerKey()\` — return a function that runs a callback at most once per string key.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function oncePerKey() {
  // Implement this function
  
}`,
      typescript: `function oncePerKey() {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function oncePerKey() {
  const seen = new Set();
    return (key, fn) => {
      if (seen.has(key)) return false;
      seen.add(key);
      fn();
      return true;
    };
}`,
      typescript: `function oncePerKey() {
  const seen = new Set();
    return (key, fn) => {
      if (seen.has(key)) return false;
      seen.add(key);
      fn();
      return true;
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'oncePerKey');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('oncePerKey', `return Boolean((function () {
                  const run = oncePerKey();
                  let count = 0;
                  run('a', () => { count += 1; });
                  run('a', () => { count += 1; });
                  run('b', () => { count += 1; });
                  return count === 2;
                })());`);
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
    { label: 'Idempotent oncePerKey', url: 'https://developer.mozilla.org/' }
  ],
};
