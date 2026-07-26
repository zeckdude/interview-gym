import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss22ParseTranslate: Lesson = {
  id: 'lesson-css-22-parse-translate',
  title: 'Parse translateX Value',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'advanced',
  relatedChallengeIds: ['css-22-parse-translate'],
  estimatedMinutes: 10,
  concepts: ["transforms"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Parse translateX Value** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** transforms
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function parseTranslateX(transform) {
  const match = transform.match(/translateX\\(([-\\d.]+)px\\)/);
    return match ? Number(match[1]) : 0;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **transforms**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-22-parse-translate',
    prompt: `Implement \`parseTranslateX\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function parseTranslateX(transform) {
  // Implement this function
  
}`,
      typescript: `function parseTranslateX(transform: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function parseTranslateX(transform) {
  const match = transform.match(/translateX\\(([-\\d.]+)px\\)/);
    return match ? Number(match[1]) : 0;
}`,
      typescript: `function parseTranslateX(transform: string) {
  const match = transform.match(/translateX\\(([-\\d.]+)px\\)/);
    return match ? Number(match[1]) : 0;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'parseTranslateX');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('parseTranslateX', 'return Boolean(parseTranslateX("translateX(12px) rotate(5deg)") === 12)');
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
    { label: 'Parse translateX Value', url: 'https://developer.mozilla.org/' }
  ],
};
