export const starterTs = `function withFakeNow(ts: number, fn: () => number) {
  // Implement this function
  
}

export { withFakeNow };`;

export const starterJs = `function withFakeNow(ts, fn) {
  // Implement this function
  
}

module.exports = { withFakeNow };`;

export const solutionTs = `function withFakeNow(ts: number, fn: () => number) {
  const real = Date.now;
    Date.now = () => ts;
    try {
      return fn();
    } finally {
      Date.now = real;
    }
}

export { withFakeNow };`;

export const solutionJs = `function withFakeNow(ts, fn) {
  const real = Date.now;
    Date.now = () => ts;
    try {
      return fn();
    } finally {
      Date.now = real;
    }
}

module.exports = { withFakeNow };`;
