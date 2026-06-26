export const starterTs = `import * as fs from 'fs';

function listFiles(): string {
  // Use fs.readdirSync to read the directory
  // Return the filenames as a comma-separated string
  
}

export { listFiles };`;

export const starterJs = `const fs = require('fs');

function listFiles() {
  // Use fs.readdirSync to read the directory
  // Return the filenames as a comma-separated string
  
}

module.exports = { listFiles };`;

export const solutionTs = `import * as fs from 'fs';

function listFiles(): string {
  const files = fs.readdirSync('.');
  return files.join(', ');
}

export { listFiles };`;

export const solutionJs = `const fs = require('fs');

function listFiles() {
  const files = fs.readdirSync('.');
  return files.join(', ');
}

module.exports = { listFiles };`;
