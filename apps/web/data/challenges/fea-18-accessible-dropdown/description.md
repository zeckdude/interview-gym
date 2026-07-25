# Accessible Dropdown

## What You're Building

Implement `createDropdown` — the logic behind an accessible dropdown/select component with keyboard navigation (ARIA listbox pattern).

## Requirements

- `createDropdown(options)` takes `{ items: string[], onSelect: (item: string) => void }`
- Returns `{ open(), close(), isOpen(), navigate(direction), selectCurrent(), getCurrentIndex(), getItems() }`
- `open()` opens the dropdown, sets currentIndex to 0
- `close()` closes, resets currentIndex to -1
- `navigate('next' | 'prev')` moves through items with wrapping
- `selectCurrent()` calls `onSelect` with the current item and closes the dropdown
- Keyboard equivalents: ArrowDown = next, ArrowUp = prev, Enter = selectCurrent, Escape = close

## Example

```js
let selected = '';
const dd = createDropdown({ items: ['Apple', 'Banana', 'Cherry'], onSelect: v => selected = v });

dd.open();
dd.getCurrentIndex(); // 0
dd.navigate('next');
dd.getCurrentIndex(); // 1
dd.selectCurrent();
selected; // 'Banana'
dd.isOpen(); // false
```

## Why This Comes Up in Interviews

Accessibility is a senior engineer responsibility. The ARIA listbox pattern is required for custom dropdowns used at every major company. This tests your understanding of keyboard navigation, focus management, and WCAG compliance.

## What You Need to Know

- ARIA roles: listbox, option, combobox
- Keyboard navigation: ArrowUp/Down, Enter, Escape, Tab
- roving tabindex pattern
- Why native `<select>` isn't always suitable (styling limitations)
