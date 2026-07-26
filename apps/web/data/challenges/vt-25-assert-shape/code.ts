export const starterTs = `function assertShape(obj: Record<string, unknown>, shape: Record<string, string>) {
  // Implement this function
  
}

export { assertShape };`;

export const starterJs = `function assertShape(obj, shape) {
  // Implement this function
  
}

module.exports = { assertShape };`;

export const solutionTs = `function assertShape(obj: Record<string, unknown>, shape: Record<string, string>) {
  for (const key of Object.keys(shape)) {
      if (typeof obj[key] !== shape[key]) return false;
    }
    return true;
}

export { assertShape };`;

export const solutionJs = `function assertShape(obj, shape) {
  for (const key of Object.keys(shape)) {
      if (typeof obj[key] !== shape[key]) return false;
    }
    return true;
}

module.exports = { assertShape };`;
