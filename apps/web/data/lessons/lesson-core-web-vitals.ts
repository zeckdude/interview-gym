import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCoreWebVitals: Lesson = {
  id: 'lesson-core-web-vitals',
  title: 'Core Web Vitals and Performance',
  category: 'fe-advanced',
  difficulty: 'intermediate',
  relatedChallengeIds: ["fea-17-code-splitting","fea-20"],
  estimatedMinutes: 11,
  concepts: ["LCP","CLS"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Core Web Vitals and Performance** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** LCP, CLS
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function clsScore(shifts) {
  return shifts.reduce((a, b) => a + b, 0);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **LCP**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-core-web-vitals',
    prompt: `Calculate total CLS score by summing layout shift values.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function clsScore(shifts) {
  
}`,
      typescript: `function clsScore(shifts: number[]): number {
  
}`,
    },
    solution: {
      javascript: `function clsScore(shifts) {
  return shifts.reduce((a, b) => a + b, 0);
}`,
      typescript: `function clsScore(shifts: number[]): number {
  return shifts.reduce((a, b) => a + b, 0);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'clsScore');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('clsScore', 'return Boolean(clsScore([0.1, 0.05, 0.02]) === 0.17)');
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
    { label: 'Web Vitals', url: 'https://web.dev/vitals/' }
  ],
};
