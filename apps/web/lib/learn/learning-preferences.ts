/** Global + per-module learning experience preferences. */

import {
  DEFAULT_INDENT_GUIDE_COLOR,
  normalizeIndentGuideColor,
} from '@/lib/learn/monaco-indent-theme';

export type LearningPreset = 'beginner' | 'standard' | 'challenge' | 'custom';

export type OutputDiffMode = 'off' | 'subtle' | 'full';

export type LearningFeatureFlags = {
  editorDiagnostics: boolean;
  errorLineHighlight: boolean;
  outputDiffMode: OutputDiffMode;
  formatOnRevealComparison: boolean;
  hintsEnabled: boolean;
  revealEnabled: boolean;
  expectedErrorPanel: boolean;
  indentGuides: boolean;
  editorShortcuts: boolean;
  mobileToolbar: boolean;
  setupCodeSplit: boolean;
};

export type LearningFeatureKey = keyof LearningFeatureFlags;

export interface ResolvedLearningSettings extends LearningFeatureFlags {
  preset: LearningPreset;
  presetLabel: string;
  indentGuideColor: string;
}

export interface CustomLearningProfile {
  name: string;
  features: LearningFeatureFlags;
  /** When preset is custom, overrides the global indent guide color. */
  indentGuideColor?: string;
}

export interface GlobalLearningPreferences {
  preset: LearningPreset;
  customProfile: CustomLearningProfile;
  /** Default indent guide color for all presets unless overridden. */
  indentGuideColor?: string;
}

export interface LearningAppearanceOverrides {
  indentGuideColor?: string;
}

export interface ModuleLearningOverride {
  useGlobal: boolean;
  preset?: LearningPreset;
  /** Per-feature overrides merged on top of the module's base preset. */
  featureOverrides?: Partial<LearningFeatureFlags>;
  appearanceOverrides?: LearningAppearanceOverrides;
}

export const LEARNING_PRESET_LABELS: Record<
  Exclude<LearningPreset, 'custom'>,
  { title: string; description: string }
> = {
  beginner: {
    title: 'Beginner',
    description: 'Full scaffolding — live error hints, diffs, and side-by-side reveal.',
  },
  standard: {
    title: 'Standard',
    description: 'Balanced feedback — post-run highlights and subtle diffs.',
  },
  challenge: {
    title: 'Challenge',
    description: 'Minimal scaffolding — test yourself like an interview.',
  },
};

export type LearningFeatureGroup = 'editor' | 'results' | 'reveal' | 'ui';

export interface LearningFeatureDefinition {
  key: LearningFeatureKey;
  label: string;
  description: string;
  group: LearningFeatureGroup;
  kind: 'boolean' | 'outputDiffMode';
}

export const LEARNING_FEATURE_GROUPS: { id: LearningFeatureGroup; label: string }[] = [
  { id: 'editor', label: 'Editor' },
  { id: 'results', label: 'Results' },
  { id: 'reveal', label: 'Reveal' },
  { id: 'ui', label: 'UI' },
];

