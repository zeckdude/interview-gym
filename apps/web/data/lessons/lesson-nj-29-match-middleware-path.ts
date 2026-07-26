import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNj29MatchMiddlewarePath: Lesson = {
  id: 'lesson-nj-29-match-middleware-path',
  title: 'Match Middleware Path',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'advanced',
  relatedChallengeIds: ['nj-29-match-middleware-path'],
  estimatedMinutes: 10,
  concepts: ["middleware","path matching","routing"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Match Middleware Path** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** middleware, path matching, routing
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function matchMiddlewarePath(pathname, pattern) {
  if (pattern === '/:path*') return true;
    if (pattern.endsWith('/:path*')) {
      const prefix = pattern.slice(0, -('/:path*'.length));
      return pathname === prefix || pathname.startsWith(prefix + '/');
    }
    if (pattern.includes(':')) {
      const patternParts = pattern.split('/');
      const pathParts = pathname.split('/');
      if (patternParts.length !== pathParts.length) return false;
      return patternParts.every((part, i) => part.startsWith(':') || part === pathParts[i]);
    }
    return pathname === pattern;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **middleware**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-29-match-middleware-path',
    prompt: `Implement \`matchMiddlewarePath(pathname, pattern)\` — match paths against middleware matcher patterns.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function matchMiddlewarePath(pathname, pattern) {
  // Implement this function
  
}`,
      typescript: `function matchMiddlewarePath(pathname: string, pattern: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function matchMiddlewarePath(pathname, pattern) {
  if (pattern === '/:path*') return true;
    if (pattern.endsWith('/:path*')) {
      const prefix = pattern.slice(0, -('/:path*'.length));
      return pathname === prefix || pathname.startsWith(prefix + '/');
    }
    if (pattern.includes(':')) {
      const patternParts = pattern.split('/');
      const pathParts = pathname.split('/');
      if (patternParts.length !== pathParts.length) return false;
      return patternParts.every((part, i) => part.startsWith(':') || part === pathParts[i]);
    }
    return pathname === pattern;
}`,
      typescript: `function matchMiddlewarePath(pathname: string, pattern: string) {
  if (pattern === '/:path*') return true;
    if (pattern.endsWith('/:path*')) {
      const prefix = pattern.slice(0, -('/:path*'.length));
      return pathname === prefix || pathname.startsWith(prefix + '/');
    }
    if (pattern.includes(':')) {
      const patternParts = pattern.split('/');
      const pathParts = pathname.split('/');
      if (patternParts.length !== pathParts.length) return false;
      return patternParts.every((part, i) => part.startsWith(':') || part === pathParts[i]);
    }
    return pathname === pattern;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'matchMiddlewarePath');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('matchMiddlewarePath', `return Boolean(matchMiddlewarePath("/api/health", "/api/health") === true);`);
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
    { label: 'Match Middleware Path', url: 'https://developer.mozilla.org/' }
  ],
};
