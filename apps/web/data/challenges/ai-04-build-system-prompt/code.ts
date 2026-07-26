export const starterTs = `function buildSystemPrompt(instructions: string) {
  // Implement this function
  
}

export { buildSystemPrompt };`;

export const starterJs = `function buildSystemPrompt(instructions) {
  // Implement this function
  
}

module.exports = { buildSystemPrompt };`;

export const solutionTs = `function buildSystemPrompt(instructions: string) {
  return 'You are a helpful assistant.\\n' + instructions;
}

export { buildSystemPrompt };`;

export const solutionJs = `function buildSystemPrompt(instructions) {
  return 'You are a helpful assistant.\\n' + instructions;
}

module.exports = { buildSystemPrompt };`;
