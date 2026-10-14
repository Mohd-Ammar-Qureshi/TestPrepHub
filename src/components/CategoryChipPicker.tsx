import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {CATEGORIES} from '../data/categories';
import {useTheme} from '../theme';
import {AppText} from './AppText';

interface CategoryChipPickerProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

/** Compact multi-select category pills, used inside forms. */
export function CategoryChipPicker({
  selectedIds,
  onToggle,
}: CategoryChipPickerProps) {
  const {theme} = useTheme();
  const {colors} = theme;

  return (
    <View style={styles.wrap}>
      {CATEGORIES.map(category => {
        const selected = selectedIds.includes(category.id);
        return (
          <Pressable
            key={category.id}
            accessibilityRole="checkbox"
            accessibilityLabel={category.name}
            accessibilityState={{checked: selected}}
            onPress={() => onToggle(category.id)}
            style={[
              styles.pill,
              {
                backgroundColor: selected ? colors.primary : colors.surface,
                borderColor: selected ? colors.primary : colors.inputBorder,
                borderRadius: theme.radius.pill,
                marginRight: theme.spacing.sm,
                marginBottom: theme.spacing.sm,
              },
            ]}>
            <AppText
              variant="label"
              style={{color: selected ? colors.primaryText : colors.text}}>
              {selected ? '✓ ' : ''}
              {category.emoji} {category.name}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {flexDirection: 'row', flexWrap: 'wrap'},
  pill: {
    borderWidth: 1.5,
    paddingHorizontal: 14,
    minHeight: 40,
    justifyContent: 'center',
  },
});
