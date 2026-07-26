export const starterTs = `function deepEqual(a: unknown, b: unknown) {
  // Implement this function
  
}

export { deepEqual };`;

export const starterJs = `function deepEqual(a, b) {
  // Implement this function
  
}

module.exports = { deepEqual };`;

export const solutionTs = `function deepEqual(a: unknown, b: unknown) {
  if (a === b) return true;
    if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
}

export { deepEqual };`;

export const solutionJs = `function deepEqual(a, b) {
  if (a === b) return true;
    if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
}

module.exports = { deepEqual };`;
