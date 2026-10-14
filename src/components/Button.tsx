import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {useTheme} from '../theme';
import {AppText} from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const {theme} = useTheme();
  const {colors} = theme;
  const inactive = disabled || loading;

  const palette: Record<ButtonVariant, {bg: string; fg: string}> = {
    primary: {bg: colors.primary, fg: colors.primaryText},
    secondary: {bg: colors.primaryMuted, fg: colors.primary},
    ghost: {bg: 'transparent', fg: colors.primary},
    danger: {bg: colors.error, fg: colors.onError},
  };

  const bg = disabled ? colors.disabled : palette[variant].bg;
  const fg = disabled ? colors.disabledText : palette[variant].fg;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{disabled: inactive, busy: loading}}
      disabled={inactive}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        {
          backgroundColor: bg,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.xl,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <AppText variant="label" style={[styles.title, {color: fg}]}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {fontSize: 16},
});
