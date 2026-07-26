export const starterTs = `function compareSpecificity(a: string, b: string) {
  // Implement this function
  
}

export { compareSpecificity };`;

export const starterJs = `function compareSpecificity(a, b) {
  // Implement this function
  
}

module.exports = { compareSpecificity };`;

export const solutionTs = `function compareSpecificity(a: string, b: string) {
  const score = (sel) => {
      const ids = (sel.match(/#/g) || []).length;
      const classes = (sel.match(/\\./g) || []).length;
      const tags = (sel.match(/^[a-z]+|\\s[a-z]+/gi) || []).length;
      return ids * 100 + classes * 10 + tags;
    };
    return score(a) - score(b);
}

export { compareSpecificity };`;

export const solutionJs = `function compareSpecificity(a, b) {
  const score = (sel) => {
      const ids = (sel.match(/#/g) || []).length;
      const classes = (sel.match(/\\./g) || []).length;
      const tags = (sel.match(/^[a-z]+|\\s[a-z]+/gi) || []).length;
      return ids * 100 + classes * 10 + tags;
    };
    return score(a) - score(b);
}

module.exports = { compareSpecificity };`;
