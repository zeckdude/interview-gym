export const starterTs = `function createAsyncCache() {
  // Implement this function
  
}

export { createAsyncCache };`;

export const starterJs = `function createAsyncCache() {
  // Implement this function
  
}

module.exports = { createAsyncCache };`;

export const solutionTs = `function createAsyncCache() {
  const cache = new Map();
    return {
      async get(key, loader) {
        if (cache.has(key)) return cache.get(key);
        const value = await loader();
        cache.set(key, value);
        return value;
      },
      has(key) { return cache.has(key); },
      clear() { cache.clear(); },
    };
}

export { createAsyncCache };`;

export const solutionJs = `function createAsyncCache() {
  const cache = new Map();
    return {
      async get(key, loader) {
        if (cache.has(key)) return cache.get(key);
        const value = await loader();
        cache.set(key, value);
        return value;
      },
      has(key) { return cache.has(key); },
      clear() { cache.clear(); },
    };
}

module.exports = { createAsyncCache };`;
