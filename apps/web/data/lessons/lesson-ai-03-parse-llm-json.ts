import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi03ParseLlmJson: Lesson = {
  id: 'lesson-ai-03-parse-llm-json',
  title: 'Extract JSON From LLM Output',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'easy',
  relatedChallengeIds: ['ai-03-parse-llm-json'],
  estimatedMinutes: 10,
  concepts: ["structured output"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Extract JSON From LLM Output** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** structured output
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function extractJson(text) {
  const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    return JSON.parse(text.slice(start, end + 1));
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
    id: 'mini-ai-03-parse-llm-json',
    prompt: `Implement \`extractJson\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function extractJson(text) {
  // Implement this function
  
}`,
      typescript: `function extractJson(text: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function extractJson(text) {
  const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    return JSON.parse(text.slice(start, end + 1));
}`,
      typescript: `function extractJson(text: string) {
  const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    return JSON.parse(text.slice(start, end + 1));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'extractJson');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('extractJson', 'return Boolean(JSON.stringify(extractJson("Here is data {\\"a\\":1} done")) === JSON.stringify({"a":1}))');
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
    { label: 'Extract JSON From LLM Output', url: 'https://developer.mozilla.org/' }
  ],
};
