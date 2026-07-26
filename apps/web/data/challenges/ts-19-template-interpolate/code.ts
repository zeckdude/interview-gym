export const starterTs = `function interpolate(template: string, vars: Record<string, unknown>) {
  // Implement this function
  
}

export { interpolate };`;

export const starterJs = `function interpolate(template, vars) {
  // Implement this function
  
}

module.exports = { interpolate };`;

export const solutionTs = `function interpolate(template: string, vars: Record<string, unknown>) {
  return template.replace(/\\{\\{(\\w+)\\}\\}/g, (_, key) => String(vars[key] ?? ''));
}

export { interpolate };`;

export const solutionJs = `function interpolate(template, vars) {
  return template.replace(/\\{\\{(\\w+)\\}\\}/g, (_, key) => String(vars[key] ?? ''));
}

module.exports = { interpolate };`;
