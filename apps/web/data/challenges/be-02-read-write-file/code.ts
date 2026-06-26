export const starterTs = `import * as fs from 'fs';

function readAndWrite(): string {
  // Read input.txt, convert to uppercase, write to output.txt
  // Return the uppercase string
  
}

export { readAndWrite };`;

export const starterJs = `const fs = require('fs');

function readAndWrite() {
  // Read input.txt, convert to uppercase, write to output.txt
  // Return the uppercase string
  
}

module.exports = { readAndWrite };`;

export const solutionTs = `import * as fs from 'fs';

function readAndWrite(): string {
  const content = fs.readFileSync('input.txt', 'utf8');
  const upper = content.toUpperCase();
  fs.writeFileSync('output.txt', upper);
  return upper;
}

export { readAndWrite };`;

export const solutionJs = `const fs = require('fs');

function readAndWrite() {
  const content = fs.readFileSync('input.txt', 'utf8');
  const upper = content.toUpperCase();
  fs.writeFileSync('output.txt', upper);
  return upper;
}

module.exports = { readAndWrite };`;
