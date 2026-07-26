export const starterTs = `function backoffWithJitter(attempt: number, initialMs: number, factor: number, jitterMs: number) {
  // Implement this function
  
}

export { backoffWithJitter };`;

export const starterJs = `function backoffWithJitter(attempt, initialMs, factor, jitterMs) {
  // Implement this function
  
}

module.exports = { backoffWithJitter };`;

export const solutionTs = `function backoffWithJitter(attempt: number, initialMs: number, factor: number, jitterMs: number) {
  const base = initialMs * Math.pow(factor, attempt);
    const jitter = Math.random() * jitterMs;
    return Math.round(base + jitter);
}

export { backoffWithJitter };`;

export const solutionJs = `function backoffWithJitter(attempt, initialMs, factor, jitterMs) {
  const base = initialMs * Math.pow(factor, attempt);
    const jitter = Math.random() * jitterMs;
    return Math.round(base + jitter);
}

module.exports = { backoffWithJitter };`;
