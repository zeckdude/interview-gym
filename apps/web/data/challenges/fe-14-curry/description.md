# Function Currying

## What You're Building

Implement a `curry` function that transforms a multi-argument function into a chain of single-argument functions.

## Requirements

- `curry(fn)` returns a curried version of `fn`
- The curried function can be called with one argument at a time: `add(1)(2)(3)`
- Or called with multiple arguments at once: `add(1, 2)(3)` or `add(1, 2, 3)`
- When all arguments are collected, the original function is called
- Works for functions of any arity

## Example

```js
const add = curry((a, b, c) => a + b + c);

add(1)(2)(3);    // → 6
add(1, 2)(3);    // → 6
add(1)(2, 3);    // → 6
add(1, 2, 3);    // → 6
```

## Why This Comes Up in Interviews

Currying is a functional programming concept used in libraries like Ramda, Lodash/fp, and in functional React patterns. It tests your understanding of closures, argument collection, and higher-order functions.

## What You Need to Know

- `Function.prototype.length` — the number of expected arguments
- Recursion: if not enough args yet, return another function
- Spread/rest arguments: collect args incrementally
