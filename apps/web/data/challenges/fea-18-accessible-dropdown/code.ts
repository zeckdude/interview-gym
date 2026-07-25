export const starterTs = `function createDropdown(options: { items: string[]; onSelect: (item: string) => void }) {
  // Implement accessible dropdown logic

  return {
    open(): void {},
    close(): void {},
    isOpen(): boolean { return false; },
    navigate(_direction: 'next' | 'prev'): void {},
    selectCurrent(): void {},
    getCurrentIndex(): number { return -1; },
    getItems(): string[] { return options.items; },
  };
}

export { createDropdown };`;

export const starterJs = `function createDropdown({ items, onSelect }) {
  // Implement accessible dropdown logic

  return {
    open() {},
    close() {},
    isOpen() { return false; },
    navigate(direction) {},
    selectCurrent() {},
    getCurrentIndex() { return -1; },
    getItems() { return items; },
  };
}

module.exports = { createDropdown };`;

export const solutionTs = `function createDropdown(options: { items: string[]; onSelect: (item: string) => void }) {
  let open = false;
  let currentIndex = -1;
  const { items, onSelect } = options;

  return {
    open(): void { open = true; currentIndex = 0; },
    close(): void { open = false; currentIndex = -1; },
    isOpen(): boolean { return open; },
    navigate(direction: 'next' | 'prev'): void {
      if (!open || items.length === 0) return;
      if (direction === 'next') {
        currentIndex = (currentIndex + 1) % items.length;
      } else {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
      }
    },
    selectCurrent(): void {
      if (open && currentIndex >= 0 && currentIndex < items.length) {
        onSelect(items[currentIndex]);
        open = false;
        currentIndex = -1;
      }
    },
    getCurrentIndex(): number { return currentIndex; },
    getItems(): string[] { return items; },
  };
}

export { createDropdown };`;

export const solutionJs = `function createDropdown({ items, onSelect }) {
  let open = false;
  let currentIndex = -1;

  return {
    open() { open = true; currentIndex = 0; },
    close() { open = false; currentIndex = -1; },
    isOpen() { return open; },
    navigate(direction) {
      if (!open || items.length === 0) return;
      if (direction === 'next') {
        currentIndex = (currentIndex + 1) % items.length;
      } else {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
      }
    },
    selectCurrent() {
      if (open && currentIndex >= 0 && currentIndex < items.length) {
        onSelect(items[currentIndex]);
        open = false;
        currentIndex = -1;
      }
    },
    getCurrentIndex() { return currentIndex; },
    getItems() { return items; },
  };
}

module.exports = { createDropdown };`;
