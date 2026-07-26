export const starterTs = `function getBreakpoint(width: number, breakpoints: Record<string, number>) {
  // Implement this function
  
}

export { getBreakpoint };`;

export const starterJs = `function getBreakpoint(width, breakpoints) {
  // Implement this function
  
}

module.exports = { getBreakpoint };`;

export const solutionTs = `function getBreakpoint(width: number, breakpoints: Record<string, number>) {
  const sorted = Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
    for (const [name, min] of sorted) if (width >= min) return name;
    return 'xs';
}

export { getBreakpoint };`;

export const solutionJs = `function getBreakpoint(width, breakpoints) {
  const sorted = Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
    for (const [name, min] of sorted) if (width >= min) return name;
    return 'xs';
}

module.exports = { getBreakpoint };`;
