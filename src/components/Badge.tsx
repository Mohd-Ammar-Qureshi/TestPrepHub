import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../theme';
import {AppText} from './AppText';

export type BadgeTone = 'success' | 'warning' | 'error' | 'primary';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export function Badge({label, tone = 'primary'}: BadgeProps) {
  const {theme} = useTheme();
  const {colors} = theme;

  const palette: Record<BadgeTone, {bg: string; fg: BadgeTone}> = {
    success: {bg: colors.successBackground, fg: 'success'},
    warning: {bg: colors.warningBackground, fg: 'warning'},
    error: {bg: colors.errorBackground, fg: 'error'},
    primary: {bg: colors.primaryMuted, fg: 'primary'},
  };

  return (
    <View
      style={[
        styles.badge,
        {backgroundColor: palette[tone].bg, borderRadius: theme.radius.pill},
      ]}>
      <AppText variant="caption" color={palette[tone].fg} style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start'},
  label: {fontWeight: '700'},
});
