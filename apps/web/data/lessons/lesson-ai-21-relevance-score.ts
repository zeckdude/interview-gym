import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi21RelevanceScore: Lesson = {
  id: 'lesson-ai-21-relevance-score',
  title: 'Keyword Relevance Rank',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ai-21-relevance-score'],
  estimatedMinutes: 10,
  concepts: ["RAG"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Keyword Relevance Rank** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** RAG
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function relevanceScore(doc, keywords) {
  return keywords.filter((k) => doc.includes(k)).length;
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
    id: 'mini-ai-21-relevance-score',
    prompt: `Implement \`relevanceScore\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function relevanceScore(doc, keywords) {
  // Implement this function
  
}`,
      typescript: `function relevanceScore(doc: string, keywords: string[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function relevanceScore(doc, keywords) {
  return keywords.filter((k) => doc.includes(k)).length;
}`,
      typescript: `function relevanceScore(doc: string, keywords: string[]) {
  return keywords.filter((k) => doc.includes(k)).length;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'relevanceScore');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('relevanceScore', 'return Boolean(relevanceScore("react state hooks", ["react","hooks"]) === 2)');
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
    { label: 'Keyword Relevance Rank', url: 'https://developer.mozilla.org/' }
  ],
};
