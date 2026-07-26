import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi12KeywordScore: Lesson = {
  id: 'lesson-ai-12-keyword-score',
  title: 'Keyword Relevance Score',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ai-12-keyword-score'],
  estimatedMinutes: 10,
  concepts: ["RAG","search"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Keyword Relevance Score** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** RAG, search
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function keywordScore(query, text) {
  const words = query.toLowerCase().split(/\\s+/);
    const lower = text.toLowerCase();
    return words.filter((w) => lower.includes(w)).length;
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
    id: 'mini-ai-12-keyword-score',
    prompt: `Implement \`keywordScore\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function keywordScore(query, text) {
  // Implement this function
  
}`,
      typescript: `function keywordScore(query: string, text: string) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function keywordScore(query, text) {
  const words = query.toLowerCase().split(/\\s+/);
    const lower = text.toLowerCase();
    return words.filter((w) => lower.includes(w)).length;
}`,
      typescript: `function keywordScore(query: string, text: string) {
  const words = query.toLowerCase().split(/\\s+/);
    const lower = text.toLowerCase();
    return words.filter((w) => lower.includes(w)).length;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'keywordScore');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('keywordScore', 'return Boolean(keywordScore("react hooks", "React hooks manage state") === 2)');
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
    { label: 'Keyword Relevance Score', url: 'https://developer.mozilla.org/' }
  ],
};
