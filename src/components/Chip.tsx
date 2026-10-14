import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../theme';
import {AppText} from './AppText';

interface ChipProps {
  label: string;
}

export function Chip({label}: ChipProps) {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: theme.colors.primaryMuted,
          borderRadius: theme.radius.pill,
          paddingHorizontal: theme.spacing.md,
          marginRight: theme.spacing.sm,
          marginBottom: theme.spacing.sm,
        },
      ]}>
      <AppText variant="caption" color="primary" style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {paddingVertical: 6},
  label: {fontWeight: '600'},
});
