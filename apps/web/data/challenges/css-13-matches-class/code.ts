export const starterTs = `function matchesClass(el: { classList: string[] }, className: string) {
  // Implement this function
  
}

export { matchesClass };`;

export const starterJs = `function matchesClass(el, className) {
  // Implement this function
  
}

module.exports = { matchesClass };`;

export const solutionTs = `function matchesClass(el: { classList: string[] }, className: string) {
  return el.classList.includes(className.replace('.', ''));
}

export { matchesClass };`;

export const solutionJs = `function matchesClass(el, className) {
  return el.classList.includes(className.replace('.', ''));
}

module.exports = { matchesClass };`;
