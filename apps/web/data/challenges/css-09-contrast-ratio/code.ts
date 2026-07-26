export const starterTs = `function contrastRatio(l1: number, l2: number) {
  // Implement this function
  
}

export { contrastRatio };`;

export const starterJs = `function contrastRatio(l1, l2) {
  // Implement this function
  
}

module.exports = { contrastRatio };`;

export const solutionTs = `function contrastRatio(l1: number, l2: number) {
  const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

export { contrastRatio };`;

export const solutionJs = `function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

module.exports = { contrastRatio };`;
