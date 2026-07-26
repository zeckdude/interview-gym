export const starterTs = `function createCounterStore(initial?: number) {
  // Implement this function
  
}

export { createCounterStore };`;

export const starterJs = `function createCounterStore(initial = 0) {
  // Implement this function
  
}

module.exports = { createCounterStore };`;

export const solutionTs = `function createCounterStore(initial?: number) {
  let count = initial;
    return {
      getCount() { return count; },
      increment(step = 1) { count += step; },
      decrement(step = 1) { count -= step; },
      reset() { count = initial; },
    };
}

export { createCounterStore };`;

export const solutionJs = `function createCounterStore(initial = 0) {
  let count = initial;
    return {
      getCount() { return count; },
      increment(step = 1) { count += step; },
      decrement(step = 1) { count -= step; },
      reset() { count = initial; },
    };
}

module.exports = { createCounterStore };`;
