'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  ModuleFeatureOverrides,
  PresetFeaturesReveal,
} from '@/components/learn/LearningFeatureControls';
import { useLearningPreferences } from '@/hooks/useLearningPreferences';
import {
  LEARNING_PRESET_LABELS,
  type LearningPreset,
} from '@/lib/learn/learning-preferences';
import { cn } from '@/lib/utils';

const PRESET_OPTIONS: LearningPreset[] = ['beginner', 'standard', 'challenge', 'custom'];

interface LearnModuleSettingsProps {
  moduleId: string;
}

export function LearnModuleSettings({ moduleId }: LearnModuleSettingsProps) {
  const [open, setOpen] = useState(false);
  const {
    globalPrefs,
    moduleOverride,
    settings,
    activeLabel,
    isHydrated,
    hasModuleFeatureOverrides,
    setModuleOverride,
    setModulePreset,
    updateModuleFeature,
    updateModuleIndentGuideColor,
    resetModuleFeatureOverrides,
  } = useLearningPreferences(moduleId);

  const presetLabel = (preset: LearningPreset) =>
    preset === 'custom'
      ? globalPrefs.customProfile.name
      : LEARNING_PRESET_LABELS[preset].title;

  return (
    <div className="relative">
      <Button
        type="button"
        variant="secondary"
        onClick={() => setOpen((v) => !v)}
        className="text-sm py-1.5 px-3 max-w-[12rem] truncate"
        aria-expanded={open}
        title={isHydrated ? activeLabel : undefined}
      >
        ⚙ {isHydrated ? activeLabel : 'Settings'}
      </Button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close module settings"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-[min(100vw-2rem,24rem)] max-h-[min(80vh,36rem)] overflow-y-auto rounded-xl border-2 border-border-strong bg-bg-surface shadow-modal p-4 space-y-4">
            <div>
              <p className="font-body text-sm font-bold text-text-primary">Module settings</p>
              <p className="font-body text-xs text-text-muted mt-1">
                Override your global preset or tweak individual features — changes apply
                immediately.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={moduleOverride.useGlobal}
                onChange={(e) =>
                  setModuleOverride(
                    e.target.checked
                      ? { useGlobal: true }
                      : {
                          useGlobal: false,
                          preset: moduleOverride.preset ?? globalPrefs.preset,
                        }
                  )
                }
                className="accent-brand"
              />
              <span className="font-body text-sm text-text-primary">Use global setting</span>
            </label>

            {!moduleOverride.useGlobal && (
              <>
                <div className="space-y-2">
                  <p className="font-body text-xs font-bold uppercase tracking-wide text-text-secondary">
                    Base preset
                  </p>
                  {PRESET_OPTIONS.map((preset) => {
                    const selected =
                      (moduleOverride.preset ?? globalPrefs.preset) === preset;
                    const title = presetLabel(preset);
                    const description =
                      preset === 'custom'
                        ? 'Your custom feature mix from Settings'
                        : LEARNING_PRESET_LABELS[preset].description;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setModulePreset(preset)}
                        className={cn(
                          'w-full text-left rounded-lg border px-3 py-2 transition-colors',
                          selected
                            ? 'border-brand bg-brand/5'
                            : 'border-border-subtle hover:border-brand/40'
                        )}
                      >
                        <span className="font-body text-sm font-semibold text-text-primary block">
                          {title}
                        </span>
                        <span className="font-body text-xs text-text-muted">{description}</span>
                        {selected && preset !== 'custom' && (
                          <PresetFeaturesReveal preset={preset} />
                        )}
                      </button>
                    );
                  })}
                </div>

                <ModuleFeatureOverrides
                  settings={settings}
                  onChange={updateModuleFeature}
                  onIndentGuideColorChange={updateModuleIndentGuideColor}
                  onReset={resetModuleFeatureOverrides}
                  hasOverrides={hasModuleFeatureOverrides}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