export const LEARNING_FEATURES: LearningFeatureDefinition[] = [
  {
    key: 'editorDiagnostics',
    label: 'In-editor error hints',
    description: 'Squiggles and hover messages while you type (e.g. undeclared variables).',
    group: 'editor',
    kind: 'boolean',
  },
  {
    key: 'errorLineHighlight',
    label: 'Error line after Run',
    description: 'Highlights the line that failed when you run your code.',
    group: 'editor',
    kind: 'boolean',
  },
  {
    key: 'indentGuides',
    label: 'Indent guides',
    description: 'Vertical lines showing indentation levels in the editor.',
    group: 'editor',
    kind: 'boolean',
  },
  {
    key: 'setupCodeSplit',
    label: 'Setup / Your code split',
    description: 'Shows read-only setup above your editable region.',
    group: 'editor',
    kind: 'boolean',
  },
  {
    key: 'outputDiffMode',
    label: 'Expected vs yours diff',
    description: 'Compare your output to the expected answer on wrong attempts.',
    group: 'results',
    kind: 'outputDiffMode',
  },
  {
    key: 'expectedErrorPanel',
    label: 'Expected error panel',
    description: 'Shows the expected error callout on predict-error steps.',
    group: 'results',
    kind: 'boolean',
  },
  {
    key: 'formatOnRevealComparison',
    label: 'Side-by-side reveal',
    description: 'Your attempt next to the solution when you reveal an answer.',
    group: 'reveal',
    kind: 'boolean',
  },
  {
    key: 'hintsEnabled',
    label: 'Hint button',
    description: 'Shows the Hint button on code steps.',
    group: 'reveal',
    kind: 'boolean',
  },
  {
    key: 'revealEnabled',
    label: 'Reveal button',
    description: 'Shows the Reveal button after using hints.',
    group: 'reveal',
    kind: 'boolean',
  },
  {
    key: 'editorShortcuts',
    label: 'Keyboard shortcut hints',
    description: 'Legend under the editor (Tab, Run, comment, duplicate line).',
    group: 'ui',
    kind: 'boolean',
  },
  {
    key: 'mobileToolbar',
    label: 'Mobile editor toolbar',
    description: 'Tab, Run, and Hint buttons above the editor on small screens.',
    group: 'ui',
    kind: 'boolean',
  },
];

const PRESET_SETTINGS: Record<
  Exclude<LearningPreset, 'custom'>,
  LearningFeatureFlags
> = {
  beginner: {
    editorDiagnostics: true,
    outputDiffMode: 'full',
    errorLineHighlight: true,
    formatOnRevealComparison: true,
    hintsEnabled: true,
    revealEnabled: true,
    expectedErrorPanel: true,
    indentGuides: true,
    editorShortcuts: true,
    mobileToolbar: true,
    setupCodeSplit: true,
  },
  standard: {
    editorDiagnostics: false,
    outputDiffMode: 'subtle',
    errorLineHighlight: true,
    formatOnRevealComparison: true,
    hintsEnabled: true,
    revealEnabled: true,
    expectedErrorPanel: true,
    indentGuides: true,
    editorShortcuts: true,
    mobileToolbar: true,
    setupCodeSplit: true,
  },
  challenge: {
    editorDiagnostics: false,
    outputDiffMode: 'off',
    errorLineHighlight: false,
    formatOnRevealComparison: false,
    hintsEnabled: true,
    revealEnabled: true,
    expectedErrorPanel: false,
    indentGuides: false,
    editorShortcuts: true,
    mobileToolbar: true,
    setupCodeSplit: true,
  },
};

export const DEFAULT_CUSTOM_LEARNING_PROFILE: CustomLearningProfile = {
  name: 'My setup',
  features: { ...PRESET_SETTINGS.standard },
};

export const DEFAULT_LEARNING_PRESET: LearningPreset = 'beginner';

/** SSR-safe defaults — matches getGlobalLearningPreferences() when storage is unavailable. */
export function getDefaultGlobalLearningPreferences(): GlobalLearningPreferences {
  return {
    preset: DEFAULT_LEARNING_PRESET,
    customProfile: DEFAULT_CUSTOM_LEARNING_PROFILE,
  };
}

export function getDefaultResolvedLearningSettings(): ResolvedLearningSettings {
  const global = getDefaultGlobalLearningPreferences();
  return resolveLearningSettings(global.preset, global.customProfile, global);
}

const GLOBAL_STORAGE_KEY = 'ig-learn-preset-global';
const moduleStorageKey = (moduleId: string) => `ig-learn-module-${moduleId}`;

function readStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function isLearningPreset(value: unknown): value is LearningPreset {
  return (
    value === 'beginner' ||
    value === 'standard' ||
    value === 'challenge' ||
    value === 'custom'
  );
}

