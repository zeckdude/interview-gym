import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonPostgresPg: Lesson = {
  id: 'lesson-postgres-pg',
  title: 'PostgreSQL with node-postgres',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'intermediate',
  relatedChallengeIds: ["be-18-singleton-db"],
  estimatedMinutes: 11,
  concepts: ["SQL","parameterized queries"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**PostgreSQL with node-postgres** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** SQL, parameterized queries
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function buildQuery(table, id) {
  return { text: 'SELECT * FROM ' + table + ' WHERE id = \$1', values: [id] };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **SQL**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-postgres-pg',
    prompt: `Build a parameterized SELECT query object with text and values.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function buildQuery(table, id) {
  
}`,
      typescript: `function buildQuery(table: string, id: number): { text: string; values: unknown[] } {
  
}`,
    },
    solution: {
      javascript: `function buildQuery(table, id) {
  return { text: 'SELECT * FROM ' + table + ' WHERE id = \$1', values: [id] };
}`,
      typescript: `function buildQuery(table: string, id: number): { text: string; values: unknown[] } {
  return { text: 'SELECT * FROM ' + table + ' WHERE id = \$1', values: [id] };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'buildQuery');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('buildQuery', 'return Boolean((() => { const q = buildQuery(\'users\', 5); return q.text.includes(\'users\') && q.values[0] === 5; })())');
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
    { label: 'node-postgres', url: 'https://node-postgres.com/' }
  ],
};
