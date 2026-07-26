export const starterTs = `function pick(obj: Record<string, unknown>, keys: string[]) {
  // Implement this function
  
}

export { pick };`;

export const starterJs = `function pick(obj, keys) {
  // Implement this function
  
}

module.exports = { pick };`;

export const solutionTs = `function pick(obj: Record<string, unknown>, keys: string[]) {
  const result = {};
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
}

export { pick };`;

export const solutionJs = `function pick(obj, keys) {
  const result = {};
    for (const key of keys) {
      if (key in obj) result[key] = obj[key];
    }
    return result;
}

module.exports = { pick };`;
