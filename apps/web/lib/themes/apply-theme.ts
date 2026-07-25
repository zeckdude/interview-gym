import { ThemeTokens } from './types';

export function applyTheme(tokens: ThemeTokens): void {
  const root = document.documentElement;
  root.style.setProperty('--color-bg-base', tokens.bgBase);
  root.style.setProperty('--color-bg-surface', tokens.bgSurface);
  root.style.setProperty('--color-bg-subtle', tokens.bgSubtle);
  root.style.setProperty('--color-bg-inverse', tokens.bgInverse);
  root.style.setProperty('--color-brand', tokens.brand);
  root.style.setProperty('--color-brand-light', tokens.brandLight);
  root.style.setProperty('--color-brand-dark', tokens.brandDark);
  root.style.setProperty('--color-text-primary', tokens.textPrimary);
  root.style.setProperty('--color-text-secondary', tokens.textSecondary);
  root.style.setProperty('--color-text-inverse', tokens.textInverse);
  root.style.setProperty('--color-text-muted', tokens.textMuted);
  root.style.setProperty('--color-border-subtle', tokens.borderSubtle);
  root.style.setProperty('--color-border-strong', tokens.borderStrong);
  root.style.setProperty('--font-display', tokens.fontDisplay);
  root.style.setProperty('--font-body', tokens.fontBody);
  root.style.setProperty('--shadow-card', tokens.shadowCard);
  root.style.setProperty('--shadow-raised', tokens.shadowRaised);
  root.style.setProperty('--shadow-modal', tokens.shadowModal);
  root.style.setProperty('--shadow-brand', tokens.shadowBrand);
  root.style.setProperty('--radius-sm', tokens.radiusSm);
  root.style.setProperty('--radius-md', tokens.radiusMd);
  root.style.setProperty('--radius-lg', tokens.radiusLg);
  root.style.setProperty('--radius-xl', tokens.radiusXl);
}
