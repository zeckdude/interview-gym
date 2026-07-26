import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi15ParseToolCall: Lesson = {
  id: 'lesson-ai-15-parse-tool-call',
  title: 'Parse Tool Call JSON',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ai-15-parse-tool-call'],
  estimatedMinutes: 10,
  concepts: ["tool use"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Parse Tool Call JSON** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** tool use
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function parseToolCall(response) {
  const data = typeof response === 'string' ? JSON.parse(response) : response;
    return { name: data.name, arguments: data.arguments ?? {} };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **tool use**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-15-parse-tool-call',
    prompt: `Implement \`parseToolCall\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function parseToolCall(response) {
  // Implement this function
  
}`,
      typescript: `function parseToolCall(response: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function parseToolCall(response) {
  const data = typeof response === 'string' ? JSON.parse(response) : response;
    return { name: data.name, arguments: data.arguments ?? {} };
}`,
      typescript: `function parseToolCall(response: string) {
  const data = typeof response === 'string' ? JSON.parse(response) : response;
    return { name: data.name, arguments: data.arguments ?? {} };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'parseToolCall');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('parseToolCall', 'return Boolean(JSON.stringify(parseToolCall("{\\"name\\":\\"search\\",\\"arguments\\":{\\"q\\":\\"vitest\\"}}")) === JSON.stringify({"name":"search","arguments":{"q":"vitest"}}))');
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
    { label: 'Parse Tool Call JSON', url: 'https://developer.mozilla.org/' }
  ],
};
