export const starterTs = `interface ImageInput { src: string; width: number; height: number; aboveFold: boolean }

function buildImageProps(input: ImageInput) {
  return { src: input.src, width: input.width, height: input.height, alt: '' };
}

export { buildImageProps };`;

export const starterJs = `function buildImageProps(input) {
  return { src, width, height, alt: '' };
}

module.exports = { buildImageProps };`;

export const solutionTs = `interface ImageInput { src: string; width: number; height: number; aboveFold: boolean }

function buildImageProps(input: ImageInput) {
  const base = { src: input.src, width: input.width, height: input.height, alt: '', sizes: '(max-width: 768px) 100vw, 50vw' };
  if (input.aboveFold) return { ...base, priority: true };
  return { ...base, loading: 'lazy' as const };
}

export { buildImageProps };`;

export const solutionJs = `function buildImageProps(input) {
  const base = { src, width, height, alt, sizes) 100vw, 50vw' };
  if (input.aboveFold) return { ...base, priority: true };
  return { ...base, loading: 'lazy' };
}

module.exports = { buildImageProps };`;
