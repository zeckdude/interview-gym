# Event Emitter

## What You're Building

Implement an `EventEmitter` class — the core pattern behind Node.js event-driven programming.

## Requirements

- `on(event, listener)` — registers a listener for an event
- `off(event, listener)` — removes a specific listener
- `emit(event, ...args)` — calls all listeners for an event with the given arguments
- `once(event, listener)` — registers a one-time listener that auto-removes after first call
- Supports multiple listeners per event
- Emitting an event with no listeners registered does nothing (no error)

## Example

```js
const emitter = new EventEmitter();

emitter.on('data', (x) => console.log('got', x));
emitter.emit('data', 42); // logs 'got 42'

let count = 0;
emitter.once('click', () => count++);
emitter.emit('click');
emitter.emit('click'); // count is 1, not 2

const handler = () => {};
emitter.on('test', handler);
emitter.off('test', handler);
emitter.emit('test'); // nothing happens
```

## Why This Comes Up in Interviews

EventEmitter is THE foundational pattern in Node.js. Understanding it shows you understand event-driven architecture. It's a top-10 interview question for senior engineers.

## What You Need to Know

- `Map` for storing event → listeners
- `Set` or `Array` for multiple listeners per event
- The `once` pattern: wrap the listener, auto-remove after first call
- `Function.prototype.call` / spread args
