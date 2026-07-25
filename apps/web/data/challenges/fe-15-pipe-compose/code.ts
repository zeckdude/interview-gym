export const starterTs = `// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pipe(...fns: Array<(x: any) => any>) {
  // Apply functions left-to-right
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (x: any) => x;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function compose(...fns: Array<(x: any) => any>) {
  // Apply functions right-to-left
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (x: any) => x;
}

export { pipe, compose };`;

export const starterJs = `function pipe(...fns) {
  // Apply functions left-to-right
  return (x) => x;
}

function compose(...fns) {
  // Apply functions right-to-left
  return (x) => x;
}

module.exports = { pipe, compose };`;

export const solutionTs = `// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pipe(...fns: Array<(x: any) => any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (x: any) => fns.reduce((acc, fn) => fn(acc), x);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function compose(...fns: Array<(x: any) => any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (x: any) => fns.reduceRight((acc, fn) => fn(acc), x);
}

export { pipe, compose };`;

export const solutionJs = `function pipe(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}

function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

module.exports = { pipe, compose };`;
