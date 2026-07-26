export const starterTs = `function buildFewShot(examples: Array<{ q: string; a: string }>) {
  // Implement this function
  
}

export { buildFewShot };`;

export const starterJs = `function buildFewShot(examples) {
  // Implement this function
  
}

module.exports = { buildFewShot };`;

export const solutionTs = `function buildFewShot(examples: Array<{ q: string; a: string }>) {
  return examples.map((ex) => 'Q: ' + ex.q + '\\nA: ' + ex.a).join('\\n\\n');
}

export { buildFewShot };`;

export const solutionJs = `function buildFewShot(examples) {
  return examples.map((ex) => 'Q: ' + ex.q + '\\nA: ' + ex.a).join('\\n\\n');
}

module.exports = { buildFewShot };`;
