import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonExpressMiddleware: Lesson = {
  id: 'lesson-express-middleware',
  title: 'Express Middleware — How the Chain Works',
  category: 'be-nodejs',
  topLevel: 'be',
  subcategory: 'nodejs',
  difficulty: 'intermediate',
  relatedChallengeIds: ["be-10-middleware-chain"],
  estimatedMinutes: 10,
  concepts: ["middleware","next()"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Express Middleware** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** middleware, next()
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function runMiddleware(middlewares, req, res) {
  let i = 0;
  const next = () => { if (i < middlewares.length) middlewares[i++](req, res, next); };
  next();
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **middleware**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-express-middleware',
    prompt: `Implement runMiddleware — runs middleware functions in order via next().`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function runMiddleware(middlewares, req, res) {
  
}`,
      typescript: `function runMiddleware(middlewares: Array<(req: object, res: object, next: () => void) => void>, req: object, res: object): void {
  
}`,
    },
    solution: {
      javascript: `function runMiddleware(middlewares, req, res) {
  let i = 0;
  const next = () => { if (i < middlewares.length) middlewares[i++](req, res, next); };
  next();
}`,
      typescript: `function runMiddleware(middlewares: Array<(req: object, res: object, next: () => void) => void>, req: object, res: object): void {
  let i = 0;
  const next = () => { if (i < middlewares.length) middlewares[i++](req, res, next); };
  next();
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'runMiddleware');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('runMiddleware', 'return Boolean((() => { let n = 0; runMiddleware([(r,s,next) => { n++; next(); }, (r,s,next) => { n++; next(); }], {}, {}); return n === 2; })())');
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
    { label: 'Express middleware', url: 'https://expressjs.com/en/guide/using-middleware.html' }
  ],
};
