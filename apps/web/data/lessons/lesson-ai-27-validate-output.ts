import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi27ValidateOutput: Lesson = {
  id: 'lesson-ai-27-validate-output',
  title: 'Validate Structured Output',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'advanced',
  relatedChallengeIds: ['ai-27-validate-output'],
  estimatedMinutes: 10,
  concepts: ["structured output"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Validate Structured Output** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** structured output
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function validateStructured(obj, required) {
  return required.every((key) => key in obj);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **structured output**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-27-validate-output',
    prompt: `Implement \`validateStructured\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function validateStructured(obj, required) {
  // Implement this function
  
}`,
      typescript: `function validateStructured(obj: Record<string, unknown>, required: string[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function validateStructured(obj, required) {
  return required.every((key) => key in obj);
}`,
      typescript: `function validateStructured(obj: Record<string, unknown>, required: string[]) {
  return required.every((key) => key in obj);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'validateStructured');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('validateStructured', 'return Boolean(validateStructured({"name":"Ada","age":30}, ["name","age"]) === true)');
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
    { label: 'Validate Structured Output', url: 'https://developer.mozilla.org/' }
  ],
};
