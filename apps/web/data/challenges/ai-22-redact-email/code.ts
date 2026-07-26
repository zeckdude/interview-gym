export const starterTs = `function redactEmails(text: string) {
  // Implement this function
  
}

export { redactEmails };`;

export const starterJs = `function redactEmails(text) {
  // Implement this function
  
}

module.exports = { redactEmails };`;

export const solutionTs = `function redactEmails(text: string) {
  return text.replace(/[\\w.-]+@[\\w.-]+/g, '[redacted]');
}

export { redactEmails };`;

export const solutionJs = `function redactEmails(text) {
  return text.replace(/[\\w.-]+@[\\w.-]+/g, '[redacted]');
}

module.exports = { redactEmails };`;
