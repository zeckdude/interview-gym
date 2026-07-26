import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt28TableDriven: Lesson = {
  id: 'lesson-vt-28-table-driven',
  title: 'Table-Driven Tests',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'advanced',
  relatedChallengeIds: ['vt-28-table-driven'],
  estimatedMinutes: 10,
  concepts: ["parameterized tests"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Table-Driven Tests** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** parameterized tests
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function runTable(rows, fn) {
  return rows.every((row) => fn(row) === true);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **parameterized tests**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-28-table-driven',
    prompt: `Implement \`runTable\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function runTable(rows, fn) {
  // Implement this function
  
}`,
      typescript: `function runTable(rows: Array<{ n: number }>, fn: (row: { n: number }) => boolean) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function runTable(rows, fn) {
  return rows.every((row) => fn(row) === true);
}`,
      typescript: `function runTable(rows: Array<{ n: number }>, fn: (row: { n: number }) => boolean) {
  return rows.every((row) => fn(row) === true);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'runTable');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('runTable', 'return Boolean(runTable([{ n: 2 }, { n: 4 }], (row) => row.n % 2 === 0) === true)');
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
    { label: 'Table-Driven Tests', url: 'https://developer.mozilla.org/' }
  ],
};
