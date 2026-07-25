# Modal Focus Trap

## What You're Building

Implement `createFocusTrap` — the accessibility mechanism that keeps keyboard focus inside a modal dialog while it's open.

## Requirements

- `createFocusTrap(container)` returns `{ activate(), deactivate() }`
- `activate()` — focuses the first focusable element inside `container`, adds Tab key trapping
- `deactivate()` — removes the event listener and returns focus to the previously focused element
- Tab key cycles through focusable elements within `container`
- Shift+Tab cycles in reverse
- Focusable selectors: `'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'`

## Example

```js
const trap = createFocusTrap(document.getElementById('modal'));
trap.activate();   // traps Tab inside #modal
trap.deactivate(); // releases Tab, restores focus
```

## Why This Comes Up in Interviews

Focus management is essential for accessibility (a11y). Modals without focus traps are unusable for keyboard-only users and fail WCAG 2.1 SC 2.1.2. Senior engineers are expected to know this pattern.

## What You Need to Know

- `querySelectorAll` for finding focusable elements
- `document.activeElement` for saving/restoring focus
- `KeyboardEvent.key === 'Tab'` and `event.shiftKey`
- `event.preventDefault()` to intercept Tab
- `element.focus()` to programmatically focus elements
