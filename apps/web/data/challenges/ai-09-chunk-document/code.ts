export const starterTs = `function chunkText(text: string, size: number) {
  // Implement this function
  
}

export { chunkText };`;

export const starterJs = `function chunkText(text, size) {
  // Implement this function
  
}

module.exports = { chunkText };`;

export const solutionTs = `function chunkText(text: string, size: number) {
  const chunks = [];
    for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
    return chunks;
}

export { chunkText };`;

export const solutionJs = `function chunkText(text, size) {
  const chunks = [];
    for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
    return chunks;
}

module.exports = { chunkText };`;
