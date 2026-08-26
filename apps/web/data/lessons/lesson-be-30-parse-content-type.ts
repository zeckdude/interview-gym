import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonBe30ParseContentType: Lesson = {
  id: 'lesson-be-30-parse-content-type',
  title: 'Parse Content-Type Header',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'advanced',
  relatedChallengeIds: ['be-30-parse-content-type'],
  estimatedMinutes: 10,
  concepts: ["HTTP headers","parsing","MIME"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Parse Content-Type Header** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** HTTP headers, parsing, MIME
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function parseContentType(header) {
  const [typePart, ...params] = header.split(';').map((s) => s.trim());
    const type = typePart.toLowerCase();
    const charset = params
      .map((p) => p.split('=').map((s) => s.trim()))
      .find(([key]) => key.toLowerCase() === 'charset')?.[1]
      ?.replace(/^"|"\$/g, '');
    return { type, charset: charset ?? null };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **HTTP headers**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-be-30-parse-content-type',
    prompt: `Implement \`parseContentType(header)\` — parse a Content-Type header into \`{ type, charset }\`.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function parseContentType(header) {
  // Implement this function
  
}`,
      typescript: `function parseContentType(header: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function parseContentType(header) {
  const [typePart, ...params] = header.split(';').map((s) => s.trim());
    const type = typePart.toLowerCase();
    const charset = params
      .map((p) => p.split('=').map((s) => s.trim()))
      .find(([key]) => key.toLowerCase() === 'charset')?.[1]
      ?.replace(/^"|"\$/g, '');
    return { type, charset: charset ?? null };
}`,
      typescript: `function parseContentType(header: string) {
  const [typePart, ...params] = header.split(';').map((s) => s.trim());
    const type = typePart.toLowerCase();
    const charset = params
      .map((p) => p.split('=').map((s) => s.trim()))
      .find(([key]) => key.toLowerCase() === 'charset')?.[1]
      ?.replace(/^"|"\$/g, '');
    return { type, charset: charset ?? null };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'parseContentType');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('parseContentType', `return Boolean(JSON.stringify(parseContentType("application/json")) === JSON.stringify({"type":"application/json","charset":null}));`);
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
    { label: 'Parse Content-Type Header', url: 'https://developer.mozilla.org/' }
  ],
};
