export interface ThemeTokens {
  bgBase: string;
  bgSurface: string;
  bgSubtle: string;
  bgInverse: string;
  brand: string;
  brandLight: string;
  brandDark: string;
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  textMuted: string;
  borderSubtle: string;
  borderStrong: string;
  fontDisplay: string;
  fontBody: string;
  shadowCard: string;
  shadowRaised: string;
  shadowModal: string;
  shadowBrand: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  monacoThemeLight: string;
  monacoThemeDark: string;
}

export interface Look {
  id: string;
  name: string;
  tagline: string;
  previewColor: string;
  previewAccent: string;
  light: ThemeTokens;
  dark: ThemeTokens;
}
