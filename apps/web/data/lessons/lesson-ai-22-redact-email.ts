import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi22RedactEmail: Lesson = {
  id: 'lesson-ai-22-redact-email',
  title: 'Redact Email Addresses',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ai-22-redact-email'],
  estimatedMinutes: 10,
  concepts: ["PII"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Redact Email Addresses** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** PII
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function redactEmails(text) {
  return text.replace(/[\\w.-]+@[\\w.-]+/g, '[redacted]');
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **PII**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-22-redact-email',
    prompt: `Implement \`redactEmails\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function redactEmails(text) {
  // Implement this function
  
}`,
      typescript: `function redactEmails(text: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function redactEmails(text) {
  return text.replace(/[\\w.-]+@[\\w.-]+/g, '[redacted]');
}`,
      typescript: `function redactEmails(text: string) {
  return text.replace(/[\\w.-]+@[\\w.-]+/g, '[redacted]');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'redactEmails');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('redactEmails', 'return Boolean(redactEmails("Contact ada@example.com please") === "Contact [redacted] please")');
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
    { label: 'Redact Email Addresses', url: 'https://developer.mozilla.org/' }
  ],
};