function isOutputDiffMode(value: unknown): value is OutputDiffMode {
  return value === 'off' || value === 'subtle' || value === 'full';
}

function parseFeatureFlags(raw: unknown): Partial<LearningFeatureFlags> | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const flags: Partial<LearningFeatureFlags> = {};
  if (typeof obj.editorDiagnostics === 'boolean') {
    flags.editorDiagnostics = obj.editorDiagnostics;
  }
  if (typeof obj.errorLineHighlight === 'boolean') {
    flags.errorLineHighlight = obj.errorLineHighlight;
  }
  if (isOutputDiffMode(obj.outputDiffMode)) flags.outputDiffMode = obj.outputDiffMode;
  if (typeof obj.formatOnRevealComparison === 'boolean') {
    flags.formatOnRevealComparison = obj.formatOnRevealComparison;
  }
  if (typeof obj.hintsEnabled === 'boolean') flags.hintsEnabled = obj.hintsEnabled;
  if (typeof obj.revealEnabled === 'boolean') flags.revealEnabled = obj.revealEnabled;
  if (typeof obj.expectedErrorPanel === 'boolean') {
    flags.expectedErrorPanel = obj.expectedErrorPanel;
  }
  if (typeof obj.indentGuides === 'boolean') flags.indentGuides = obj.indentGuides;
  if (typeof obj.editorShortcuts === 'boolean') {
    flags.editorShortcuts = obj.editorShortcuts;
  }
  if (typeof obj.mobileToolbar === 'boolean') flags.mobileToolbar = obj.mobileToolbar;
  if (typeof obj.setupCodeSplit === 'boolean') flags.setupCodeSplit = obj.setupCodeSplit;
  return Object.keys(flags).length > 0 ? flags : null;
}

function parseCustomProfile(raw: unknown): CustomLearningProfile | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const name = typeof obj.name === 'string' && obj.name.trim() ? obj.name.trim() : null;
  const features = parseFeatureFlags(obj.features);
  if (!name || !features) return null;
  const indentGuideColor =
    typeof obj.indentGuideColor === 'string'
      ? normalizeIndentGuideColor(obj.indentGuideColor) ?? undefined
      : undefined;
  return {
    name,
    features: { ...DEFAULT_CUSTOM_LEARNING_PROFILE.features, ...features },
    indentGuideColor,
  };
}

function parseAppearanceOverrides(raw: unknown): LearningAppearanceOverrides | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const overrides: LearningAppearanceOverrides = {};
  if (typeof obj.indentGuideColor === 'string') {
    const normalized = normalizeIndentGuideColor(obj.indentGuideColor);
    if (normalized) overrides.indentGuideColor = normalized;
  }
  return Object.keys(overrides).length > 0 ? overrides : null;
}

export function resolveIndentGuideColor(
  global: GlobalLearningPreferences,
  preset: LearningPreset,
  appearanceOverrides?: LearningAppearanceOverrides
): string {
  if (appearanceOverrides?.indentGuideColor) {
    return appearanceOverrides.indentGuideColor;
  }
  if (preset === 'custom' && global.customProfile.indentGuideColor) {
    return global.customProfile.indentGuideColor;
  }
  if (global.indentGuideColor) {
    return global.indentGuideColor;
  }
  return DEFAULT_INDENT_GUIDE_COLOR;
}

function finalizeResolvedSettings(
  base: Omit<ResolvedLearningSettings, 'indentGuideColor'>,
  global: GlobalLearningPreferences,
  appearanceOverrides?: LearningAppearanceOverrides
): ResolvedLearningSettings {
  return {
    ...base,
    indentGuideColor: resolveIndentGuideColor(global, base.preset, appearanceOverrides),
  };
}

