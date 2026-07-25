# Throttle Function

## What You're Building

Implement a `throttle` function that limits how often a function can be called — ensuring it fires at most once per `delay` milliseconds, no matter how often it's invoked.

## Requirements

- `throttle(fn, delay)` returns a throttled version of `fn`
- The throttled function fires immediately on the first call
- Subsequent calls within `delay` ms are ignored
- After `delay` ms passes, the next call fires immediately again

## Example

```js
const throttled = throttle(() => console.log('fired'), 200);

throttled(); // fires immediately
throttled(); // ignored (within 200ms)
throttled(); // ignored
// 200ms later...
throttled(); // fires again
```

## Why This Comes Up in Interviews

Throttle is the sibling of debounce and equally important for UI performance. Use throttle for scroll handlers, resize events, and any event that fires at high frequency but should only trigger real work periodically.

## What You Need to Know

- The difference between debounce (wait for silence) and throttle (fire at most every N ms)
- Tracking the last execution timestamp with `Date.now()`
- First-call-fires behavior
