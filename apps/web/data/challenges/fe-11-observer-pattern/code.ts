export const starterTs = `interface Observable<T> {
  get(): T;
  set(value: T): void;
  subscribe(fn: (newValue: T, oldValue: T) => void): () => void;
}

function createObservable<T>(initialValue: T): Observable<T> {
  // Implement reactive observable here

  return {
    get() { return initialValue; },
    set(_value) {},
    subscribe(_fn) { return () => {}; },
  };
}

export { createObservable };`;

export const starterJs = `function createObservable(initialValue) {
  // Implement reactive observable here

  return {
    get() { return initialValue; },
    set(value) {},
    subscribe(fn) { return () => {}; },
  };
}

module.exports = { createObservable };`;

export const solutionTs = `interface Observable<T> {
  get(): T;
  set(value: T): void;
  subscribe(fn: (newValue: T, oldValue: T) => void): () => void;
}

function createObservable<T>(initialValue: T): Observable<T> {
  let value = initialValue;
  const subscribers = new Set<(newValue: T, oldValue: T) => void>();

  return {
    get() { return value; },
    set(newValue) {
      const old = value;
      value = newValue;
      subscribers.forEach((fn) => fn(newValue, old));
    },
    subscribe(fn) {
      subscribers.add(fn);
      return () => { subscribers.delete(fn); };
    },
  };
}

export { createObservable };`;

export const solutionJs = `function createObservable(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  return {
    get() { return value; },
    set(newValue) {
      const old = value;
      value = newValue;
      subscribers.forEach((fn) => fn(newValue, old));
    },
    subscribe(fn) {
      subscribers.add(fn);
      return () => { subscribers.delete(fn); };
    },
  };
}

module.exports = { createObservable };`;
