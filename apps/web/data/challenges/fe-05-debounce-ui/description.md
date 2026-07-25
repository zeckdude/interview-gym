# Debounced Search Input

## What You're Building

Implement a `debounce` function for UI interactions — the same pattern used in every search input that delays API calls until the user stops typing.

## Requirements

- `debounce(fn, delay)` returns a debounced version of `fn`
- The debounced function waits `delay` ms after the LAST call before executing
- Rapid calls reset the timer — only the last one fires
- Returns the debounced function directly (no `.cancel()` needed for this version)

## Example

```js
const handleSearch = debounce((query) => {
  fetchResults(query);
}, 300);

// User types quickly: 'r', 're', 'rea', 'reac', 'react'
handleSearch('r');     // timer resets
handleSearch('re');    // timer resets
handleSearch('react'); // 300ms later → fetchResults('react')
```

## Why This Comes Up in Interviews

Debounce is one of the most practical performance patterns in frontend development. You'll use it in search bars, window resize handlers, and form validators. It's a top-5 FE interview topic.

## What You Need to Know

- `setTimeout` / `clearTimeout`
- Closure to maintain the timer ID
- Why rapid calls should collapse into one execution
