import type { Config } from 'tailwindcss';
import path from 'path';

// Dark mode hex overrides (used in dark: variants — see AGENTS.md):
// bg-[#0F0F0F] = bg-base dark  | bg-[#1A1A1A] = bg-surface dark  | bg-[#252525] = bg-subtle dark
// text-[#F0EDE8] = text-primary dark | text-[#9B9590] = text-secondary dark | text-[#5A5550] = text-muted dark
// border-[#2A2A2A] = border-subtle dark | border-[#3A3A3A] = border-strong dark
//
// Status callouts (success-light, error-light, warning-light) use CSS vars via globals.css + applyTheme().
// Always pair *-light backgrounds with text-text-primary — never assume static Tailwind pastels.

const config: Config = {
  darkMode: 'class',
  content: [
    path.join(__dirname, 'apps/web/app/**/*.{ts,tsx}'),
    path.join(__dirname, 'apps/web/components/**/*.{ts,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#FBF9F7',
        'bg-surface': '#FFFFFF',
        'bg-subtle': '#F3EFE9',
        'bg-inverse': '#2D2A26',

        'brand': '#FF6B35',
        'brand-light': '#FFE8DF',
        'brand-dark': 'var(--color-brand-dark)',

        'text-primary': '#1A1714',
        'text-secondary': '#6B6560',
        'text-inverse': '#F5F3F0',
        'text-muted': '#A39E99',

        'border-subtle': '#E8E2DA',
        'border-strong': '#C4BDB4',

        'success': '#2ECC71',
        'success-light': 'var(--color-success-light)',
        'error': '#E74C3C',
        'error-light': 'var(--color-error-light)',
        'warning': '#F39C12',
        'warning-light': 'var(--color-warning-light)',

        'easy': '#27AE60',
        'easy-light': '#D5F5E3',
        'medium': '#E67E22',
        'medium-light': '#FDEBD0',
        'hard': '#E74C3C',
        'hard-light': '#FDECEA',

        'cat-be': '#8E44AD',
        'cat-be-light': '#EFE0F8',
        'cat-fe': '#2980B9',
        'cat-fe-light': '#D6EAF8',
        'cat-advanced': '#16A085',
        'cat-advanced-light': '#D1F2EB',
        'cat-nextjs': '#111827',
        'cat-nextjs-light': '#E5E7EB',
      },

      fontFamily: {
        display: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'Fira Code', 'monospace'],
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
      },

      borderRadius: {
        none: '0',
        sm: '0.375rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },

      boxShadow: {
        card: '0 1px 4px 0 rgba(26,23,20,0.06), 0 2px 8px 0 rgba(26,23,20,0.04)',
        raised: '0 4px 12px 0 rgba(26,23,20,0.10), 0 1px 4px 0 rgba(26,23,20,0.06)',
        modal: '0 20px 60px 0 rgba(26,23,20,0.16)',
        brand: '0 4px 14px 0 rgba(255,107,53,0.30)',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out forwards',
      },
    },
  },
  // Design swap: update tokens above AND sync apps/web/lib/clerk-appearance.ts (see AGENTS.md)
  safelist: [
    // Clerk appearance element classes (defined in lib/clerk-appearance.ts)
    'bg-brand',
    'hover:bg-brand-dark',
    'bg-bg-surface',
    'bg-code-bg',
    'hover:bg-bg-subtle',
    'bg-border-subtle',
    'text-text-primary',
    'text-text-secondary',
    'text-text-muted',
    'text-brand',
    'hover:text-brand-dark',
    'border-border-subtle',
    'font-display',
    'font-body',
    'shadow-brand',
    'focus:ring-brand',
    '!shadow-none',
    '!bg-transparent',
    '!border-0',
  ],
  plugins: [],
};

export default config;
