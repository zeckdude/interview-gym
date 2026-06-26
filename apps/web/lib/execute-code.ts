/**
 * Executes user code in a sandboxed CommonJS-like environment.
 * Works in both browser and Node.js test contexts.
 */
export function executeUserCode(
  userCode: string,
  requireFn: (mod: string) => unknown
): Record<string, unknown> {
  const module = { exports: {} as Record<string, unknown> };
  const exports = module.exports;

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function('require', 'module', 'exports', userCode);
  fn(requireFn, module, exports);

  return module.exports;
}

export function getExport<T>(
  exports: Record<string, unknown>,
  name: string
): T {
  const value = exports[name];
  if (typeof value === 'undefined') {
    throw new Error(`Expected export "${name}" not found in user code`);
  }
  return value as T;
}
