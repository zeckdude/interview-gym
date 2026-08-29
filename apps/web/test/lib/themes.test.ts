import { describe, it, expect, beforeEach } from 'vitest';
import { LOOKS, DEFAULT_LOOK_ID, getLookById } from '@/lib/themes/registry';
import { applyTheme } from '@/lib/themes/apply-theme';
import type { ThemeTokens } from '@/lib/themes/types';

const HEX = /^#[0-9A-Fa-f]{6}$/;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const BASE_TEST_TOKENS: ThemeTokens = {
  bgBase: '#111111',
  bgSurface: '#222222',
  bgSubtle: '#333333',
  bgInverse: '#000000',
  brand: '#FF6B35',
  brandLight: '#FFE8DF',
  brandDark: '#D94F1E',
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textInverse: '#000000',
  textMuted: '#888888',
  borderSubtle: '#444444',
  borderStrong: '#666666',
  codeBg: '#1A1A1A',
  successLight: '#D4F5E3',
  errorLight: '#FDECEA',
  warningLight: '#FEF3DA',
  fontDisplay: 'serif',
  fontBody: 'sans-serif',
  shadowCard: 'none',
  shadowRaised: 'none',
  shadowModal: 'none',
  shadowBrand: 'none',
  radiusSm: '2px',
  radiusMd: '4px',
  radiusLg: '8px',
  radiusXl: '16px',
  monacoThemeLight: 'vs-light',
  monacoThemeDark: 'vs-dark',
};

describe('Theme Registry', () => {
  it('getLookById returns the correct look by id', () => {
    const look = getLookById('the-zen');
    expect(look.id).toBe('the-zen');
    expect(look.name).toBe('The Zen');
  });

  it('getLookById falls back to default when id is unknown', () => {
    const look = getLookById('nonexistent-theme');
    expect(look.id).toBe(DEFAULT_LOOK_ID);
  });

  it('every look in the registry has required fields', () => {
    LOOKS.forEach((look) => {
      expect(look.id).toBeTruthy();
      expect(look.name).toBeTruthy();
      expect(look.tagline).toBeTruthy();
      expect(look.light).toBeDefined();
      expect(look.dark).toBeDefined();
      expect(look.light.brand).toMatch(HEX);
      expect(look.dark.brand).toMatch(HEX);
    });
  });

  it('every look has both monaco themes defined on light and dark', () => {
    LOOKS.forEach((look) => {
      expect(look.light.monacoThemeLight).toBeTruthy();
      expect(look.light.monacoThemeDark).toBeTruthy();
      expect(look.dark.monacoThemeLight).toBeTruthy();
      expect(look.dark.monacoThemeDark).toBeTruthy();
    });
  });

  it('status callout backgrounds have readable contrast with text-primary', () => {
    for (const look of LOOKS) {
      for (const mode of ['light', 'dark'] as const) {
        const tokens = look[mode];
        for (const bg of [tokens.successLight, tokens.errorLight, tokens.warningLight]) {
          expect(contrastRatio(tokens.textPrimary, bg)).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  it('includes the-grind', () => {
    expect(getLookById('the-grind').id).toBe('the-grind');
  });
});

describe('applyTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('style');
  });

  it('sets CSS custom properties on documentElement', () => {
    applyTheme(BASE_TEST_TOKENS);

    const style = document.documentElement.style;
    expect(style.getPropertyValue('--color-brand')).toBe('#FF6B35');
    expect(style.getPropertyValue('--color-bg-base')).toBe('#111111');
    expect(style.getPropertyValue('--color-warning-light')).toBe('#FEF3DA');
    expect(style.getPropertyValue('--font-display')).toBe('serif');
    expect(style.getPropertyValue('--radius-md')).toBe('4px');
    expect(style.getPropertyValue('--color-code-bg')).toBe('#1A1A1A');
  });
});
