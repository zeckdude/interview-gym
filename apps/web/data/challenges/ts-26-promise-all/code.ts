export const starterTs = `function promiseAll(promises: Array<Promise<number> | number>) {
  // Implement this function
  
}

export { promiseAll };`;

export const starterJs = `function promiseAll(promises) {
  // Implement this function
  
}

module.exports = { promiseAll };`;

export const solutionTs = `function promiseAll(promises: Array<Promise<number> | number>) {
  return Promise.all(promises);
}

export { promiseAll };`;

export const solutionJs = `function promiseAll(promises) {
  return Promise.all(promises);
}

module.exports = { promiseAll };`;
