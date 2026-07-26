export const starterTs = `function parseToolCall(response: string) {
  // Implement this function
  
}

export { parseToolCall };`;

export const starterJs = `function parseToolCall(response) {
  // Implement this function
  
}

module.exports = { parseToolCall };`;

export const solutionTs = `function parseToolCall(response: string) {
  const data = typeof response === 'string' ? JSON.parse(response) : response;
    return { name: data.name, arguments: data.arguments ?? {} };
}

export { parseToolCall };`;

export const solutionJs = `function parseToolCall(response) {
  const data = typeof response === 'string' ? JSON.parse(response) : response;
    return { name: data.name, arguments: data.arguments ?? {} };
}

module.exports = { parseToolCall };`;
