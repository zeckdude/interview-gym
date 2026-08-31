import { describe, expect, it } from 'vitest';
import {
  DEFAULT_INDENT_GUIDE_COLOR,
  getLearnIndentGuideThemeId,
  normalizeIndentGuideColor,
} from '@/lib/learn/monaco-indent-theme';

describe('monaco-indent-theme', () => {
  it('normalizes valid hex colors', () => {
    expect(normalizeIndentGuideColor('#ff6b35')).toBe('#FF6B35');
    expect(normalizeIndentGuideColor('#FF6B35')).toBe('#FF6B35');
  });

  it('rejects invalid colors', () => {
    expect(normalizeIndentGuideColor('red')).toBeNull();
    expect(normalizeIndentGuideColor('#fff')).toBeNull();
  });

  it('builds stable theme ids from base theme and color', () => {
    expect(getLearnIndentGuideThemeId('learn-grind-light', DEFAULT_INDENT_GUIDE_COLOR, true)).toBe(
      'learn-guides-learn-grind-light-6366F1'
    );
    expect(getLearnIndentGuideThemeId('learn-grind-light', DEFAULT_INDENT_GUIDE_COLOR, false)).toBe(
      'learn-grind-light'
    );
  });
});
