import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNjServerClientComponents: Lesson = {
  id: 'lesson-nj-server-client-components',
  title: 'Server vs Client Components — The Mental Model',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'intermediate',
  relatedChallengeIds: ['nj-02-server-client-components', 'nj-03-static-dynamic-rendering'],
  estimatedMinutes: 15,
  concepts: ['server components', 'client components', "'use client' boundary", 'bundle size', 'composition'],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
Every component in the App Router is a **Server Component by default** — it renders on the server, never ships its JS to the browser, and can \`await\` data directly.

Adding \`'use client'\` at the top of a file doesn't just make *that* component interactive — it marks the **start of a client boundary**. Every module that file imports underneath it also gets bundled and shipped to the browser, whether or not those child files have their own directive.

**The mental model:** think of \`'use client'\` as a line in the tree. Everything *above* the line stays server-only (small bundle, direct data access). Everything *below* the line ships to the browser (interactive, but costs bytes).

**The best pattern:** push \`'use client'\` as far down the tree as possible — a small, focused interactive leaf (a button, a dropdown) — and keep the surrounding layout, data fetching, and static content as Server Components. You can even pass Server Components **as children** into a Client Component, so the server-rendered content is "slotted in" without becoming part of the client bundle itself.
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'typescript',
      content: `// ServerContent.tsx — a Server Component, stays server-only
export default async function ServerContent() {
  const data = await getData();
  return <p>{data.title}</p>;
}

// ClientShell.tsx
'use client';
export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)}>Toggle</button>
      {open && children}
    </div>
  );
}

// page.tsx — a Server Component composing both
export default function Page() {
  return (
    <ClientShell>
      <ServerContent /> {/* passed as children, NOT imported inside ClientShell */}
    </ClientShell>
  );
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
**"I can import a Server Component directly inside a Client Component file and it'll still render on the server."** It won't — once you \`import\` a component into a \`'use client'\` file, it's treated as part of that client subtree.

The fix is the **children/props pattern** shown above: a parent Server Component renders both pieces and passes the Server Component down as \`children\` (or another prop) to the Client Component, which just needs to know *where* to render it — not *how* it was built.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-server-client-components',
    prompt: `Implement getClientBundle(files) — given a list of module descriptors ({ name, useClient, imports }), return a sorted array of component names that end up shipped to the client: every file with 'use client' itself, plus everything it imports (transitively).`,
    timeLimitSeconds: 180,
    starterCode: {
      javascript: `function getClientBundle(files) {
  
}`,
      typescript: `interface FileDescriptor {
  name: string;
  useClient: boolean;
  imports: string[];
}

function getClientBundle(files: FileDescriptor[]): string[] {
  
}`,
    },
    solution: {
      javascript: `function getClientBundle(files) {
  const byName = new Map(files.map((f) => [f.name, f]));
  const clientSet = new Set();

  function visit(name) {
    if (clientSet.has(name)) return;
    clientSet.add(name);
    const file = byName.get(name);
    if (!file) return;
    for (const imported of file.imports) visit(imported);
  }

  for (const file of files) {
    if (file.useClient) visit(file.name);
  }

  return Array.from(clientSet).sort();
}`,
      typescript: `interface FileDescriptor {
  name: string;
  useClient: boolean;
  imports: string[];
}

function getClientBundle(files: FileDescriptor[]): string[] {
  const byName = new Map(files.map((f) => [f.name, f]));
  const clientSet = new Set<string>();

  function visit(name: string) {
    if (clientSet.has(name)) return;
    clientSet.add(name);
    const file = byName.get(name);
    if (!file) return;
    for (const imported of file.imports) visit(imported);
  }

  for (const file of files) {
    if (file.useClient) visit(file.name);
  }

  return Array.from(clientSet).sort();
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'getClientBundle');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function(
          'getClientBundle',
          `const files = [
            { name: 'Page', useClient: false, imports: ['Layout'] },
            { name: 'Layout', useClient: false, imports: ['Sidebar'] },
            { name: 'Sidebar', useClient: true, imports: ['Icon'] },
            { name: 'Icon', useClient: false, imports: [] },
          ];
          return Boolean(JSON.stringify(getClientBundle(files)) === JSON.stringify(['Icon', 'Sidebar']));`
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
    { label: 'Server and Client Components — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components' },
    { label: 'Client Components — Next.js Docs', url: 'https://nextjs.org/docs/app/building-your-application/rendering/client-components' },
  ],
};
