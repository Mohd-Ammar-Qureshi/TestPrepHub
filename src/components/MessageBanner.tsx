import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme, type Theme} from '../theme';
import {AppText} from './AppText';

interface MessageBannerProps {
  message: string;
  variant?: 'error' | 'success';
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    banner: {
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
  });

export function MessageBanner({
  message,
  variant = 'error',
}: MessageBannerProps) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const backgroundColor =
    variant === 'error'
      ? theme.colors.errorBackground
      : theme.colors.successBackground;

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.banner, {backgroundColor}]}>
      <AppText variant="label" color={variant}>
        {message}
      </AppText>
    </View>
  );
}
