import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi06ExtractCodeFence: Lesson = {
  id: 'lesson-ai-06-extract-code-fence',
  title: 'Extract Markdown Code Block',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'easy',
  relatedChallengeIds: ['ai-06-extract-code-fence'],
  estimatedMinutes: 10,
  concepts: ["markdown"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Extract Markdown Code Block** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** markdown
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function extractCodeBlock(markdown) {
  const match = markdown.match(/\`\`\`(?:\\w+)?\\n([\\s\\S]*?)\\n\`\`\`/);
    return match ? match[1].trim() : '';
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **markdown**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-06-extract-code-fence',
    prompt: `Implement \`extractCodeBlock\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function extractCodeBlock(markdown) {
  // Implement this function
  
}`,
      typescript: `function extractCodeBlock(markdown: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function extractCodeBlock(markdown) {
  const match = markdown.match(/\`\`\`(?:\\w+)?\\n([\\s\\S]*?)\\n\`\`\`/);
    return match ? match[1].trim() : '';
}`,
      typescript: `function extractCodeBlock(markdown: string) {
  const match = markdown.match(/\`\`\`(?:\\w+)?\\n([\\s\\S]*?)\\n\`\`\`/);
    return match ? match[1].trim() : '';
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'extractCodeBlock');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('extractCodeBlock', 'return Boolean(extractCodeBlock("```js\\nconst x = 1;\\n```") === "const x = 1;")');
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
    { label: 'Extract Markdown Code Block', url: 'https://developer.mozilla.org/' }
  ],
};
