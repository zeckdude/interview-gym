export const starterTs = `interface Storage<T> {
  get(): T;
  set(value: T): void;
  remove(): void;
}

function createStorage<T>(key: string, defaultValue: T): Storage<T> {
  // Implement type-safe localStorage wrapper here

  return {
    get() { return defaultValue; },
    set(_value) {},
    remove() {},
  };
}

export { createStorage };`;

export const starterJs = `function createStorage(key, defaultValue) {
  // Implement type-safe localStorage wrapper here

  return {
    get() { return defaultValue; },
    set(value) {},
    remove() {},
  };
}

module.exports = { createStorage };`;

export const solutionTs = `interface Storage<T> {
  get(): T;
  set(value: T): void;
  remove(): void;
}

function createStorage<T>(key: string, defaultValue: T): Storage<T> {
  return {
    get() {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) return defaultValue;
        return JSON.parse(raw) as T;
      } catch {
        return defaultValue;
      }
    },
    set(value: T) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // ignore quota errors
      }
    },
    remove() {
      localStorage.removeItem(key);
    },
  };
}

export { createStorage };`;

export const solutionJs = `function createStorage(key, defaultValue) {
  return {
    get() {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) return defaultValue;
        return JSON.parse(raw);
      } catch {
        return defaultValue;
      }
    },
    set(value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    },
    remove() {
      localStorage.removeItem(key);
    },
  };
}

module.exports = { createStorage };`;
