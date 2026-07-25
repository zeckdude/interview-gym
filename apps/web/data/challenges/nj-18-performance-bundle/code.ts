export const starterTs = `type Issue = 'dynamic-import' | 'server-only-in-client' | 'blocking-script';

function auditImports(lines: string[]): Issue[] {
  return [];
}

export { auditImports };`;

export const starterJs = `function auditImports(lines): Issue[] {
  return [];
}

module.exports = { auditImports };`;

export const solutionTs = `type Issue = 'dynamic-import' | 'server-only-in-client' | 'blocking-script';

function auditImports(lines: string[]): Issue[] {
  const issues: Issue[] = [];
  for (const line of lines) {
    if (/^imports+w+s+froms+['"]heavy-chart['"]/.test(line)) issues.push('dynamic-import');
    if (/^imports+.*s+froms+['"]fs['"]/.test(line)) issues.push('server-only-in-client');
    if (/<scripts+src=/.test(line) && !/strategy=/.test(line)) issues.push('blocking-script');
  }
  return issues;
}

export { auditImports };`;

export const solutionJs = `function auditImports(lines): Issue[] {
  const issues: Issue[] = [];
  for (const line of lines) {
    if (/^imports+w+s+froms+['"]heavy-chart['"]/.test(line)) issues.push('dynamic-import');
    if (/^imports+.*s+froms+['"]fs['"]/.test(line)) issues.push('server-only-in-client');
    if (/<scripts+src=/.test(line) && !/strategy=/.test(line)) issues.push('blocking-script');
  }
  return issues;
}

module.exports = { auditImports };`;
