export const starterTs = `function deepClone(value: unknown) {
  // Implement this function
  
}

export { deepClone };`;

export const starterJs = `function deepClone(value) {
  // Implement this function
  
}

module.exports = { deepClone };`;

export const solutionTs = `function deepClone(value: unknown) {
  return JSON.parse(JSON.stringify(value));
}

export { deepClone };`;

export const solutionJs = `function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

module.exports = { deepClone };`;
