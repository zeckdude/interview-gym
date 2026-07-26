import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFea27BatchScheduler: Lesson = {
  id: 'lesson-fea-27-batch-scheduler',
  title: 'Batch Scheduler Factory',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'advanced',
  relatedChallengeIds: ['fea-27-batch-scheduler'],
  estimatedMinutes: 10,
  concepts: ["batching","scheduling","factories"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Batch Scheduler Factory** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** batching, scheduling, factories
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createBatchScheduler(onFlush, delayMs) {
  let queue = [];
    let scheduled = false;
    const flush = () => {
      scheduled = false;
      const batch = queue;
      queue = [];
      onFlush(batch);
    };
    return {
      push(item) {
        queue.push(item);
        if (!scheduled) {
          scheduled = true;
          setTimeout(flush, delayMs);
        }
      },
      size() { return queue.length; },
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **batching**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fea-27-batch-scheduler',
    prompt: `Implement \`createBatchScheduler(onFlush, delayMs)\` — collect items and flush as a batch after a delay.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function createBatchScheduler(onFlush, delayMs) {
  // Implement this function
  
}`,
      typescript: `function createBatchScheduler(onFlush: (batch: number[]) => void, delayMs: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createBatchScheduler(onFlush, delayMs) {
  let queue = [];
    let scheduled = false;
    const flush = () => {
      scheduled = false;
      const batch = queue;
      queue = [];
      onFlush(batch);
    };
    return {
      push(item) {
        queue.push(item);
        if (!scheduled) {
          scheduled = true;
          setTimeout(flush, delayMs);
        }
      },
      size() { return queue.length; },
    };
}`,
      typescript: `function createBatchScheduler(onFlush: (batch: number[]) => void, delayMs: number) {
  let queue = [];
    let scheduled = false;
    const flush = () => {
      scheduled = false;
      const batch = queue;
      queue = [];
      onFlush(batch);
    };
    return {
      push(item) {
        queue.push(item);
        if (!scheduled) {
          scheduled = true;
          setTimeout(flush, delayMs);
        }
      },
      size() { return queue.length; },
    };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createBatchScheduler');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createBatchScheduler', `return Boolean((function () {
                  const batches = [];
                  const scheduler = createBatchScheduler((batch) => batches.push(batch), 50);
                  scheduler.push(1);
                  scheduler.push(2);
                  return scheduler.size() === 2;
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
    { label: 'Batch Scheduler Factory', url: 'https://developer.mozilla.org/' }
  ],
};
