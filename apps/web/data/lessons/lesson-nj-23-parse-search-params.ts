import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNj23ParseSearchParams: Lesson = {
  id: 'lesson-nj-23-parse-search-params',
  title: 'Parse Search Params String',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'easy',
  relatedChallengeIds: ['nj-23-parse-search-params'],
  estimatedMinutes: 10,
  concepts: ["URL","search params","routing"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Parse Search Params String** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** URL, search params, routing
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function parseSearchParams(query) {
  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
    const result = {};
    for (const [key, value] of params.entries()) {
      if (result[key] === undefined) result[key] = value;
      else if (Array.isArray(result[key])) result[key].push(value);
      else result[key] = [result[key], value];
    }
    return result;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **URL**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-23-parse-search-params',
    prompt: `Implement \`parseSearchParams(query)\` — parse a query string into a params object.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function parseSearchParams(query) {
  // Implement this function
  
}`,
      typescript: `function parseSearchParams(query: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function parseSearchParams(query) {
  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
    const result = {};
    for (const [key, value] of params.entries()) {
      if (result[key] === undefined) result[key] = value;
      else if (Array.isArray(result[key])) result[key].push(value);
      else result[key] = [result[key], value];
    }
    return result;
}`,
      typescript: `function parseSearchParams(query: string) {
  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
    const result = {};
    for (const [key, value] of params.entries()) {
      if (result[key] === undefined) result[key] = value;
      else if (Array.isArray(result[key])) result[key].push(value);
      else result[key] = [result[key], value];
    }
    return result;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'parseSearchParams');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('parseSearchParams', `return Boolean(JSON.stringify(parseSearchParams("?q=hello&page=2")) === JSON.stringify({"q":"hello","page":"2"}));`);
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
    { label: 'Parse Search Params String', url: 'https://developer.mozilla.org/' }
  ],
};
