# Portal Modal

## What You're Building

Implement `createModalManager` — the state management logic behind a portal-based modal system, similar to how `ReactDOM.createPortal` works conceptually.

## Requirements

- `createModalManager()` returns `{ open(content), close(), isOpen(), getContent() }`
- `open(content)` opens the modal with the given content
- `close()` closes the modal
- `isOpen()` returns boolean
- `getContent()` returns the current content (or null when closed)
- Only one modal can be open at a time — opening a new one replaces the current

## Example

```js
const modal = createModalManager();

modal.isOpen();    // false
modal.open('Are you sure?');
modal.isOpen();    // true
modal.getContent(); // 'Are you sure?'
modal.close();
modal.isOpen();    // false
modal.getContent(); // null
```

## Why This Comes Up in Interviews

Portal modals require managing state that renders "outside" the current DOM tree. Understanding the separation between state (where this challenge focuses) and DOM positioning (ReactDOM.createPortal) shows architectural clarity.

## What You Need to Know

- Portals: rendering into a DOM node outside the component tree
- Why modals use portals (to escape CSS overflow/z-index constraints)
- Modal state: open/closed, content
- Global state management patterns
