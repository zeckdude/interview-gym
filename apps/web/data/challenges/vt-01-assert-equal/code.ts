export const starterTs = `function assertEqual(actual: unknown, expected: unknown) {
  // Implement this function
  
}

export { assertEqual };`;

export const starterJs = `function assertEqual(actual, expected) {
  // Implement this function
  
}

module.exports = { assertEqual };`;

export const solutionTs = `function assertEqual(actual: unknown, expected: unknown) {
  if (actual !== expected) throw new Error('Expected ' + expected + ' but got ' + actual);
}

export { assertEqual };`;

export const solutionJs = `function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error('Expected ' + expected + ' but got ' + actual);
}

module.exports = { assertEqual };`;
