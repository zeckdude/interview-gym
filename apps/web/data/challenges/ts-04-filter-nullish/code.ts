export const starterTs = `function filterNullish(arr: Array<unknown>) {
  // Implement this function
  
}

export { filterNullish };`;

export const starterJs = `function filterNullish(arr) {
  // Implement this function
  
}

module.exports = { filterNullish };`;

export const solutionTs = `function filterNullish(arr: Array<unknown>) {
  return arr.filter((item) => item != null);
}

export { filterNullish };`;

export const solutionJs = `function filterNullish(arr) {
  return arr.filter((item) => item != null);
}

module.exports = { filterNullish };`;
