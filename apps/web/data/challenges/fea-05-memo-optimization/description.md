# React.memo Optimization

## What You're Building

Implement `createMemoComponent` — the logic behind `React.memo`. It wraps a "render function" and skips re-rendering if props haven't changed.

## Requirements

- `createMemoComponent(renderFn, areEqual?)` returns a component-like object
- `areEqual(prevProps, nextProps)` defaults to shallow equality
- `render(props)` calls `renderFn(props)` only if props changed
- After first render with given props, identical props return cached output
- Custom `areEqual` can override the comparison logic

## Example

```js
let renderCount = 0;
const Button = createMemoComponent((props) => {
  renderCount++;
  return \`<button>\${props.label}</button>\`;
});

Button.render({ label: 'Click me' }); // renders (count=1)
Button.render({ label: 'Click me' }); // cached (count=1)
Button.render({ label: 'Submit' });   // renders (count=2)
```

## Why This Comes Up in Interviews

`React.memo` is the most common performance optimization in React. Understanding when it helps (and when it doesn't — e.g., with new object references) shows senior-level React knowledge.

## What You Need to Know

- Shallow equality: compare each top-level prop by reference
- The difference between shallow and deep equality
- Why `React.memo` doesn't help when you pass new object/function references
- When NOT to use memo (premature optimization)
