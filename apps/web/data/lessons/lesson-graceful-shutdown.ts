import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonGracefulShutdown: Lesson = {
  id: 'lesson-graceful-shutdown',
  title: 'Graceful Shutdown — Closing Cleanly',
  category: 'be',
  difficulty: 'advanced',
  relatedChallengeIds: ["be-19-graceful-shutdown"],
  estimatedMinutes: 9,
  concepts: ["SIGTERM","drain connections"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Graceful Shutdown** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** SIGTERM, drain connections
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function registerShutdown(handlers) {
  let called = false;
  return { shutdown() { if (called) return; called = true; handlers.forEach((h) => h()); } };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **SIGTERM**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-graceful-shutdown',
    prompt: `Run all handlers once on first shutdown() call.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function registerShutdown(handlers) {
  let called = false;
  return { shutdown() {} };
}`,
      typescript: `function registerShutdown(handlers: Array<() => void>) {
  let called = false;
  return { shutdown() {} };
}`,
    },
    solution: {
      javascript: `function registerShutdown(handlers) {
  let called = false;
  return { shutdown() { if (called) return; called = true; handlers.forEach((h) => h()); } };
}`,
      typescript: `function registerShutdown(handlers: Array<() => void>) {
  let called = false;
  return { shutdown() { if (called) return; called = true; handlers.forEach((h) => h()); } };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'registerShutdown');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('registerShutdown', 'return Boolean((() => { let n = 0; const s = registerShutdown([() => n++, () => n++]); s.shutdown(); s.shutdown(); return n === 2; })())');
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
    { label: 'Process signals — Node.js', url: 'https://nodejs.org/api/process.html#signal-events' }
  ],
};
