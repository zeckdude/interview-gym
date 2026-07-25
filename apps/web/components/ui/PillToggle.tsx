'use client';

import { cn } from '@/lib/utils';

interface PillToggleProps<T extends string | number> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function PillToggle<T extends string | number>({
  options,
  value,
  onChange,
  className,
}: PillToggleProps<T>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'font-body text-sm font-semibold px-4 py-2 rounded-full transition-all duration-150',
            value === opt.value
              ? 'bg-brand text-white shadow-brand'
              : 'bg-bg-subtle text-text-primary border border-border-subtle hover:border-brand hover:text-brand'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
