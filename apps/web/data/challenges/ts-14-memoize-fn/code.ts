export const starterTs = `function memoize(fn: (...args: number[]) => number) {
  // Implement this function
  
}

export { memoize };`;

export const starterJs = `function memoize(fn) {
  // Implement this function
  
}

module.exports = { memoize };`;

export const solutionTs = `function memoize(fn: (...args: number[]) => number) {
  const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
}

export { memoize };`;

export const solutionJs = `function memoize(fn) {
  const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
}

module.exports = { memoize };`;
