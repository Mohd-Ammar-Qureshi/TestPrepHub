import type {TextStyle} from 'react-native';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export type TextVariant = 'title' | 'heading' | 'body' | 'label' | 'caption';

export const typography: Record<TextVariant, TextStyle> = {
  title: {fontSize: 28, fontWeight: '700', lineHeight: 34},
  heading: {fontSize: 20, fontWeight: '600', lineHeight: 26},
  body: {fontSize: 16, fontWeight: '400', lineHeight: 22},
  label: {fontSize: 14, fontWeight: '600', lineHeight: 20},
  caption: {fontSize: 13, fontWeight: '400', lineHeight: 18},
};
