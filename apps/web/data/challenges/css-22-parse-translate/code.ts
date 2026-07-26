export const starterTs = `function parseTranslateX(transform: string) {
  // Implement this function
  
}

export { parseTranslateX };`;

export const starterJs = `function parseTranslateX(transform) {
  // Implement this function
  
}

module.exports = { parseTranslateX };`;

export const solutionTs = `function parseTranslateX(transform: string) {
  const match = transform.match(/translateX\\(([-\\d.]+)px\\)/);
    return match ? Number(match[1]) : 0;
}

export { parseTranslateX };`;

export const solutionJs = `function parseTranslateX(transform) {
  const match = transform.match(/translateX\\(([-\\d.]+)px\\)/);
    return match ? Number(match[1]) : 0;
}

module.exports = { parseTranslateX };`;
