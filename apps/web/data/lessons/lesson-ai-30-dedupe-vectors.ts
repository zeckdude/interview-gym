import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi30DedupeVectors: Lesson = {
  id: 'lesson-ai-30-dedupe-vectors',
  title: 'Dedupe Similar Items',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'advanced',
  relatedChallengeIds: ['ai-30-dedupe-vectors'],
  estimatedMinutes: 10,
  concepts: ["embeddings"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Dedupe Similar Items** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** embeddings
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function dedupeSimilar(items, threshold, similarity) {
  const kept = [];
    for (const item of items) {
      if (!kept.some((k) => similarity(k.vector, item.vector) >= threshold)) kept.push(item);
    }
    return kept;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **embeddings**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-30-dedupe-vectors',
    prompt: `Implement \`dedupeSimilar\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function dedupeSimilar(items, threshold, similarity) {
  // Implement this function
  
}`,
      typescript: `function dedupeSimilar(items: Array<{ id: string; vector: number[] }>, threshold: number, similarity: (a: number[], b: number[]) => number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function dedupeSimilar(items, threshold, similarity) {
  const kept = [];
    for (const item of items) {
      if (!kept.some((k) => similarity(k.vector, item.vector) >= threshold)) kept.push(item);
    }
    return kept;
}`,
      typescript: `function dedupeSimilar(items: Array<{ id: string; vector: number[] }>, threshold: number, similarity: (a: number[], b: number[]) => number) {
  const kept = [];
    for (const item of items) {
      if (!kept.some((k) => similarity(k.vector, item.vector) >= threshold)) kept.push(item);
    }
    return kept;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'dedupeSimilar');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('dedupeSimilar', 'return Boolean(JSON.stringify(dedupeSimilar([{ id: \'a\', vector: [1, 0] }, { id: \'b\', vector: [0.99, 0.01] }], 0.9, (a, b) => a[0] * b[0] + a[1] * b[1])) === JSON.stringify([{ id: \'a\', vector: [1, 0] }]))');
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
    { label: 'Dedupe Similar Items', url: 'https://developer.mozilla.org/' }
  ],
};
