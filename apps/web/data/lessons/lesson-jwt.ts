import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonJwt: Lesson = {
  id: 'lesson-jwt',
  title: 'JSON Web Tokens — Auth the Right Way',
  category: 'be-nodejs',
  topLevel: 'be',
  subcategory: 'nodejs',
  difficulty: 'intermediate',
  relatedChallengeIds: ["be-20-api-client","be-05-env-config"],
  estimatedMinutes: 10,
  concepts: ["JWT","Bearer token"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**JSON Web Tokens** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** JWT, Bearer token
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function decodePayload(token) {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **JWT**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-jwt',
    prompt: `Decode the payload (middle segment) of a JWT from base64 JSON.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function decodePayload(token) {
  
}`,
      typescript: `function decodePayload(token: string): Record<string, unknown> {
  
}`,
    },
    solution: {
      javascript: `function decodePayload(token) {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
}`,
      typescript: `function decodePayload(token: string): Record<string, unknown> {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'decodePayload');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('decodePayload', 'return Boolean((() => { const p = btoa(JSON.stringify({sub:\'123\'})); return decodePayload(\'h.\' + p + \'.s\').sub === \'123\'; })())');
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
    { label: 'JWT introduction', url: 'https://jwt.io/introduction' }
  ],
};
