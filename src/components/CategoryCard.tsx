import React, {useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import type {Category} from '../types/category';
import {useTheme, type Theme} from '../theme';
import {AppText} from './AppText';

interface CategoryCardProps {
  category: Category;
  selected: boolean;
  onToggle: (id: string) => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      width: '48%',
      minHeight: 168,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      borderWidth: 2,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    emoji: {fontSize: 32, lineHeight: 40},
    indicator: {
      width: 24,
      height: 24,
      borderRadius: theme.radius.pill,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    check: {fontSize: 14, fontWeight: '700', lineHeight: 16},
    name: {marginBottom: theme.spacing.xs},
  });

export function CategoryCard({
  category,
  selected,
  onToggle,
}: CategoryCardProps) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {colors} = theme;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={category.name}
      accessibilityHint={category.description}
      accessibilityState={{checked: selected}}
      onPress={() => onToggle(category.id)}
      style={({pressed}) => [
        styles.card,
        {
          backgroundColor: selected ? colors.primaryMuted : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <View style={styles.topRow}>
        <AppText style={styles.emoji}>{category.emoji}</AppText>
        <View
          style={[
            styles.indicator,
            {
              borderColor: selected ? colors.primary : colors.inputBorder,
              backgroundColor: selected ? colors.primary : 'transparent',
            },
          ]}>
          {selected ? (
            <AppText style={[styles.check, {color: colors.primaryText}]}>
              ✓
            </AppText>
          ) : null}
        </View>
      </View>
      <AppText variant="label" style={styles.name}>
        {category.name}
      </AppText>
      <AppText variant="caption" color="secondary">
        {category.description}
      </AppText>
    </Pressable>
  );
}
