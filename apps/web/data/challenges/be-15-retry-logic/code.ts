export const starterTs = `interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  factor?: number;
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  // Implement retry with exponential backoff here
  return fn();
}

export { retryWithBackoff };`;

export const starterJs = `async function retryWithBackoff(fn, options = {}) {
  // Implement retry with exponential backoff here
  return fn();
}

module.exports = { retryWithBackoff };`;

export const solutionTs = `interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  factor?: number;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, initialDelayMs = 100, factor = 2 } = options;
  let delay = initialDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await sleep(delay);
      delay *= factor;
    }
  }

  throw new Error('unreachable');
}

export { retryWithBackoff };`;

export const solutionJs = `const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retryWithBackoff(fn, options = {}) {
  const { maxRetries = 3, initialDelayMs = 100, factor = 2 } = options;
  let delay = initialDelayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await sleep(delay);
      delay *= factor;
    }
  }
}

module.exports = { retryWithBackoff };`;
