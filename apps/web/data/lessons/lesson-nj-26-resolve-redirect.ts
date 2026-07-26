import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNj26ResolveRedirect: Lesson = {
  id: 'lesson-nj-26-resolve-redirect',
  title: 'Resolve Redirect Path',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'easy',
  relatedChallengeIds: ['nj-26-resolve-redirect'],
  estimatedMinutes: 10,
  concepts: ["redirects","routing","URLs"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Resolve Redirect Path** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** redirects, routing, URLs
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function resolveRedirectPath(basePath, target) {
  if (target.startsWith('http://') || target.startsWith('https://')) return target;
    const base = basePath.replace(/\\/\$/, '');
    const path = target.startsWith('/') ? target : \`/\${target}\`;
    return \`\${base}\${path}\`.replace(/\\/+/g, '/');
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **redirects**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-26-resolve-redirect',
    prompt: `Implement \`resolveRedirectPath(basePath, target)\` — resolve relative redirect targets against a base path.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function resolveRedirectPath(basePath, target) {
  // Implement this function
  
}`,
      typescript: `function resolveRedirectPath(basePath: string, target: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function resolveRedirectPath(basePath, target) {
  if (target.startsWith('http://') || target.startsWith('https://')) return target;
    const base = basePath.replace(/\\/\$/, '');
    const path = target.startsWith('/') ? target : \`/\${target}\`;
    return \`\${base}\${path}\`.replace(/\\/+/g, '/');
}`,
      typescript: `function resolveRedirectPath(basePath: string, target: string) {
  if (target.startsWith('http://') || target.startsWith('https://')) return target;
    const base = basePath.replace(/\\/\$/, '');
    const path = target.startsWith('/') ? target : \`/\${target}\`;
    return \`\${base}\${path}\`.replace(/\\/+/g, '/');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'resolveRedirectPath');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('resolveRedirectPath', `return Boolean(resolveRedirectPath("/app", "dashboard") === "/app/dashboard");`);
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
    { label: 'Resolve Redirect Path', url: 'https://developer.mozilla.org/' }
  ],
};
