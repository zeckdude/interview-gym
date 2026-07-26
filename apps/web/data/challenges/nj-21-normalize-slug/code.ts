export const starterTs = `function normalizeSlug(input: string) {
  // Implement this function
  
}

export { normalizeSlug };`;

export const starterJs = `function normalizeSlug(input) {
  // Implement this function
  
}

module.exports = { normalizeSlug };`;

export const solutionTs = `function normalizeSlug(input: string) {
  return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-\$/g, '');
}

export { normalizeSlug };`;

export const solutionJs = `function normalizeSlug(input) {
  return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-\$/g, '');
}

module.exports = { normalizeSlug };`;
