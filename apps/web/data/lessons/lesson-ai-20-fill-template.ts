import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi20FillTemplate: Lesson = {
  id: 'lesson-ai-20-fill-template',
  title: 'Fill Prompt Template',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ai-20-fill-template'],
  estimatedMinutes: 10,
  concepts: ["templates"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Fill Prompt Template** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** templates
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function fillTemplate(template, data) {
  return template.replace(/\\{(\\w+)\\}/g, (_, key) => String(data[key] ?? ''));
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **templates**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-20-fill-template',
    prompt: `Implement \`fillTemplate\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function fillTemplate(template, data) {
  // Implement this function
  
}`,
      typescript: `function fillTemplate(template: string, data: Record<string, unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function fillTemplate(template, data) {
  return template.replace(/\\{(\\w+)\\}/g, (_, key) => String(data[key] ?? ''));
}`,
      typescript: `function fillTemplate(template: string, data: Record<string, unknown>) {
  return template.replace(/\\{(\\w+)\\}/g, (_, key) => String(data[key] ?? ''));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'fillTemplate');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('fillTemplate', 'return Boolean(fillTemplate("Hello {name}", {"name":"Sam"}) === "Hello Sam")');
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
    { label: 'Fill Prompt Template', url: 'https://developer.mozilla.org/' }
  ],
};
