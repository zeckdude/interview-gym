export const starterTs = `interface InterceptResult {
  level: 'same' | 'one-above' | 'two-above' | 'root';
  segment: string;
}

function isParallelSlot(folderName: string): boolean {
  // A parallel route slot folder starts with '@'.

  return false;
}

function parseInterceptingRoute(folderName: string): InterceptResult | null {
  // Parse (.)  (..)  (..)(..)  (...) prefixes into { level, segment }.

  return null;
}

export { isParallelSlot, parseInterceptingRoute };`;

export const starterJs = `function isParallelSlot(folderName) {
  // A parallel route slot folder starts with '@'.

  return false;
}

function parseInterceptingRoute(folderName) {
  // Parse (.)  (..)  (..)(..)  (...) prefixes into { level, segment }.

  return null;
}

module.exports = { isParallelSlot, parseInterceptingRoute };`;

export const solutionTs = `interface InterceptResult {
  level: 'same' | 'one-above' | 'two-above' | 'root';
  segment: string;
}

function isParallelSlot(folderName: string): boolean {
  return folderName.startsWith('@');
}

function parseInterceptingRoute(folderName: string): InterceptResult | null {
  if (folderName.startsWith('(..)(..)')) {
    return { level: 'two-above', segment: folderName.slice('(..)(..)'.length) };
  }
  if (folderName.startsWith('(...)')) {
    return { level: 'root', segment: folderName.slice('(...)'.length) };
  }
  if (folderName.startsWith('(..)')) {
    return { level: 'one-above', segment: folderName.slice('(..)'.length) };
  }
  if (folderName.startsWith('(.)')) {
    return { level: 'same', segment: folderName.slice('(.)'.length) };
  }
  return null;
}

export { isParallelSlot, parseInterceptingRoute };`;

export const solutionJs = `function isParallelSlot(folderName) {
  return folderName.startsWith('@');
}

function parseInterceptingRoute(folderName) {
  if (folderName.startsWith('(..)(..)')) {
    return { level: 'two-above', segment: folderName.slice('(..)(..)'.length) };
  }
  if (folderName.startsWith('(...)')) {
    return { level: 'root', segment: folderName.slice('(...)'.length) };
  }
  if (folderName.startsWith('(..)')) {
    return { level: 'one-above', segment: folderName.slice('(..)'.length) };
  }
  if (folderName.startsWith('(.)')) {
    return { level: 'same', segment: folderName.slice('(.)'.length) };
  }
  return null;
}

module.exports = { isParallelSlot, parseInterceptingRoute };`;
