export const starterTs = `function fillTemplate(template: string, data: Record<string, unknown>) {
  // Implement this function
  
}

export { fillTemplate };`;

export const starterJs = `function fillTemplate(template, data) {
  // Implement this function
  
}

module.exports = { fillTemplate };`;

export const solutionTs = `function fillTemplate(template: string, data: Record<string, unknown>) {
  return template.replace(/\\{(\\w+)\\}/g, (_, key) => String(data[key] ?? ''));
}

export { fillTemplate };`;

export const solutionJs = `function fillTemplate(template, data) {
  return template.replace(/\\{(\\w+)\\}/g, (_, key) => String(data[key] ?? ''));
}

module.exports = { fillTemplate };`;
