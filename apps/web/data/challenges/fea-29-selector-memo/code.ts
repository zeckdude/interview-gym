export const starterTs = `function createSelectorMemo(selector: (...args: number[]) => number) {
  // Implement this function
  
}

export { createSelectorMemo };`;

export const starterJs = `function createSelectorMemo(selector) {
  // Implement this function
  
}

module.exports = { createSelectorMemo };`;

export const solutionTs = `function createSelectorMemo(selector: (...args: number[]) => number) {
  let lastArgs = null;
    let lastResult;
    return (...args) => {
      const same = lastArgs && args.length === lastArgs.length && args.every((v, i) => v === lastArgs[i]);
      if (same) return lastResult;
      lastArgs = args;
      lastResult = selector(...args);
      return lastResult;
    };
}

export { createSelectorMemo };`;

export const solutionJs = `function createSelectorMemo(selector) {
  let lastArgs = null;
    let lastResult;
    return (...args) => {
      const same = lastArgs && args.length === lastArgs.length && args.every((v, i) => v === lastArgs[i]);
      if (same) return lastResult;
      lastArgs = args;
      lastResult = selector(...args);
      return lastResult;
    };
}

module.exports = { createSelectorMemo };`;
