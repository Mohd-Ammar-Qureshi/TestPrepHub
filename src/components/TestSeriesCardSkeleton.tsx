import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme, type Theme} from '../theme';
import {Card} from './Card';
import {Skeleton} from './Skeleton';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {marginBottom: theme.spacing.lg},
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {marginBottom: theme.spacing.lg},
    stats: {flexDirection: 'row', marginBottom: theme.spacing.lg},
    statGap: {width: theme.spacing.sm},
  });

/** Card-shaped placeholder that matches the layout of TestSeriesCard. */
export function TestSeriesCardSkeleton() {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <Skeleton width="45%" height={14} />
        <Skeleton width={64} height={22} radius={theme.radius.pill} />
      </View>
      <Skeleton width="75%" height={22} style={styles.title} />
      <View style={styles.stats}>
        <Skeleton width="31%" height={56} radius={theme.radius.md} />
        <View style={styles.statGap} />
        <Skeleton width="31%" height={56} radius={theme.radius.md} />
        <View style={styles.statGap} />
        <Skeleton width="31%" height={56} radius={theme.radius.md} />
      </View>
      <Skeleton height={48} radius={theme.radius.md} />
    </Card>
  );
}
