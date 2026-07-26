import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFea28PubSub: Lesson = {
  id: 'lesson-fea-28-pub-sub',
  title: 'Pub/Sub Factory',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'advanced',
  relatedChallengeIds: ['fea-28-pub-sub'],
  estimatedMinutes: 10,
  concepts: ["events","pub/sub","factories"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Pub/Sub Factory** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** events, pub/sub, factories
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createPubSub() {
  const listeners = new Map();
    return {
      subscribe(event, fn) {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event).add(fn);
        return () => listeners.get(event)?.delete(fn);
      },
      publish(event, payload) {
        for (const fn of listeners.get(event) ?? []) fn(payload);
      },
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **events**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fea-28-pub-sub',
    prompt: `Implement \`createPubSub()\` — minimal event bus with subscribe and publish.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function createPubSub() {
  // Implement this function
  
}`,
      typescript: `function createPubSub() {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createPubSub() {
  const listeners = new Map();
    return {
      subscribe(event, fn) {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event).add(fn);
        return () => listeners.get(event)?.delete(fn);
      },
      publish(event, payload) {
        for (const fn of listeners.get(event) ?? []) fn(payload);
      },
    };
}`,
      typescript: `function createPubSub() {
  const listeners = new Map();
    return {
      subscribe(event, fn) {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event).add(fn);
        return () => listeners.get(event)?.delete(fn);
      },
      publish(event, payload) {
        for (const fn of listeners.get(event) ?? []) fn(payload);
      },
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createPubSub');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createPubSub', `return Boolean((function () {
                  const bus = createPubSub();
                  let received = null;
                  bus.subscribe('msg', (p) => { received = p; });
                  bus.publish('msg', 42);
                  return received === 42;
                })());`);
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
    { label: 'Pub/Sub Factory', url: 'https://developer.mozilla.org/' }
  ],
};
