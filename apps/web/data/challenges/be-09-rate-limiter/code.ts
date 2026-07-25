export const starterTs = `interface RateLimiter {
  isAllowed(): boolean;
}

function createRateLimiter(maxCalls: number, windowMs: number): RateLimiter {
  // Implement rate limiting here

  return {
    isAllowed() {
      return true;
    },
  };
}

export { createRateLimiter };`;

export const starterJs = `function createRateLimiter(maxCalls, windowMs) {
  // Implement rate limiting here

  return {
    isAllowed() {
      return true;
    },
  };
}

module.exports = { createRateLimiter };`;

export const solutionTs = `interface RateLimiter {
  isAllowed(): boolean;
}

function createRateLimiter(maxCalls: number, windowMs: number): RateLimiter {
  const timestamps: number[] = [];

  return {
    isAllowed() {
      const now = Date.now();
      const cutoff = now - windowMs;
      while (timestamps.length > 0 && timestamps[0] < cutoff) {
        timestamps.shift();
      }
      if (timestamps.length < maxCalls) {
        timestamps.push(now);
        return true;
      }
      return false;
    },
  };
}

export { createRateLimiter };`;

export const solutionJs = `function createRateLimiter(maxCalls, windowMs) {
  const timestamps = [];

  return {
    isAllowed() {
      const now = Date.now();
      const cutoff = now - windowMs;
      while (timestamps.length > 0 && timestamps[0] < cutoff) {
        timestamps.shift();
      }
      if (timestamps.length < maxCalls) {
        timestamps.push(now);
        return true;
      }
      return false;
    },
  };
}

module.exports = { createRateLimiter };`;
