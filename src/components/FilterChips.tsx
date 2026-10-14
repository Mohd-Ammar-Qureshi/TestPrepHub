import React from 'react';
import {Pressable, ScrollView, StyleSheet} from 'react-native';
import {useTheme} from '../theme';
import {AppText} from './AppText';

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  activeId: string;
  onChange: (id: string) => void;
}

/** Horizontally scrolling single-select filter pills. */
export function FilterChips({options, activeId, onChange}: FilterChipsProps) {
  const {theme} = useTheme();
  const {colors} = theme;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}>
      {options.map(option => {
        const active = option.id === activeId;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{selected: active}}
            onPress={() => onChange(option.id)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.primary : colors.surface,
                borderColor: active ? colors.primary : colors.border,
                borderRadius: theme.radius.pill,
                marginRight: theme.spacing.sm,
              },
            ]}>
            <AppText
              variant="label"
              style={{color: active ? colors.primaryText : colors.text}}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Without this the row grows to fill the screen inside a vertical ScrollView.
  scroll: {flexGrow: 0},
  content: {paddingVertical: 4},
  chip: {
    borderWidth: 1,
    paddingHorizontal: 14,
    minHeight: 40,
    justifyContent: 'center',
  },
});
