'use client';

import { cn } from '@/lib/utils';

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: string;
  variant?: 'default' | 'most-asked';
}

export function FilterPill({
  active,
  onClick,
  children,
  icon,
  variant = 'default',
}: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-150 border',
        active && variant === 'most-asked' && 'bg-error-light text-error border-error/30',
        active && variant === 'default' && 'bg-brand text-white border-brand shadow-brand',
        !active && 'bg-bg-subtle text-text-secondary border-border-subtle hover:border-brand hover:text-text-primary'
      )}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </button>
  );
}

interface FilterGroupProps {
  label: string;
  children: React.ReactNode;
}

export function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <div className="space-y-2">
      <p className="font-body text-xs font-semibold uppercase tracking-widest text-text-muted">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
