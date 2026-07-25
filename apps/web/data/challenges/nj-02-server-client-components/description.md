# Server vs Client Components

## What You're Building

Every component in the App Router is a **Server Component by default**. It only becomes a **Client Component** once you add the `'use client'` directive — and you should only add it when the component truly needs the browser. Implement `analyzeComponent()`, a linter-style function that inspects a component's source and decides whether it needs that directive.

## Requirements

A component needs `'use client'` if it:

- Already declares `'use client'` at the top (explicit opt-in)
- Uses a stateful/interactive hook — `useState`, `useEffect`, `useReducer`, `useRef`, `useContext`, `useLayoutEffect`, `useImperativeHandle`
- Attaches a DOM event handler — `onClick`, `onChange`, `onSubmit`, etc.
- Touches a browser-only global — `window`, `document`, `localStorage`, `sessionStorage`, `navigator`

> **Expected Output**
>
> `analyzeComponent(source)` returns `{ needsClientDirective: boolean, reasons: string[] }` — `reasons` lists every rule that was triggered, and `needsClientDirective` is `true` whenever `reasons.length > 0`.

## Example

```ts
analyzeComponent(`
  function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  }
`);
// → { needsClientDirective: true, reasons: [...] }

analyzeComponent(`
  async function ProductList() {
    const products = await getProducts();
    return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
  }
`);
// → { needsClientDirective: false, reasons: [] }
```

## Why This Comes Up in Interviews

Picking the wrong component boundary is the #1 App Router mistake — either shipping too much JS to the client, or trying to use hooks in a Server Component and getting a build error. Interviewers ask this to see if you reason about **where code runs**, not just how to write it.

## What You Need to Know

- Server Components run only on the server — smaller bundles, direct data access, no hooks or browser APIs
- Client Components hydrate in the browser — required for interactivity and state
- `'use client'` marks the **boundary**: everything imported below it also ships to the browser
- Keep the client boundary as low in the tree as possible to minimize JS sent to the browser
