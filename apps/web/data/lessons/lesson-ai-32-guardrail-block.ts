import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi32GuardrailBlock: Lesson = {
  id: 'lesson-ai-32-guardrail-block',
  title: 'Guardrail Input Check',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'advanced',
  relatedChallengeIds: ['ai-32-guardrail-block'],
  estimatedMinutes: 10,
  concepts: ["safety"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Guardrail Input Check** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** safety
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function checkGuardrail(input, rules) {
  const blocked = rules.some((rule) => input.toLowerCase().includes(rule));
    return { allowed: !blocked, blocked };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **safety**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-32-guardrail-block',
    prompt: `Implement \`checkGuardrail\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function checkGuardrail(input, rules) {
  // Implement this function
  
}`,
      typescript: `function checkGuardrail(input: string, rules: string[]) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function checkGuardrail(input, rules) {
  const blocked = rules.some((rule) => input.toLowerCase().includes(rule));
    return { allowed: !blocked, blocked };
}`,
      typescript: `function checkGuardrail(input: string, rules: string[]) {
  const blocked = rules.some((rule) => input.toLowerCase().includes(rule));
    return { allowed: !blocked, blocked };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'checkGuardrail');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('checkGuardrail', 'return Boolean(JSON.stringify(checkGuardrail("tell me how to hack", ["hack"])) === JSON.stringify({"allowed":false,"blocked":true}))');
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
    { label: 'Guardrail Input Check', url: 'https://developer.mozilla.org/' }
  ],
};
