import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi33EvalMetrics: Lesson = {
  id: 'lesson-ai-33-eval-metrics',
  title: 'Compute Eval Metrics',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'advanced',
  relatedChallengeIds: ['ai-33-eval-metrics'],
  estimatedMinutes: 10,
  concepts: ["evals"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Compute Eval Metrics** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** evals
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function computeEvalMetrics(results) {
  const tp = results.filter((r) => r.expected === r.actual).length;
    return { accuracy: tp / results.length, total: results.length };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **evals**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-33-eval-metrics',
    prompt: `Implement \`computeEvalMetrics\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function computeEvalMetrics(results) {
  // Implement this function
  
}`,
      typescript: `function computeEvalMetrics(results: Array<{ expected: string; actual: string }>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function computeEvalMetrics(results) {
  const tp = results.filter((r) => r.expected === r.actual).length;
    return { accuracy: tp / results.length, total: results.length };
}`,
      typescript: `function computeEvalMetrics(results: Array<{ expected: string; actual: string }>) {
  const tp = results.filter((r) => r.expected === r.actual).length;
    return { accuracy: tp / results.length, total: results.length };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'computeEvalMetrics');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('computeEvalMetrics', 'return Boolean(JSON.stringify(computeEvalMetrics([{"expected":"a","actual":"a"},{"expected":"b","actual":"c"}])) === JSON.stringify({"accuracy":0.5,"total":2}))');
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
    { label: 'Compute Eval Metrics', url: 'https://developer.mozilla.org/' }
  ],
};
