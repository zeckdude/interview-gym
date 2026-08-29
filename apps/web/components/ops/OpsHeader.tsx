'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LooksSwitcher } from '@/components/ui/LooksSwitcher';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/ops', label: 'Hub', exact: true },
  { href: '/ops/ui', label: 'UI showcase' },
  { href: '/admin/paused-features', label: 'Paused features' },
];

export function OpsHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await fetch('/api/ops/auth', { method: 'DELETE' });
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-surface/95 backdrop-blur px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/ops" className="font-display font-bold text-lg text-text-primary">
            Ops
          </Link>
          <nav className="flex flex-wrap gap-2">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'font-body text-sm font-semibold px-3 py-1.5 rounded-md transition-colors',
                    active
                      ? 'bg-brand text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LooksSwitcher />
          <button
            type="button"
            onClick={() => void signOut()}
            className="font-body text-sm font-semibold text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-md border border-border-subtle hover:bg-bg-subtle transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
