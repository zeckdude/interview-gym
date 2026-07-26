export const starterTs = `function readonlyCopy(obj: Record<string, unknown>) {
  // Implement this function
  
}

export { readonlyCopy };`;

export const starterJs = `function readonlyCopy(obj) {
  // Implement this function
  
}

module.exports = { readonlyCopy };`;

export const solutionTs = `function readonlyCopy(obj: Record<string, unknown>) {
  return Object.freeze({ ...obj });
}

export { readonlyCopy };`;

export const solutionJs = `function readonlyCopy(obj) {
  return Object.freeze({ ...obj });
}

module.exports = { readonlyCopy };`;
