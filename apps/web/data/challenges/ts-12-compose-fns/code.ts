export const starterTs = `function compose(...fns: Array<(arg: number) => number>) {
  // Implement this function
  
}

export { compose };`;

export const starterJs = `function compose(...fns) {
  // Implement this function
  
}

module.exports = { compose };`;

export const solutionTs = `function compose(...fns: Array<(arg: number) => number>) {
  return (value) => fns.reduceRight((acc, fn) => fn(acc), value);
}

export { compose };`;

export const solutionJs = `function compose(...fns) {
  return (value) => fns.reduceRight((acc, fn) => fn(acc), value);
}

module.exports = { compose };`;
