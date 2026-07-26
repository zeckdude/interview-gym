import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs19TemplateInterpolate: Lesson = {
  id: 'lesson-ts-19-template-interpolate',
  title: 'Template Interpolation',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'intermediate',
  relatedChallengeIds: ['ts-19-template-interpolate'],
  estimatedMinutes: 10,
  concepts: ["templates","strings"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Template Interpolation** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** templates, strings
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function interpolate(template, vars) {
  return template.replace(/\\{\\{(\\w+)\\}\\}/g, (_, key) => String(vars[key] ?? ''));
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
    id: 'mini-ts-19-template-interpolate',
    prompt: `Implement \`interpolate\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function interpolate(template, vars) {
  // Implement this function
  
}`,
      typescript: `function interpolate(template: string, vars: Record<string, unknown>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function interpolate(template, vars) {
  return template.replace(/\\{\\{(\\w+)\\}\\}/g, (_, key) => String(vars[key] ?? ''));
}`,
      typescript: `function interpolate(template: string, vars: Record<string, unknown>) {
  return template.replace(/\\{\\{(\\w+)\\}\\}/g, (_, key) => String(vars[key] ?? ''));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'interpolate');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('interpolate', 'return Boolean(interpolate("Hello {{name}}", {"name":"Ada"}) === "Hello Ada")');
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
    { label: 'Template Interpolation', url: 'https://developer.mozilla.org/' }
  ],
};
