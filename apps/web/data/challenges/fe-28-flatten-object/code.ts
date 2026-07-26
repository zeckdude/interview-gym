export const starterTs = `function flattenObject(obj: Record<string, unknown>) {
  // Implement this function
  
}

export { flattenObject };`;

export const starterJs = `function flattenObject(obj) {
  // Implement this function
  
}

module.exports = { flattenObject };`;

export const solutionTs = `function flattenObject(obj: Record<string, unknown>) {
  const result = {};
    const walk = (value, prefix) => {
      if (value != null && typeof value === 'object' && !Array.isArray(value)) {
        for (const [key, nested] of Object.entries(value)) {
          walk(nested, prefix ? \`\${prefix}.\${key}\` : key);
        }
      } else {
        result[prefix] = value;
      }
    };
    walk(obj, '');
    return result;
}

export { flattenObject };`;

export const solutionJs = `function flattenObject(obj) {
  const result = {};
    const walk = (value, prefix) => {
      if (value != null && typeof value === 'object' && !Array.isArray(value)) {
        for (const [key, nested] of Object.entries(value)) {
          walk(nested, prefix ? \`\${prefix}.\${key}\` : key);
        }
      } else {
        result[prefix] = value;
      }
    };
    walk(obj, '');
    return result;
}

module.exports = { flattenObject };`;
