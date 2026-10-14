import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../theme';

interface ProgressBarProps {
  /** Value from 0 to 1. */
  progress: number;
}

export function ProgressBar({progress}: ProgressBarProps) {
  const {theme} = useTheme();
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{min: 0, max: 100, now: Math.round(clamped * 100)}}
      style={[
        styles.track,
        {
          backgroundColor: theme.colors.surfaceAlt,
          borderRadius: theme.radius.pill,
        },
      ]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.pill,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {height: 8, overflow: 'hidden'},
  fill: {height: '100%'},
});
