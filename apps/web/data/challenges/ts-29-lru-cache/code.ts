export const starterTs = `function createLruCache(capacity: number) {
  // Implement this function
  
}

export { createLruCache };`;

export const starterJs = `function createLruCache(capacity) {
  // Implement this function
  
}

module.exports = { createLruCache };`;

export const solutionTs = `function createLruCache(capacity: number) {
  const map = new Map();
    return {
      get(key) {
        if (!map.has(key)) return undefined;
        const value = map.get(key);
        map.delete(key);
        map.set(key, value);
        return value;
      },
      set(key, value) {
        if (map.has(key)) map.delete(key);
        map.set(key, value);
        if (map.size > capacity) {
          const oldest = map.keys().next().value;
          map.delete(oldest);
        }
      },
    };
}

export { createLruCache };`;

export const solutionJs = `function createLruCache(capacity) {
  const map = new Map();
    return {
      get(key) {
        if (!map.has(key)) return undefined;
        const value = map.get(key);
        map.delete(key);
        map.set(key, value);
        return value;
      },
      set(key, value) {
        if (map.has(key)) map.delete(key);
        map.set(key, value);
        if (map.size > capacity) {
          const oldest = map.keys().next().value;
          map.delete(oldest);
        }
      },
    };
}

module.exports = { createLruCache };`;
