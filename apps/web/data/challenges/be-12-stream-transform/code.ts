export const starterTs = `// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Transform = (item: any) => any;

function createTransformPipeline(...transforms: Transform[]) {
  return function process<T>(items: T[]): unknown[] {
    // Apply all transforms in sequence to each item
    return [];
  };
}

export { createTransformPipeline };`;

export const starterJs = `function createTransformPipeline(...transforms) {
  return function process(items) {
    // Apply all transforms in sequence to each item
    return [];
  };
}

module.exports = { createTransformPipeline };`;

export const solutionTs = `// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Transform = (item: any) => any;

function createTransformPipeline(...transforms: Transform[]) {
  return function process<T>(items: T[]): unknown[] {
    return items.map((item) =>
      transforms.reduce((acc, fn) => fn(acc), item)
    );
  };
}

export { createTransformPipeline };`;

export const solutionJs = `function createTransformPipeline(...transforms) {
  return function process(items) {
    return items.map((item) =>
      transforms.reduce((acc, fn) => fn(acc), item)
    );
  };
}

module.exports = { createTransformPipeline };`;
