import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss17BreakpointFor: Lesson = {
  id: 'lesson-css-17-breakpoint-for',
  title: 'Breakpoint Name For Width',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'intermediate',
  relatedChallengeIds: ['css-17-breakpoint-for'],
  estimatedMinutes: 10,
  concepts: ["responsive"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Breakpoint Name For Width** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** responsive
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function getBreakpoint(width, breakpoints) {
  const sorted = Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
    for (const [name, min] of sorted) if (width >= min) return name;
    return 'xs';
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **responsive**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-17-breakpoint-for',
    prompt: `Implement \`getBreakpoint\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function getBreakpoint(width, breakpoints) {
  // Implement this function
  
}`,
      typescript: `function getBreakpoint(width: number, breakpoints: Record<string, number>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function getBreakpoint(width, breakpoints) {
  const sorted = Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
    for (const [name, min] of sorted) if (width >= min) return name;
    return 'xs';
}`,
      typescript: `function getBreakpoint(width: number, breakpoints: Record<string, number>) {
  const sorted = Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
    for (const [name, min] of sorted) if (width >= min) return name;
    return 'xs';
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'getBreakpoint');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('getBreakpoint', 'return Boolean(getBreakpoint(820, {"sm":640,"md":768,"lg":1024}) === "md")');
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
    { label: 'Breakpoint Name For Width', url: 'https://developer.mozilla.org/' }
  ],
};
