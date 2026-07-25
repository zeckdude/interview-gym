import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonSse: Lesson = {
  id: 'lesson-sse',
  title: 'Server-Sent Events — Real-Time Without WebSockets',
  category: 'fe',
  difficulty: 'advanced',
  relatedChallengeIds: ["fea-15-websocket-chat"],
  estimatedMinutes: 10,
  concepts: ["SSE","EventSource"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Server-Sent Events** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** SSE, EventSource
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function parseSseLine(line) {
  if (!line.includes(':')) return null;
  const [type, ...rest] = line.split(':');
  return { type: type.trim(), value: rest.join(':').trim() };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **SSE**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-sse',
    prompt: `Parse an SSE line like data: hello into { type, value }.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function parseSseLine(line) {
  
}`,
      typescript: `function parseSseLine(line: string): { type: string; value: string } | null {
  
}`,
    },
    solution: {
      javascript: `function parseSseLine(line) {
  if (!line.includes(':')) return null;
  const [type, ...rest] = line.split(':');
  return { type: type.trim(), value: rest.join(':').trim() };
}`,
      typescript: `function parseSseLine(line: string): { type: string; value: string } | null {
  if (!line.includes(':')) return null;
  const [type, ...rest] = line.split(':');
  return { type: type.trim(), value: rest.join(':').trim() };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'parseSseLine');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('parseSseLine', 'return Boolean(parseSseLine(\'data: hello\').value === \'hello\')');
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
    { label: 'Server-sent events — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events' }
  ],
};
