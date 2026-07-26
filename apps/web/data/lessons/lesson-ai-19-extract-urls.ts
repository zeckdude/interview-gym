import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi19ExtractUrls: Lesson = {
  id: 'lesson-ai-19-extract-urls',
  title: 'Extract URLs From Text',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ai-19-extract-urls'],
  estimatedMinutes: 10,
  concepts: ["citations"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Extract URLs From Text** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** citations
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function extractUrls(text) {
  return text.match(/https?:\\/\\/\\S+/g) ?? [];
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **citations**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-19-extract-urls',
    prompt: `Implement \`extractUrls\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function extractUrls(text) {
  // Implement this function
  
}`,
      typescript: `function extractUrls(text: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function extractUrls(text) {
  return text.match(/https?:\\/\\/\\S+/g) ?? [];
}`,
      typescript: `function extractUrls(text: string) {
  return text.match(/https?:\\/\\/\\S+/g) ?? [];
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'extractUrls');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('extractUrls', 'return Boolean(JSON.stringify(extractUrls("See https://example.com and https://a.com/x")) === JSON.stringify(["https://example.com","https://a.com/x"]))');
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
    { label: 'Extract URLs From Text', url: 'https://developer.mozilla.org/' }
  ],
};
