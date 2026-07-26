export const starterTs = `function curry(fn: (...args: number[]) => number) {
  // Implement this function
  
}

export { curry };`;

export const starterJs = `function curry(fn) {
  // Implement this function
  
}

module.exports = { curry };`;

export const solutionTs = `function curry(fn: (...args: number[]) => number) {
  return function curried(...args) {
      if (args.length >= fn.length) return fn(...args);
      return (...next) => curried(...args, ...next);
    };
}

export { curry };`;

export const solutionJs = `function curry(fn) {
  return function curried(...args) {
      if (args.length >= fn.length) return fn(...args);
      return (...next) => curried(...args, ...next);
    };
}

module.exports = { curry };`;
