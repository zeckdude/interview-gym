import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs18ParseQueryString: Lesson = {
  id: 'lesson-ts-18-parse-query-string',
  title: 'Parse Query String',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ts-18-parse-query-string'],
  estimatedMinutes: 10,
  concepts: ["URLSearchParams","strings"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Parse Query String** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** URLSearchParams, strings
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function parseQuery(qs) {
  const params = new URLSearchParams(qs.startsWith('?') ? qs.slice(1) : qs);
    const result = {};
    for (const [key, value] of params.entries()) result[key] = value;
    return result;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **URLSearchParams**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-18-parse-query-string',
    prompt: `Implement \`parseQuery\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function parseQuery(qs) {
  // Implement this function
  
}`,
      typescript: `function parseQuery(qs: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function parseQuery(qs) {
  const params = new URLSearchParams(qs.startsWith('?') ? qs.slice(1) : qs);
    const result = {};
    for (const [key, value] of params.entries()) result[key] = value;
    return result;
}`,
      typescript: `function parseQuery(qs: string) {
  const params = new URLSearchParams(qs.startsWith('?') ? qs.slice(1) : qs);
    const result = {};
    for (const [key, value] of params.entries()) result[key] = value;
    return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'parseQuery');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('parseQuery', 'return Boolean(JSON.stringify(parseQuery("?a=1&b=two")) === JSON.stringify({"a":"1","b":"two"}))');
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
    { label: 'Parse Query String', url: 'https://developer.mozilla.org/' }
  ],
};
