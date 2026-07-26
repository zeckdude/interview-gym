export const starterTs = `function resolveLayer(layer: string) {
  // Implement this function
  
}

export { resolveLayer };`;

export const starterJs = `function resolveLayer(layer) {
  // Implement this function
  
}

module.exports = { resolveLayer };`;

export const solutionTs = `function resolveLayer(layer: string) {
  const order = { reset: 0, base: 1, components: 2, utilities: 3 };
    return order[layer] ?? 0;
}

export { resolveLayer };`;

export const solutionJs = `function resolveLayer(layer) {
  const order = { reset: 0, base: 1, components: 2, utilities: 3 };
    return order[layer] ?? 0;
}

module.exports = { resolveLayer };`;
