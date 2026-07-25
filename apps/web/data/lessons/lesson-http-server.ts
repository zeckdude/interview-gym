import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonHttpServer: Lesson = {
  id: 'lesson-http-server',
  title: 'Building HTTP Servers in Node.js',
  category: 'be',
  difficulty: 'intermediate',
  relatedChallengeIds: ["be-13-http-router","be-05-env-config"],
  estimatedMinutes: 12,
  concepts: ["HTTP","request","response","routing"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Building HTTP Servers in Node.js** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** HTTP, request, response, routing
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function matchRoute(method, path, routes) {
  return routes[method + ' ' + path] ?? null;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **HTTP**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-http-server',
    prompt: `Implement matchRoute(method, path, routes) — returns the handler for METHOD path or null.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function matchRoute(method, path, routes) {
  // Return handler or null
  
}`,
      typescript: `function matchRoute(method: string, path: string, routes: Record<string, unknown>): unknown {
  
}`,
    },
    solution: {
      javascript: `function matchRoute(method, path, routes) {
  return routes[method + ' ' + path] ?? null;
}`,
      typescript: `function matchRoute(method: string, path: string, routes: Record<string, unknown>): unknown {
  return routes[method + ' ' + path] ?? null;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'matchRoute');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('matchRoute', 'return Boolean(matchRoute(\'GET\', \'/users\', { \'GET /users\': 1 }) === 1 && matchRoute(\'POST\', \'/users\', { \'GET /users\': 1 }) === null)');
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
    { label: 'HTTP — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP' }
  ],
};
