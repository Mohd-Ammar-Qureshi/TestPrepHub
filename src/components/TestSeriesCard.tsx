import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {getCategoryById} from '../data/categories';
import {useTheme, type Theme} from '../theme';
import type {Difficulty, TestSeries} from '../types/testSeries';
import {formatDuration} from '../utils/format';
import {AppText} from './AppText';
import {Badge, type BadgeTone} from './Badge';
import {Button} from './Button';
import {Card} from './Card';
import {StatItem} from './StatItem';

interface TestSeriesCardProps {
  testSeries: TestSeries;
  onPress: (id: string) => void;
  /** Shown when the student has already attempted this test. */
  progress?: {attempts: number; bestPercentage: number};
}

export const DIFFICULTY_TONE: Record<Difficulty, BadgeTone> = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {marginBottom: theme.spacing.lg},
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    category: {flex: 1, marginRight: theme.spacing.sm},
    title: {marginBottom: theme.spacing.sm},
    progress: {marginBottom: theme.spacing.md},
    stats: {flexDirection: 'row', marginBottom: theme.spacing.lg},
    gap: {width: theme.spacing.sm},
  });

export function TestSeriesCard({
  testSeries,
  onPress,
  progress,
}: TestSeriesCardProps) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const category = getCategoryById(testSeries.categoryId);

  return (
    <Card
      style={styles.card}
      onPress={() => onPress(testSeries.id)}
      accessibilityLabel={`${testSeries.name}, ${testSeries.difficulty}. View details`}>
      <View style={styles.topRow}>
        <AppText variant="caption" color="secondary" style={styles.category}>
          {category ? `${category.emoji} ${category.name}` : 'Category'}
        </AppText>
        <Badge
          label={testSeries.difficulty}
          tone={DIFFICULTY_TONE[testSeries.difficulty]}
        />
      </View>

      <AppText variant="heading" style={styles.title}>
        {testSeries.name}
      </AppText>

      {progress ? (
        <AppText variant="caption" color="success" style={styles.progress}>
          Best score {progress.bestPercentage}% • {progress.attempts}{' '}
          {progress.attempts === 1 ? 'attempt' : 'attempts'}
        </AppText>
      ) : (
        <View style={styles.progress} />
      )}

      <View style={styles.stats}>
        <StatItem label="Questions" value={`${testSeries.totalQuestions}`} />
        <View style={styles.gap} />
        <StatItem
          label="Duration"
          value={formatDuration(testSeries.durationMinutes)}
        />
        <View style={styles.gap} />
        <StatItem label="Total marks" value={`${testSeries.totalMarks}`} />
      </View>

      <Button
        title="Start Test"
        accessibilityLabel={`Start test: ${testSeries.name}`}
        onPress={() => onPress(testSeries.id)}
      />
    </Card>
  );
}
