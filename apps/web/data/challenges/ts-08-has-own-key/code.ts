export const starterTs = `function hasOwn(obj: object, key: string) {
  // Implement this function
  
}

export { hasOwn };`;

export const starterJs = `function hasOwn(obj, key) {
  // Implement this function
  
}

module.exports = { hasOwn };`;

export const solutionTs = `function hasOwn(obj: object, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export { hasOwn };`;

export const solutionJs = `function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

module.exports = { hasOwn };`;
