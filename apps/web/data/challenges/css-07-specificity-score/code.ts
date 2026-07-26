export const starterTs = `function specificity(selector: string) {
  // Implement this function
  
}

export { specificity };`;

export const starterJs = `function specificity(selector) {
  // Implement this function
  
}

module.exports = { specificity };`;

export const solutionTs = `function specificity(selector: string) {
  const ids = (selector.match(/#/g) || []).length;
    const classes = (selector.match(/\\./g) || []).length + (selector.match(/\\[/g) || []).length;
    const elements = (selector.match(/[a-zA-Z]/g) || []).length;
    return ids * 100 + classes * 10 + elements;
}

export { specificity };`;

export const solutionJs = `function specificity(selector) {
  const ids = (selector.match(/#/g) || []).length;
    const classes = (selector.match(/\\./g) || []).length + (selector.match(/\\[/g) || []).length;
    const elements = (selector.match(/[a-zA-Z]/g) || []).length;
    return ids * 100 + classes * 10 + elements;
}

module.exports = { specificity };`;
