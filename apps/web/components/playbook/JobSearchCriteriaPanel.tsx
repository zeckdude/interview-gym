'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface JobSearchCriteriaData {
  targetRoles: string[];
  targetCompanyStage: string[];
  targetIndustries: string[];
  preferredStack: string[];
  locationPreference: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  mustHaves: string[];
  dealBreakers: string[];
  additionalNotes: string | null;
}

interface JobSearchCriteriaPanelProps {
  criteria: JobSearchCriteriaData | null;
  onSave: (data: JobSearchCriteriaData) => Promise<void>;
  onClose: () => void;
  embedded?: boolean;
}

function TagInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
      setInput('');
    }
  };

  return (
    <div className="space-y-2">
      <span className="font-body text-sm font-semibold text-text-primary">{label}</span>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-light text-brand font-body text-sm"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="hover:text-error"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          className="flex-1 px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-sm text-text-primary"
          placeholder="Type and press Enter"
        />
        <Button variant="secondary" onClick={add} type="button">
          + Add
        </Button>
      </div>
    </div>
  );
}

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

export function JobSearchCriteriaPanel({ criteria, onSave, onClose, embedded }: JobSearchCriteriaPanelProps) {
  const [targetRoles, setTargetRoles] = useState(criteria?.targetRoles ?? []);
  const [targetCompanyStage, setTargetCompanyStage] = useState(criteria?.targetCompanyStage ?? []);
  const [targetIndustries, setTargetIndustries] = useState(criteria?.targetIndustries ?? []);
  const [preferredStack, setPreferredStack] = useState(criteria?.preferredStack ?? []);
  const [locationPreference, setLocationPreference] = useState(criteria?.locationPreference ?? '');
  const [salaryMin, setSalaryMin] = useState(criteria?.salaryMin?.toString() ?? '');
  const [salaryMax, setSalaryMax] = useState(criteria?.salaryMax?.toString() ?? '');
  const [mustHaves, setMustHaves] = useState((criteria?.mustHaves ?? []).join('\n'));
  const [dealBreakers, setDealBreakers] = useState((criteria?.dealBreakers ?? []).join('\n'));
  const [additionalNotes, setAdditionalNotes] = useState(criteria?.additionalNotes ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        targetRoles,
        targetCompanyStage,
        targetIndustries,
        preferredStack,
        locationPreference: locationPreference || null,
        salaryMin: salaryMin ? parseInt(salaryMin, 10) : null,
        salaryMax: salaryMax ? parseInt(salaryMax, 10) : null,
        mustHaves: linesToArray(mustHaves),
        dealBreakers: linesToArray(dealBreakers),
        additionalNotes: additionalNotes || null,
      });
      if (!embedded) onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-bg-surface rounded-xl shadow-card p-6 space-y-6 border border-border-subtle">
      {!embedded && (
        <div className="space-y-2">
          <h2 className="font-display font-bold text-xl text-text-primary">🎯 What I&apos;m Looking For</h2>
          <p className="font-body text-base text-text-primary">
            This helps the AI tailor its coaching and feedback to the roles you&apos;re actually targeting.
          </p>
        </div>
      )}

      <TagInput label="Target Roles" values={targetRoles} onChange={setTargetRoles} />
      <TagInput label="Company Stage" values={targetCompanyStage} onChange={setTargetCompanyStage} />
      <TagInput label="Industries" values={targetIndustries} onChange={setTargetIndustries} />
      <TagInput label="Preferred Stack" values={preferredStack} onChange={setPreferredStack} />

      <label className="block space-y-2">
        <span className="font-body text-sm font-semibold text-text-primary">Location</span>
        <input
          value={locationPreference}
          onChange={(e) => setLocationPreference(e.target.value)}
          placeholder="Remote or Las Vegas"
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block space-y-2">
          <span className="font-body text-sm font-semibold text-text-primary">Salary min</span>
          <input
            type="number"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            placeholder="$"
            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
          />
        </label>
        <label className="block space-y-2">
          <span className="font-body text-sm font-semibold text-text-primary">Salary max</span>
          <input
            type="number"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            placeholder="$"
            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="font-body text-sm font-semibold text-text-primary">Must-Haves (one per line)</span>
        <textarea
          value={mustHaves}
          onChange={(e) => setMustHaves(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
        />
      </label>

      <label className="block space-y-2">
        <span className="font-body text-sm font-semibold text-text-primary">Deal-Breakers (one per line)</span>
        <textarea
          value={dealBreakers}
          onChange={(e) => setDealBreakers(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
        />
      </label>

      <label className="block space-y-2">
        <span className="font-body text-sm font-semibold text-text-primary">Additional Notes</span>
        <textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-bg-base font-body text-base text-text-primary"
        />
      </label>

      <div className="flex gap-3">
        <Button onClick={() => void handleSave()} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        {!embedded && (
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
