export const starterTs = `function assertDeepEqual(a: unknown, b: unknown) {
  // Implement this function
  
}

export { assertDeepEqual };`;

export const starterJs = `function assertDeepEqual(a, b) {
  // Implement this function
  
}

module.exports = { assertDeepEqual };`;

export const solutionTs = `function assertDeepEqual(a: unknown, b: unknown) {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error('Not deep equal');
}

export { assertDeepEqual };`;

export const solutionJs = `function assertDeepEqual(a, b) {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error('Not deep equal');
}

module.exports = { assertDeepEqual };`;
