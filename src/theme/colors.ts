export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryText: string;
  primaryMuted: string;
  inputBackground: string;
  inputBorder: string;
  inputBorderFocused: string;
  placeholder: string;
  error: string;
  onError: string;
  errorBackground: string;
  success: string;
  successBackground: string;
  warning: string;
  warningBackground: string;
  disabled: string;
  disabledText: string;
  shadow: string;
}

export const lightColors: ThemeColors = {
  background: '#F5F7FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF1F8',
  text: '#111827',
  textSecondary: '#5B6475',
  border: '#DDE2EE',
  primary: '#4F46E5',
  primaryText: '#FFFFFF',
  primaryMuted: '#E0E7FF',
  inputBackground: '#FFFFFF',
  inputBorder: '#C9D0E0',
  inputBorderFocused: '#4F46E5',
  placeholder: '#8A93A8',
  error: '#DC2626',
  onError: '#FFFFFF',
  errorBackground: '#FEE2E2',
  success: '#15803D',
  successBackground: '#DCFCE7',
  warning: '#B45309',
  warningBackground: '#FEF3C7',
  disabled: '#E3E7F0',
  disabledText: '#8A93A8',
  shadow: '#0B1220',
};

export const darkColors: ThemeColors = {
  background: '#0F1220',
  surface: '#181C2E',
  surfaceAlt: '#222740',
  text: '#F3F4F8',
  textSecondary: '#A4ACC4',
  border: '#2C3350',
  primary: '#818CF8',
  primaryText: '#0F1220',
  primaryMuted: '#2A2F5C',
  inputBackground: '#1C2136',
  inputBorder: '#3A4263',
  inputBorderFocused: '#818CF8',
  placeholder: '#7C86A3',
  error: '#F87171',
  onError: '#1A0B0B',
  errorBackground: '#3B1A1F',
  success: '#4ADE80',
  successBackground: '#12301F',
  warning: '#FBBF24',
  warningBackground: '#3A2E0F',
  disabled: '#262B42',
  disabledText: '#6B7592',
  shadow: '#000000',
};
