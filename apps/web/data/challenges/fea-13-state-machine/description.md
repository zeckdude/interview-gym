# Finite State Machine

## What You're Building

Implement `createStateMachine` — a simple FSM used to model UI state transitions (fetch lifecycle, form states, multi-step wizard).

## Requirements

- `createStateMachine({ initial, states })` where `states` is `{ [state]: { on: { [event]: nextState } } }`
- Returns `{ send(event), getState(), can(event) }`
- `send(event)` transitions to next state if transition is valid; no-op if not
- `getState()` returns current state string
- `can(event)` returns true if the event is valid in the current state

## Example

```js
const machine = createStateMachine({
  initial: 'idle',
  states: {
    idle:    { on: { FETCH: 'loading' } },
    loading: { on: { SUCCESS: 'success', FAILURE: 'error' } },
    success: { on: { RESET: 'idle' } },
    error:   { on: { RETRY: 'loading', RESET: 'idle' } },
  },
});

machine.getState(); // 'idle'
machine.send('FETCH');
machine.getState(); // 'loading'
machine.send('SUCCESS');
machine.getState(); // 'success'
machine.can('RESET'); // true
machine.can('FETCH'); // false
```

## Why This Comes Up in Interviews

FSMs model predictable, bug-free UI state. Libraries like XState are based on this pattern. Implementing one from scratch demonstrates strong systems thinking and knowledge of predictable state management.

## What You Need to Know

- FSM: states, transitions, events
- Why FSMs prevent impossible states (you can't be loading and success at the same time)
- XState basics
- How this maps to fetch lifecycle states
