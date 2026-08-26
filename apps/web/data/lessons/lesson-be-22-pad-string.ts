import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonBe22PadString: Lesson = {
  id: 'lesson-be-22-pad-string',
  title: 'Pad String to Length',
  category: 'stack-javascript',
  topLevel: 'stack',
  subcategory: 'javascript',
  difficulty: 'easy',
  relatedChallengeIds: ['be-22-pad-string'],
  estimatedMinutes: 10,
  concepts: ["strings","padding"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Pad String to Length** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** strings, padding
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function padString(str, length, char = " ", side = "right") {
  const padChar = char ?? ' ';
    const padSide = side ?? 'right';
    const padLen = Math.max(0, length - str.length);
    const pad = padChar.repeat(padLen);
    return padSide === 'left' ? pad + str : str + pad;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **strings**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-be-22-pad-string',
    prompt: `Implement \`padString(str, length, char?, side?)\` — pad a string to a minimum length.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function padString(str, length, char = " ", side = "right") {
  // Implement this function
  
}`,
      typescript: `function padString(str: string, length: number, char?: string, side?: 'left' | 'right') {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function padString(str, length, char = " ", side = "right") {
  const padChar = char ?? ' ';
    const padSide = side ?? 'right';
    const padLen = Math.max(0, length - str.length);
    const pad = padChar.repeat(padLen);
    return padSide === 'left' ? pad + str : str + pad;
}`,
      typescript: `function padString(str: string, length: number, char?: string, side?: 'left' | 'right') {
  const padChar = char ?? ' ';
    const padSide = side ?? 'right';
    const padLen = Math.max(0, length - str.length);
    const pad = padChar.repeat(padLen);
    return padSide === 'left' ? pad + str : str + pad;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'padString');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('padString', `return Boolean(padString("hi", 5) === "hi   ");`);
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
    { label: 'Pad String to Length', url: 'https://developer.mozilla.org/' }
  ],
};
