import React, {useMemo} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {useTheme, type Theme} from '../theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      shadowColor: theme.colors.shadow,
      shadowOpacity: theme.isDark ? 0.4 : 0.08,
      shadowRadius: 8,
      shadowOffset: {width: 0, height: 2},
      elevation: 2,
    },
    pressed: {opacity: 0.85},
  });

export function Card({
  children,
  onPress,
  style,
  accessibilityLabel,
}: CardProps) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({pressed}) => [styles.card, pressed && styles.pressed, style]}>
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}
