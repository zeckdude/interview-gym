import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi29SummarizeTurns: Lesson = {
  id: 'lesson-ai-29-summarize-turns',
  title: 'Summarize Conversation Turns',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'advanced',
  relatedChallengeIds: ['ai-29-summarize-turns'],
  estimatedMinutes: 10,
  concepts: ["summarization"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Summarize Conversation Turns** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** summarization
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function summarizeTurns(messages, maxChars) {
  const joined = messages.map((m) => m.role + ': ' + m.content).join(' | ');
    return joined.length > maxChars ? joined.slice(0, maxChars) + '…' : joined;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **summarization**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-29-summarize-turns',
    prompt: `Implement \`summarizeTurns\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function summarizeTurns(messages, maxChars) {
  // Implement this function
  
}`,
      typescript: `function summarizeTurns(messages: Array<{ role: string; content: string }>, maxChars: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function summarizeTurns(messages, maxChars) {
  const joined = messages.map((m) => m.role + ': ' + m.content).join(' | ');
    return joined.length > maxChars ? joined.slice(0, maxChars) + '…' : joined;
}`,
      typescript: `function summarizeTurns(messages: Array<{ role: string; content: string }>, maxChars: number) {
  const joined = messages.map((m) => m.role + ': ' + m.content).join(' | ');
    return joined.length > maxChars ? joined.slice(0, maxChars) + '…' : joined;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'summarizeTurns');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('summarizeTurns', 'return Boolean(summarizeTurns([{"role":"user","content":"Hi"},{"role":"assistant","content":"Hello"}], 100) === "user: Hi | assistant: Hello")');
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
    { label: 'Summarize Conversation Turns', url: 'https://developer.mozilla.org/' }
  ],
};
