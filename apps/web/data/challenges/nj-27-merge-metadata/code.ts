export const starterTs = `function mergeMetadata(base: Record<string, unknown>, override: Record<string, unknown>) {
  // Implement this function
  
}

export { mergeMetadata };`;

export const starterJs = `function mergeMetadata(base, override) {
  // Implement this function
  
}

module.exports = { mergeMetadata };`;

export const solutionTs = `function mergeMetadata(base: Record<string, unknown>, override: Record<string, unknown>) {
  const result = { ...base };
    for (const [key, value] of Object.entries(override)) {
      if (value == null) continue;
      if (typeof value === 'object' && !Array.isArray(value) && typeof result[key] === 'object' && result[key] != null && !Array.isArray(result[key])) {
        result[key] = mergeMetadata(result[key], value);
      } else {
        result[key] = value;
      }
    }
    return result;
}

export { mergeMetadata };`;

export const solutionJs = `function mergeMetadata(base, override) {
  const result = { ...base };
    for (const [key, value] of Object.entries(override)) {
      if (value == null) continue;
      if (typeof value === 'object' && !Array.isArray(value) && typeof result[key] === 'object' && result[key] != null && !Array.isArray(result[key])) {
        result[key] = mergeMetadata(result[key], value);
      } else {
        result[key] = value;
      }
    }
    return result;
}

module.exports = { mergeMetadata };`;
