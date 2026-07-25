'use client';

import { useState } from 'react';
import { mutate } from 'swr';
import { Button } from '@/components/ui/Button';
import { useBadgeCelebrationOptional } from '@/components/providers/BadgeCelebrationProvider';

interface StreakFreezePromptProps {
  freezesAvailable: number;
}

export function StreakFreezePrompt({ freezesAvailable }: StreakFreezePromptProps) {
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const badgeCelebration = useBadgeCelebrationOptional();

  if (dismissed || freezesAvailable <= 0) return null;

  const handleUseFreeze = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/streak/freeze', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        if (data.newBadges?.length && badgeCelebration) {
          badgeCelebration.showBadges(data.newBadges);
        }
        mutate('/api/streak');
        setDismissed(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-light border-l-4 border-brand rounded-lg p-5 space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl">❄️</span>
        <div className="space-y-1">
          <p className="font-display font-bold text-text-primary text-base">
            Take a rest day — you&apos;ve earned it.
          </p>
          <p className="font-body text-sm text-text-primary">
            You missed yesterday but your streak freeze can keep your {freezesAvailable}{' '}
            weekly freeze alive. Use it now to preserve your streak.
          </p>
        </div>
      </div>
      <div className="flex gap-3 pl-9">
        <Button variant="primary" className="px-4 py-2 text-sm" onClick={handleUseFreeze} disabled={loading}>
          {loading ? 'Saving…' : 'Use Streak Freeze ❄️'}
        </Button>
        <Button variant="secondary" className="px-4 py-2 text-sm" onClick={() => setDismissed(true)}>
          No thanks
        </Button>
      </div>
    </div>
  );
}
