export const starterTs = `interface SectionConfig {
  id: string;
  delayMs: number;
  critical: boolean;
}

interface StreamingPlan {
  shellSections: string[];
  streamedSections: string[];
  totalBlockingMs: number;
}

function planStreamingSections(sections: SectionConfig[]): StreamingPlan {
  return { shellSections: [], streamedSections: [], totalBlockingMs: 0 };
}

export { planStreamingSections };`;

export const starterJs = `function planStreamingSections(sections): StreamingPlan {
  return { shellSections, streamedSections, totalBlockingMs: 0 };
}

module.exports = { planStreamingSections };`;

export const solutionTs = `interface SectionConfig {
  id: string;
  delayMs: number;
  critical: boolean;
}

interface StreamingPlan {
  shellSections: string[];
  streamedSections: string[];
  totalBlockingMs: number;
}

function planStreamingSections(sections: SectionConfig[]): StreamingPlan {
  const shellSections = sections.filter((s) => s.critical && s.delayMs === 0).map((s) => s.id);
  const streamedSections = sections
    .filter((s) => !(s.critical && s.delayMs === 0))
    .sort((a, b) => a.delayMs - b.delayMs)
    .map((s) => s.id);
  return { shellSections, streamedSections, totalBlockingMs: shellSections.length > 0 ? 0 : 999 };
}

export { planStreamingSections };`;

export const solutionJs = `function planStreamingSections(sections): StreamingPlan {
  const shellSections = sections.filter((s) => s.critical && s.delayMs === 0).map((s) => s.id);
  const streamedSections = sections
    .filter((s) => !(s.critical && s.delayMs === 0))
    .sort((a, b) => a.delayMs - b.delayMs)
    .map((s) => s.id);
  return { shellSections, streamedSections, totalBlockingMs: shellSections.length > 0 ? 0 : 999 };
}

module.exports = { planStreamingSections };`;
