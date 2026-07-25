# Event Delegation

## What You're Building

Implement `addDelegatedListener` — a function that uses event delegation to attach a single listener to a parent element and handle events from matching child elements.

## Requirements

- `addDelegatedListener(parent, eventType, selector, handler)` attaches ONE listener to `parent`
- The handler fires when an event bubbles up from a child matching `selector`
- `handler` receives the matched element and the original event
- Returns a cleanup function that removes the listener
- Works with any CSS selector

## Example

```js
const cleanup = addDelegatedListener(
  document.getElementById('list'),
  'click',
  '.item',
  (el, event) => {
    console.log('Clicked item:', el.dataset.id);
  }
);

// Later:
cleanup(); // removes the event listener
```

## Why This Comes Up in Interviews

Event delegation is a critical performance pattern — instead of attaching listeners to every child element, you attach one to the parent. It's foundational for list rendering, dynamic content, and memory-efficient UIs.

## What You Need to Know

- `event.target` — the element that was actually clicked
- `Element.closest(selector)` — walks up the DOM tree to find a matching ancestor
- `addEventListener` / `removeEventListener`
- Why delegation is better than per-element listeners
