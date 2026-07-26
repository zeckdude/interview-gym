export const starterTs = `function omit(obj: Record<string, unknown>, keys: string[]) {
  // Implement this function
  
}

export { omit };`;

export const starterJs = `function omit(obj, keys) {
  // Implement this function
  
}

module.exports = { omit };`;

export const solutionTs = `function omit(obj: Record<string, unknown>, keys: string[]) {
  const result = { ...obj };
    for (const key of keys) delete result[key];
    return result;
}

export { omit };`;

export const solutionJs = `function omit(obj, keys) {
  const result = { ...obj };
    for (const key of keys) delete result[key];
    return result;
}

module.exports = { omit };`;
