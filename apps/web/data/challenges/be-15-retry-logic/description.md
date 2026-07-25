# Retry with Backoff

## What You're Building

Implement a `retryWithBackoff` function that retries a failing async operation with exponential backoff.

## Requirements

- `retryWithBackoff(fn, options)` returns a Promise
- `options.maxRetries` — max number of retry attempts (default: 3)
- `options.initialDelayMs` — delay before first retry (default: 100ms)
- `options.factor` — multiplier for each subsequent delay (default: 2)
- If `fn` succeeds, return its result immediately
- If `fn` fails on the final attempt, re-throw the error
- Delay sequence: 100ms → 200ms → 400ms (with factor 2)

## Example

```js
let attempts = 0;
const flaky = async () => {
  attempts++;
  if (attempts < 3) throw new Error('not yet');
  return 'success';
};

const result = await retryWithBackoff(flaky, { maxRetries: 3, initialDelayMs: 10 });
// result → 'success', attempts === 3
```

## Why This Comes Up in Interviews

Retry logic is essential for resilient distributed systems. Every production system that calls external APIs needs it. Interviewers use it to test async control flow, error handling, and exponential backoff understanding.

## What You Need to Know

- `async/await` with loops
- Exponential backoff: `delay = initialDelay * factor^attempt`
- `setTimeout` wrapped in a Promise: `new Promise(r => setTimeout(r, ms))`
- Re-throwing errors on final failure
