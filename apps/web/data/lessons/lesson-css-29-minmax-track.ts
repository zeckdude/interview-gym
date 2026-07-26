import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss29MinmaxTrack: Lesson = {
  id: 'lesson-css-29-minmax-track',
  title: 'Parse minmax Track',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'advanced',
  relatedChallengeIds: ['css-29-minmax-track'],
  estimatedMinutes: 10,
  concepts: ["grid"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Parse minmax Track** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** grid
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function parseMinmax(value) {
  const match = value.match(/minmax\\(([^,]+),\\s*([^)]+)\\)/);
    if (!match) return null;
    return { min: match[1].trim(), max: match[2].trim() };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **grid**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-29-minmax-track',
    prompt: `Implement \`parseMinmax\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function parseMinmax(value) {
  // Implement this function
  
}`,
      typescript: `function parseMinmax(value: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function parseMinmax(value) {
  const match = value.match(/minmax\\(([^,]+),\\s*([^)]+)\\)/);
    if (!match) return null;
    return { min: match[1].trim(), max: match[2].trim() };
}`,
      typescript: `function parseMinmax(value: string) {
  const match = value.match(/minmax\\(([^,]+),\\s*([^)]+)\\)/);
    if (!match) return null;
    return { min: match[1].trim(), max: match[2].trim() };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'parseMinmax');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('parseMinmax', 'return Boolean(JSON.stringify(parseMinmax("minmax(200px, 1fr)")) === JSON.stringify({"min":"200px","max":"1fr"}))');
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
    { label: 'Parse minmax Track', url: 'https://developer.mozilla.org/' }
  ],
};
