export const starterTs = `function validateStructured(obj: Record<string, unknown>, required: string[]) {
  // Implement this function
  
}

export { validateStructured };`;

export const starterJs = `function validateStructured(obj, required) {
  // Implement this function
  
}

module.exports = { validateStructured };`;

export const solutionTs = `function validateStructured(obj: Record<string, unknown>, required: string[]) {
  return required.every((key) => key in obj);
}

export { validateStructured };`;

export const solutionJs = `function validateStructured(obj, required) {
  return required.every((key) => key in obj);
}

module.exports = { validateStructured };`;
