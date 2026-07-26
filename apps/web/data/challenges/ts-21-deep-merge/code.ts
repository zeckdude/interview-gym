export const starterTs = `function deepMerge(a: Record<string, unknown>, b: Record<string, unknown>) {
  // Implement this function
  
}

export { deepMerge };`;

export const starterJs = `function deepMerge(a, b) {
  // Implement this function
  
}

module.exports = { deepMerge };`;

export const solutionTs = `function deepMerge(a: Record<string, unknown>, b: Record<string, unknown>) {
  const result = { ...a };
    for (const key of Object.keys(b)) {
      const av = a[key];
      const bv = b[key];
      if (av && bv && typeof av === 'object' && typeof bv === 'object' && !Array.isArray(av) && !Array.isArray(bv)) {
        result[key] = deepMerge(av, bv);
      } else {
        result[key] = bv;
      }
    }
    return result;
}

export { deepMerge };`;

export const solutionJs = `function deepMerge(a, b) {
  const result = { ...a };
    for (const key of Object.keys(b)) {
      const av = a[key];
      const bv = b[key];
      if (av && bv && typeof av === 'object' && typeof bv === 'object' && !Array.isArray(av) && !Array.isArray(bv)) {
        result[key] = deepMerge(av, bv);
      } else {
        result[key] = bv;
      }
    }
    return result;
}

module.exports = { deepMerge };`;
