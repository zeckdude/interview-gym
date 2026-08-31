import type { Monaco } from '@monaco-editor/react';

/** Visible default — indigo that reads clearly on code-bg in light and dark. */
export const DEFAULT_INDENT_GUIDE_COLOR = '#6366F1';

export const INDENT_GUIDE_COLOR_SWATCHES = [
  '#6366F1',
  '#FF6B35',
  '#2563EB',
  '#0D9488',
  '#6B6560',
] as const;

const INDENT_GUIDE_COLOR_KEYS = [
  'editorIndentGuide.background',
  'editorIndentGuide.activeBackground',
  'editorIndentGuide.background1',
  'editorIndentGuide.background2',
  'editorIndentGuide.background3',
  'editorIndentGuide.background4',
  'editorIndentGuide.background5',
  'editorIndentGuide.background6',
  'editorIndentGuide.activeBackground1',
  'editorIndentGuide.activeBackground2',
  'editorIndentGuide.activeBackground3',
  'editorIndentGuide.activeBackground4',
  'editorIndentGuide.activeBackground5',
  'editorIndentGuide.activeBackground6',
] as const;

export function normalizeIndentGuideColor(value: string): string | null {
  const trimmed = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed.toUpperCase();
  return null;
}

function getMonacoThemeBase(baseTheme: string): 'vs' | 'vs-dark' {
  return baseTheme.includes('dark') ? 'vs-dark' : 'vs';
}

export function getLearnIndentGuideThemeId(
  baseTheme: string,
  color: string,
  guidesEnabled: boolean
): string {
  if (!guidesEnabled) return baseTheme;
  const safe = (normalizeIndentGuideColor(color) ?? DEFAULT_INDENT_GUIDE_COLOR).slice(1);
  return `learn-guides-${baseTheme}-${safe}`;
}

function buildIndentGuideThemeColors(color: string): Record<string, string> {
  const normalized = normalizeIndentGuideColor(color) ?? DEFAULT_INDENT_GUIDE_COLOR;
  const colors: Record<string, string> = {};
  for (const key of INDENT_GUIDE_COLOR_KEYS) {
    colors[key] = normalized;
  }
  return colors;
}

/** Register (or refresh) a Monaco theme with custom indent guide colors. */
export function applyLearnIndentGuideTheme(
  monaco: Monaco,
  baseTheme: string,
  color: string,
  guidesEnabled: boolean
): string {
  if (!guidesEnabled) return baseTheme;

  const themeId = getLearnIndentGuideThemeId(baseTheme, color, true);

  monaco.editor.defineTheme(themeId, {
    base: getMonacoThemeBase(baseTheme),
    inherit: true,
    rules: [],
    colors: buildIndentGuideThemeColors(color),
  });

  return themeId;
}

export function getIndentGuideCssColors(color: string): {
  guide: string;
  guideActive: string;
} {
  const normalized = normalizeIndentGuideColor(color) ?? DEFAULT_INDENT_GUIDE_COLOR;
  return { guide: normalized, guideActive: normalized };
}
