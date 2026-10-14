import {darkColors, lightColors, type ThemeColors} from './colors';
import {radius, spacing, typography} from './tokens';

export interface Theme {
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

export type ThemePreference = 'system' | 'light' | 'dark';

export function buildTheme(isDark: boolean): Theme {
  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
    spacing,
    radius,
    typography,
  };
}
