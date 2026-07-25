export const starterTs = `interface FetchOptions {
  cache?: 'force-cache' | 'no-store';
  revalidate?: number;
}

interface FetchResult<T> {
  value: T;
  hit: boolean;
}

function createFetchCache(clock: () => number = Date.now) {
  // Implement a cache with no-store bypass and revalidate-based expiry.

  return {
    fetch<T>(key: string, fetcher: () => T, options: FetchOptions = {}): FetchResult<T> {
      return { value: fetcher(), hit: false };
    },
  };
}

export { createFetchCache };`;

export const starterJs = `function createFetchCache(clock = Date.now) {
  // Implement a cache with no-store bypass and revalidate-based expiry.

  return {
    fetch(key, fetcher, options = {}) {
      return { value: fetcher(), hit: false };
    },
  };
}

module.exports = { createFetchCache };`;

export const solutionTs = `interface FetchOptions {
  cache?: 'force-cache' | 'no-store';
  revalidate?: number;
}

interface FetchResult<T> {
  value: T;
  hit: boolean;
}

interface CacheEntry {
  value: unknown;
  cachedAt: number;
}

function createFetchCache(clock: () => number = Date.now) {
  const store = new Map<string, CacheEntry>();

  return {
    fetch<T>(key: string, fetcher: () => T, options: FetchOptions = {}): FetchResult<T> {
      if (options.cache === 'no-store') {
        return { value: fetcher(), hit: false };
      }

      const now = clock();
      const entry = store.get(key);
      const isValid =
        entry !== undefined &&
        (options.revalidate === undefined || now - entry.cachedAt < options.revalidate * 1000);

      if (isValid && entry) {
        return { value: entry.value as T, hit: true };
      }

      const value = fetcher();
      store.set(key, { value, cachedAt: now });
      return { value, hit: false };
    },
  };
}

export { createFetchCache };`;

export const solutionJs = `function createFetchCache(clock = Date.now) {
  const store = new Map();

  return {
    fetch(key, fetcher, options = {}) {
      if (options.cache === 'no-store') {
        return { value: fetcher(), hit: false };
      }

      const now = clock();
      const entry = store.get(key);
      const isValid =
        entry !== undefined &&
        (options.revalidate === undefined || now - entry.cachedAt < options.revalidate * 1000);

      if (isValid && entry) {
        return { value: entry.value, hit: true };
      }

      const value = fetcher();
      store.set(key, { value, cachedAt: now });
      return { value, hit: false };
    },
  };
}

module.exports = { createFetchCache };`;
