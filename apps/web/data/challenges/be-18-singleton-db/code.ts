export const starterTs = `interface DatabaseSingleton<T> {
  getInstance(): Promise<T>;
}

function createDatabaseSingleton<T>(connectFn: () => Promise<T>): DatabaseSingleton<T> {
  // Implement singleton pattern here

  return {
    getInstance() {
      return connectFn();
    },
  };
}

export { createDatabaseSingleton };`;

export const starterJs = `function createDatabaseSingleton(connectFn) {
  // Implement singleton pattern here

  return {
    getInstance() {
      return connectFn();
    },
  };
}

module.exports = { createDatabaseSingleton };`;

export const solutionTs = `interface DatabaseSingleton<T> {
  getInstance(): Promise<T>;
}

function createDatabaseSingleton<T>(connectFn: () => Promise<T>): DatabaseSingleton<T> {
  let instancePromise: Promise<T> | null = null;

  return {
    getInstance() {
      if (!instancePromise) {
        instancePromise = connectFn();
      }
      return instancePromise;
    },
  };
}

export { createDatabaseSingleton };`;

export const solutionJs = `function createDatabaseSingleton(connectFn) {
  let instancePromise = null;

  return {
    getInstance() {
      if (!instancePromise) {
        instancePromise = connectFn();
      }
      return instancePromise;
    },
  };
}

module.exports = { createDatabaseSingleton };`;
