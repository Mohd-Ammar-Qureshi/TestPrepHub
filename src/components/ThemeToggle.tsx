import React, {useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useTheme, type Theme, type ThemePreference} from '../theme';
import {AppText} from './AppText';

const OPTIONS: {value: ThemePreference; label: string}[] = [
  {value: 'system', label: 'System'},
  {value: 'light', label: 'Light'},
  {value: 'dark', label: 'Dark'},
];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    track: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: theme.radius.md,
      padding: theme.spacing.xs,
    },
    option: {
      flex: 1,
      minHeight: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.sm,
    },
    selected: {backgroundColor: theme.colors.primary},
    hint: {marginTop: theme.spacing.sm},
  });

export function ThemeToggle() {
  const {theme, preference, setPreference} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const hint =
    preference === 'system'
      ? `Following device setting (currently ${theme.isDark ? 'dark' : 'light'})`
      : `Using ${preference} theme`;

  return (
    <View>
      <View style={styles.track} accessibilityRole="radiogroup">
        {OPTIONS.map(option => {
          const isSelected = option.value === preference;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={`${option.label} theme`}
              accessibilityState={{selected: isSelected}}
              onPress={() => setPreference(option.value)}
              style={[styles.option, isSelected && styles.selected]}>
              <AppText
                variant="label"
                style={{
                  color: isSelected
                    ? theme.colors.primaryText
                    : theme.colors.textSecondary,
                }}>
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      <AppText variant="caption" color="secondary" style={styles.hint}>
        {hint}
      </AppText>
    </View>
  );
}
