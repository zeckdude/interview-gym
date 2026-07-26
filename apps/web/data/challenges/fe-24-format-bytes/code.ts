export const starterTs = `function formatBytes(bytes: number) {
  // Implement this function
  
}

export { formatBytes };`;

export const starterJs = `function formatBytes(bytes) {
  // Implement this function
  
}

module.exports = { formatBytes };`;

export const solutionTs = `function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, i);
    return \`\${Math.round(value * 10) / 10} \${units[i]}\`;
}

export { formatBytes };`;

export const solutionJs = `function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, i);
    return \`\${Math.round(value * 10) / 10} \${units[i]}\`;
}

module.exports = { formatBytes };`;
