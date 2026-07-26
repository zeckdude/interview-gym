export const starterTs = `function exponentialBackoff(attempt: number, base: number) {
  // Implement this function
  
}

export { exponentialBackoff };`;

export const starterJs = `function exponentialBackoff(attempt, base) {
  // Implement this function
  
}

module.exports = { exponentialBackoff };`;

export const solutionTs = `function exponentialBackoff(attempt: number, base: number) {
  return base * Math.pow(2, attempt);
}

export { exponentialBackoff };`;

export const solutionJs = `function exponentialBackoff(attempt, base) {
  return base * Math.pow(2, attempt);
}

module.exports = { exponentialBackoff };`;
