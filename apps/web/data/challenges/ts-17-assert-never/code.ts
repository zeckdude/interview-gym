export const starterTs = `function assertNever(value: never) {
  // Implement this function
  
}

export { assertNever };`;

export const starterJs = `function assertNever(value) {
  // Implement this function
  
}

module.exports = { assertNever };`;

export const solutionTs = `function assertNever(value: never) {
  throw new Error('Unexpected value: ' + String(value));
}

export { assertNever };`;

export const solutionJs = `function assertNever(value) {
  throw new Error('Unexpected value: ' + String(value));
}

module.exports = { assertNever };`;
