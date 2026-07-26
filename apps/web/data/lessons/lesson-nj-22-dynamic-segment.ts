import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNj22DynamicSegment: Lesson = {
  id: 'lesson-nj-22-dynamic-segment',
  title: 'Is Dynamic Segment',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'easy',
  relatedChallengeIds: ['nj-22-dynamic-segment'],
  estimatedMinutes: 10,
  concepts: ["routing","dynamic routes"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Is Dynamic Segment** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** routing, dynamic routes
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function isDynamicSegment(segment) {
  return segment.startsWith('[') && segment.endsWith(']');
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **routing**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-22-dynamic-segment',
    prompt: `Implement \`isDynamicSegment(segment)\` — return true for Next.js dynamic route segments like \`[id]\`.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function isDynamicSegment(segment) {
  // Implement this function
  
}`,
      typescript: `function isDynamicSegment(segment: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function isDynamicSegment(segment) {
  return segment.startsWith('[') && segment.endsWith(']');
}`,
      typescript: `function isDynamicSegment(segment: string) {
  return segment.startsWith('[') && segment.endsWith(']');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'isDynamicSegment');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('isDynamicSegment', `return Boolean(isDynamicSegment("[slug]") === true);`);
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
    { label: 'Is Dynamic Segment', url: 'https://developer.mozilla.org/' }
  ],
};
