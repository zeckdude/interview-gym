import type { ConceptualQuestion } from './types';

export const feQuestions: ConceptualQuestion[] = [
  {
    id: 'fe-q-01',
    category: 'fe-question',
    question: 'Explain the JavaScript event loop. What is the difference between the call stack, microtask queue, and macrotask queue?',
    difficulty: 'intermediate',
    concepts: ['event loop', 'call stack', 'microtasks', 'macrotasks', 'async'],
    modelAnswer: `The JavaScript event loop is a single-threaded mechanism that enables non-blocking code execution.

**Call stack** — where synchronous code executes. Functions are pushed on entry and popped on return. Only one frame executes at a time.

**Microtask queue** — high-priority async work: Promise callbacks (.then/.catch/.finally), async/await continuations, queueMicrotask(). The event loop drains the ENTIRE microtask queue after each task before moving on. This means chained Promises all resolve before the next setTimeout fires.

**Macrotask queue (task queue)** — lower-priority: setTimeout, setInterval, setImmediate, I/O events, UI rendering. Only ONE macrotask is processed per event loop turn, then microtasks drain fully again.

Order of execution: call stack → microtask queue (drain completely) → one macrotask → microtask queue (drain) → one macrotask → ...

Example: \`setTimeout(() => console.log('timeout'), 0); Promise.resolve().then(() => console.log('promise'));\` → logs "promise" then "timeout" because the promise microtask runs before the setTimeout macrotask.

This matters for performance: runaway microtasks (infinite promise chain) can starve rendering and I/O.`,
    keyTerms: ['event loop', 'call stack', 'microtask', 'macrotask', 'Promise', 'setTimeout', 'drain', 'single-threaded', 'async/await'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-02',
    category: 'fe-question',
    question: 'What is the difference between var, let, and const? Explain hoisting and the temporal dead zone.',
    difficulty: 'easy',
    concepts: ['hoisting', 'temporal dead zone', 'scope', 'var', 'let', 'const'],
    modelAnswer: `**var** is function-scoped (or global if outside functions) and is hoisted to the top of its scope with the value \`undefined\`. This means you can reference a \`var\` variable before its declaration without a ReferenceError — it's just \`undefined\`.

**let** and **const** are block-scoped (scoped to the nearest \`{}\`). They are also hoisted but NOT initialized — accessing them before their declaration throws a \`ReferenceError\`. This uninitialized state is the **Temporal Dead Zone (TDZ)**.

**const** additionally requires initialization at declaration and prevents reassignment (but does NOT make objects immutable — you can still mutate their properties).

**Hoisting** is JavaScript's behavior of moving declarations to the top of their scope during the compilation phase. With var, both the declaration and initialization to \`undefined\` happen. With let/const, only the declaration is hoisted (creating the TDZ).

Best practice: use \`const\` by default, \`let\` when reassignment is needed, and avoid \`var\` entirely in modern code. This prevents entire classes of bugs (accidental re-declaration, accessing before initialization).`,
    keyTerms: ['var', 'let', 'const', 'hoisting', 'temporal dead zone', 'block-scoped', 'function-scoped', 'ReferenceError', 'TDZ'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-03',
    category: 'fe-question',
    question: 'What is closure in JavaScript? Give a practical use case.',
    difficulty: 'easy',
    concepts: ['closure', 'lexical scope', 'private state', 'factory functions'],
    modelAnswer: `A closure is a function that "remembers" the variables from its outer scope even after that outer function has returned. In JavaScript, every function creates a closure — it has access to its own scope, the outer function's scope, and the global scope.

**How it works:** When a function is defined, it captures a reference to the environment (lexical scope) where it was created. If the outer function returns, the inner function still holds a reference to those variables, preventing garbage collection.

**Practical use cases:**

1. **Private state / factory functions:** \`function createCounter() { let count = 0; return { increment: () => ++count, get: () => count }; }\` — \`count\` is private, inaccessible from outside.

2. **Partial application / currying:** \`const add = (a) => (b) => a + b;\` — the inner function closes over \`a\`.

3. **Event handlers with captured context:** A click handler can close over a specific item's data without needing to re-query the DOM.

4. **Memoization:** A cache Map in the outer scope is shared across all invocations of the memoized function.

Closures are fundamental to React hooks — useState and useEffect close over the render's props and state values.`,
    keyTerms: ['closure', 'lexical scope', 'outer function', 'private state', 'factory function', 'capture', 'garbage collection'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-04',
    category: 'fe-question',
    question: 'How does the browser render a web page? Explain the critical rendering path.',
    difficulty: 'intermediate',
    concepts: ['critical rendering path', 'DOM', 'CSSOM', 'render tree', 'layout', 'paint'],
    modelAnswer: `The critical rendering path is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on screen.

**Steps:**
1. **Parse HTML → DOM** — the browser parses HTML bytes into a Document Object Model tree
2. **Parse CSS → CSSOM** — CSS is parsed into a CSS Object Model. CSS blocks rendering (it's render-blocking)
3. **JavaScript execution** — parser-blocking scripts (without \`async\`/\`defer\`) stop HTML parsing, execute JS, which can modify the DOM/CSSOM
4. **Render tree construction** — DOM + CSSOM = Render Tree (only visible elements; \`display:none\` is excluded)
5. **Layout (Reflow)** — calculates exact position and size of every element. Expensive for deep trees
6. **Paint** — fills in pixels — colors, text, images, borders, shadows
7. **Compositing** — layers are composited in the correct order on the GPU

**Performance implications:**
- Minimize render-blocking resources (inline critical CSS, defer non-critical JS)
- Reduce layout thrashing (batch DOM reads and writes)
- Use \`will-change\` or transforms to promote elements to GPU layers
- Use \`requestAnimationFrame\` for JS animations to sync with the paint cycle

LCP, FID, and CLS (Core Web Vitals) all measure different aspects of this pipeline.`,
    keyTerms: ['critical rendering path', 'DOM', 'CSSOM', 'render tree', 'layout', 'paint', 'reflow', 'compositing', 'render-blocking'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-05',
    category: 'fe-question',
    question: 'What is the virtual DOM in React and why was it introduced? Is it still the best approach?',
    difficulty: 'intermediate',
    concepts: ['virtual DOM', 'reconciliation', 'React', 'diffing', 'performance'],
    modelAnswer: `The Virtual DOM is an in-memory JavaScript representation of the actual DOM. When state changes, React creates a new virtual DOM tree, diffs it against the previous one (reconciliation), and applies only the minimal set of changes to the real DOM.

**Why it was introduced:** Direct DOM manipulation is expensive — layout and paint are triggered on every change. The Virtual DOM batches and minimizes DOM operations, improving performance for highly dynamic UIs. It also provides a declarative API: you describe what the UI should look like, React figures out how to get there.

**How reconciliation works:** React uses a heuristic O(n) algorithm. Keys are used to match list items across renders. Without keys, React falls back to position-based matching, causing incorrect reuse. The fiber architecture (React 16+) made reconciliation interruptible and prioritizable.

**Is it still the best approach?** It depends. Svelte and Solid.js compile templates to fine-grained DOM update code at build time — no virtual DOM, no runtime reconciliation overhead, faster for many use cases. React's React Compiler (formerly React Forget) now auto-memoizes components to reduce reconciliation overhead.

The virtual DOM's main value is developer experience (declarative, componentized) — not raw performance.`,
    keyTerms: ['virtual DOM', 'reconciliation', 'diffing', 'fiber', 'keys', 'declarative', 'Svelte', 'React Compiler', 'memoization'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-06',
    category: 'fe-question',
    question: 'Explain React hooks: why were they introduced, and how do useState and useEffect work internally?',
    difficulty: 'intermediate',
    concepts: ['React hooks', 'useState', 'useEffect', 'closures', 'fiber'],
    modelAnswer: `React hooks were introduced in React 16.8 to bring state and lifecycle features to function components. Before hooks, these required class components — leading to complex lifecycle methods (\`componentDidMount\`, \`componentDidUpdate\`, \`componentWillUnmount\`), \`this\` binding issues, and difficulty sharing stateful logic between components.

**How useState works internally:** React maintains a linked list of "hooks" per component fiber node. Each \`useState\` call corresponds to an index in this list. On first render, the state is initialized. On re-render, the hook at each index returns the current state value. This is why hooks must be called in the same order every render — the order determines which state value maps to which hook call.

**How useEffect works:** After the browser paints, React runs effects. The dependency array determines when to re-run: empty \`[]\` = once after mount, specific deps = re-run when those change, no array = after every render. The cleanup function runs before the next effect and on unmount. Internally, React compares current deps to previous deps using Object.is().

**Rules of hooks:** Only call at the top level (no conditionals/loops), only in React functions. These rules exist because hook state is stored by call order.`,
    keyTerms: ['useState', 'useEffect', 'closure', 'fiber', 'dependency array', 'cleanup', 'hooks order', 'function components'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-07',
    category: 'fe-question',
    question: 'What is the difference between CSS grid and flexbox? When would you use each?',
    difficulty: 'easy',
    concepts: ['CSS grid', 'flexbox', 'layout', 'two-dimensional', 'one-dimensional'],
    modelAnswer: `**Flexbox** is a one-dimensional layout system — it distributes items along a single axis (row or column). It excels at distributing space among items of unknown size, aligning items within a container, and creating flexible row/column layouts.

**CSS Grid** is a two-dimensional layout system — it controls both rows and columns simultaneously. It excels at creating complex page layouts where you need precise control over both dimensions.

**When to use Flexbox:**
- Navigation bars, toolbars, button groups
- Aligning items within a container (centering, space-between)
- Dynamic item sizes where you want flexible shrink/grow
- Single-row or single-column layouts

**When to use Grid:**
- Page-level layouts (header, sidebar, main, footer)
- Card grids with equal heights across rows
- Complex overlapping layouts (where items span multiple rows/columns)
- Any layout where you need both row and column control

**Key insight:** Use Grid for the macro layout (page structure), Flexbox for micro layout (item alignment within components). They complement each other — a grid cell can be a flex container.

Both are now well-supported in all modern browsers. You rarely need float-based layouts or positioning tricks for general layout.`,
    keyTerms: ['flexbox', 'grid', 'one-dimensional', 'two-dimensional', 'alignment', 'layout', 'row', 'column'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-08',
    category: 'fe-question',
    question: 'What is accessibility (a11y)? What ARIA roles and keyboard patterns are most important for a senior FE engineer to know?',
    difficulty: 'intermediate',
    concepts: ['accessibility', 'ARIA', 'keyboard navigation', 'screen reader', 'WCAG'],
    modelAnswer: `Accessibility (a11y) means ensuring web content is usable by everyone, including people with disabilities who use assistive technologies like screen readers, switch controls, or keyboard-only navigation.

**Why it matters:** ~15% of the global population has a disability. WCAG 2.1 AA compliance is legally required in many jurisdictions (ADA, EAA). It also improves SEO and usability for everyone.

**ARIA (Accessible Rich Internet Applications)** provides semantic meaning to elements that HTML alone doesn't convey. Key roles:
- \`role="button"\`, \`role="dialog"\`, \`role="listbox"\`, \`role="alert"\`
- \`aria-label\`, \`aria-labelledby\` — provide accessible names
- \`aria-expanded\`, \`aria-selected\`, \`aria-checked\` — communicate state
- \`aria-live\` — announce dynamic content changes to screen readers
- Rule: always prefer native HTML elements (\`<button>\`, \`<select>\`) over ARIA-enhanced divs

**Critical keyboard patterns:**
- Tab/Shift+Tab: move between focusable elements
- Enter/Space: activate buttons
- Arrow keys: navigate within widgets (menus, listboxes, tabs)
- Escape: close dialogs and menus
- Focus trapping in modals (prevent Tab from leaving the modal)
- Roving tabindex for complex widgets (only one item in the group is tabstop)

Tools: axe DevTools, Lighthouse accessibility audit, VoiceOver (macOS), NVDA (Windows).`,
    keyTerms: ['accessibility', 'ARIA', 'screen reader', 'keyboard navigation', 'WCAG', 'focus management', 'aria-label', 'dialog', 'roving tabindex'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-09',
    category: 'fe-question',
    question: 'What is TypeScript? What are its main benefits, and what are generics used for?',
    difficulty: 'easy',
    concepts: ['TypeScript', 'type safety', 'generics', 'static analysis', 'interfaces'],
    modelAnswer: `TypeScript is a statically-typed superset of JavaScript that compiles to plain JavaScript. It adds optional type annotations, interfaces, enums, and advanced type system features.

**Benefits:**
- **Catch bugs at compile time** — type errors found during development, not at runtime in production
- **Better IDE support** — autocomplete, refactoring, and go-to-definition work accurately because the editor knows types
- **Self-documenting code** — function signatures communicate intent (no need to guess what an argument is)
- **Safe refactoring** — renaming a function shows every call site that must be updated
- **Better teamwork** — interfaces define contracts between components and teams

**Generics** enable you to write code that works with multiple types while preserving type safety:

\`\`\`typescript
// Without generics: loses type information
function identity(arg: unknown): unknown { return arg; }

// With generics: preserves type information
function identity<T>(arg: T): T { return arg; }
const str = identity('hello'); // inferred as string
const num = identity(42);      // inferred as number
\`\`\`

Generics are used in: data structures (Array<T>, Map<K, V>), API wrappers (\`fetch<User>(url)\`), React components (useState<User>(null)), utility types (Partial<T>, Pick<T, K>).

TypeScript's structural typing (duck typing) means types are compatible if they have the same shape — no explicit "implements" needed.`,
    keyTerms: ['TypeScript', 'static typing', 'generics', 'type safety', 'interface', 'compile time', 'autocomplete', 'structural typing'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-10',
    category: 'fe-question',
    question: 'What is the difference between SSR, SSG, ISR, and CSR in Next.js? When would you use each?',
    difficulty: 'intermediate',
    concepts: ['SSR', 'SSG', 'ISR', 'CSR', 'Next.js', 'rendering strategies'],
    modelAnswer: `**CSR (Client-Side Rendering)** — the server sends a minimal HTML shell, JavaScript runs in the browser to fetch data and render the UI. Best for: authenticated dashboards, highly interactive apps. Downsides: poor SEO, slow initial load.

**SSR (Server-Side Rendering)** — HTML is generated on the server for every request. Data is fresh on every load. Best for: personalized pages, pages with user-specific data, real-time dashboards. Downsides: server latency on every request, can't be cached at the CDN edge without careful setup.

**SSG (Static Site Generation)** — HTML is generated at build time. Pages served as static files from a CDN — fastest possible delivery. Best for: marketing pages, blogs, documentation, any content that rarely changes. Downsides: stale between builds, re-deploy needed for content updates.

**ISR (Incremental Static Regeneration)** — static pages with a revalidation TTL. The first request after TTL expires triggers background regeneration; subsequent users get the fresh page. Best for: e-commerce product pages, news articles — content changes occasionally but doesn't need to be real-time.

**Next.js App Router** blurs these lines: Server Components fetch data on the server per-request (like SSR) but with composable, granular caching. Use \`cache: 'no-store'\` for SSR behavior, \`cache: 'force-cache'\` with \`revalidate\` for ISR.`,
    keyTerms: ['SSR', 'SSG', 'ISR', 'CSR', 'Next.js', 'revalidation', 'CDN', 'static', 'server components'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-11',
    category: 'fe-question',
    question: 'What are Core Web Vitals? Explain LCP, CLS, and INP and how to optimize each.',
    difficulty: 'intermediate',
    concepts: ['Core Web Vitals', 'LCP', 'CLS', 'INP', 'performance', 'Lighthouse'],
    modelAnswer: `Core Web Vitals are Google's user-centric performance metrics that directly impact SEO rankings and user experience.

**LCP (Largest Contentful Paint)** — time until the largest visible element (image, text block) is rendered. Target: < 2.5s. Optimize by: preloading hero images (\`<link rel="preload">\`), serving images in WebP/AVIF, using a CDN, eliminating render-blocking resources, server-side rendering above-fold content.

**CLS (Cumulative Layout Shift)** — unexpected layout shifts during the page lifecycle. Target: < 0.1. Causes: images without explicit width/height, dynamic content injected above existing content, web fonts causing text reflow. Fix by: always set image dimensions, use \`font-display: optional\` or preload fonts, reserve space for dynamic content (\`min-height\`).

**INP (Interaction to Next Paint)** — measures the latency of ALL interactions during a page visit, taking the worst-case. Replaced FID in March 2024. Target: < 200ms. Optimize by: breaking up long tasks with \`scheduler.yield()\` or setTimeout, reducing JavaScript execution time, using debounce/throttle for frequent events, avoiding synchronous layout reads in event handlers (layout thrashing).

**Tools:** Chrome DevTools Performance panel, Lighthouse, PageSpeed Insights, Web Vitals Chrome extension, real-user monitoring with the web-vitals library.`,
    keyTerms: ['LCP', 'CLS', 'INP', 'Core Web Vitals', 'layout shift', 'interaction latency', 'preload', 'CDN', 'long tasks', 'SEO'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-12',
    category: 'fe-question',
    question: 'What is lazy loading in React? How do React.lazy() and Suspense work together?',
    difficulty: 'easy',
    concepts: ['React.lazy', 'Suspense', 'code splitting', 'dynamic import', 'bundle size'],
    modelAnswer: `Lazy loading defers loading JavaScript until it's needed, reducing initial bundle size and improving page load performance.

**React.lazy()** wraps a dynamic import to create a lazily-loaded component:
\`\`\`jsx
const HeavyChart = React.lazy(() => import('./HeavyChart'));
\`\`\`
The component's code is only fetched when it's first rendered.

**Suspense** handles the loading state while the lazy component is being fetched:
\`\`\`jsx
<Suspense fallback={<Spinner />}>
  <HeavyChart data={data} />
</Suspense>
\`\`\`
When the lazy component is loading, React renders the fallback. When loaded, it replaces the fallback with the real component. Without Suspense wrapping a lazy component, React throws an error.

**How it works internally:** React.lazy() returns a special component type that "throws" a Promise (the import Promise) when first rendered. Suspense catches this thrown Promise, renders the fallback, and re-renders when the Promise resolves.

**Best practices:**
- Split at route level (each page loaded separately)
- Split heavy components (charts, rich text editors, maps)
- Preload on hover/focus for perceived performance: \`const load = () => import('./Modal')\`
- In Next.js, use \`dynamic()\` which extends React.lazy with SSR support and named exports`,
    keyTerms: ['React.lazy', 'Suspense', 'dynamic import', 'code splitting', 'bundle', 'fallback', 'loading', 'Next.js dynamic'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-13',
    category: 'fe-question',
    question: 'What is the purpose of keys in React lists? What happens if you use array index as a key?',
    difficulty: 'easy',
    concepts: ['React keys', 'reconciliation', 'list rendering', 'component identity'],
    modelAnswer: `Keys help React identify which items in a list have changed, been added, or removed during reconciliation. Without keys (or with wrong keys), React can't efficiently update the DOM and may produce incorrect results.

**How reconciliation uses keys:** When comparing old and new lists, React matches elements by key. If a key matches, React assumes it's the same component and updates it. If no matching key exists, React creates a new component. Keys must be unique among siblings.

**Why index keys are problematic:**
When you use array index as key, adding/removing/reordering items causes React to mismatch component identity with data. Example: a list of [A, B, C] rendered as [key=0, key=1, key=2]. If you remove A, the new list [B, C] has [key=0, key=1]. React thinks it updated key=0 (A→B) and deleted key=2, rather than deleting A. This causes:
- Component state from A is incorrectly applied to B
- Unnecessary re-renders of all subsequent items
- Incorrect animations (items appear to shift/flash)
- Uncontrolled form inputs showing wrong values

**When index keys are safe:** static lists that never change order, and don't have per-item state.

**Best practice:** use stable, unique IDs from your data (database IDs, UUIDs) — never array indexes unless the list is truly static.`,
    keyTerms: ['keys', 'reconciliation', 'list rendering', 'index key', 'component identity', 'stable ID', 'reorder', 'state'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-14',
    category: 'fe-question',
    question: 'What is the CSS box model? Explain box-sizing: border-box and why it matters.',
    difficulty: 'easy',
    concepts: ['box model', 'box-sizing', 'padding', 'border', 'margin', 'content width'],
    modelAnswer: `The CSS box model describes how elements are sized and spaced. Every element is a rectangular box composed of four areas from inside out: **content**, **padding**, **border**, **margin**.

**Default (content-box) behavior:** \`width\` and \`height\` apply only to the content area. Padding and border are ADDED on top. So a \`width: 200px\` element with \`padding: 20px\` and \`border: 2px\` has a total width of 200 + 40 + 4 = 244px. This makes layouts unpredictable — changing padding breaks widths.

**border-box behavior:** \`width\` and \`height\` include padding and border. The content area shrinks to accommodate them. A \`width: 200px\` element with \`padding: 20px\` and \`border: 2px\` is exactly 200px total — content is 156px. This is the intuitive mental model for most developers.

**Why it matters:** With content-box, adding padding to a \`width: 100%\` element causes overflow. With border-box, it stays at 100%. Modern CSS resets include:
\`\`\`css
*, *::before, *::after { box-sizing: border-box; }
\`\`\`

This is included by default in Tailwind CSS and most CSS frameworks. Margin is always "outside" and not affected by box-sizing.`,
    keyTerms: ['box model', 'box-sizing', 'border-box', 'content-box', 'padding', 'border', 'margin', 'content area', 'width'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-15',
    category: 'fe-question',
    question: 'What is event bubbling and event delegation? How do you prevent an event from bubbling?',
    difficulty: 'easy',
    concepts: ['event bubbling', 'event delegation', 'stopPropagation', 'event capturing', 'performance'],
    modelAnswer: `**Event bubbling:** when a DOM event fires on an element, it propagates ("bubbles") upward through its ancestors to the document root. So a click on a \`<button>\` inside a \`<div>\` inside \`<body>\` triggers click handlers on the button, then the div, then body, then document, then window. Most events bubble (except \`focus\`, \`blur\`, \`mouseenter\`, \`mouseleave\`).

**Event capturing (trickling):** the opposite direction — events travel from window down to the target before bubbling. Enabled with \`addEventListener('click', handler, true)\`. Rarely used in practice.

**Stopping propagation:**
- \`event.stopPropagation()\` — stops the event from bubbling further
- \`event.stopImmediatePropagation()\` — also prevents other handlers on the same element from firing
- \`event.preventDefault()\` — prevents the browser's default action (form submit, link navigation) but does NOT stop bubbling

**Event delegation:** instead of attaching a listener to each child (e.g., 1000 list items), attach one listener to the parent and use \`event.target\` to identify which child was clicked. Benefits: fewer event listeners (better memory), works for dynamically added elements.

\`\`\`js
list.addEventListener('click', (e) => {
  const item = e.target.closest('li');
  if (item) handleItemClick(item);
});
\`\`\``,
    keyTerms: ['event bubbling', 'event delegation', 'stopPropagation', 'preventDefault', 'event.target', 'capturing', 'propagation', 'closest'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-16',
    category: 'fe-question',
    question: 'What is memoization in React (React.memo, useMemo, useCallback)? When should you use each?',
    difficulty: 'intermediate',
    concepts: ['React.memo', 'useMemo', 'useCallback', 'memoization', 're-renders', 'performance'],
    modelAnswer: `Memoization caches results and avoids recalculation when inputs haven't changed. In React, unnecessary re-renders are the main performance bottleneck.

**React.memo(Component)** — wraps a component to skip re-rendering if props haven't changed (shallow comparison). Use for: components that render often but receive the same props frequently, expensive components lower in the tree.

**useMemo(() => expr, deps)** — memoizes a computed value. Only recalculates when \`deps\` change. Use for: expensive calculations (sorting/filtering large arrays), creating stable references for objects/arrays that would otherwise be new on every render.

**useCallback(() => fn, deps)** — memoizes a function. Returns the same function reference until deps change. Use for: passing callbacks to React.memo-wrapped children (without useCallback, the parent creates a new function every render, breaking memo), dependencies for other hooks.

**When NOT to use:**
- Default should be NO memoization — measure first. Premature memoization adds complexity and the memo comparison itself has a cost.
- Don't use useMemo for simple calculations (adding two numbers)
- Don't use useCallback unless you have a React.memo'd child or a hook dependency

**Rule of thumb:** Profile first with React DevTools. Apply memoization where you see unnecessary re-renders causing actual performance issues, not preemptively.`,
    keyTerms: ['React.memo', 'useMemo', 'useCallback', 'memoization', 're-render', 'props', 'shallow comparison', 'performance', 'dependency'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-17',
    category: 'fe-question',
    question: 'What is the difference between controlled and uncontrolled components in React?',
    difficulty: 'easy',
    concepts: ['controlled components', 'uncontrolled components', 'form state', 'refs', 'React'],
    modelAnswer: `**Controlled components** — form element values are controlled by React state. The component renders with a value from state, and onChange updates that state. React is the single source of truth.

\`\`\`jsx
const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />
\`\`\`

**Uncontrolled components** — form element values are managed by the DOM itself. React reads the value via a ref when needed (e.g., on form submit) rather than on every keystroke.

\`\`\`jsx
const ref = useRef(null);
<input ref={ref} defaultValue="initial" />
// Read: ref.current.value on submit
\`\`\`

**When to use controlled:**
- When you need real-time validation, conditional formatting, or derived state
- When you need to sync with other UI elements
- Most form use cases — predictable and testable

**When to use uncontrolled:**
- Simple forms where you only need the value on submit
- Integrating with non-React code that manages the DOM
- File inputs (file input value can't be controlled by React)
- Performance-critical inputs with many rapid updates (avoid re-rendering on every keystroke)

React Hook Form is a popular library that uses uncontrolled components for performance, then collects values on submit.`,
    keyTerms: ['controlled', 'uncontrolled', 'form state', 'ref', 'onChange', 'defaultValue', 'single source of truth', 'React Hook Form'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-18',
    category: 'fe-question',
    question: 'What is a CSS custom property (CSS variable) and how does it differ from a preprocessor variable (SCSS)?',
    difficulty: 'easy',
    concepts: ['CSS variables', 'custom properties', 'SCSS', 'cascade', 'dynamic theming'],
    modelAnswer: `**CSS Custom Properties** (also called CSS variables) are properties defined by the author, prefixed with \`--\`. They are part of the browser's CSS engine and are live at runtime:

\`\`\`css
:root { --brand: #FF6B35; --spacing: 16px; }
.button { background: var(--brand); padding: var(--spacing); }
\`\`\`

**SCSS variables** are preprocessor constructs — they're replaced with literal values at compile time and don't exist in the output CSS. Once compiled, the values are static.

**Key differences:**
1. **Runtime** — CSS variables can change with JavaScript (\`el.style.setProperty('--brand', '#000')\`) or via media queries/cascade. SCSS variables cannot.
2. **Scoping** — CSS variables cascade and can be overridden in any scope (component-level, media query, dark mode). SCSS variables are scoped to their module.
3. **Dynamic theming** — dark mode, user preferences, component theming — all trivially achievable with CSS variables by changing values on \`:root\` or a scoped element.
4. **Browser DevTools** — CSS variables are inspectable and modifiable live. SCSS output is static.

**SCSS advantages:** more features (mixins, functions, loops), better for complex preprocessing logic, easier to use in older toolchains.

**Modern best practice:** use CSS custom properties for design tokens (colors, spacing, fonts) that may need to change at runtime or per-theme. Use SCSS/PostCSS for build-time computation.`,
    keyTerms: ['CSS variables', 'custom properties', 'SCSS', 'runtime', 'cascade', 'dynamic', 'theming', 'var()', 'setProperty'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-19',
    category: 'fe-question',
    question: 'What is tree shaking and how does it reduce JavaScript bundle size?',
    difficulty: 'intermediate',
    concepts: ['tree shaking', 'dead code elimination', 'ES modules', 'bundle size', 'webpack', 'rollup'],
    modelAnswer: `Tree shaking is a dead code elimination technique that removes unused JavaScript exports from the final bundle. The term comes from "shaking a tree" to make dead leaves (unused code) fall out.

**How it works:** Tree shaking relies on ES module static analysis. Because ES module imports (\`import { X } from 'module'\`) are statically analyzable at build time (unlike \`require()\` which is dynamic), bundlers (Webpack, Rollup, Vite) can determine which exports are never imported in any module. These are excluded from the output bundle.

Example: you import only \`format\` from a large \`lodash-es\` library. Tree shaking excludes all other lodash functions, potentially reducing bundle size by 90%.

**Requirements for tree shaking:**
1. ES modules (\`import\`/\`export\`) — CommonJS (\`require\`) cannot be tree-shaken
2. \`sideEffects: false\` in package.json (tells bundler the package has no side effects, enabling aggressive elimination)
3. Build tool support (Rollup, Webpack 2+, Vite)

**What prevents tree shaking:**
- CommonJS (\`module.exports\`) — dynamic and opaque
- Side effects (imports that modify globals: polyfills, CSS imports)
- Dynamic import patterns that can't be statically analyzed

**Best practices:** import specifically (\`import { debounce } from 'lodash-es'\` not \`import _ from 'lodash'\`), use ES-module-native packages, mark your own libraries with \`sideEffects: false\`.`,
    keyTerms: ['tree shaking', 'dead code elimination', 'ES modules', 'static analysis', 'bundle size', 'sideEffects', 'Webpack', 'Rollup', 'import'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'fe-q-20',
    category: 'fe-question',
    question: 'What is the difference between localStorage, sessionStorage, and cookies? When would you use each?',
    difficulty: 'easy',
    concepts: ['localStorage', 'sessionStorage', 'cookies', 'storage', 'security', 'persistence'],
    modelAnswer: `All three are client-side storage mechanisms, but they differ in scope, persistence, and server accessibility:

**localStorage:**
- Persistent until explicitly cleared (survives tab close, browser restart)
- ~5-10MB per origin
- Accessible only by JavaScript in the same origin — never sent to the server
- Synchronous API (\`localStorage.setItem/getItem\`)
- Use for: user preferences, draft content, cached data, theme settings

**sessionStorage:**
- Cleared when the tab is closed (not shared between tabs)
- Same size and API as localStorage
- Use for: multi-step form state within a session, temporary data scoped to one tab

**Cookies:**
- Can be set with an expiry date or session-only (cleared on browser close)
- Small size (~4KB per cookie)
- Sent to the server with every HTTP request (in headers) — this is their key differentiator
- \`HttpOnly\` flag prevents JavaScript access (XSS protection)
- \`Secure\` flag sends only over HTTPS
- \`SameSite\` prevents CSRF attacks
- Use for: authentication tokens (session IDs, JWTs sent to server), tracking, server-readable preferences

**Security notes:**
- Never store sensitive data (passwords, tokens) in localStorage — vulnerable to XSS
- Use \`HttpOnly\` cookies for auth tokens
- \`Secure\` + \`HttpOnly\` + \`SameSite=Strict\` is the secure cookie config

IndexedDB is a browser database for larger, structured data (hundreds of MB).`,
    keyTerms: ['localStorage', 'sessionStorage', 'cookies', 'HttpOnly', 'Secure', 'SameSite', 'persistence', 'XSS', 'CSRF', 'server'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
];
