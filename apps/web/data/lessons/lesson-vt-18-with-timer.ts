import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt18WithTimer: Lesson = {
  id: 'lesson-vt-18-with-timer',
  title: 'Run With Fake Timestamp',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'intermediate',
  relatedChallengeIds: ['vt-18-with-timer'],
  estimatedMinutes: 10,
  concepts: ["timers"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Run With Fake Timestamp** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** timers
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function withFakeNow(ts, fn) {
  const real = Date.now;
    Date.now = () => ts;
    try {
      return fn();
    } finally {
      Date.now = real;
    }
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **timers**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-18-with-timer',
    prompt: `Implement \`withFakeNow\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function withFakeNow(ts, fn) {
  // Implement this function
  
}`,
      typescript: `function withFakeNow(ts: number, fn: () => number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function withFakeNow(ts, fn) {
  const real = Date.now;
    Date.now = () => ts;
    try {
      return fn();
    } finally {
      Date.now = real;
    }
}`,
      typescript: `function withFakeNow(ts: number, fn: () => number) {
  const real = Date.now;
    Date.now = () => ts;
    try {
      return fn();
    } finally {
      Date.now = real;
    }
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'withFakeNow');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('withFakeNow', 'return Boolean(withFakeNow(1000, () => Date.now()) === 1000)');
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
    { label: 'Run With Fake Timestamp', url: 'https://developer.mozilla.org/' }
  ],
};
