export const starterTs = `function diffSnapshots(a: Record<string, unknown>, b: Record<string, unknown>) {
  // Implement this function
  
}

export { diffSnapshots };`;

export const starterJs = `function diffSnapshots(a, b) {
  // Implement this function
  
}

module.exports = { diffSnapshots };`;

export const solutionTs = `function diffSnapshots(a: Record<string, unknown>, b: Record<string, unknown>) {
  const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((k) => a[k] === b[k]);
}

export { diffSnapshots };`;

export const solutionJs = `function diffSnapshots(a, b) {
  const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((k) => a[k] === b[k]);
}

module.exports = { diffSnapshots };`;
