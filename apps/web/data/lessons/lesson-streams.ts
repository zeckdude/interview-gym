import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonStreams: Lesson = {
  id: 'lesson-streams',
  title: 'Node.js Streams — Pipes and Transform',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'intermediate',
  relatedChallengeIds: ["be-12-stream-transform","be-15-retry-logic"],
  estimatedMinutes: 11,
  concepts: ["streams","pipe","transform"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Node.js Streams** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** streams, pipe, transform
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function transformLines(lines, fn) {
  return lines.map(fn);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **streams**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-streams',
    prompt: `Implement transformLines(lines, fn) — maps each line through fn.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function transformLines(lines, fn) {
  
}`,
      typescript: `function transformLines(lines: string[], fn: (line: string) => string): string[] {
  
}`,
    },
    solution: {
      javascript: `function transformLines(lines, fn) {
  return lines.map(fn);
}`,
      typescript: `function transformLines(lines: string[], fn: (line: string) => string): string[] {
  return lines.map(fn);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'transformLines');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('transformLines', 'return Boolean(JSON.stringify(transformLines([\'a\',\'b\'], (l) => l.toUpperCase())) === JSON.stringify([\'A\',\'B\']))');
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
    { label: 'Streams — Node.js', url: 'https://nodejs.org/api/stream.html' }
  ],
};
