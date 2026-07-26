import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi31StripCot: Lesson = {
  id: 'lesson-ai-31-strip-cot',
  title: 'Strip Chain-of-Thought',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'advanced',
  relatedChallengeIds: ['ai-31-strip-cot'],
  estimatedMinutes: 10,
  concepts: ["prompt hygiene"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Strip Chain-of-Thought** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** prompt hygiene
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function stripChainOfThought(text) {
  return text.replace(/Thought:[\\s\\S]*?Answer:/i, 'Answer:');
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **prompt hygiene**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-31-strip-cot',
    prompt: `Implement \`stripChainOfThought\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function stripChainOfThought(text) {
  // Implement this function
  
}`,
      typescript: `function stripChainOfThought(text: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function stripChainOfThought(text) {
  return text.replace(/Thought:[\\s\\S]*?Answer:/i, 'Answer:');
}`,
      typescript: `function stripChainOfThought(text: string) {
  return text.replace(/Thought:[\\s\\S]*?Answer:/i, 'Answer:');
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'stripChainOfThought');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('stripChainOfThought', 'return Boolean(stripChainOfThought("Thought: hidden reasoning\\nAnswer: 42") === "Answer: 42")');
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
    { label: 'Strip Chain-of-Thought', url: 'https://developer.mozilla.org/' }
  ],
};