export function resolveLearningSettings(
  preset: LearningPreset,
  customProfile: CustomLearningProfile = DEFAULT_CUSTOM_LEARNING_PROFILE,
  global: GlobalLearningPreferences = {
    preset,
    customProfile,
  }
): ResolvedLearningSettings {
  if (preset === 'custom') {
    return finalizeResolvedSettings(
      {
        preset: 'custom',
        presetLabel: customProfile.name,
        ...customProfile.features,
      },
      global
    );
  }
  return finalizeResolvedSettings(
    {
      preset,
      presetLabel: LEARNING_PRESET_LABELS[preset].title,
      ...PRESET_SETTINGS[preset],
    },
    global
  );
}

export function mergeLearningFeatureOverrides(
  base: ResolvedLearningSettings,
  overrides?: Partial<LearningFeatureFlags>
): ResolvedLearningSettings {
  if (!overrides || Object.keys(overrides).length === 0) return base;
  return { ...base, ...overrides };
}

export function getPresetFeatureValue(
  preset: LearningPreset,
  key: LearningFeatureKey,
  customProfile: CustomLearningProfile = DEFAULT_CUSTOM_LEARNING_PROFILE
): LearningFeatureFlags[LearningFeatureKey] {
  if (preset === 'custom') return customProfile.features[key];
  return PRESET_SETTINGS[preset][key];
}

export function formatFeatureValue(
  key: LearningFeatureKey,
  value: LearningFeatureFlags[LearningFeatureKey]
): string {
  if (key === 'outputDiffMode') {
    if (value === 'off') return 'Off';
    if (value === 'subtle') return 'Subtle';
    return 'Full';
  }
  return value ? 'On' : 'Off';
}

export function isFeatureEnabledInPreset(
  preset: LearningPreset,
  key: LearningFeatureKey,
  customProfile: CustomLearningProfile = DEFAULT_CUSTOM_LEARNING_PROFILE
): boolean {
  const value = getPresetFeatureValue(preset, key, customProfile);
  if (key === 'outputDiffMode') return value !== 'off';
  return Boolean(value);
}

export function getGlobalLearningPreferences(): GlobalLearningPreferences {
  const raw = readStorage(GLOBAL_STORAGE_KEY);
  if (!raw) {
    return {
      preset: DEFAULT_LEARNING_PRESET,
      customProfile: DEFAULT_CUSTOM_LEARNING_PROFILE,
    };
  }

  if (isLearningPreset(raw)) {
    return { preset: raw, customProfile: DEFAULT_CUSTOM_LEARNING_PROFILE };
  }

  try {
    const parsed = JSON.parse(raw) as GlobalLearningPreferences;
    if (!isLearningPreset(parsed.preset)) {
      return {
        preset: DEFAULT_LEARNING_PRESET,
        customProfile: DEFAULT_CUSTOM_LEARNING_PROFILE,
      };
    }
    const customProfile =
      parseCustomProfile(parsed.customProfile) ?? DEFAULT_CUSTOM_LEARNING_PROFILE;
    const indentGuideColor =
      typeof parsed.indentGuideColor === 'string'
        ? normalizeIndentGuideColor(parsed.indentGuideColor) ?? undefined
        : undefined;
    return { preset: parsed.preset, customProfile, indentGuideColor };
  } catch {
    return {
      preset: DEFAULT_LEARNING_PRESET,
      customProfile: DEFAULT_CUSTOM_LEARNING_PROFILE,
    };
  }
}

export function setGlobalLearningPreferences(prefs: GlobalLearningPreferences): void {
  writeStorage(GLOBAL_STORAGE_KEY, JSON.stringify(prefs));
}

export function setGlobalLearningPreset(preset: LearningPreset): void {
  const current = getGlobalLearningPreferences();
  setGlobalLearningPreferences({ ...current, preset });
}

export function setGlobalCustomProfile(customProfile: CustomLearningProfile): void {
  const current = getGlobalLearningPreferences();
  setGlobalLearningPreferences({
    preset: current.preset === 'custom' ? 'custom' : current.preset,
    customProfile,
  });
}

