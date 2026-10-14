import React from 'react';
import {Text, type TextProps, type TextStyle} from 'react-native';
import {useTheme, type TextVariant} from '../theme';

export type AppTextColor =
  'text' | 'secondary' | 'primary' | 'error' | 'success' | 'warning';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: AppTextColor;
  align?: TextStyle['textAlign'];
}

export function AppText({
  variant = 'body',
  color = 'text',
  align,
  style,
  ...rest
}: AppTextProps) {
  const {theme} = useTheme();
  const colorMap: Record<AppTextColor, string> = {
    text: theme.colors.text,
    secondary: theme.colors.textSecondary,
    primary: theme.colors.primary,
    error: theme.colors.error,
    success: theme.colors.success,
    warning: theme.colors.warning,
  };

  return (
    <Text
      {...rest}
      style={[
        theme.typography[variant],
        {color: colorMap[color]},
        align ? {textAlign: align} : null,
        style,
      ]}
    />
  );
}
