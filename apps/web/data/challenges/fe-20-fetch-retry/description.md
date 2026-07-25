# Fetch with Retry

## What You're Building

Implement a `fetchWithRetry` function that wraps the `fetch` API with automatic retry logic for network failures and server errors.

## Requirements

- `fetchWithRetry(url, options?, retries?)` returns a Promise
- `retries` defaults to 3
- Retries on network errors and 5xx responses
- Does NOT retry on 4xx client errors
- Returns the Response object on success
- Throws an error after all retries are exhausted

## Example

```js
// Automatic retry on 503 Service Unavailable
const response = await fetchWithRetry('/api/data', {}, 3);
// → tries up to 3 times, returns on first success
```

## Why This Comes Up in Interviews

Resilient HTTP clients are production-critical. Every frontend app that calls an API needs retry logic. This tests async control flow, error handling, and understanding of HTTP status codes.

## What You Need to Know

- `response.ok` — false for 4xx and 5xx
- `response.status` — differentiate 4xx (don't retry) vs 5xx (retry)
- Loops with try/catch for retry logic
- When to retry vs. fail fast
