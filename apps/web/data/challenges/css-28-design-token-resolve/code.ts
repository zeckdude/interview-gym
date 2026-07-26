export const starterTs = `function resolveToken(name: string, tokens: Record<string, string>) {
  // Implement this function
  
}

export { resolveToken };`;

export const starterJs = `function resolveToken(name, tokens) {
  // Implement this function
  
}

module.exports = { resolveToken };`;

export const solutionTs = `function resolveToken(name: string, tokens: Record<string, string>) {
  let val = tokens[name];
    while (val && val.startsWith('{') && val.endsWith('}')) val = tokens[val.slice(1, -1)];
    return val;
}

export { resolveToken };`;

export const solutionJs = `function resolveToken(name, tokens) {
  let val = tokens[name];
    while (val && val.startsWith('{') && val.endsWith('}')) val = tokens[val.slice(1, -1)];
    return val;
}

module.exports = { resolveToken };`;
