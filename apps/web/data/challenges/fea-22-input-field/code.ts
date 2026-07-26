export const starterTs = `function createInputField(initial?: string) {
  // Implement this function
  
}

export { createInputField };`;

export const starterJs = `function createInputField(initial = "") {
  // Implement this function
  
}

module.exports = { createInputField };`;

export const solutionTs = `function createInputField(initial?: string) {
  let value = initial;
    const listeners = new Set();
    const notify = () => listeners.forEach((fn) => fn(value));
    return {
      getValue() { return value; },
      setValue(next) { value = next; notify(); },
      subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    };
}

export { createInputField };`;

export const solutionJs = `function createInputField(initial = "") {
  let value = initial;
    const listeners = new Set();
    const notify = () => listeners.forEach((fn) => fn(value));
    return {
      getValue() { return value; },
      setValue(next) { value = next; notify(); },
      subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    };
}

module.exports = { createInputField };`;
