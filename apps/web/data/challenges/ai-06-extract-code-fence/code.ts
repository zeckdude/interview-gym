export const starterTs = `function extractCodeBlock(markdown: string) {
  // Implement this function
  
}

export { extractCodeBlock };`;

export const starterJs = `function extractCodeBlock(markdown) {
  // Implement this function
  
}

module.exports = { extractCodeBlock };`;

export const solutionTs = `function extractCodeBlock(markdown: string) {
  const match = markdown.match(/\`\`\`(?:\\w+)?\\n([\\s\\S]*?)\\n\`\`\`/);
    return match ? match[1].trim() : '';
}

export { extractCodeBlock };`;

export const solutionJs = `function extractCodeBlock(markdown) {
  const match = markdown.match(/\`\`\`(?:\\w+)?\\n([\\s\\S]*?)\\n\`\`\`/);
    return match ? match[1].trim() : '';
}

module.exports = { extractCodeBlock };`;
