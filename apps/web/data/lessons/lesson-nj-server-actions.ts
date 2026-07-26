import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNjServerActions: Lesson = {
  id: 'lesson-nj-server-actions',
  title: 'Server Actions & Mutations',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'intermediate',
  relatedChallengeIds: ['nj-06-server-actions', 'nj-15-optimistic-updates-server-actions'],
  estimatedMinutes: 16,
  concepts: ["'use server'", 'form actions', 'progressive enhancement', 'useActionState', 'revalidation'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Server Actions** are async functions marked with \`'use server'\` that run only on the server but can be called directly from a component — no hand-written API route needed.

Passed directly to a \`<form action={...}>\`, they work **even before JavaScript loads** — the browser does a native form POST that Next.js intercepts. This is progressive enhancement for free.

**The pieces that fit together:**
- \`useActionState\` — lets a form read a serializable return value from the action (e.g. \`{ error: 'Title required' }\`) to show validation messages
- \`useFormStatus\` — gives a child of the form a \`pending\` boolean, so a submit button can show a spinner without prop drilling
- \`revalidatePath\` / \`revalidateTag\` — called manually **inside** the action after a mutation, since Next.js has no way to know your database changed on its own

**Security reminder:** a Server Action is still a public HTTP endpoint under the hood. "Only my form calls it" is not an auth boundary — always re-check permissions inside the action itself.
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'typescript',
      content: `// actions.ts
'use server';
export async function createPost(prevState: unknown, formData: FormData) {
  const title = formData.get('title') as string;
  if (!title) return { error: 'Title is required' };

  await db.post.create({ data: { title } });
  revalidatePath('/posts');
  return { error: null };
}

// form.tsx
'use client';
function PostForm() {
  const [state, formAction] = useActionState(createPost, { error: null });
  return (
    <form action={formAction}>
      <input name="title" />
      {state.error && <p>{state.error}</p>}
      <SubmitButton />
    </form>
  );
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"I hid the delete button for non-admins, so the action is safe."** Hiding UI is not authorization. Anyone can call a Server Action directly via a crafted request — always re-verify the user's identity and permissions **inside the action itself**, not just in the component that renders the trigger.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-server-actions',
    prompt: `Implement createSafeAction(handler) — wraps a Server-Action-style handler so any thrown error becomes a serializable { success: false, error } result instead of an unhandled exception, matching the shape useActionState expects.`,
    timeLimitSeconds: 150,
    starterCode: {
      javascript: `function createSafeAction(handler) {
  
}`,
      typescript: `function createSafeAction<T>(
  handler: (formData: Map<string, unknown>) => T
): (formData: Map<string, unknown>) => { success: true; data: T } | { success: false; error: string } {
  
}`,
    },
    solution: {
      javascript: `function createSafeAction(handler) {
  return function (formData) {
    try {
      const data = handler(formData);
      return { success: true, data };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : String(e) };
    }
  };
}`,
      typescript: `function createSafeAction<T>(
  handler: (formData: Map<string, unknown>) => T
): (formData: Map<string, unknown>) => { success: true; data: T } | { success: false; error: string } {
  return (formData) => {
    try {
      const data = handler(formData);
      return { success: true, data };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : String(e) };
    }
  };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'createSafeAction');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function(
          'createSafeAction',
          `const action = createSafeAction((fd) => {
            const name = fd.get('name');
            if (!name) throw new Error('Name required');
            return { name };
          });
          const ok1 = action(new Map([['name', 'Alice']]));
          const ok2 = action(new Map());
          return Boolean(
            ok1.success === true && ok1.data.name === 'Alice' &&
            ok2.success === false && typeof ok2.error === 'string'
          );`
        );
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
    { label: 'Server Actions and Mutations — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations' },
    { label: 'useActionState — React Docs', url: 'https://react.dev/reference/react/useActionState' },
  ],
};
