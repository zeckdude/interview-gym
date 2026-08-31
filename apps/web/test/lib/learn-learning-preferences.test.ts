import { describe, expect, it } from 'vitest';
import {
  DEFAULT_INDENT_GUIDE_COLOR,
} from '@/lib/learn/monaco-indent-theme';
import {
  DEFAULT_CUSTOM_LEARNING_PROFILE,
  getResolvedLearningSettings,
  mergeLearningFeatureOverrides,
  resolveIndentGuideColor,
  resolveLearningSettings,
  type GlobalLearningPreferences,
} from '@/lib/learn/learning-preferences';

describe('learning-preferences', () => {
  it('beginner preset enables full diff, reveal comparison, and in-editor diagnostics', () => {
    const settings = resolveLearningSettings('beginner');
    expect(settings.outputDiffMode).toBe('full');
    expect(settings.formatOnRevealComparison).toBe(true);
    expect(settings.errorLineHighlight).toBe(true);
    expect(settings.editorDiagnostics).toBe(true);
  });

  it('standard preset disables in-editor diagnostics but keeps post-run highlights', () => {
    const settings = resolveLearningSettings('standard');
    expect(settings.outputDiffMode).toBe('subtle');
    expect(settings.errorLineHighlight).toBe(true);
    expect(settings.editorDiagnostics).toBe(false);
  });

  it('challenge preset disables scaffolding features', () => {
    const settings = resolveLearningSettings('challenge');
    expect(settings.outputDiffMode).toBe('off');
    expect(settings.formatOnRevealComparison).toBe(false);
    expect(settings.errorLineHighlight).toBe(false);
    expect(settings.editorDiagnostics).toBe(false);
  });

  it('custom preset uses profile name and features', () => {
    const challenge = resolveLearningSettings('challenge');
    const settings = resolveLearningSettings('custom', {
      name: 'Interview prep',
      features: {
        editorDiagnostics: challenge.editorDiagnostics,
        errorLineHighlight: challenge.errorLineHighlight,
        outputDiffMode: challenge.outputDiffMode,
        formatOnRevealComparison: challenge.formatOnRevealComparison,
        hintsEnabled: false,
        revealEnabled: challenge.revealEnabled,
        expectedErrorPanel: challenge.expectedErrorPanel,
        indentGuides: challenge.indentGuides,
        editorShortcuts: challenge.editorShortcuts,
        mobileToolbar: challenge.mobileToolbar,
        setupCodeSplit: challenge.setupCodeSplit,
      },
    });
    expect(settings.presetLabel).toBe('Interview prep');
    expect(settings.editorDiagnostics).toBe(false);
    expect(settings.hintsEnabled).toBe(false);
  });

  it('merges module feature overrides on top of preset', () => {
    const base = resolveLearningSettings('standard');
    const merged = mergeLearningFeatureOverrides(base, {
      editorDiagnostics: true,
      outputDiffMode: 'full',
    });
    expect(merged.editorDiagnostics).toBe(true);
    expect(merged.outputDiffMode).toBe('full');
    expect(merged.errorLineHighlight).toBe(true);
  });

  it('defaults to beginner when no storage', () => {
    expect(getResolvedLearningSettings().preset).toBe('beginner');
  });

  it('resolves indent guide color from global, custom profile, and module overrides', () => {
    const global: GlobalLearningPreferences = {
      preset: 'standard',
      customProfile: {
        ...DEFAULT_CUSTOM_LEARNING_PROFILE,
        name: 'Mine',
        indentGuideColor: '#FF6B35',
      },
      indentGuideColor: '#2563EB',
    };

    expect(resolveIndentGuideColor(global, 'beginner')).toBe('#2563EB');
    expect(resolveIndentGuideColor(global, 'custom')).toBe('#FF6B35');
    expect(
      resolveIndentGuideColor(global, 'standard', { indentGuideColor: '#0D9488' })
    ).toBe('#0D9488');
    expect(resolveLearningSettings('beginner', undefined, global).indentGuideColor).toBe(
      '#2563EB'
    );
    expect(resolveLearningSettings('beginner').indentGuideColor).toBe(DEFAULT_INDENT_GUIDE_COLOR);
  });
});
