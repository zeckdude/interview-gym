export const starterTs = `function shallowDiff(a: Record<string, unknown>, b: Record<string, unknown>) {
  // Implement this function
  
}

export { shallowDiff };`;

export const starterJs = `function shallowDiff(a, b) {
  // Implement this function
  
}

module.exports = { shallowDiff };`;

export const solutionTs = `function shallowDiff(a: Record<string, unknown>, b: Record<string, unknown>) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const diff = {};
    for (const key of keys) {
      if (a[key] !== b[key]) diff[key] = b[key];
    }
    return diff;
}

export { shallowDiff };`;

export const solutionJs = `function shallowDiff(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const diff = {};
    for (const key of keys) {
      if (a[key] !== b[key]) diff[key] = b[key];
    }
    return diff;
}

module.exports = { shallowDiff };`;
