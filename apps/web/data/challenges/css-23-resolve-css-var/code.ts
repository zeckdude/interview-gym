export const starterTs = `function resolveVar(value: string, vars: Record<string, string>) {
  // Implement this function
  
}

export { resolveVar };`;

export const starterJs = `function resolveVar(value, vars) {
  // Implement this function
  
}

module.exports = { resolveVar };`;

export const solutionTs = `function resolveVar(value: string, vars: Record<string, string>) {
  if (!value.startsWith('var(')) return value;
    const name = value.slice(4, -1).trim();
    return vars[name] ?? value;
}

export { resolveVar };`;

export const solutionJs = `function resolveVar(value, vars) {
  if (!value.startsWith('var(')) return value;
    const name = value.slice(4, -1).trim();
    return vars[name] ?? value;
}

module.exports = { resolveVar };`;
