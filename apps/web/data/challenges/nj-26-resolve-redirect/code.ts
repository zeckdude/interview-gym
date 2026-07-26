export const starterTs = `function resolveRedirectPath(basePath: string, target: string) {
  // Implement this function
  
}

export { resolveRedirectPath };`;

export const starterJs = `function resolveRedirectPath(basePath, target) {
  // Implement this function
  
}

module.exports = { resolveRedirectPath };`;

export const solutionTs = `function resolveRedirectPath(basePath: string, target: string) {
  if (target.startsWith('http://') || target.startsWith('https://')) return target;
    const base = basePath.replace(/\\/\$/, '');
    const path = target.startsWith('/') ? target : \`/\${target}\`;
    return \`\${base}\${path}\`.replace(/\\/+/g, '/');
}

export { resolveRedirectPath };`;

export const solutionJs = `function resolveRedirectPath(basePath, target) {
  if (target.startsWith('http://') || target.startsWith('https://')) return target;
    const base = basePath.replace(/\\/\$/, '');
    const path = target.startsWith('/') ? target : \`/\${target}\`;
    return \`\${base}\${path}\`.replace(/\\/+/g, '/');
}

module.exports = { resolveRedirectPath };`;
