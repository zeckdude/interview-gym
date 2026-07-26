export const starterTs = `function coveragePercent(covered: number, total: number) {
  // Implement this function
  
}

export { coveragePercent };`;

export const starterJs = `function coveragePercent(covered, total) {
  // Implement this function
  
}

module.exports = { coveragePercent };`;

export const solutionTs = `function coveragePercent(covered: number, total: number) {
  if (total === 0) return 0;
    return Math.round((covered / total) * 100);
}

export { coveragePercent };`;

export const solutionJs = `function coveragePercent(covered, total) {
  if (total === 0) return 0;
    return Math.round((covered / total) * 100);
}

module.exports = { coveragePercent };`;
