export const starterTs = `function withDefaults(defaults: Record<string, unknown>, overrides: Record<string, unknown>) {
  // Implement this function
  
}

export { withDefaults };`;

export const starterJs = `function withDefaults(defaults, overrides) {
  // Implement this function
  
}

module.exports = { withDefaults };`;

export const solutionTs = `function withDefaults(defaults: Record<string, unknown>, overrides: Record<string, unknown>) {
  return { ...defaults, ...overrides };
}

export { withDefaults };`;

export const solutionJs = `function withDefaults(defaults, overrides) {
  return { ...defaults, ...overrides };
}

module.exports = { withDefaults };`;
