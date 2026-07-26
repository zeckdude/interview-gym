export const starterTs = `function invariant(condition: boolean, message: string) {
  // Implement this function
  
}

export { invariant };`;

export const starterJs = `function invariant(condition, message) {
  // Implement this function
  
}

module.exports = { invariant };`;

export const solutionTs = `function invariant(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

export { invariant };`;

export const solutionJs = `function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

module.exports = { invariant };`;
