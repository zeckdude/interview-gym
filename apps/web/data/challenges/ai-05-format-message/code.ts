export const starterTs = `function formatMessage(role: 'user' | 'assistant' | 'system', content: string) {
  // Implement this function
  
}

export { formatMessage };`;

export const starterJs = `function formatMessage(role, content) {
  // Implement this function
  
}

module.exports = { formatMessage };`;

export const solutionTs = `function formatMessage(role: 'user' | 'assistant' | 'system', content: string) {
  return { role, content };
}

export { formatMessage };`;

export const solutionJs = `function formatMessage(role, content) {
  return { role, content };
}

module.exports = { formatMessage };`;
