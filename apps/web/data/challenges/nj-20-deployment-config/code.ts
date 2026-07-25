export const starterTs = `interface ProductionConfig {
  output: string;
  headers: string[];
  envValidated: boolean;
  redirects: unknown[];
}

function validateProductionConfig(config: ProductionConfig): boolean {
  return false;
}

export { validateProductionConfig };`;

export const starterJs = `function validateProductionConfig(config): boolean {
  return false;
}

module.exports = { validateProductionConfig };`;

export const solutionTs = `interface ProductionConfig {
  output: string;
  headers: string[];
  envValidated: boolean;
  redirects: unknown[];
}

function validateProductionConfig(config: ProductionConfig): boolean {
  const hasCsp = config.headers.some((h) => h.toLowerCase().includes('content-security-policy'));
  const hasHsts = config.headers.some((h) => h.toLowerCase().includes('strict-transport-security'));
  return config.output === 'standalone' && hasCsp && hasHsts && config.envValidated === true && config.redirects.length > 0;
}

export { validateProductionConfig };`;

export const solutionJs = `function validateProductionConfig(config): boolean {
  const hasCsp = config.headers.some((h) => h.toLowerCase().includes('content-security-policy'));
  const hasHsts = config.headers.some((h) => h.toLowerCase().includes('strict-transport-security'));
  return config.output === 'standalone' && hasCsp && hasHsts && config.envValidated === true && config.redirects.length > 0;
}

module.exports = { validateProductionConfig };`;
