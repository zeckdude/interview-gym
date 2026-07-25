# useReducer Counter

## What You're Building

Implement a `createReducerStore` function that mimics React's `useReducer` hook — a predictable state management pattern where all state transitions go through a reducer function.

## Requirements

- `createReducerStore(reducer, initialState)` returns `{ getState(), dispatch(action) }`
- `reducer(state, action)` returns the new state (pure function, no side effects)
- `dispatch(action)` calls the reducer and updates state
- `getState()` returns the current state
- Supports multiple action types
- State is immutable — the reducer must return a new object, never mutate

## Example

```js
const counter = createReducerStore(
  (state, action) => {
    switch (action.type) {
      case 'INCREMENT': return { count: state.count + 1 };
      case 'DECREMENT': return { count: state.count - 1 };
      case 'RESET': return { count: 0 };
      default: return state;
    }
  },
  { count: 0 }
);

counter.dispatch({ type: 'INCREMENT' });
counter.dispatch({ type: 'INCREMENT' });
counter.getState(); // → { count: 2 }
counter.dispatch({ type: 'RESET' });
counter.getState(); // → { count: 0 }
```

## Why This Comes Up in Interviews

`useReducer` is the foundation of Redux and the recommended pattern for complex state in React. Understanding reducers proves you can reason about state machines, predictable updates, and the unidirectional data flow principle.

## What You Need to Know

- Pure functions: same input → same output, no side effects
- Action objects: `{ type: string, payload?: any }`
- State transitions: all changes through dispatch
- Why reducers must not mutate state
