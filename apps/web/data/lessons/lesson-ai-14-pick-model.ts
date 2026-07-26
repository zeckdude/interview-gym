import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi14PickModel: Lesson = {
  id: 'lesson-ai-14-pick-model',
  title: 'Pick Model By Complexity',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ai-14-pick-model'],
  estimatedMinutes: 10,
  concepts: ["routing"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Pick Model By Complexity** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** routing
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function pickModel(complexity, models) {
  if (complexity === 'high') return models.large;
    if (complexity === 'medium') return models.medium;
    return models.small;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **routing**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-14-pick-model',
    prompt: `Implement \`pickModel\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function pickModel(complexity, models) {
  // Implement this function
  
}`,
      typescript: `function pickModel(complexity: 'low' | 'medium' | 'high', models: Record<string, string>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function pickModel(complexity, models) {
  if (complexity === 'high') return models.large;
    if (complexity === 'medium') return models.medium;
    return models.small;
}`,
      typescript: `function pickModel(complexity: 'low' | 'medium' | 'high', models: Record<string, string>) {
  if (complexity === 'high') return models.large;
    if (complexity === 'medium') return models.medium;
    return models.small;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'pickModel');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('pickModel', 'return Boolean(pickModel("high", {"small":"mini","medium":"base","large":"pro"}) === "pro")');
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
    { label: 'Pick Model By Complexity', url: 'https://developer.mozilla.org/' }
  ],
};
