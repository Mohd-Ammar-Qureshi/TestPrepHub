import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../theme';
import {AppText} from './AppText';

interface StatItemProps {
  label: string;
  value: string;
}

/** Small label/value box used for questions, duration and marks. */
export function StatItem({label, value}: StatItemProps) {
  const {theme} = useTheme();

  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={[
        styles.item,
        {
          backgroundColor: theme.colors.surfaceAlt,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
        },
      ]}>
      <AppText variant="caption" color="secondary">
        {label}
      </AppText>
      <AppText variant="label">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {flex: 1},
});
