export const starterTs = `function parseMargin(value: string) {
  // Implement this function
  
}

export { parseMargin };`;

export const starterJs = `function parseMargin(value) {
  // Implement this function
  
}

module.exports = { parseMargin };`;

export const solutionTs = `function parseMargin(value: string) {
  const parts = value.trim().split(/\\s+/);
    if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    if (parts.length === 3) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
}

export { parseMargin };`;

export const solutionJs = `function parseMargin(value) {
  const parts = value.trim().split(/\\s+/);
    if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    if (parts.length === 3) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
}

module.exports = { parseMargin };`;
