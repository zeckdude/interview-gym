export const starterTs = `function invertObject(obj: Record<string, string | number>) {
  // Implement this function
  
}

export { invertObject };`;

export const starterJs = `function invertObject(obj) {
  // Implement this function
  
}

module.exports = { invertObject };`;

export const solutionTs = `function invertObject(obj: Record<string, string | number>) {
  const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[String(value)] = key;
    }
    return result;
}

export { invertObject };`;

export const solutionJs = `function invertObject(obj) {
  const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[String(value)] = key;
    }
    return result;
}

module.exports = { invertObject };`;
