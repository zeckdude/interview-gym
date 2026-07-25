export const starterTs = `function deepClone<T>(value: T): T {
  // Recursively clone the value
  return value;
}

export { deepClone };`;

export const starterJs = `function deepClone(value) {
  // Recursively clone the value
  return value;
}

module.exports = { deepClone };`;

export const solutionTs = `function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(deepClone) as unknown as T;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, deepClone(v)])
  ) as T;
}

export { deepClone };`;

export const solutionJs = `function deepClone(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(deepClone);
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, deepClone(v)])
  );
}

module.exports = { deepClone };`;
