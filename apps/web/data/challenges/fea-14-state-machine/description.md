# State Machine

## What You're Building

Implement a `createStateMachine` function — a finite state machine that manages state transitions through defined events.

## Requirements

- `createStateMachine({ initial, states })` returns `{ getState(), send(event) }`
- `states` maps state names to their allowed transitions: `{ [state]: { [event]: nextState } }`
- `send(event)` transitions to the next state if the transition is defined; otherwise stays in current state
- `getState()` returns the current state string
- Transitions are deterministic: same state + same event → same next state always

## Example

```js
const trafficLight = createStateMachine({
  initial: 'red',
  states: {
    red: { GO: 'green' },
    green: { SLOW: 'yellow' },
    yellow: { STOP: 'red' },
  },
});

trafficLight.getState(); // 'red'
trafficLight.send('GO');
trafficLight.getState(); // 'green'
trafficLight.send('SLOW');
trafficLight.getState(); // 'yellow'
trafficLight.send('INVALID'); // stays 'yellow'
```

## Why This Comes Up in Interviews

State machines are the mathematically rigorous approach to managing UI state. They eliminate impossible states and make transitions explicit. XState is a popular React library built on this concept. Senior engineers who understand state machines write more reliable, predictable code.

## What You Need to Know

- Finite state machines: a set of states, events, and transitions
- Why state machines eliminate "impossible states"
- The difference between state (what you're in) and events (what triggers transitions)
