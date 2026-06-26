export const starterTs = `import * as fs from 'fs';

async function readFileAsync(filename: string): Promise<string> {
  // Use fs.promises.readFile to read the file
  // Return contents or "file not found" if missing
  
}

export { readFileAsync };`;

export const starterJs = `const fs = require('fs');

async function readFileAsync(filename) {
  // Use fs.promises.readFile to read the file
  // Return contents or "file not found" if missing
  
}

module.exports = { readFileAsync };`;

export const solutionTs = `import * as fs from 'fs';

async function readFileAsync(filename: string): Promise<string> {
  try {
    return await fs.promises.readFile(filename, 'utf8');
  } catch {
    return 'file not found';
  }
}

export { readFileAsync };`;

export const solutionJs = `const fs = require('fs');

async function readFileAsync(filename) {
  try {
    return await fs.promises.readFile(filename, 'utf8');
  } catch {
    return 'file not found';
  }
}

module.exports = { readFileAsync };`;
