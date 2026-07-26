export const starterTs = `function parseAgentAction(text: string) {
  // Implement this function
  
}

export { parseAgentAction };`;

export const starterJs = `function parseAgentAction(text) {
  // Implement this function
  
}

module.exports = { parseAgentAction };`;

export const solutionTs = `function parseAgentAction(text: string) {
  const match = text.match(/Action:\\s*(\\w+)\\s*Input:\\s*(\\{[\\s\\S]*\\})/);
    if (!match) return null;
    return { action: match[1], input: JSON.parse(match[2]) };
}

export { parseAgentAction };`;

export const solutionJs = `function parseAgentAction(text) {
  const match = text.match(/Action:\\s*(\\w+)\\s*Input:\\s*(\\{[\\s\\S]*\\})/);
    if (!match) return null;
    return { action: match[1], input: JSON.parse(match[2]) };
}

module.exports = { parseAgentAction };`;
