# Pipe and Compose

## What You're Building

Implement `pipe` and `compose` — two fundamental functional programming utilities for chaining functions together.

## Requirements

- `pipe(f, g, h)` applies functions left-to-right: `h(g(f(x)))`
- `compose(f, g, h)` applies functions right-to-left: `f(g(h(x)))`
- Both accept any number of functions
- Both return a new function that takes an initial value and runs it through the chain
- With a single function, returns that function

## Example

```js
const double = (x) => x * 2;
const addOne = (x) => x + 1;
const square = (x) => x * x;

const transform = pipe(double, addOne, square);
transform(3); // → ((3*2)+1)² = 49

const transform2 = compose(square, addOne, double);
transform2(3); // → square(addOne(double(3))) = 49
```

## Why This Comes Up in Interviews

Pipe and compose are staples of functional programming — used in Lodash/fp, Ramda, Redux middleware, and React component composition. They demonstrate fluency with higher-order functions and reduce.

## What You Need to Know

- `Array.prototype.reduce` and `reduceRight`
- Function composition: `f(g(x))`
- Why `pipe` and `compose` are inverses of each other
