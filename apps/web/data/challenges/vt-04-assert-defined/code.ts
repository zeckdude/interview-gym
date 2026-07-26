export const starterTs = `function assertDefined(value: unknown) {
  // Implement this function
  
}

export { assertDefined };`;

export const starterJs = `function assertDefined(value) {
  // Implement this function
  
}

module.exports = { assertDefined };`;

export const solutionTs = `function assertDefined(value: unknown) {
  if (value === undefined) throw new Error('Expected defined value');
}

export { assertDefined };`;

export const solutionJs = `function assertDefined(value) {
  if (value === undefined) throw new Error('Expected defined value');
}

module.exports = { assertDefined };`;
