export const starterTs = `function stripRouteGroups(segments: string[]) {
  // Implement this function
  
}

export { stripRouteGroups };`;

export const starterJs = `function stripRouteGroups(segments) {
  // Implement this function
  
}

module.exports = { stripRouteGroups };`;

export const solutionTs = `function stripRouteGroups(segments: string[]) {
  return segments
      .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')))
      .join('/');
}

export { stripRouteGroups };`;

export const solutionJs = `function stripRouteGroups(segments) {
  return segments
      .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')))
      .join('/');
}

module.exports = { stripRouteGroups };`;
