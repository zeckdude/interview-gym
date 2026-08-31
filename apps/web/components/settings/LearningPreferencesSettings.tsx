'use client';

import { Card } from '@/components/ui/Card';
import {
  IndentGuideColorControl,
  LearningFeatureControls,
  PresetFeaturesReveal,
} from '@/components/learn/LearningFeatureControls';
import { useLearningPreferences } from '@/hooks/useLearningPreferences';
import {
  LEARNING_PRESET_LABELS,
  resolveLearningSettings,
  type LearningPreset,
} from '@/lib/learn/learning-preferences';
import { cn } from '@/lib/utils';

const BUILT_IN_PRESETS: Exclude<LearningPreset, 'custom'>[] = [
  'beginner',
  'standard',
  'challenge',
];

export function LearningPreferencesSettings() {
  const {
    globalPrefs,
    globalGuideColor,
    customGuideColor,
    setGlobalPreset,
    selectCustomPreset,
    setCustomProfileName,
    updateCustomFeature,
    setGlobalGuideColor,
    setCustomGuideColor,
  } = useLearningPreferences();

  const isCustom = globalPrefs.preset === 'custom';
  const activeSettings = resolveLearningSettings(
    globalPrefs.preset,
    globalPrefs.customProfile,
    globalPrefs
  );
  const showGlobalGuideColor = activeSettings.indentGuides;

  return (
    <Card className="p-6 space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl text-text-primary mb-1">
          Learn modules
        </h2>
        <p className="font-body text-sm text-text-secondary leading-relaxed">
          Choose how much scaffolding you get while learning. You can override presets and
          individual features per module from the module page.
        </p>
      </div>

      <div className="space-y-3">
        {BUILT_IN_PRESETS.map((preset) => {
          const meta = LEARNING_PRESET_LABELS[preset];
          const selected = globalPrefs.preset === preset;
          return (
            <div
              key={preset}
              className={cn(
                'rounded-xl border-2 p-4 transition-colors',
                selected
                  ? 'border-brand bg-brand/5'
                  : 'border-border-subtle bg-bg-subtle'
              )}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="learn-preset-global"
                  checked={selected}
                  onChange={() => setGlobalPreset(preset)}
                  className="mt-1 accent-brand"
                />
                <span className="flex-1">
                  <span className="font-body text-base font-semibold text-text-primary block">
                    {meta.title}
                  </span>
                  <span className="font-body text-sm text-text-secondary leading-relaxed">
                    {meta.description}
                  </span>
                </span>
              </label>
              <PresetFeaturesReveal preset={preset} />
            </div>
          );
        })}

        <div
          className={cn(
            'rounded-xl border-2 p-4 transition-colors space-y-4',
            isCustom ? 'border-brand bg-brand/5' : 'border-border-subtle bg-bg-subtle'
          )}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="learn-preset-global"
              checked={isCustom}
              onChange={() => selectCustomPreset()}
              className="mt-1 accent-brand"
            />
            <span className="flex-1">
              <span className="font-body text-base font-semibold text-text-primary block">
                Custom
              </span>
              <span className="font-body text-sm text-text-secondary leading-relaxed">
                Name your setup and pick exactly which features you want.
              </span>
            </span>
          </label>

          {isCustom && (
            <div className="space-y-4 pl-7">
              <div>
                <label
                  htmlFor="learn-custom-name"
                  className="font-body text-sm font-semibold text-text-primary block mb-1"
                >
                  Preset name
                </label>
                <input
                  id="learn-custom-name"
                  type="text"
                  value={globalPrefs.customProfile.name}
                  onChange={(e) => setCustomProfileName(e.target.value)}
                  maxLength={40}
                  className="w-full rounded-lg border-2 border-border-strong bg-bg-surface px-3 py-2 font-body text-base text-text-primary"
                  placeholder="My setup"
                />
              </div>
              <LearningFeatureControls
                values={globalPrefs.customProfile.features}
                onChange={updateCustomFeature}
                indentGuideColor={customGuideColor}
                onIndentGuideColorChange={setCustomGuideColor}
              />
            </div>
          )}

          {!isCustom && (
            <div className="pl-7">
              <PresetFeaturesReveal
                preset="custom"
                customProfile={globalPrefs.customProfile}
              />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border-2 border-border-subtle bg-bg-subtle p-4 space-y-3">
        <div>
          <p className="font-body text-base font-semibold text-text-primary">Editor appearance</p>
          <p className="font-body text-sm text-text-secondary leading-relaxed mt-1">
            Default color for indent guides. Custom presets and individual modules can override
            this.
          </p>
        </div>
        {showGlobalGuideColor ? (
          <IndentGuideColorControl
            value={globalGuideColor}
            onChange={setGlobalGuideColor}
          />
        ) : (
          <p className="font-body text-sm text-text-muted">
            Enable indent guides in your preset to pick a guide color.
          </p>
        )}
      </div>
    </Card>
  );
}
