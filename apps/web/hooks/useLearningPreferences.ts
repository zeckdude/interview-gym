'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getActivePresetLabel,
  getDefaultGlobalLearningPreferences,
  getDefaultResolvedLearningSettings,
  getGlobalLearningPreferences,
  getModuleLearningOverride,
  getResolvedLearningSettings,
  resolveIndentGuideColor,
  setGlobalCustomIndentGuideColor,
  setGlobalCustomProfile,
  setGlobalIndentGuideColor,
  setGlobalLearningPreferences,
  setGlobalLearningPreset,
  setModuleLearningOverride,
  updateGlobalCustomFeature,
  type CustomLearningProfile,
  type GlobalLearningPreferences,
  type LearningFeatureFlags,
  type LearningFeatureKey,
  type LearningPreset,
  type ModuleLearningOverride,
  type ResolvedLearningSettings,
} from '@/lib/learn/learning-preferences';
import { normalizeIndentGuideColor } from '@/lib/learn/monaco-indent-theme';

const PREFS_EVENT = 'ig-learning-preferences-changed';

function notifyPreferencesChanged(): void {
  window.dispatchEvent(new Event(PREFS_EVENT));
}

export function useLearningPreferences(moduleId?: string) {
  const [globalPrefs, setGlobalPrefsState] = useState<GlobalLearningPreferences>(
    getDefaultGlobalLearningPreferences
  );
  const [moduleOverride, setModuleOverrideState] = useState<ModuleLearningOverride>({
    useGlobal: true,
  });
  const [settings, setSettings] = useState<ResolvedLearningSettings>(
    getDefaultResolvedLearningSettings
  );
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = useCallback(() => {
    setGlobalPrefsState(getGlobalLearningPreferences());
    if (moduleId) {
      setModuleOverrideState(getModuleLearningOverride(moduleId));
    }
    setSettings(getResolvedLearningSettings(moduleId));
    setIsHydrated(true);
  }, [moduleId]);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(PREFS_EVENT, onChange);
    return () => window.removeEventListener(PREFS_EVENT, onChange);
  }, [refresh]);

  const setGlobalPreset = useCallback((preset: LearningPreset) => {
    setGlobalLearningPreset(preset);
    notifyPreferencesChanged();
  }, []);

  const saveCustomProfile = useCallback((customProfile: CustomLearningProfile) => {
    setGlobalCustomProfile(customProfile);
    notifyPreferencesChanged();
  }, []);

  const setCustomProfileName = useCallback((name: string) => {
    const current = getGlobalLearningPreferences();
    saveCustomProfile({ ...current.customProfile, name: name.trim() || 'My setup' });
  }, [saveCustomProfile]);

  const updateCustomFeature = useCallback(
    <K extends LearningFeatureKey>(key: K, value: LearningFeatureFlags[K]) => {
      updateGlobalCustomFeature(key, value);
      notifyPreferencesChanged();
    },
    []
  );

  const setGlobalGuideColor = useCallback((color: string) => {
    setGlobalIndentGuideColor(color);
    notifyPreferencesChanged();
  }, []);

  const setCustomGuideColor = useCallback((color: string) => {
    setGlobalCustomIndentGuideColor(color);
    notifyPreferencesChanged();
  }, []);

  const selectCustomPreset = useCallback(() => {
    const current = getGlobalLearningPreferences();
    setGlobalLearningPreferences({
      preset: 'custom',
      customProfile: current.customProfile,
    });
    notifyPreferencesChanged();
  }, []);

  const setModuleOverride = useCallback(
    (override: ModuleLearningOverride) => {
      if (!moduleId) return;
      setModuleLearningOverride(moduleId, override);
      notifyPreferencesChanged();
    },
    [moduleId]
  );

  const setModulePreset = useCallback(
    (preset: LearningPreset) => {
      if (!moduleId) return;
      setModuleLearningOverride(moduleId, {
        useGlobal: false,
        preset,
        featureOverrides: undefined,
        appearanceOverrides: undefined,
      });
      notifyPreferencesChanged();
    },
    [moduleId]
  );

  const updateModuleFeature = useCallback(
    <K extends LearningFeatureKey>(key: K, value: LearningFeatureFlags[K]) => {
      if (!moduleId) return;
      const currentOverride = getModuleLearningOverride(moduleId);
      const basePreset = currentOverride.preset ?? getGlobalLearningPreferences().preset;
      const nextOverrides = {
        ...(currentOverride.featureOverrides ?? {}),
        [key]: value,
      };
      setModuleLearningOverride(moduleId, {
        useGlobal: false,
        preset: basePreset,
        featureOverrides: nextOverrides,
        appearanceOverrides: currentOverride.appearanceOverrides,
      });
      notifyPreferencesChanged();
    },
    [moduleId]
  );

  const updateModuleIndentGuideColor = useCallback(
    (color: string) => {
      if (!moduleId) return;
      const normalized = normalizeIndentGuideColor(color);
      if (!normalized) return;
      const currentOverride = getModuleLearningOverride(moduleId);
      const basePreset = currentOverride.preset ?? getGlobalLearningPreferences().preset;
      setModuleLearningOverride(moduleId, {
        useGlobal: false,
        preset: basePreset,
        featureOverrides: currentOverride.featureOverrides,
        appearanceOverrides: {
          ...currentOverride.appearanceOverrides,
          indentGuideColor: normalized,
        },
      });
      notifyPreferencesChanged();
    },
    [moduleId]
  );

  const resetModuleFeatureOverrides = useCallback(() => {
    if (!moduleId) return;
    const currentOverride = getModuleLearningOverride(moduleId);
    if (currentOverride.useGlobal) return;
    setModuleLearningOverride(moduleId, {
      useGlobal: false,
      preset: currentOverride.preset ?? getGlobalLearningPreferences().preset,
      featureOverrides: undefined,
      appearanceOverrides: undefined,
    });
    notifyPreferencesChanged();
  }, [moduleId]);

  const activeLabel = getActivePresetLabel(globalPrefs, moduleOverride, settings);

  const hasModuleFeatureOverrides = Boolean(
    (moduleOverride.featureOverrides &&
      Object.keys(moduleOverride.featureOverrides).length > 0) ||
      (moduleOverride.appearanceOverrides &&
        Object.keys(moduleOverride.appearanceOverrides).length > 0)
  );

  const globalGuideColor = resolveIndentGuideColor(globalPrefs, globalPrefs.preset);

  const customGuideColor =
    globalPrefs.customProfile.indentGuideColor ??
    globalPrefs.indentGuideColor ??
    settings.indentGuideColor;

  return {
    globalPrefs,
    moduleOverride,
    settings,
    activeLabel,
    isHydrated,
    hasModuleFeatureOverrides,
    globalGuideColor,
    customGuideColor,
    setGlobalPreset,
    saveCustomProfile,
    setCustomProfileName,
    updateCustomFeature,
    setGlobalGuideColor,
    setCustomGuideColor,
    selectCustomPreset,
    setModuleOverride,
    setModulePreset,
    updateModuleFeature,
    updateModuleIndentGuideColor,
    resetModuleFeatureOverrides,
    refresh,
  };
}
