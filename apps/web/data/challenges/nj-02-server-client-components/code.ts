export const starterTs = `interface ComponentAnalysis {
  needsClientDirective: boolean;
  reasons: string[];
}

function analyzeComponent(source: string): ComponentAnalysis {
  // Inspect the source string and decide whether it needs 'use client'.
  // Check for: explicit directive, stateful hooks, event handlers, browser globals.

  return { needsClientDirective: false, reasons: [] };
}

export { analyzeComponent };`;

export const starterJs = `function analyzeComponent(source) {
  // Inspect the source string and decide whether it needs 'use client'.
  // Check for: explicit directive, stateful hooks, event handlers, browser globals.

  return { needsClientDirective: false, reasons: [] };
}

module.exports = { analyzeComponent };`;

export const solutionTs = `interface ComponentAnalysis {
  needsClientDirective: boolean;
  reasons: string[];
}

function analyzeComponent(source: string): ComponentAnalysis {
  const reasons: string[] = [];

  if (/^\\s*['"]use client['"]/.test(source)) {
    reasons.push('Has an explicit "use client" directive');
  }

  if (/\\buse(State|Effect|Reducer|Ref|Context|LayoutEffect|ImperativeHandle)\\b/.test(source)) {
    reasons.push('Uses a stateful or browser-only React hook');
  }

  if (/\\bon[A-Z]\\w*\\s*=/.test(source)) {
    reasons.push('Attaches a DOM event handler');
  }

  if (/\\b(window|document|localStorage|sessionStorage|navigator)\\s*\\./.test(source)) {
    reasons.push('Accesses a browser-only global');
  }

  return { needsClientDirective: reasons.length > 0, reasons };
}

export { analyzeComponent };`;

export const solutionJs = `function analyzeComponent(source) {
  const reasons = [];

  if (/^\\s*['"]use client['"]/.test(source)) {
    reasons.push('Has an explicit "use client" directive');
  }

  if (/\\buse(State|Effect|Reducer|Ref|Context|LayoutEffect|ImperativeHandle)\\b/.test(source)) {
    reasons.push('Uses a stateful or browser-only React hook');
  }

  if (/\\bon[A-Z]\\w*\\s*=/.test(source)) {
    reasons.push('Attaches a DOM event handler');
  }

  if (/\\b(window|document|localStorage|sessionStorage|navigator)\\s*\\./.test(source)) {
    reasons.push('Accesses a browser-only global');
  }

  return { needsClientDirective: reasons.length > 0, reasons };
}

module.exports = { analyzeComponent };`;
