export const starterTs = `function wantsJsonOutput(prompt: string) {
  // Implement this function
  
}

export { wantsJsonOutput };`;

export const starterJs = `function wantsJsonOutput(prompt) {
  // Implement this function
  
}

module.exports = { wantsJsonOutput };`;

export const solutionTs = `function wantsJsonOutput(prompt: string) {
  return /json|schema|structured/i.test(prompt);
}

export { wantsJsonOutput };`;

export const solutionJs = `function wantsJsonOutput(prompt) {
  return /json|schema|structured/i.test(prompt);
}

module.exports = { wantsJsonOutput };`;
