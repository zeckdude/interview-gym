import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt30CoveragePercent: Lesson = {
  id: 'lesson-vt-30-coverage-percent',
  title: 'Coverage Percentage',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'advanced',
  relatedChallengeIds: ['vt-30-coverage-percent'],
  estimatedMinutes: 10,
  concepts: ["coverage"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Coverage Percentage** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** coverage
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function coveragePercent(covered, total) {
  if (total === 0) return 0;
    return Math.round((covered / total) * 100);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **coverage**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-30-coverage-percent',
    prompt: `Implement \`coveragePercent\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function coveragePercent(covered, total) {
  // Implement this function
  
}`,
      typescript: `function coveragePercent(covered: number, total: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function coveragePercent(covered, total) {
  if (total === 0) return 0;
    return Math.round((covered / total) * 100);
}`,
      typescript: `function coveragePercent(covered: number, total: number) {
  if (total === 0) return 0;
    return Math.round((covered / total) * 100);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'coveragePercent');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('coveragePercent', 'return Boolean(coveragePercent(8, 10) === 80)');
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
    { label: 'Coverage Percentage', url: 'https://developer.mozilla.org/' }
  ],
};
