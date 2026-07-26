export const starterTs = `function createTokenBucket(capacity: number, refillRate: number, refillMs: number) {
  // Implement this function
  
}

export { createTokenBucket };`;

export const starterJs = `function createTokenBucket(capacity, refillRate, refillMs) {
  // Implement this function
  
}

module.exports = { createTokenBucket };`;

export const solutionTs = `function createTokenBucket(capacity: number, refillRate: number, refillMs: number) {
  let tokens = capacity;
    let lastRefill = Date.now();
    const refill = () => {
      const now = Date.now();
      const elapsed = now - lastRefill;
      const added = Math.floor(elapsed / refillMs) * refillRate;
      if (added > 0) {
        tokens = Math.min(capacity, tokens + added);
        lastRefill = now;
      }
    };
    return {
      tryConsume(count = 1) {
        refill();
        if (tokens >= count) {
          tokens -= count;
          return true;
        }
        return false;
      },
      getTokens() {
        refill();
        return tokens;
      },
    };
}

export { createTokenBucket };`;

export const solutionJs = `function createTokenBucket(capacity, refillRate, refillMs) {
  let tokens = capacity;
    let lastRefill = Date.now();
    const refill = () => {
      const now = Date.now();
      const elapsed = now - lastRefill;
      const added = Math.floor(elapsed / refillMs) * refillRate;
      if (added > 0) {
        tokens = Math.min(capacity, tokens + added);
        lastRefill = now;
      }
    };
    return {
      tryConsume(count = 1) {
        refill();
        if (tokens >= count) {
          tokens -= count;
          return true;
        }
        return false;
      },
      getTokens() {
        refill();
        return tokens;
      },
    };
}

module.exports = { createTokenBucket };`;
