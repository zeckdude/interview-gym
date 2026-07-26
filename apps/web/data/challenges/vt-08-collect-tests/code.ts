export const starterTs = `function collectTests(results: Array<{ passed: boolean }>) {
  // Implement this function
  
}

export { collectTests };`;

export const starterJs = `function collectTests(results) {
  // Implement this function
  
}

module.exports = { collectTests };`;

export const solutionTs = `function collectTests(results: Array<{ passed: boolean }>) {
  return results.every((r) => r.passed);
}

export { collectTests };`;

export const solutionJs = `function collectTests(results) {
  return results.every((r) => r.passed);
}

module.exports = { collectTests };`;
