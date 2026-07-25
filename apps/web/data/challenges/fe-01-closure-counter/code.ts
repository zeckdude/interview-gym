export const starterTs = `interface Counter {
  increment(): void;
  decrement(): void;
  reset(): void;
  getCount(): number;
}

function createCounter(initial = 0): Counter {
  // Use a closure to maintain private state

  return {
    increment() {},
    decrement() {},
    reset() {},
    getCount() { return 0; },
  };
}

export { createCounter };`;

export const starterJs = `function createCounter(initial = 0) {
  // Use a closure to maintain private state

  return {
    increment() {},
    decrement() {},
    reset() {},
    getCount() { return 0; },
  };
}

module.exports = { createCounter };`;

export const solutionTs = `interface Counter {
  increment(): void;
  decrement(): void;
  reset(): void;
  getCount(): number;
}

function createCounter(initial = 0): Counter {
  let count = initial;

  return {
    increment() { count++; },
    decrement() { count--; },
    reset() { count = initial; },
    getCount() { return count; },
  };
}

export { createCounter };`;

export const solutionJs = `function createCounter(initial = 0) {
  let count = initial;

  return {
    increment() { count++; },
    decrement() { count--; },
    reset() { count = initial; },
    getCount() { return count; },
  };
}

module.exports = { createCounter };`;
