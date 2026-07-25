'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PillToggle } from '@/components/ui/PillToggle';
import { Toggle } from '@/components/ui/Toggle';

const TIMEZONE_OPTIONS = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
];

interface Preferences {
  reminderEnabled: boolean;
  reminderFrequency: 'daily' | 'weekly';
  reminderTime: string;
  timezone: string;
}

export function ReminderSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [timezone, setTimezone] = useState('America/Los_Angeles');

  const loadPreferences = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/reminders');
      if (!res.ok) throw new Error('Failed to load preferences');
      const data: Preferences = await res.json();
      setReminderEnabled(data.reminderEnabled);
      setFrequency(data.reminderFrequency);
      setReminderTime(data.reminderTime);
      setTimezone(data.timezone);
    } catch {
      setMessage({ type: 'error', text: 'Could not load your preferences. Try refreshing the page.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  async function savePreferences() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reminderEnabled,
          reminderFrequency: frequency,
          reminderTime,
          timezone,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to save');
      }

      setMessage({ type: 'success', text: 'Preferences saved.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save preferences.',
      });
    } finally {
      setSaving(false);
    }
  }

  async function sendTestEmail() {
    setTesting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings/test-email', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to send test email');
      }

      setMessage({ type: 'success', text: `Test email sent to ${data.sentTo}. Check your inbox.` });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to send test email.',
      });
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <p className="font-body text-base text-text-primary">Loading preferences…</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-display text-xl font-bold text-text-primary mb-2">
          Practice Reminders
        </h2>
        <p className="font-body text-base text-text-primary mb-6">
          Get a nudge when you haven&apos;t practiced yet — only if you need it.
        </p>

        <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-bg-subtle border border-border-subtle">
          <div>
            <p className="font-body font-semibold text-text-primary">Email Reminders</p>
            <p className="font-body text-sm text-text-secondary mt-1">
              Sends only when you haven&apos;t practiced today
            </p>
          </div>
          <Toggle
            checked={reminderEnabled}
            onChange={setReminderEnabled}
            label="Enable email reminders"
          />
        </div>

        {reminderEnabled && (
          <div className="space-y-6">
            <div>
              <label className="font-body text-sm font-semibold text-text-primary mb-3 block">
                Frequency
              </label>
              <PillToggle
                options={[
                  { value: 'daily' as const, label: 'Daily' },
                  { value: 'weekly' as const, label: 'Weekly (Mondays)' },
                ]}
                value={frequency}
                onChange={setFrequency}
              />
            </div>

            <div>
              <label
                htmlFor="reminder-time"
                className="font-body text-sm font-semibold text-text-primary mb-3 block"
              >
                Reminder Time
              </label>
              <input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-bg-surface border border-border-subtle rounded-md px-4 py-2 font-body text-base text-text-primary"
              />
            </div>

            <div>
              <label
                htmlFor="timezone"
                className="font-body text-sm font-semibold text-text-primary mb-3 block"
              >
                Timezone
              </label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="bg-bg-surface border border-border-subtle rounded-md px-4 py-2 font-body text-base text-text-primary w-full max-w-md"
              >
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-8">
          <Button variant="primary" onClick={savePreferences} disabled={saving}>
            {saving ? 'Saving…' : 'Save Preferences'}
          </Button>
          {reminderEnabled && (
            <Button variant="secondary" onClick={sendTestEmail} disabled={testing}>
              {testing ? 'Sending…' : 'Send Test Email'}
            </Button>
          )}
        </div>
      </Card>

      {message && (
        <div
          className={`rounded-lg border p-4 ${
            message.type === 'success'
              ? 'bg-brand-light border-brand text-text-primary'
              : 'bg-red-50 border-red-200 text-text-primary dark:bg-red-950/30 dark:border-red-800'
          }`}
          role="status"
        >
          <p className="font-body text-base font-semibold">{message.text}</p>
        </div>
      )}
    </div>
  );
}
