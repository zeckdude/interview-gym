import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss27KeyframeLerp: Lesson = {
  id: 'lesson-css-27-keyframe-lerp',
  title: 'Interpolate Keyframe Value',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'advanced',
  relatedChallengeIds: ['css-27-keyframe-lerp'],
  estimatedMinutes: 10,
  concepts: ["animation"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Interpolate Keyframe Value** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** animation
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function lerp(start, end, t) {
  return start + (end - start) * t;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **animation**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-27-keyframe-lerp',
    prompt: `Implement \`lerp\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function lerp(start, end, t) {
  // Implement this function
  
}`,
      typescript: `function lerp(start: number, end: number, t: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function lerp(start, end, t) {
  return start + (end - start) * t;
}`,
      typescript: `function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'lerp');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('lerp', 'return Boolean(lerp(0, 100, 0.5) === 50)');
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
    { label: 'Interpolate Keyframe Value', url: 'https://developer.mozilla.org/' }
  ],
};
