import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonStateMachines: Lesson = {
  id: 'lesson-state-machines',
  title: 'Finite State Machines for UI',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'intermediate',
  relatedChallengeIds: ["fea-13-state-machine"],
  estimatedMinutes: 11,
  concepts: ["FSM","transitions"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Finite State Machines for UI** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** FSM, transitions
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function transition(state, event, machine) {
  return machine[state]?.[event] ?? state;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **FSM**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-state-machines',
    prompt: `Implement FSM transition — return next state or stay if invalid.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function transition(state, event, machine) {
  
}`,
      typescript: `function transition(state: string, event: string, machine: Record<string, Record<string, string>>): string {
  
}`,
    },
    solution: {
      javascript: `function transition(state, event, machine) {
  return machine[state]?.[event] ?? state;
}`,
      typescript: `function transition(state: string, event: string, machine: Record<string, Record<string, string>>): string {
  return machine[state]?.[event] ?? state;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'transition');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('transition', 'return Boolean(transition(\'idle\', \'START\', { idle: { START: \'loading\' } }) === \'loading\')');
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
    { label: 'Finite state machine — MDN', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Finite_state_machine' }
  ],
};
