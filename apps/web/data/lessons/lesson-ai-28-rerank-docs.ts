import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi28RerankDocs: Lesson = {
  id: 'lesson-ai-28-rerank-docs',
  title: 'Rerank Documents',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'advanced',
  relatedChallengeIds: ['ai-28-rerank-docs'],
  estimatedMinutes: 10,
  concepts: ["RAG"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Rerank Documents** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** RAG
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function rerankDocs(query, docs, score) {
  return [...docs].sort((a, b) => score(query, b) - score(query, a));
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **RAG**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-28-rerank-docs',
    prompt: `Implement \`rerankDocs\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function rerankDocs(query, docs, score) {
  // Implement this function
  
}`,
      typescript: `function rerankDocs(query: string, docs: string[], score: (q: string, d: string) => number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function rerankDocs(query, docs, score) {
  return [...docs].sort((a, b) => score(query, b) - score(query, a));
}`,
      typescript: `function rerankDocs(query: string, docs: string[], score: (q: string, d: string) => number) {
  return [...docs].sort((a, b) => score(query, b) - score(query, a));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'rerankDocs');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('rerankDocs', 'return Boolean(JSON.stringify(rerankDocs(\'react\', [\'vue guide\', \'react hooks\'], (q, d) => (d.includes(\'react\') ? 1 : 0))) === JSON.stringify([\'react hooks\', \'vue guide\']))');
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
    { label: 'Rerank Documents', url: 'https://developer.mozilla.org/' }
  ],
};
