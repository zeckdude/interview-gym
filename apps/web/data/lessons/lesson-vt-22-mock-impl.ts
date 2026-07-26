import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonVt22MockImpl: Lesson = {
  id: 'lesson-vt-22-mock-impl',
  title: 'Mock With Implementation',
  category: 'stack-vitest',
  topLevel: 'stack',
  subcategory: 'vitest',
  difficulty: 'advanced',
  relatedChallengeIds: ['vt-22-mock-impl'],
  estimatedMinutes: 10,
  concepts: ["mocks"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Mock With Implementation** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** mocks
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function mockWithImpl(impl) {
  const calls = [];
    const mock = (...args) => { calls.push(args); return impl(...args); };
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
    id: 'mini-vt-22-mock-impl',
    prompt: `Implement \`mockWithImpl\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function mockWithImpl(impl) {
  // Implement this function
  
}`,
      typescript: `function mockWithImpl(impl) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function mockWithImpl(impl) {
  const calls = [];
    const mock = (...args) => { calls.push(args); return impl(...args); };
    mock.calls = calls;
    return mock;
}`,
      typescript: `function mockWithImpl(impl) {
  const calls = [];
    const mock = (...args) => { calls.push(args); return impl(...args); };
    mock.calls = calls;
    return mock;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'mockWithImpl');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('mockWithImpl', 'return Boolean(mockWithImpl((a,b)=>a+b)(2,5) === 7)');
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
    { label: 'Mock With Implementation', url: 'https://developer.mozilla.org/' }
  ],
};
