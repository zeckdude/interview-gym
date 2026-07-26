export const starterTs = `function isString(value: unknown) {
  // Implement this function
  
}

export { isString };`;

export const starterJs = `function isString(value) {
  // Implement this function
  
}

module.exports = { isString };`;

export const solutionTs = `function isString(value: unknown) {
  return typeof value === 'string';
}

export { isString };`;

export const solutionJs = `function isString(value) {
  return typeof value === 'string';
}

module.exports = { isString };`;
