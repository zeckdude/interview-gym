import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonCss25LayerOrder: Lesson = {
  id: 'lesson-css-25-layer-order',
  title: 'Resolve Cascade Layer Order',
  category: 'fe-css',
  topLevel: 'fe',
  subcategory: 'css',
  difficulty: 'advanced',
  relatedChallengeIds: ['css-25-layer-order'],
  estimatedMinutes: 10,
  concepts: ["cascade layers"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Resolve Cascade Layer Order** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** cascade layers
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function resolveLayer(layer) {
  const order = { reset: 0, base: 1, components: 2, utilities: 3 };
    return order[layer] ?? 0;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **cascade layers**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-css-25-layer-order',
    prompt: `Implement \`resolveLayer\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function resolveLayer(layer) {
  // Implement this function
  
}`,
      typescript: `function resolveLayer(layer: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function resolveLayer(layer) {
  const order = { reset: 0, base: 1, components: 2, utilities: 3 };
    return order[layer] ?? 0;
}`,
      typescript: `function resolveLayer(layer: string) {
  const order = { reset: 0, base: 1, components: 2, utilities: 3 };
    return order[layer] ?? 0;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'resolveLayer');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('resolveLayer', 'return Boolean(resolveLayer("utilities") === 3)');
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
    { label: 'Resolve Cascade Layer Order', url: 'https://developer.mozilla.org/' }
  ],
};
