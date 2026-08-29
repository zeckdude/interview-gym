'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function OpsLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ops/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Invalid password');
        return;
      }
      router.refresh();
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-bg-base">
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="w-full max-w-md rounded-xl border border-border-subtle bg-bg-surface shadow-modal p-8 space-y-6"
      >
        <div className="space-y-2">
          <h1 className="font-display font-bold text-2xl text-text-primary">Ops access</h1>
          <p className="font-body text-base text-text-primary">
            Internal tools — enter the ops password from your environment config.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="ops-password" className="font-body text-sm font-semibold text-text-primary">
            Password
          </label>
          <input
            id="ops-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full font-body text-base text-text-primary bg-bg-subtle border border-border-subtle rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {error && (
          <p className="font-body text-sm text-error bg-error-light border border-error/30 rounded-md px-4 py-3">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading || !password} className="w-full">
          {loading ? 'Checking…' : 'Unlock ops'}
        </Button>
      </form>
    </div>
  );
}