export function updateGlobalCustomFeature<K extends LearningFeatureKey>(
  key: K,
  value: LearningFeatureFlags[K]
): void {
  const current = getGlobalLearningPreferences();
  setGlobalLearningPreferences({
    ...current,
    customProfile: {
      ...current.customProfile,
      features: { ...current.customProfile.features, [key]: value },
    },
  });
}

export function setGlobalIndentGuideColor(color: string): void {
  const normalized = normalizeIndentGuideColor(color);
  if (!normalized) return;
  const current = getGlobalLearningPreferences();
  setGlobalLearningPreferences({ ...current, indentGuideColor: normalized });
}

export function setGlobalCustomIndentGuideColor(color: string): void {
  const normalized = normalizeIndentGuideColor(color);
  if (!normalized) return;
  const current = getGlobalLearningPreferences();
  setGlobalLearningPreferences({
    ...current,
    customProfile: { ...current.customProfile, indentGuideColor: normalized },
  });
}

export function getModuleLearningOverride(moduleId: string): ModuleLearningOverride {
  const raw = readStorage(moduleStorageKey(moduleId));
  if (!raw) return { useGlobal: true };
  try {
    const parsed = JSON.parse(raw) as ModuleLearningOverride;
    if (parsed.useGlobal) return { useGlobal: true };
    const preset = isLearningPreset(parsed.preset) ? parsed.preset : undefined;
    const featureOverrides = parseFeatureFlags(parsed.featureOverrides) ?? undefined;
    const appearanceOverrides = parseAppearanceOverrides(parsed.appearanceOverrides) ?? undefined;
    if (!preset && !featureOverrides && !appearanceOverrides) return { useGlobal: true };
    return {
      useGlobal: false,
      preset,
      featureOverrides,
      appearanceOverrides,
    };
  } catch {
    return { useGlobal: true };
  }
}

export function setModuleLearningOverride(
  moduleId: string,
  override: ModuleLearningOverride
): void {
  writeStorage(moduleStorageKey(moduleId), JSON.stringify(override));
}

export function getResolvedLearningSettings(moduleId?: string): ResolvedLearningSettings {
  const global = getGlobalLearningPreferences();

  if (!moduleId) {
    return resolveLearningSettings(global.preset, global.customProfile, global);
  }

  const moduleOverride = getModuleLearningOverride(moduleId);
  if (moduleOverride.useGlobal) {
    return resolveLearningSettings(global.preset, global.customProfile, global);
  }

  const preset = moduleOverride.preset ?? global.preset;
  const base = resolveLearningSettings(preset, global.customProfile, global);
  const merged = mergeLearningFeatureOverrides(base, moduleOverride.featureOverrides);
  return {
    ...merged,
    indentGuideColor: resolveIndentGuideColor(
      global,
      preset,
      moduleOverride.appearanceOverrides
    ),
  };
}

export function getActivePresetLabel(
  global: GlobalLearningPreferences,
  moduleOverride: ModuleLearningOverride,
  settings: ResolvedLearningSettings
): string {
  if (moduleOverride.useGlobal) {
    return settings.preset === 'custom'
      ? settings.presetLabel
      : LEARNING_PRESET_LABELS[settings.preset as Exclude<LearningPreset, 'custom'>].title;
  }

  const hasOverrides =
    (moduleOverride.featureOverrides &&
      Object.keys(moduleOverride.featureOverrides).length > 0) ||
    (moduleOverride.appearanceOverrides &&
      Object.keys(moduleOverride.appearanceOverrides).length > 0);

  const baseLabel =
    settings.preset === 'custom'
      ? settings.presetLabel
      : moduleOverride.preset
        ? LEARNING_PRESET_LABELS[
            moduleOverride.preset as Exclude<LearningPreset, 'custom'>
          ].title
        : settings.presetLabel;

  return hasOverrides ? `${baseLabel} · customized` : baseLabel;
}
