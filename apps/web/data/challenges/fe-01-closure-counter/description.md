# Closure Counter

## What You're Building

Implement a `createCounter` function that uses a closure to maintain private state — a counter that can be incremented, decremented, and reset.

## Requirements

- `createCounter(initial?)` creates a counter starting at `initial` (default: 0)
- Returns `{ increment(), decrement(), reset(), getCount() }`
- `increment()` adds 1 to the count
- `decrement()` subtracts 1 from the count
- `reset()` returns count to its initial value
- `getCount()` returns the current count (number)
- The count variable must be private (not directly accessible)

## Example

```js
const counter = createCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.decrement(); // 11
counter.reset();     // back to 10
counter.getCount();  // 10
```

## Why This Comes Up in Interviews

Closures are one of the most fundamental JavaScript concepts. This challenge demonstrates that you understand lexical scoping, private state without classes, and the factory function pattern.

## What You Need to Know

- Closures: inner functions that capture outer variables
- Factory functions vs. classes
- Private state through closure scope
