export const starterTs = `function parseContentType(header: string) {
  // Implement this function
  
}

export { parseContentType };`;

export const starterJs = `function parseContentType(header) {
  // Implement this function
  
}

module.exports = { parseContentType };`;

export const solutionTs = `function parseContentType(header: string) {
  const [typePart, ...params] = header.split(';').map((s) => s.trim());
    const type = typePart.toLowerCase();
    const charset = params
      .map((p) => p.split('=').map((s) => s.trim()))
      .find(([key]) => key.toLowerCase() === 'charset')?.[1]
      ?.replace(/^"|"\$/g, '');
    return { type, charset: charset ?? null };
}

export { parseContentType };`;

export const solutionJs = `function parseContentType(header) {
  const [typePart, ...params] = header.split(';').map((s) => s.trim());
    const type = typePart.toLowerCase();
    const charset = params
      .map((p) => p.split('=').map((s) => s.trim()))
      .find(([key]) => key.toLowerCase() === 'charset')?.[1]
      ?.replace(/^"|"\$/g, '');
    return { type, charset: charset ?? null };
}

module.exports = { parseContentType };`;
