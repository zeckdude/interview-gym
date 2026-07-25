# Stream Transform

## What You're Building

Implement a `createTransformPipeline` function that chains transform functions over an array of values, similar to how Node.js Transform streams work — but implemented with pure functions.

## Requirements

- `createTransformPipeline(...transforms)` returns a `process(items)` function
- Each transform is `(item: T) => U` — maps one item to another
- `process(items)` applies all transforms in sequence to each item
- Returns the final transformed array
- Transforms can change the type of items

## Example

```js
const pipeline = createTransformPipeline(
  (s) => s.trim(),
  (s) => s.toUpperCase(),
  (s) => s + '!'
);

pipeline(['  hello  ', ' world ']);
// → ['HELLO!', 'WORLD!']
```

## Why This Comes Up in Interviews

Stream transformations and data pipelines are central to backend work. This tests your understanding of function composition, generic types, and pipeline architecture.

## What You Need to Know

- `Array.prototype.reduce` for chaining transforms
- Function composition: `f(g(x))`
- Generic type flow through a pipeline
