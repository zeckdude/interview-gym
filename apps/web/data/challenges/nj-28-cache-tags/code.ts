export const starterTs = `function computeCacheTags(resource: { type?: string; id?: string; tenantId?: string }) {
  // Implement this function
  
}

export { computeCacheTags };`;

export const starterJs = `function computeCacheTags(resource) {
  // Implement this function
  
}

module.exports = { computeCacheTags };`;

export const solutionTs = `function computeCacheTags(resource: { type?: string; id?: string; tenantId?: string }) {
  const tags = new Set(['app']);
    if (resource.type) tags.add(\`type:\${resource.type}\`);
    if (resource.id) tags.add(\`\${resource.type ?? 'item'}:\${resource.id}\`);
    if (resource.tenantId) tags.add(\`tenant:\${resource.tenantId}\`);
    return [...tags];
}

export { computeCacheTags };`;

export const solutionJs = `function computeCacheTags(resource) {
  const tags = new Set(['app']);
    if (resource.type) tags.add(\`type:\${resource.type}\`);
    if (resource.id) tags.add(\`\${resource.type ?? 'item'}:\${resource.id}\`);
    if (resource.tenantId) tags.add(\`tenant:\${resource.tenantId}\`);
    return [...tags];
}

module.exports = { computeCacheTags };`;
