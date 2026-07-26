export const starterTs = `function setNested(obj: Record<string, unknown>, path: string, value: unknown) {
  // Implement this function
  
}

export { setNested };`;

export const starterJs = `function setNested(obj, path, value) {
  // Implement this function
  
}

module.exports = { setNested };`;

export const solutionTs = `function setNested(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split('.');
    const clone = { ...obj };
    let cursor = clone;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      cursor[key] = { ...(cursor[key] ?? {}) };
      cursor = cursor[key];
    }
    cursor[keys[keys.length - 1]] = value;
    return clone;
}

export { setNested };`;

export const solutionJs = `function setNested(obj, path, value) {
  const keys = path.split('.');
    const clone = { ...obj };
    let cursor = clone;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      cursor[key] = { ...(cursor[key] ?? {}) };
      cursor = cursor[key];
    }
    cursor[keys[keys.length - 1]] = value;
    return clone;
}

module.exports = { setNested };`;
