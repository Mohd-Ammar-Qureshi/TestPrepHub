import React, {useMemo} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useTheme, type Theme} from '../theme';
import {AppText} from './AppText';
import {Button} from './Button';

interface StatusViewProps {
  /** Shows a spinner instead of an emoji. */
  loading?: boolean;
  emoji?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xxl,
      paddingHorizontal: theme.spacing.lg,
    },
    emoji: {fontSize: 48, lineHeight: 60, marginBottom: theme.spacing.md},
    spinner: {marginBottom: theme.spacing.lg},
    message: {marginTop: theme.spacing.xs},
    action: {marginTop: theme.spacing.lg},
  });

/** Shared loading / empty / error placeholder. */
export function StatusView({
  loading,
  emoji,
  title,
  message,
  actionLabel,
  onAction,
}: StatusViewProps) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.spinner}
        />
      ) : emoji ? (
        <AppText style={styles.emoji}>{emoji}</AppText>
      ) : null}
      <AppText variant="heading" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText
          variant="body"
          color="secondary"
          align="center"
          style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          variant="secondary"
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}
