export const starterTs = `function parseQuery(qs: string) {
  // Implement this function
  
}

export { parseQuery };`;

export const starterJs = `function parseQuery(qs) {
  // Implement this function
  
}

module.exports = { parseQuery };`;

export const solutionTs = `function parseQuery(qs: string) {
  const params = new URLSearchParams(qs.startsWith('?') ? qs.slice(1) : qs);
    const result = {};
    for (const [key, value] of params.entries()) result[key] = value;
    return result;
}

export { parseQuery };`;

export const solutionJs = `function parseQuery(qs) {
  const params = new URLSearchParams(qs.startsWith('?') ? qs.slice(1) : qs);
    const result = {};
    for (const [key, value] of params.entries()) result[key] = value;
    return result;
}

module.exports = { parseQuery };`;
