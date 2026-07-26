export const starterTs = `function summarizeTurns(messages: Array<{ role: string; content: string }>, maxChars: number) {
  // Implement this function
  
}

export { summarizeTurns };`;

export const starterJs = `function summarizeTurns(messages, maxChars) {
  // Implement this function
  
}

module.exports = { summarizeTurns };`;

export const solutionTs = `function summarizeTurns(messages: Array<{ role: string; content: string }>, maxChars: number) {
  const joined = messages.map((m) => m.role + ': ' + m.content).join(' | ');
    return joined.length > maxChars ? joined.slice(0, maxChars) + '…' : joined;
}

export { summarizeTurns };`;

export const solutionJs = `function summarizeTurns(messages, maxChars) {
  const joined = messages.map((m) => m.role + ': ' + m.content).join(' | ');
    return joined.length > maxChars ? joined.slice(0, maxChars) + '…' : joined;
}

module.exports = { summarizeTurns };`;
