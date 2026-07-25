# Context API Theme

## What You're Building

Implement a `createContext` function — a simplified version of React's Context API — that enables any component to access shared state without prop drilling.

## Requirements

- `createContext(defaultValue)` returns `{ Provider, useContext }`
- `Provider` wraps a context value: `Provider.setValue(value)` sets the current context value
- `useContext()` returns the current context value (or default if no Provider)
- A Provider can update its value, and `useContext()` reflects the update
- Multiple contexts can coexist independently

## Example

```js
const ThemeContext = createContext('light');

ThemeContext.Provider.setValue('dark');
ThemeContext.useContext(); // → 'dark'

ThemeContext.Provider.setValue('light');
ThemeContext.useContext(); // → 'light'

const AnotherContext = createContext(42);
AnotherContext.useContext(); // → 42 (independent)
```

## Why This Comes Up in Interviews

React Context is the go-to solution for global state without Redux. Understanding how it works under the hood — essentially a shared mutable cell — helps you use it correctly and diagnose performance issues.

## What You Need to Know

- Shared mutable state via closure
- Default values when no Provider is present
- Context isolation (each `createContext` call is independent)
