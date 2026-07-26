export const starterTs = `function stripChainOfThought(text: string) {
  // Implement this function
  
}

export { stripChainOfThought };`;

export const starterJs = `function stripChainOfThought(text) {
  // Implement this function
  
}

module.exports = { stripChainOfThought };`;

export const solutionTs = `function stripChainOfThought(text: string) {
  return text.replace(/Thought:[\\s\\S]*?Answer:/i, 'Answer:');
}

export { stripChainOfThought };`;

export const solutionJs = `function stripChainOfThought(text) {
  return text.replace(/Thought:[\\s\\S]*?Answer:/i, 'Answer:');
}

module.exports = { stripChainOfThought };`;
