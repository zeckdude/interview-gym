# forwardRef Input

## What You're Building

Implement `createRefableInput` — the pattern behind `React.forwardRef`. It allows a parent to hold a ref to a child's internal element and control it programmatically.

## Requirements

- `createRefableInput(options?)` creates a controlled input-like object
- Returns `{ getValue(), setValue(v), focus(), blur(), getRef() }`
- `getRef()` returns an object that can be stored and used by the parent
- `focus()` marks the input as focused
- `blur()` marks the input as unfocused
- `isFocused()` returns current focus state

## Example

```js
const input = createRefableInput({ placeholder: 'Search...' });
const ref = input.getRef();

ref.focus(); // parent programmatically focuses the input
ref.isFocused(); // true

input.setValue('hello');
input.getValue(); // 'hello'
```

## Why This Comes Up in Interviews

`forwardRef` is required when building reusable input components that need to expose imperative methods like `focus()` and `scroll()`. It's used in every serious component library (Material UI, Headless UI, shadcn/ui).

## What You Need to Know

- `React.forwardRef((props, ref) => ...)` signature
- `useImperativeHandle` for exposing custom methods via ref
- When refs are needed vs. controlled components
- The difference between ref and state
