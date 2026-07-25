export const starterTs = `function memoize<T extends unknown[], R>(fn: (...args: T) => R): (...args: T) => R {
  // Cache results by argument key

  return (...args) => fn(...args);
}

export { memoize };`;

export const starterJs = `function memoize(fn) {
  // Cache results by argument key

  return (...args) => fn(...args);
}

module.exports = { memoize };`;

export const solutionTs = `function memoize<T extends unknown[], R>(fn: (...args: T) => R): (...args: T) => R {
  const cache = new Map<string, R>();

  return (...args: T): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
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
