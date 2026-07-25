export const starterTs = `function createModalManager<T = unknown>() {
  // Implement modal state management

  return {
    open(_content: T): void {},
    close(): void {},
    isOpen(): boolean { return false; },
    getContent(): T | null { return null; },
  };
}

export { createModalManager };`;

export const starterJs = `function createModalManager() {
  // Implement modal state management

  return {
    open(content) {},
    close() {},
    isOpen() { return false; },
    getContent() { return null; },
  };
}

module.exports = { createModalManager };`;

export const solutionTs = `function createModalManager<T = unknown>() {
  let open = false;
  let content: T | null = null;

  return {
    open(c: T): void { open = true; content = c; },
    close(): void { open = false; content = null; },
    isOpen(): boolean { return open; },
    getContent(): T | null { return content; },
  };
}

export { createModalManager };`;

export const solutionJs = `function createModalManager() {
  let open = false;
  let content = null;

  return {
    open(c) { open = true; content = c; },
    close() { open = false; content = null; },
    isOpen() { return open; },
    getContent() { return content; },
  };
}

module.exports = { createModalManager };`;
