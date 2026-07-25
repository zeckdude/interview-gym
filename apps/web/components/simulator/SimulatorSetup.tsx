'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { PillToggle } from '@/components/ui/PillToggle';
import { Spinner } from '@/components/ui/Spinner';
import type { SimulatorCategory, SimulatorDifficulty } from '@/lib/simulator';

export function SimulatorSetup() {
  const router = useRouter();
  const [durationMinutes, setDurationMinutes] = useState<45 | 60>(45);
  const [difficulty, setDifficulty] = useState<SimulatorDifficulty>('mixed');
  const [category, setCategory] = useState<SimulatorCategory>('mixed');
  const [challengeCount, setChallengeCount] = useState<3 | 4 | 5>(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationMinutes,
          difficulty,
          category,
          challengeCount,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to start session');
        return;
      }
      router.push(`/simulator/${data.sessionId}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-3">
        <h1 className="font-display font-bold text-3xl text-text-primary">
          Interview Simulator 🎯
        </h1>
        <p className="font-body text-base text-text-primary leading-relaxed">
          Simulate a real technical interview. No hints. No do-overs. Just you and the code.
        </p>
      </div>

      <div className="bg-bg-surface rounded-xl shadow-card p-6 space-y-8">
        <section className="space-y-3">
          <h2 className="font-display font-semibold text-lg text-text-primary">
            Duration
          </h2>
          <PillToggle
            options={[
              { value: 45 as const, label: '45 minutes' },
              { value: 60 as const, label: '60 minutes' },
            ]}
            value={durationMinutes}
            onChange={setDurationMinutes}
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-semibold text-lg text-text-primary">
            Difficulty
          </h2>
          <PillToggle
            options={[
              { value: 'easy' as const, label: 'Easy' },
              { value: 'intermediate' as const, label: 'Intermediate' },
              { value: 'advanced' as const, label: 'Advanced' },
              { value: 'mixed' as const, label: 'Mixed' },
            ]}
            value={difficulty}
            onChange={setDifficulty}
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-semibold text-lg text-text-primary">
            Category
          </h2>
          <PillToggle
            options={[
              { value: 'be' as const, label: 'Backend' },
              { value: 'frontend' as const, label: 'Frontend' },
              { value: 'react' as const, label: 'React' },
              { value: 'nextjs' as const, label: 'Next.js' },
              { value: 'mixed' as const, label: 'Mixed' },
            ]}
            value={category}
            onChange={setCategory}
          />
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-semibold text-lg text-text-primary">
            Number of Challenges
          </h2>
          <PillToggle
            options={[
              { value: 3 as const, label: '3' },
              { value: 4 as const, label: '4' },
              { value: 5 as const, label: '5' },
            ]}
            value={challengeCount}
            onChange={setChallengeCount}
          />
        </section>

        {error && (
          <div className="bg-error-light border-l-4 border-error rounded-r-lg px-4 py-3">
            <p className="font-body text-base text-text-primary">{error}</p>
          </div>
        )}

        <Button
          onClick={handleStart}
          disabled={loading}
          className="w-full text-lg py-4"
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              Starting session…
            </>
          ) : (
            'Start Session'
          )}
        </Button>
      </div>

      <div className="text-center">
        <Link
          href="/simulator/history"
          className="font-body text-base text-brand hover:text-brand-dark font-semibold"
        >
          Past Sessions →
        </Link>
      </div>
    </div>
  );
}
