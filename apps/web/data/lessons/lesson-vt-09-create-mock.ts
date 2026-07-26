import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt09CreateMock: Lesson = {
  id: 'lesson-vt-09-create-mock',
  title: 'Create Mock Function',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'easy',
  relatedChallengeIds: ['vt-09-create-mock'],
  estimatedMinutes: 10,
  concepts: ["mocks"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Create Mock Function** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** mocks
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createMock() {
  const calls = [];
    const mock = (...args) => { calls.push(args); return undefined; };
    mock.calls = calls;
    return mock;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **mocks**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-vt-09-create-mock',
    prompt: `Implement \`createMock\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function createMock() {
  // Implement this function
  
}`,
      typescript: `function createMock() {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createMock() {
  const calls = [];
    const mock = (...args) => { calls.push(args); return undefined; };
    mock.calls = calls;
    return mock;
}`,
      typescript: `function createMock() {
  const calls = [];
    const mock = (...args) => { calls.push(args); return undefined; };
    mock.calls = calls;
    return mock;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createMock');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createMock', 'return Boolean((() => { const m = createMock(); m(1,2); return m.calls.length === 1 && m.calls[0][0] === 1; })())');
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
    { label: 'Create Mock Function', url: 'https://developer.mozilla.org/' }
  ],
};
