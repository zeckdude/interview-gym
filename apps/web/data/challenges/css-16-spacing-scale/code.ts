export const starterTs = `function spacingScale(base: number, steps: number) {
  // Implement this function
  
}

export { spacingScale };`;

export const starterJs = `function spacingScale(base, steps) {
  // Implement this function
  
}

module.exports = { spacingScale };`;

export const solutionTs = `function spacingScale(base: number, steps: number) {
  return Array.from({ length: steps }, (_, i) => (i + 1) * base);
}

export { spacingScale };`;

export const solutionJs = `function spacingScale(base, steps) {
  return Array.from({ length: steps }, (_, i) => (i + 1) * base);
}

module.exports = { spacingScale };`;
