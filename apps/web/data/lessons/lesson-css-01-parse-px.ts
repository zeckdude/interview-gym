import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss01ParsePx: Lesson = {
  id: 'lesson-css-01-parse-px',
  title: 'Parse Pixel Length',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'easy',
  relatedChallengeIds: ['css-01-parse-px'],
  estimatedMinutes: 10,
  concepts: ["CSS units","parsing"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Parse Pixel Length** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** CSS units, parsing
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function parsePx(value) {
  const match = String(value).trim().match(/^(\\d+(?:\\.\\d+)?)px\$/);
    return match ? Number(match[1]) : null;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **CSS units**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-01-parse-px',
    prompt: `Implement \`parsePx\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function parsePx(value) {
  // Implement this function
  
}`,
      typescript: `function parsePx(value: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function parsePx(value) {
  const match = String(value).trim().match(/^(\\d+(?:\\.\\d+)?)px\$/);
    return match ? Number(match[1]) : null;
}`,
      typescript: `function parsePx(value: string) {
  const match = String(value).trim().match(/^(\\d+(?:\\.\\d+)?)px\$/);
    return match ? Number(match[1]) : null;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'parsePx');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('parsePx', 'return Boolean(parsePx("16px") === 16)');
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
    { label: 'Parse Pixel Length', url: 'https://developer.mozilla.org/' }
  ],
};
