export const starterTs = `function trimMessages(messages: unknown[], max: number) {
  // Implement this function
  
}

export { trimMessages };`;

export const starterJs = `function trimMessages(messages, max) {
  // Implement this function
  
}

module.exports = { trimMessages };`;

export const solutionTs = `function trimMessages(messages: unknown[], max: number) {
  return messages.slice(-max);
}

export { trimMessages };`;

export const solutionJs = `function trimMessages(messages, max) {
  return messages.slice(-max);
}

module.exports = { trimMessages };`;
