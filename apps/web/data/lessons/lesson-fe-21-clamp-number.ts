import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFe21ClampNumber: Lesson = {
  id: 'lesson-fe-21-clamp-number',
  title: 'Clamp Number to Range',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  relatedChallengeIds: ['fe-21-clamp-number'],
  estimatedMinutes: 12,
  concepts: ['numbers', 'min/max', 'comparison'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
You're building a volume slider. The UI lets users drag from 0–100, but your audio API only accepts 0–10. Without a clamp helper, every input handler needs scattered \`if\` checks.

Interviewers use \`clamp\` as a **warm-up question** — it tests whether you know the standard library and can handle boundary values cleanly in one line.
      `,
    },
    {
      type: 'explanation',
      title: 'How Clamping Works',
      content: `
**Clamp** means: if the value is below the minimum, return the minimum; if above the maximum, return the maximum; otherwise return the value unchanged.

The idiomatic one-liner uses **nested min/max**:

- \`Math.max(min, value)\` — raises anything below \`min\`
- \`Math.min(max, …)\` — caps anything above \`max\`

**Order matters:** \`Math.min(max, Math.max(min, value))\` — max-of-min first, then min-of-max.
      `,
    },
    {
      type: 'code-example',
      title: 'Basic Example',
      language: 'javascript',
      content: `function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

clamp(15, 0, 10);  // 10 — capped at max
clamp(-3, 0, 10);  // 0  — raised to min
clamp(7, 0, 10);   // 7  — unchanged`,
    },
    {
      type: 'code-example',
      title: 'Interview Variation',
      language: 'javascript',
      content: `// Interviewer adds: "What if min > max?"
function clamp(value, min, max) {
  if (min > max) {
    // Swap so the range is valid — mention this out loud
    [min, max] = [max, min];
  }
  return Math.min(max, Math.max(min, value));
}

// Interviewer adds: "Clamp a scroll position"
function clampScroll(scrollY, contentHeight, viewportHeight) {
  const maxScroll = Math.max(0, contentHeight - viewportHeight);
  return clamp(scrollY, 0, maxScroll);
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"I'd use \`if (value < min) return min; if (value > max) return max;\`"** — That works, but interviewers want the one-liner. Also mention: **what if \`min > max\`?** Your function should either swap them or throw — don't silently return wrong results.
      `,
    },
    {
      type: 'gotcha',
      title: 'When NOT to Use Clamp',
      content: `
**Clamp is wrong for validation with error messages.** If the user typed an invalid credit card number, you don't clamp it — you show an error.

**Clamp is wrong for wrapping.** A clock that goes from 23 → 0 needs modulo (\`% 24\`), not clamping.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fe-21-clamp-number',
    prompt: `Implement \`clamp(value, min, max)\` — constrain a number to an inclusive range.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function clamp(value, min, max) {
  // Implement this function
  
}`,
      typescript: `function clamp(value: number, min: number, max: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}`,
      typescript: `function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'clamp');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('clamp', `return Boolean(clamp(15, 0, 10) === 10);`);
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
    { label: 'Math.min — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min' },
    { label: 'Math.max — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max' },
    { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' },
  ],
};
