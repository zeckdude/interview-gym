import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonRestApi: Lesson = {
  id: 'lesson-rest-api',
  title: 'REST API Design and CRUD',
  category: 'be',
  topLevel: 'be',
  subcategory: null,
  difficulty: 'intermediate',
  relatedChallengeIds: ["be-13-http-router","be-20-api-client"],
  estimatedMinutes: 11,
  concepts: ["REST","CRUD","HTTP methods"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**REST API Design and CRUD** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** REST, CRUD, HTTP methods
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function crudAction(method) {
  const map = { GET: 'read', POST: 'create', PUT: 'update', DELETE: 'delete' };
  return map[method] ?? null;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **REST**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-rest-api',
    prompt: `Map HTTP methods to CRUD actions.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function crudAction(method) {
  
}`,
      typescript: `function crudAction(method: string): string | null {
  
}`,
    },
    solution: {
      javascript: `function crudAction(method) {
  const map = { GET: 'read', POST: 'create', PUT: 'update', DELETE: 'delete' };
  return map[method] ?? null;
}`,
      typescript: `function crudAction(method: string): string | null {
  const map: Record<string, string> = { GET: 'read', POST: 'create', PUT: 'update', DELETE: 'delete' };
  return map[method] ?? null;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'crudAction');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('crudAction', 'return Boolean(crudAction(\'GET\') === \'read\' && crudAction(\'POST\') === \'create\' && crudAction(\'PATCH\') === null)');
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
    { label: 'HTTP methods — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods' }
  ],
};
