export const starterTs = `function createSpy(fn) {
  // Implement this function
  
}

export { createSpy };`;

export const starterJs = `function createSpy(fn) {
  // Implement this function
  
}

module.exports = { createSpy };`;

export const solutionTs = `function createSpy(fn) {
  const calls = [];
    return (...args) => { calls.push(args); return fn(...args); };
}

export { createSpy };`;

export const solutionJs = `function createSpy(fn) {
  const calls = [];
    return (...args) => { calls.push(args); return fn(...args); };
}

module.exports = { createSpy };`;
