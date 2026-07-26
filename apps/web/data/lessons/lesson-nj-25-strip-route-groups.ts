import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNj25StripRouteGroups: Lesson = {
  id: 'lesson-nj-25-strip-route-groups',
  title: 'Strip Route Groups',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'easy',
  relatedChallengeIds: ['nj-25-strip-route-groups'],
  estimatedMinutes: 10,
  concepts: ["routing","route groups","App Router"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Strip Route Groups** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** routing, route groups, App Router
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function stripRouteGroups(segments) {
  return segments
      .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')))
      .join('/');
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
    id: 'mini-nj-25-strip-route-groups',
    prompt: `Implement \`stripRouteGroups(segments)\` — remove \`(group)\` segments from a path segment array.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function stripRouteGroups(segments) {
  // Implement this function
  
}`,
      typescript: `function stripRouteGroups(segments: string[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function stripRouteGroups(segments) {
  return segments
      .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')))
      .join('/');
}`,
      typescript: `function stripRouteGroups(segments: string[]) {
  return segments
      .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')))
      .join('/');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'stripRouteGroups');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('stripRouteGroups', `return Boolean(stripRouteGroups(["(marketing)","pricing"]) === "pricing");`);
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
    { label: 'Strip Route Groups', url: 'https://developer.mozilla.org/' }
  ],
};
