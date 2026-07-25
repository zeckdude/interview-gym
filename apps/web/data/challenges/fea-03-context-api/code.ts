export const starterTs = `interface Context<T> {
  Provider: { setValue(value: T): void };
  useContext(): T;
}

function createContext<T>(defaultValue: T): Context<T> {
  // Implement simplified Context API here

  return {
    Provider: {
      setValue(_value) {},
    },
    useContext() { return defaultValue; },
  };
}

export { createContext };`;

export const starterJs = `function createContext(defaultValue) {
  // Implement simplified Context API here

  return {
    Provider: {
      setValue(value) {},
    },
    useContext() { return defaultValue; },
  };
}

module.exports = { createContext };`;

export const solutionTs = `interface Context<T> {
  Provider: { setValue(value: T): void };
  useContext(): T;
}

function createContext<T>(defaultValue: T): Context<T> {
  let currentValue = defaultValue;

  return {
    Provider: {
      setValue(value: T) { currentValue = value; },
    },
    useContext() { return currentValue; },
  };
}

export { createContext };`;

export const solutionJs = `function createContext(defaultValue) {
  let currentValue = defaultValue;

  return {
    Provider: {
      setValue(value) { currentValue = value; },
    },
    useContext() { return currentValue; },
  };
}

module.exports = { createContext };`;
