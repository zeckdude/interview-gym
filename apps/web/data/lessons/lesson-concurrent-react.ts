import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonConcurrentReact: Lesson = {
  id: 'lesson-concurrent-react',
  title: 'React 18 Concurrent Features',
  category: 'fe-advanced',
  difficulty: 'intermediate',
  relatedChallengeIds: ["fea-04-use-reducer","fea-05-memo-optimization","fea-06-suspense-boundary"],
  estimatedMinutes: 12,
  concepts: ["concurrent rendering","Suspense"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**React 18 Concurrent Features** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** concurrent rendering, Suspense
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function schedulePriority(urgent, deferred) {
  urgent();
  deferred();
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **concurrent rendering**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-concurrent-react',
    prompt: `Run urgent() before deferred().`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function schedulePriority(urgent, deferred) {
  urgent();
  deferred();
}`,
      typescript: `function schedulePriority(urgent: () => void, deferred: () => void): void {
  urgent();
  deferred();
}`,
    },
    solution: {
      javascript: `function schedulePriority(urgent, deferred) {
  urgent();
  deferred();
}`,
      typescript: `function schedulePriority(urgent: () => void, deferred: () => void): void {
  urgent();
  deferred();
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'schedulePriority');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('schedulePriority', 'return Boolean((() => { let order = []; schedulePriority(() => order.push(\'u\'), () => order.push(\'d\')); return order[0] === \'u\' && order[1] === \'d\'; })())');
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
    { label: 'Concurrent React', url: 'https://react.dev/blog/2022/03/29/react-v18' }
  ],
};
