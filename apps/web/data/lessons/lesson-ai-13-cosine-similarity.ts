import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi13CosineSimilarity: Lesson = {
  id: 'lesson-ai-13-cosine-similarity',
  title: 'Cosine Similarity',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ai-13-cosine-similarity'],
  estimatedMinutes: 10,
  concepts: ["embeddings"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Cosine Similarity** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** embeddings
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return dot / (magA * magB);
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
    id: 'mini-ai-13-cosine-similarity',
    prompt: `Implement \`cosineSimilarity\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function cosineSimilarity(a, b) {
  // Implement this function
  
}`,
      typescript: `function cosineSimilarity(a: number[], b: number[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return dot / (magA * magB);
}`,
      typescript: `function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return dot / (magA * magB);
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'cosineSimilarity');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('cosineSimilarity', 'return Boolean(cosineSimilarity([1,0], [1,0]) === 1)');
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
    { label: 'Cosine Similarity', url: 'https://developer.mozilla.org/' }
  ],
};
