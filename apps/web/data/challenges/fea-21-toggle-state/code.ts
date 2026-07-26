export const starterTs = `function createToggleState(initial?: boolean) {
  // Implement this function
  
}

export { createToggleState };`;

export const starterJs = `function createToggleState(initial = false) {
  // Implement this function
  
}

module.exports = { createToggleState };`;

export const solutionTs = `function createToggleState(initial?: boolean) {
  let value = initial;
    return {
      get() { return value; },
      toggle() { value = !value; },
      set(next) { value = Boolean(next); },
    };
}

export { createToggleState };`;

export const solutionJs = `function createToggleState(initial = false) {
  let value = initial;
    return {
      get() { return value; },
      toggle() { value = !value; },
      set(next) { value = Boolean(next); },
    };
}

module.exports = { createToggleState };`;
