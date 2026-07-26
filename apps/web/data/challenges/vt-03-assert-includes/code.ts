export const starterTs = `function assertIncludes(haystack: unknown[], needle: unknown) {
  // Implement this function
  
}

export { assertIncludes };`;

export const starterJs = `function assertIncludes(haystack, needle) {
  // Implement this function
  
}

module.exports = { assertIncludes };`;

export const solutionTs = `function assertIncludes(haystack: unknown[], needle: unknown) {
  if (!haystack.includes(needle)) throw new Error('Missing ' + needle);
}

export { assertIncludes };`;

export const solutionJs = `function assertIncludes(haystack, needle) {
  if (!haystack.includes(needle)) throw new Error('Missing ' + needle);
}

module.exports = { assertIncludes };`;
