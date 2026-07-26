export const starterTs = `function assertLength(arr: unknown[], len: number) {
  // Implement this function
  
}

export { assertLength };`;

export const starterJs = `function assertLength(arr, len) {
  // Implement this function
  
}

module.exports = { assertLength };`;

export const solutionTs = `function assertLength(arr: unknown[], len: number) {
  if (arr.length !== len) throw new Error('Expected length ' + len);
}

export { assertLength };`;

export const solutionJs = `function assertLength(arr, len) {
  if (arr.length !== len) throw new Error('Expected length ' + len);
}

module.exports = { assertLength };`;
