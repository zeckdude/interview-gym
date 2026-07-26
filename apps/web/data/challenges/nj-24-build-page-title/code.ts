export const starterTs = `function buildPageTitle(pageTitle: string, sectionTitle: string, siteName: string) {
  // Implement this function
  
}

export { buildPageTitle };`;

export const starterJs = `function buildPageTitle(pageTitle, sectionTitle, siteName) {
  // Implement this function
  
}

module.exports = { buildPageTitle };`;

export const solutionTs = `function buildPageTitle(pageTitle: string, sectionTitle: string, siteName: string) {
  const parts = [pageTitle, sectionTitle, siteName].filter(Boolean);
    return parts.join(' | ');
}

export { buildPageTitle };`;

export const solutionJs = `function buildPageTitle(pageTitle, sectionTitle, siteName) {
  const parts = [pageTitle, sectionTitle, siteName].filter(Boolean);
    return parts.join(' | ');
}

module.exports = { buildPageTitle };`;
