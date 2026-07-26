export const starterTs = `function createCircuitBreaker(threshold: number) {
  // Implement this function
  
}

export { createCircuitBreaker };`;

export const starterJs = `function createCircuitBreaker(threshold) {
  // Implement this function
  
}

module.exports = { createCircuitBreaker };`;

export const solutionTs = `function createCircuitBreaker(threshold: number) {
  let failures = 0;
    let open = false;
    return {
      async execute(fn) {
        if (open) throw new Error('Circuit open');
        try {
          const result = await fn();
          failures = 0;
          return result;
        } catch (err) {
          failures += 1;
          if (failures >= threshold) open = true;
          throw err;
        }
      },
      isOpen() {
        return open;
      },
      reset() {
        failures = 0;
        open = false;
      },
    };
}

export { createCircuitBreaker };`;

export const solutionJs = `function createCircuitBreaker(threshold) {
  let failures = 0;
    let open = false;
    return {
      async execute(fn) {
        if (open) throw new Error('Circuit open');
        try {
          const result = await fn();
          failures = 0;
          return result;
        } catch (err) {
          failures += 1;
          if (failures >= threshold) open = true;
          throw err;
        }
      },
      isOpen() {
        return open;
      },
      reset() {
        failures = 0;
        open = false;
      },
    };
}

module.exports = { createCircuitBreaker };`;
