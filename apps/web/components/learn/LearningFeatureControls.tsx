'use client';

import { useState } from 'react';
import {
  formatFeatureValue,
  getPresetFeatureValue,
  LEARNING_FEATURE_GROUPS,
  LEARNING_FEATURES,
  type CustomLearningProfile,
  type LearningFeatureFlags,
  type LearningFeatureKey,
  type LearningPreset,
  type ResolvedLearningSettings,
} from '@/lib/learn/learning-preferences';
import {
  DEFAULT_INDENT_GUIDE_COLOR,
  INDENT_GUIDE_COLOR_SWATCHES,
  normalizeIndentGuideColor,
} from '@/lib/learn/monaco-indent-theme';
import { cn } from '@/lib/utils';

interface PresetFeatureChecklistProps {
  preset: LearningPreset;
  customProfile?: CustomLearningProfile;
  className?: string;
}

export function PresetFeatureChecklist({
  preset,
  customProfile,
  className,
}: PresetFeatureChecklistProps) {
  return (
    <ul className={cn('space-y-2', className)}>
      {LEARNING_FEATURES.map((feature) => {
        const rawValue = getPresetFeatureValue(preset, feature.key, customProfile);
        const enabled =
          feature.key === 'outputDiffMode'
            ? rawValue !== 'off'
            : Boolean(rawValue);
        const displayValue = formatFeatureValue(feature.key, rawValue);

        return (
          <li
            key={feature.key}
            className="flex items-start gap-2 font-body text-sm text-text-primary"
          >
            <span
              className={cn(
                'mt-0.5 shrink-0 font-bold',
                enabled ? 'text-success' : 'text-text-muted'
              )}
              aria-hidden
            >
              {enabled ? '✓' : '—'}
            </span>
            <span>
              <span className="font-semibold">{feature.label}</span>
              {feature.kind === 'outputDiffMode' && (
                <span className="text-text-secondary"> · {displayValue}</span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

interface PresetFeaturesRevealProps {
  preset: LearningPreset;
  customProfile?: CustomLearningProfile;
}

export function PresetFeaturesReveal({ preset, customProfile }: PresetFeaturesRevealProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-body text-sm font-semibold text-brand hover:underline"
        aria-expanded={open}
      >
        {open ? "Hide what's included" : "See what's included"}
      </button>
      {open && (
        <PresetFeatureChecklist
          preset={preset}
          customProfile={customProfile}
          className="mt-3 rounded-lg border border-border-subtle bg-bg-subtle p-3"
        />
      )}
    </div>
  );
}

interface IndentGuideColorControlProps {
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  className?: string;
}

export function IndentGuideColorControl({
  value,
  onChange,
  disabled = false,
  className,
}: IndentGuideColorControlProps) {
  const safeValue = normalizeIndentGuideColor(value) ?? DEFAULT_INDENT_GUIDE_COLOR;

  return (
    <div
      className={cn(
        'mt-3 rounded-lg border border-border-subtle bg-bg-surface px-3 py-3',
        className
      )}
    >
      <p className="font-body text-sm font-semibold text-text-primary mb-1">Guide color</p>
      <p className="font-body text-xs text-text-muted leading-relaxed mb-3">
        Pick a color for vertical indent lines in the editor.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {INDENT_GUIDE_COLOR_SWATCHES.map((swatch) => {
          const selected = safeValue === swatch;
          return (
            <button
              key={swatch}
              type="button"
              disabled={disabled}
              onClick={() => onChange(swatch)}
              className={cn(
                'h-9 w-9 rounded-lg border-2 transition-transform shrink-0',
                selected ? 'border-brand ring-2 ring-brand/30 scale-105' : 'border-border-strong',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              style={{ backgroundColor: swatch }}
              aria-label={`Use ${swatch}`}
              aria-pressed={selected}
            />
          );
        })}
        <label className="relative h-9 w-9 shrink-0 cursor-pointer rounded-lg border-2 border-border-strong overflow-hidden has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed">
          <span className="sr-only">Custom color</span>
          <input
            type="color"
            value={safeValue}
            disabled={disabled}
            onChange={(e) => {
              const next = normalizeIndentGuideColor(e.target.value);
              if (next) onChange(next);
            }}
            className="absolute inset-0 h-full w-full cursor-pointer border-0 p-0 disabled:cursor-not-allowed"
          />
        </label>
      </div>
    </div>
  );
}

interface LearningFeatureControlsProps {
  values: LearningFeatureFlags;
  onChange: <K extends LearningFeatureKey>(
    key: K,
    value: LearningFeatureFlags[K]
  ) => void;
  indentGuideColor?: string;
  onIndentGuideColorChange?: (color: string) => void;
  disabled?: boolean;
  className?: string;
}

export function LearningFeatureControls({
  values,
  onChange,
  indentGuideColor,
  onIndentGuideColorChange,
  disabled = false,
  className,
}: LearningFeatureControlsProps) {
  const showIndentColor =
    values.indentGuides && indentGuideColor != null && onIndentGuideColorChange != null;

  return (
    <div className={cn('space-y-4', className)}>
      {LEARNING_FEATURE_GROUPS.map((group) => {
        const features = LEARNING_FEATURES.filter((f) => f.group === group.id);
        return (
          <div key={group.id}>
            <p className="font-body text-xs font-bold uppercase tracking-wide text-text-secondary mb-2">
              {group.label}
            </p>
            <div className="space-y-2">
              {features.map((feature) => (
                <div
                  key={feature.key}
                  className="rounded-lg border border-border-subtle bg-bg-subtle px-3 py-2"
                >
                  {feature.kind === 'boolean' ? (
                    <>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(values[feature.key])}
                          disabled={disabled}
                          onChange={(e) =>
                            onChange(
                              feature.key as LearningFeatureKey,
                              e.target.checked as LearningFeatureFlags[LearningFeatureKey]
                            )
                          }
                          className="mt-1 accent-brand"
                        />
                        <span>
                          <span className="font-body text-sm font-semibold text-text-primary block">
                            {feature.label}
                          </span>
                          <span className="font-body text-xs text-text-muted leading-relaxed">
                            {feature.description}
                          </span>
                        </span>
                      </label>
                      {feature.key === 'indentGuides' && showIndentColor && (
                        <IndentGuideColorControl
                          value={indentGuideColor}
                          onChange={onIndentGuideColorChange}
                          disabled={disabled}
                        />
                      )}
                    </>
                  ) : (
                    <div>
                      <p className="font-body text-sm font-semibold text-text-primary">
                        {feature.label}
                      </p>
                      <p className="font-body text-xs text-text-muted leading-relaxed mb-2">
                        {feature.description}
                      </p>
                      <select
                        value={values.outputDiffMode}
                        disabled={disabled}
                        onChange={(e) =>
                          onChange(
                            'outputDiffMode',
                            e.target.value as LearningFeatureFlags['outputDiffMode']
                          )
                        }
                        className="w-full rounded-lg border border-border-strong bg-bg-surface px-3 py-2 font-body text-sm text-text-primary"
                      >
                        <option value="off">Off</option>
                        <option value="subtle">Subtle</option>
                        <option value="full">Full</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ModuleFeatureOverridesProps {
  settings: ResolvedLearningSettings;
  onChange: <K extends LearningFeatureKey>(
    key: K,
    value: LearningFeatureFlags[K]
  ) => void;
  onIndentGuideColorChange: (color: string) => void;
  onReset: () => void;
  hasOverrides: boolean;
}

export function ModuleFeatureOverrides({
  settings,
  onChange,
  onIndentGuideColorChange,
  onReset,
  hasOverrides,
}: ModuleFeatureOverridesProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="font-body text-sm font-bold text-text-primary"
          aria-expanded={open}
        >
          Customize features {open ? '▾' : '▸'}
        </button>
        {hasOverrides && (
          <button
            type="button"
            onClick={onReset}
            className="font-body text-xs font-semibold text-brand hover:underline shrink-0"
          >
            Reset to preset
          </button>
        )}
      </div>
      {open && (
        <LearningFeatureControls
          values={settings}
          onChange={onChange}
          indentGuideColor={settings.indentGuideColor}
          onIndentGuideColorChange={onIndentGuideColorChange}
        />
      )}
    </div>
  );
}
