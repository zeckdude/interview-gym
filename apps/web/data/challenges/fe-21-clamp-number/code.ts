export const starterTs = `function clamp(value: number, min: number, max: number) {
  // Implement this function
  
}

export { clamp };`;

export const starterJs = `function clamp(value, min, max) {
  // Implement this function
  
}

module.exports = { clamp };`;

export const solutionTs = `function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export { clamp };`;

export const solutionJs = `function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

module.exports = { clamp };`;
