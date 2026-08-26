import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonPubSub: Lesson = {
  id: 'lesson-pub-sub',
  title: 'Pub/Sub Pattern — Decoupled Communication',
  category: 'be-nodejs',
  topLevel: 'be',
  subcategory: 'nodejs',
  difficulty: 'intermediate',
  relatedChallengeIds: ["be-08-event-emitter","be-16-queue"],
  estimatedMinutes: 10,
  concepts: ["pub/sub","decoupling"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Pub/Sub Pattern** is a core interview topic. Understanding it deeply means you can explain trade-offs, not just recite syntax.

**Key concepts:** pub/sub, decoupling
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createPubSub() {
  const subs = {};
  return {
    subscribe(channel, fn) { if (!subs[channel]) subs[channel] = []; subs[channel].push(fn); },
    publish(channel, msg) { (subs[channel] || []).forEach((fn) => fn(msg)); },
  };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers love asking about edge cases for **pub/sub**. Always mention error handling and when NOT to use this pattern.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-pub-sub',
    prompt: `Complete pub/sub — subscribe adds listeners, publish notifies them.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function createPubSub() {
  const subs = {};
  return { subscribe(channel, fn) {}, publish(channel, msg) {} };
}`,
      typescript: `function createPubSub() {
  const subs: Record<string, Array<(msg: unknown) => void>> = {};
  return { subscribe(channel: string, fn: (msg: unknown) => void) {}, publish(channel: string, msg: unknown) {} };
}`,
    },
    solution: {
      javascript: `function createPubSub() {
  const subs = {};
  return {
    subscribe(channel, fn) { if (!subs[channel]) subs[channel] = []; subs[channel].push(fn); },
    publish(channel, msg) { (subs[channel] || []).forEach((fn) => fn(msg)); },
  };
}`,
      typescript: `function createPubSub() {
  const subs: Record<string, Array<(msg: unknown) => void>> = {};
  return {
    subscribe(channel: string, fn: (msg: unknown) => void) { if (!subs[channel]) subs[channel] = []; subs[channel].push(fn); },
    publish(channel: string, msg: unknown) { (subs[channel] || []).forEach((fn) => fn(msg)); },
  };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createPubSub');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createPubSub', 'return Boolean((() => { let m = \'\'; const ps = createPubSub(); ps.subscribe(\'news\', (x) => { m = x; }); ps.publish(\'news\', \'hi\'); return m === \'hi\'; })())');
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
    { label: 'Observer pattern — MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget' }
  ],
};
