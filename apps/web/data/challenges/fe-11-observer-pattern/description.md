# Observer Pattern

## What You're Building

Implement a `createObservable` function — a simple pub/sub system where subscribers receive notifications when the value changes.

## Requirements

- `createObservable(initialValue)` returns an observable with `get()`, `set()`, and `subscribe()` methods
- `get()` returns the current value
- `set(newValue)` updates the value and notifies all subscribers
- `subscribe(fn)` registers a callback that fires when the value changes
- `subscribe` returns an unsubscribe function
- Subscribers receive `(newValue, oldValue)` as arguments

## Example

```js
const name = createObservable('Alice');

const unsub = name.subscribe((newVal, oldVal) => {
  console.log(`changed from ${oldVal} to ${newVal}`);
});

name.set('Bob'); // logs 'changed from Alice to Bob'
name.get(); // → 'Bob'
unsub();    // unsubscribe
name.set('Carol'); // no log
```

## Why This Comes Up in Interviews

The Observer pattern is the foundation of every reactive state system — Vue's reactivity, MobX, Zustand, and RxJS are all built on this core idea. Understanding it proves you can reason about reactive programming.

## What You Need to Know

- Array of subscribers / listeners
- Notification loop when value changes
- Unsubscribe pattern (filter out the removed subscriber)
