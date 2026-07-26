import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonFea30ResourceLoader: Lesson = {
  id: 'lesson-fea-30-resource-loader',
  title: 'Resource Loader Factory',
  category: 'fe-advanced',
  topLevel: 'fe',
  subcategory: 'react',
  difficulty: 'advanced',
  relatedChallengeIds: ['fea-30-resource-loader'],
  estimatedMinutes: 10,
  concepts: ["async","loading state","factories"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Resource Loader Factory** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** async, loading state, factories
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function createResourceLoader() {
  const resources = new Map();
    return {
      async load(id, fetcher) {
        if (resources.has(id)) return resources.get(id);
        const promise = fetcher().then((data) => {
          resources.set(id, { status: 'success', data });
          return data;
        }).catch((error) => {
          resources.set(id, { status: 'error', error });
          throw error;
        });
        resources.set(id, { status: 'loading', promise });
        return promise;
      },
      getState(id) {
        return resources.get(id) ?? { status: 'idle' };
      },
    };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **async**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-fea-30-resource-loader',
    prompt: `Implement \`createResourceLoader()\` — load async resources with idle/loading/success/error state.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function createResourceLoader() {
  // Implement this function
  
}`,
      typescript: `function createResourceLoader() {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function createResourceLoader() {
  const resources = new Map();
    return {
      async load(id, fetcher) {
        if (resources.has(id)) return resources.get(id);
        const promise = fetcher().then((data) => {
          resources.set(id, { status: 'success', data });
          return data;
        }).catch((error) => {
          resources.set(id, { status: 'error', error });
          throw error;
        });
        resources.set(id, { status: 'loading', promise });
        return promise;
      },
      getState(id) {
        return resources.get(id) ?? { status: 'idle' };
      },
    };
}`,
      typescript: `function createResourceLoader() {
  const resources = new Map();
    return {
      async load(id, fetcher) {
        if (resources.has(id)) return resources.get(id);
        const promise = fetcher().then((data) => {
          resources.set(id, { status: 'success', data });
          return data;
        }).catch((error) => {
          resources.set(id, { status: 'error', error });
          throw error;
        });
        resources.set(id, { status: 'loading', promise });
        return promise;
      },
      getState(id) {
        return resources.get(id) ?? { status: 'idle' };
      },
    };
}`,
    },
    validate: async (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createResourceLoader');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('createResourceLoader', `return ((async () => {
                  const loader = createResourceLoader();
                  const data = await loader.load('user', async () => ({ id: 1 }));
                  const state = loader.getState('user');
                  return data.id === 1 && state.status === 'success';
                })());`);
        const ok = Boolean(await testRunner(result.value));
        return ok
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check the requirements and try again.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Resource Loader Factory', url: 'https://developer.mozilla.org/' }
  ],
};
