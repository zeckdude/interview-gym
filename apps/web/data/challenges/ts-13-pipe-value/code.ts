export const starterTs = `function pipe(value: number, fns: Array<(n: number) => number>) {
  // Implement this function
  
}

export { pipe };`;

export const starterJs = `function pipe(value, fns) {
  // Implement this function
  
}

module.exports = { pipe };`;

export const solutionTs = `function pipe(value: number, fns: Array<(n: number) => number>) {
  return fns.reduce((acc, fn) => fn(acc), value);
}

export { pipe };`;

export const solutionJs = `function pipe(value, fns) {
  return fns.reduce((acc, fn) => fn(acc), value);
}

module.exports = { pipe };`;
