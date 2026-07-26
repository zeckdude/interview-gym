import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonIntersectionObserver: Lesson = {
  id: 'lesson-intersection-observer',
  title: 'Intersection Observer — Scroll-Based UI',
  category: 'fe',
  topLevel: 'fe',
  subcategory: null,
  difficulty: 'intermediate',
  relatedChallengeIds: ["fe-09-infinite-scroll","fe-02-event-delegation"],
  estimatedMinutes: 10,
  concepts: ["IntersectionObserver","lazy loading"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Intersection Observer** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** IntersectionObserver, lazy loading
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function isInViewport(elTop, elBottom, viewTop, viewBottom) {
  return elBottom > viewTop && elTop < viewBottom;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **IntersectionObserver**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-intersection-observer',
    prompt: `Implement viewport overlap check.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function isInViewport(elTop, elBottom, viewTop, viewBottom) {
  
}`,
      typescript: `function isInViewport(elTop: number, elBottom: number, viewTop: number, viewBottom: number): boolean {
  
}`,
    },
    solution: {
      javascript: `function isInViewport(elTop, elBottom, viewTop, viewBottom) {
  return elBottom > viewTop && elTop < viewBottom;
}`,
      typescript: `function isInViewport(elTop: number, elBottom: number, viewTop: number, viewBottom: number): boolean {
  return elBottom > viewTop && elTop < viewBottom;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'isInViewport');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('isInViewport', 'return Boolean(isInViewport(100, 200, 0, 150) && !isInViewport(200, 300, 0, 150))');
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
    { label: 'Intersection Observer — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API' }
  ],
};
