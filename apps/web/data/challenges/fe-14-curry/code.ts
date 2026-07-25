export const starterTs = `// eslint-disable-next-line @typescript-eslint/no-explicit-any
function curry(fn: (...args: any[]) => any) {
  // Return a curried version of fn

  return fn;
}

export { curry };`;

export const starterJs = `function curry(fn) {
  // Return a curried version of fn

  return fn;
}

module.exports = { curry };`;

export const solutionTs = `// eslint-disable-next-line @typescript-eslint/no-explicit-any
function curry(fn: (...args: any[]) => any) {
  const arity = fn.length;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function curried(...args: any[]): any {
    if (args.length >= arity) return fn(...args);
    return (...more: unknown[]) => curried(...args, ...more);
  }

  return curried;
}

export { curry };`;

export const solutionJs = `function curry(fn) {
  const arity = fn.length;

  function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...more) => curried(...args, ...more);
  }

  return curried;
}

module.exports = { curry };`;
