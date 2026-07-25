export const starterTs = `function pathJoin(...segments: string[]): string {
  // Join segments into a clean, normalized path
  
}

export { pathJoin };`;

export const starterJs = `function pathJoin(...segments) {
  // Join segments into a clean, normalized path
  
}

module.exports = { pathJoin };`;

export const solutionTs = `function pathJoin(...segments: string[]): string {
  const joined = segments.join('/');
  const normalized = joined.replace(/\\/+/g, '/');
  const hasLeading = normalized.startsWith('/');
  const trimmed = normalized.replace(/^\\/+|\\/+$/g, '');
  return hasLeading ? '/' + trimmed : trimmed;
}

export { pathJoin };`;

export const solutionJs = `function pathJoin(...segments) {
  const joined = segments.join('/');
  const normalized = joined.replace(/\\/+/g, '/');
  const hasLeading = normalized.startsWith('/');
  const trimmed = normalized.replace(/^\\/+|\\/+$/g, '');
  return hasLeading ? '/' + trimmed : trimmed;
}

module.exports = { pathJoin };`;
