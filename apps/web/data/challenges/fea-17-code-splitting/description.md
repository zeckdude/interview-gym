# Code Splitting & Lazy Loading

## What You're Building

Implement `createLazyLoader` — the pattern behind `React.lazy()` and dynamic `import()`. It loads a module on-demand and caches the result.

## Requirements

- `createLazyLoader(loader)` wraps an async loader function
- Returns `{ load(), getStatus(), getModule(), reset() }`
- Status: `'idle' | 'loading' | 'loaded' | 'error'`
- `load()` triggers the async load (no-op if already loading/loaded)
- Returns the same Promise if called multiple times while loading
- `getModule()` returns the loaded module (or null)
- `reset()` resets back to idle state

## Example

```js
const lazy = createLazyLoader(() => Promise.resolve({ default: MyComponent }));

lazy.getStatus(); // 'idle'
await lazy.load();
lazy.getStatus(); // 'loaded'
lazy.getModule(); // { default: MyComponent }

// called again — uses cache
const p = lazy.load();
await p;
lazy.getStatus(); // still 'loaded'
```

## Why This Comes Up in Interviews

Code splitting is critical for performance. `React.lazy()` and `Suspense` work together to defer component loading. Implementing the loader proves you understand async module loading, caching, and the Suspense data-fetching contract.

## What You Need to Know

- Dynamic `import()` returns a Promise<module>
- React.lazy() wraps a dynamic import
- Suspense reads a "thrown Promise" to know when to show a fallback
- Module caching prevents double-loading
