import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi24ToolRegistry: Lesson = {
  id: 'lesson-ai-24-tool-registry',
  title: 'Tool Registry',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'advanced',
  relatedChallengeIds: ['ai-24-tool-registry'],
  estimatedMinutes: 10,
  concepts: ["tool use"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Tool Registry** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** tool use
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createToolRegistry() {
  const tools = {};
    return {
      register(name, handler) { tools[name] = handler; },
      call(name, input) { return tools[name](input); },
    };
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
    id: 'mini-ai-24-tool-registry',
    prompt: `Implement \`createToolRegistry\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function createToolRegistry() {
  // Implement this function
  
}`,
      typescript: `function createToolRegistry() {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createToolRegistry() {
  const tools = {};
    return {
      register(name, handler) { tools[name] = handler; },
      call(name, input) { return tools[name](input); },
    };
}`,
      typescript: `function createToolRegistry() {
  const tools = {};
    return {
      register(name, handler) { tools[name] = handler; },
      call(name, input) { return tools[name](input); },
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createToolRegistry');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createToolRegistry', 'return Boolean((() => { const r = createToolRegistry(); r.register(\'echo\', (x) => x); return r.call(\'echo\', 42) === 42; })())');
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
    { label: 'Tool Registry', url: 'https://developer.mozilla.org/' }
  ],
};
