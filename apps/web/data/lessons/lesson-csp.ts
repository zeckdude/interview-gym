import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCsp: Lesson = {
  id: 'lesson-csp',
  title: 'Content Security Policy',
  category: 'fe-advanced',
  difficulty: 'advanced',
  relatedChallengeIds: ["fea-16-ssr-hydration"],
  estimatedMinutes: 10,
  concepts: ["CSP","XSS prevention"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Content Security Policy** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** CSP, XSS prevention
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function buildCspHeader(directives) {
  return Object.entries(directives).map(([k, v]) => k + ' ' + v.join(' ')).join('; ');
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **CSP**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-csp',
    prompt: `Build a CSP header string from a directives object.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function buildCspHeader(directives) {
  
}`,
      typescript: `function buildCspHeader(directives: Record<string, string[]>): string {
  
}`,
    },
    solution: {
      javascript: `function buildCspHeader(directives) {
  return Object.entries(directives).map(([k, v]) => k + ' ' + v.join(' ')).join('; ');
}`,
      typescript: `function buildCspHeader(directives: Record<string, string[]>): string {
  return Object.entries(directives).map(([k, v]) => k + ' ' + v.join(' ')).join('; ');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'buildCspHeader');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('buildCspHeader', 'return Boolean(buildCspHeader({ \'script-src\': ["\'self\'"] }).includes("script-src \'self\'"))');
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
    { label: 'CSP — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP' }
  ],
};
