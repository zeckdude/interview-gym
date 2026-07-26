import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi26UnsupportedClaim: Lesson = {
  id: 'lesson-ai-26-unsupported-claim',
  title: 'Flag Unsupported Claims',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'advanced',
  relatedChallengeIds: ['ai-26-unsupported-claim'],
  estimatedMinutes: 10,
  concepts: ["hallucinations"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Flag Unsupported Claims** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** hallucinations
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function flagUnverifiedClaims(answer, sources) {
  const answerWords = answer.toLowerCase().split(/\\s+/);
    return answerWords.filter((word) => word.length > 5 && !sources.join(' ').toLowerCase().includes(word));
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **hallucinations**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-26-unsupported-claim',
    prompt: `Implement \`flagUnverifiedClaims\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function flagUnverifiedClaims(answer, sources) {
  // Implement this function
  
}`,
      typescript: `function flagUnverifiedClaims(answer: string, sources: string[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function flagUnverifiedClaims(answer, sources) {
  const answerWords = answer.toLowerCase().split(/\\s+/);
    return answerWords.filter((word) => word.length > 5 && !sources.join(' ').toLowerCase().includes(word));
}`,
      typescript: `function flagUnverifiedClaims(answer: string, sources: string[]) {
  const answerWords = answer.toLowerCase().split(/\\s+/);
    return answerWords.filter((word) => word.length > 5 && !sources.join(' ').toLowerCase().includes(word));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'flagUnverifiedClaims');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('flagUnverifiedClaims', 'return Boolean(flagUnverifiedClaims("React uses quantum mechanics", ["react library"]) === ["quantum","mechanics"])');
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
    { label: 'Flag Unsupported Claims', url: 'https://developer.mozilla.org/' }
  ],
};
