import { describe, it, expect, beforeEach } from 'vitest';
import { LOOKS, DEFAULT_LOOK_ID, getLookById } from '@/lib/themes/registry';
import { applyTheme } from '@/lib/themes/apply-theme';
import type { ThemeTokens } from '@/lib/themes/types';

const HEX = /^#[0-9A-Fa-f]{6}$/;

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

  it('includes the-grind', () => {
    expect(getLookById('the-grind').id).toBe('the-grind');
  });
});

describe('applyTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('style');
  });

  it('sets CSS custom properties on documentElement', () => {
    const tokens: ThemeTokens = {
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

    applyTheme(tokens);

    const style = document.documentElement.style;
    expect(style.getPropertyValue('--color-brand')).toBe('#FF6B35');
    expect(style.getPropertyValue('--color-bg-base')).toBe('#111111');
    expect(style.getPropertyValue('--font-display')).toBe('serif');
    expect(style.getPropertyValue('--radius-md')).toBe('4px');
  });
});
