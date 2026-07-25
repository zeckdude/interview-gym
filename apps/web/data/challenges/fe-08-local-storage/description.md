# LocalStorage Hook

## What You're Building

Implement a `createStorage` factory that provides a type-safe wrapper around `localStorage` with JSON serialization and fallback values.

## Requirements

- `createStorage(key, defaultValue)` returns `{ get(), set(value), remove(), clear() }`
- `get()` reads and deserializes from localStorage; returns `defaultValue` if missing or corrupted
- `set(value)` serializes and stores the value
- `remove()` removes the key from localStorage
- Never throws — always handles JSON parse errors gracefully
- Works with any JSON-serializable type

## Example

```js
const prefs = createStorage('user-prefs', { theme: 'light' });

prefs.get();            // → { theme: 'light' } (default if not set)
prefs.set({ theme: 'dark' });
prefs.get();            // → { theme: 'dark' }
prefs.remove();
prefs.get();            // → { theme: 'light' } (back to default)
```

## Why This Comes Up in Interviews

localStorage is used in virtually every frontend app for persisting user preferences, auth tokens, and session data. A typed wrapper shows you understand serialization, error handling, and clean API design.

## What You Need to Know

- `localStorage.getItem()` / `setItem()` / `removeItem()`
- `JSON.parse` / `JSON.stringify`
- try/catch for graceful error handling
- Defaulting to provided value on missing or invalid data
