# Rate Limiter

## What You're Building

Implement a `createRateLimiter` function that returns a rate-limited wrapper. It allows at most `maxCalls` calls within any `windowMs` millisecond window, then blocks until the window resets.

## Requirements

- `createRateLimiter(maxCalls, windowMs)` returns a `{ isAllowed() }` object
- `isAllowed()` returns `true` if the call is within the rate limit
- `isAllowed()` returns `false` if the limit has been exceeded for the current window
- The window is a sliding or fixed window — fixed is fine for this challenge
- Timestamps are tracked in memory — no external dependencies needed

## Example

```js
const limiter = createRateLimiter(3, 1000); // 3 calls per second

limiter.isAllowed(); // true  (1)
limiter.isAllowed(); // true  (2)
limiter.isAllowed(); // true  (3)
limiter.isAllowed(); // false (4 — limit hit)

// after 1000ms...
limiter.isAllowed(); // true  (window reset)
```

## Why This Comes Up in Interviews

Rate limiting is a fundamental API security and performance pattern. Senior engineers are expected to implement it from scratch. It combines time-based logic, windowing, and state management.

## What You Need to Know

- `Date.now()` for timestamps
- Sliding window: track all call timestamps, evict old ones
- Fixed window: reset count after window expires
- Array filtering to remove timestamps outside the window
