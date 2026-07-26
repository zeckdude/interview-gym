import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs06UniqueArray: Lesson = {
  id: 'lesson-ts-06-unique-array',
  title: 'Unique Array Values',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'easy',
  relatedChallengeIds: ['ts-06-unique-array'],
  estimatedMinutes: 10,
  concepts: ["Set","deduplication"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Unique Array Values** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** Set, deduplication
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function unique(arr) {
  return [...new Set(arr)];
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **Set**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-06-unique-array',
    prompt: `Implement \`unique\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function unique(arr) {
  // Implement this function
  
}`,
      typescript: `function unique(arr: unknown[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function unique(arr) {
  return [...new Set(arr)];
}`,
      typescript: `function unique(arr: unknown[]) {
  return [...new Set(arr)];
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'unique');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('unique', 'return Boolean(JSON.stringify(unique([1,2,2,3,1])) === JSON.stringify([1,2,3]))');
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
    { label: 'Unique Array Values', url: 'https://developer.mozilla.org/' }
  ],
};
