import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi23ParseAgentAction: Lesson = {
  id: 'lesson-ai-23-parse-agent-action',
  title: 'Parse Agent Action Line',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'advanced',
  relatedChallengeIds: ['ai-23-parse-agent-action'],
  estimatedMinutes: 10,
  concepts: ["agents"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Parse Agent Action Line** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** agents
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function parseAgentAction(text) {
  const match = text.match(/Action:\\s*(\\w+)\\s*Input:\\s*(\\{[\\s\\S]*\\})/);
    if (!match) return null;
    return { action: match[1], input: JSON.parse(match[2]) };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **agents**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-23-parse-agent-action',
    prompt: `Implement \`parseAgentAction\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function parseAgentAction(text) {
  // Implement this function
  
}`,
      typescript: `function parseAgentAction(text: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function parseAgentAction(text) {
  const match = text.match(/Action:\\s*(\\w+)\\s*Input:\\s*(\\{[\\s\\S]*\\})/);
    if (!match) return null;
    return { action: match[1], input: JSON.parse(match[2]) };
}`,
      typescript: `function parseAgentAction(text: string) {
  const match = text.match(/Action:\\s*(\\w+)\\s*Input:\\s*(\\{[\\s\\S]*\\})/);
    if (!match) return null;
    return { action: match[1], input: JSON.parse(match[2]) };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'parseAgentAction');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('parseAgentAction', 'return Boolean(JSON.stringify(parseAgentAction("Action: search Input: {\\"q\\":\\"vitest\\"}")) === JSON.stringify({"action":"search","input":{"q":"vitest"}}))');
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
    { label: 'Parse Agent Action Line', url: 'https://developer.mozilla.org/' }
  ],
};
