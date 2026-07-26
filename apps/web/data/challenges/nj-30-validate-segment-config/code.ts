export const starterTs = `function validateSegmentConfig(config: { dynamic?: string; revalidate?: number; runtime?: string }) {
  // Implement this function
  
}

export { validateSegmentConfig };`;

export const starterJs = `function validateSegmentConfig(config) {
  // Implement this function
  
}

module.exports = { validateSegmentConfig };`;

export const solutionTs = `function validateSegmentConfig(config: { dynamic?: string; revalidate?: number; runtime?: string }) {
  const errors = [];
    if (config.dynamic != null && !['auto', 'force-dynamic', 'error', 'force-static'].includes(config.dynamic)) {
      errors.push('Invalid dynamic value');
    }
    if (config.revalidate != null && (typeof config.revalidate !== 'number' || config.revalidate < 0)) {
      errors.push('revalidate must be a non-negative number');
    }
    if (config.runtime != null && !['nodejs', 'edge'].includes(config.runtime)) {
      errors.push('Invalid runtime');
    }
    return { valid: errors.length === 0, errors };
}

export { validateSegmentConfig };`;

export const solutionJs = `function validateSegmentConfig(config) {
  const errors = [];
    if (config.dynamic != null && !['auto', 'force-dynamic', 'error', 'force-static'].includes(config.dynamic)) {
      errors.push('Invalid dynamic value');
    }
    if (config.revalidate != null && (typeof config.revalidate !== 'number' || config.revalidate < 0)) {
      errors.push('revalidate must be a non-negative number');
    }
    if (config.runtime != null && !['nodejs', 'edge'].includes(config.runtime)) {
      errors.push('Invalid runtime');
    }
    return { valid: errors.length === 0, errors };
}

module.exports = { validateSegmentConfig };`;
