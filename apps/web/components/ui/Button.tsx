import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand hover:bg-brand-dark text-white shadow-brand disabled:opacity-50 disabled:shadow-none',
  secondary:
    'bg-bg-subtle hover:bg-border-subtle text-text-primary border border-border-subtle disabled:opacity-50 dark:bg-[#252525] dark:hover:bg-[#2A2A2A] dark:text-[#F0EDE8] dark:border-[#3A3A3A]',
  ghost:
    'text-brand hover:text-brand-dark hover:bg-brand-light disabled:opacity-50',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'font-body font-semibold px-6 py-3 rounded-md transition-all duration-150 inline-flex items-center justify-center gap-2',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';
