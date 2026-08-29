import type { Appearance } from '@clerk/types';

/**
 * Clerk appearance config using Interview Gym design tokens.
 * Values mirror tailwind.config.ts — update both when swapping aesthetics.
 */
export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: '#FF6B35',
    colorDanger: '#E74C3C',
    colorSuccess: '#2ECC71',
    colorWarning: '#F39C12',
    colorBackground: 'transparent',
    colorInputBackground: '#FFFFFF',
    colorInputText: '#1A1714',
    colorText: '#1A1714',
    colorTextSecondary: '#6B6560',
    colorTextOnPrimaryBackground: '#FFFFFF',
    borderRadius: '0.75rem',
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    fontFamilyButtons: 'var(--font-inter), system-ui, sans-serif',
    fontSize: '1rem',
    spacingUnit: '1rem',
  },
  layout: {
    socialButtonsPlacement: 'top',
    socialButtonsVariant: 'blockButton',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full !shadow-none !bg-transparent !border-0 p-0 m-0',
    card: '!shadow-none !border-0 !bg-transparent p-0 gap-6 w-full',
    scrollBox: '!bg-transparent !shadow-none',
    pageScrollBox: '!bg-transparent',
    main: 'gap-6',
    header: 'gap-2',
    headerTitle:
      'font-display font-bold text-2xl text-text-primary tracking-tight',
    headerSubtitle: 'font-body text-sm text-text-secondary',
    socialButtonsBlockButton:
      'border border-border-subtle bg-bg-surface hover:bg-bg-subtle transition-all duration-150 h-12',
    socialButtonsBlockButtonText:
      'font-body font-semibold text-text-primary text-sm',
    socialButtonsProviderIcon: 'size-5',
    dividerLine: 'bg-border-subtle',
    dividerText: 'font-body text-xs text-text-muted uppercase',
    formFieldLabel: 'font-body font-semibold text-sm text-text-primary',
    formFieldInput:
      'border border-border-subtle rounded-md font-body text-base focus:ring-2 focus:ring-brand focus:border-transparent',
    formButtonPrimary:
      'btn-primary font-body font-semibold text-sm normal-case transition-all duration-150 h-12',
    footerActionText: 'font-body text-sm text-text-secondary',
    footerActionLink:
      'font-body font-semibold text-brand hover:text-brand-dark',
    identityPreviewText: 'font-body text-text-primary',
    identityPreviewEditButton: 'text-brand hover:text-brand-dark',
    formFieldAction: 'text-brand hover:text-brand-dark font-body text-sm',
    alertText: 'font-body text-sm',
    otpCodeFieldInput: 'border-border-subtle rounded-md',
  },
};
