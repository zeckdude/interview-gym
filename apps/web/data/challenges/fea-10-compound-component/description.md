# Compound Component

## What You're Building

Implement `createAccordion` — the logic behind a compound component pattern where parent and children share state through a closed scope.

## Requirements

- `createAccordion()` returns an accordion controller with `{ addPanel(id), expand(id), collapse(id), isExpanded(id), getExpandedIds() }`
- `addPanel(id)` registers a panel (starts collapsed)
- `expand(id)` expands a panel (only one can be expanded at a time)
- `collapse(id)` collapses a panel
- `isExpanded(id)` returns boolean
- `getExpandedIds()` returns array of currently expanded panel IDs

## Example

```js
const accordion = createAccordion();
accordion.addPanel('a');
accordion.addPanel('b');

accordion.expand('a');
accordion.isExpanded('a'); // true
accordion.isExpanded('b'); // false

accordion.expand('b');
accordion.isExpanded('a'); // false — only one open at a time
accordion.isExpanded('b'); // true
```

## Why This Comes Up in Interviews

Compound components (Tabs, Accordion, Select) are a popular advanced React pattern. They share state between a parent controller and child items using Context — understanding the state machine behind them shows you understand both the pattern and its implementation.

## What You Need to Know

- Compound component pattern in React
- Shared state via React Context
- The difference between uncontrolled and controlled accordion
- Accordion UX: usually only one panel open at a time
