import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonEventEmitter: Lesson = {
  id: 'lesson-event-emitter',
  title: 'Node.js EventEmitter — Custom Events',
  category: 'be',
  difficulty: 'intermediate',
  relatedChallengeIds: ["be-08-event-emitter"],
  estimatedMinutes: 10,
  concepts: ["EventEmitter","on","emit"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Node.js EventEmitter** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** EventEmitter, on, emit
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createEmitter() {
  const listeners = {};
  return {
    on(event, fn) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(fn);
    },
    emit(event, data) {
      (listeners[event] || []).forEach((fn) => fn(data));
    },
  };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **EventEmitter**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-event-emitter',
    prompt: `Complete the mini EventEmitter — on registers listeners, emit calls them with data.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function createEmitter() {
  const listeners = {};
  return {
    on(event, fn) { /* store listener */ },
    emit(event, data) { /* call listeners */ },
  };
}`,
      typescript: `function createEmitter() {
  const listeners: Record<string, Array<(data: unknown) => void>> = {};
  return {
    on(event: string, fn: (data: unknown) => void) { /* store listener */ },
    emit(event: string, data: unknown) { /* call listeners */ },
  };
}`,
    },
    solution: {
      javascript: `function createEmitter() {
  const listeners = {};
  return {
    on(event, fn) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(fn);
    },
    emit(event, data) {
      (listeners[event] || []).forEach((fn) => fn(data));
    },
  };
}`,
      typescript: `function createEmitter() {
  const listeners: Record<string, Array<(data: unknown) => void>> = {};
  return {
    on(event: string, fn: (data: unknown) => void) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(fn);
    },
    emit(event: string, data: unknown) {
      (listeners[event] || []).forEach((fn) => fn(data));
    },
  };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createEmitter');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createEmitter', 'return Boolean((() => { let v = 0; const e = createEmitter(); e.on(\'x\', (d) => { v = d; }); e.emit(\'x\', 42); return v === 42; })())');
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
    { label: 'EventEmitter — Node.js', url: 'https://nodejs.org/api/events.html' }
  ],
};
