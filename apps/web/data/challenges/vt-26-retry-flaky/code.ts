export const starterTs = `function retryTest(attempts: number, fn: () => string) {
  // Implement this function
  
}

export { retryTest };`;

export const starterJs = `function retryTest(attempts, fn) {
  // Implement this function
  
}

module.exports = { retryTest };`;

export const solutionTs = `function retryTest(attempts: number, fn: () => string) {
  let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return fn();
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError;
}

export { retryTest };`;

export const solutionJs = `function retryTest(attempts, fn) {
  let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return fn();
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError;
}

module.exports = { retryTest };`;
