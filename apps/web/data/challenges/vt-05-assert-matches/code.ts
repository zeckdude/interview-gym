export const starterTs = `function assertMatches(value: string, pattern: RegExp) {
  // Implement this function
  
}

export { assertMatches };`;

export const starterJs = `function assertMatches(value, pattern) {
  // Implement this function
  
}

module.exports = { assertMatches };`;

export const solutionTs = `function assertMatches(value: string, pattern: RegExp) {
  if (!pattern.test(value)) throw new Error('No match for ' + value);
}

export { assertMatches };`;

export const solutionJs = `function assertMatches(value, pattern) {
  if (!pattern.test(value)) throw new Error('No match for ' + value);
}

module.exports = { assertMatches };`;
