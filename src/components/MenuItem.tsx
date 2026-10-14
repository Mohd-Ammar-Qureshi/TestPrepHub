import React, {useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useTheme, type Theme} from '../theme';
import {AppText} from './AppText';

interface MenuItemProps {
  /** Emoji shown in the round badge on the left. */
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  /** Draws a thin line under the row (use for all but the last row). */
  showDivider?: boolean;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      minHeight: 64,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    icon: {fontSize: 18, lineHeight: 24},
    body: {flex: 1},
    chevron: {fontSize: 24, lineHeight: 28, marginLeft: theme.spacing.sm},
  });

/** A tappable row for menu-style lists, e.g. on the Profile screen. */
export function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  showDivider = false,
}: MenuItemProps) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      onPress={onPress}
      style={({pressed}) => [
        styles.row,
        {
          opacity: pressed ? 0.7 : 1,
          borderBottomWidth: showDivider ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: theme.colors.border,
        },
      ]}>
      <View style={styles.iconCircle}>
        <AppText style={styles.icon}>{icon}</AppText>
      </View>
      <View style={styles.body}>
        <AppText variant="label" style={{fontSize: 16}}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="secondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <AppText color="secondary" style={styles.chevron}>
        ›
      </AppText>
    </Pressable>
  );
}
