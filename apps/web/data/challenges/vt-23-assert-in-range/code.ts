export const starterTs = `function assertInRange(n: number, min: number, max: number) {
  // Implement this function
  
}

export { assertInRange };`;

export const starterJs = `function assertInRange(n, min, max) {
  // Implement this function
  
}

module.exports = { assertInRange };`;

export const solutionTs = `function assertInRange(n: number, min: number, max: number) {
  if (n < min || n > max) throw new Error('Out of range');
}

export { assertInRange };`;

export const solutionJs = `function assertInRange(n, min, max) {
  if (n < min || n > max) throw new Error('Out of range');
}

module.exports = { assertInRange };`;
