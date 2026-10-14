import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  AppText,
  Badge,
  Button,
  Card,
  Screen,
  StatItem,
  StatusView,
} from '../components';
import {useAttempts} from '../context/AttemptsContext';
import {getCategoryById} from '../data/categories';
import {getTestSeriesById} from '../services/testSeriesService';
import type {RootScreenProps} from '../navigation/types';
import {useTheme, type Theme} from '../theme';
import {formatDateTime, formatTimeTaken} from '../utils/format';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    back: {alignSelf: 'flex-start', paddingHorizontal: 0},
    header: {marginTop: theme.spacing.sm, marginBottom: theme.spacing.lg},
    summary: {flexDirection: 'row', marginBottom: theme.spacing.lg},
    summaryGap: {width: theme.spacing.sm},
    card: {marginBottom: theme.spacing.md},
    top: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    name: {flex: 1, marginRight: theme.spacing.sm},
    meta: {marginTop: theme.spacing.xs},
  });

export default function AttemptHistoryScreen({
  navigation,
}: RootScreenProps<'AttemptHistory'>) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {attempts, isLoading, stats} = useAttempts();

  return (
    <Screen>
      <Button
        title="‹ Back"
        variant="ghost"
        onPress={() => navigation.goBack()}
        style={styles.back}
      />
      <View style={styles.header}>
        <AppText variant="title">Attempt history</AppText>
        <AppText variant="body" color="secondary">
          Tap an attempt to review your answers.
        </AppText>
      </View>

      {isLoading ? (
        <StatusView loading title="Loading history…" />
      ) : attempts.length === 0 ? (
        <StatusView
          emoji="📝"
          title="No attempts yet"
          message="Take a test and your results will appear here."
          actionLabel="Browse test series"
          onAction={() => navigation.popToTop()}
        />
      ) : (
        <>
          <View style={styles.summary}>
            <StatItem label="Tests taken" value={`${stats.total}`} />
            <View style={styles.summaryGap} />
            <StatItem label="Average" value={`${stats.averagePercentage}%`} />
            <View style={styles.summaryGap} />
            <StatItem label="Best" value={`${stats.bestPercentage}%`} />
          </View>
          {attempts.map(attempt => {
            const series = getTestSeriesById(attempt.testSeriesId);
            const category = series ? getCategoryById(series.categoryId) : null;
            const tone =
              attempt.percentage >= 80
                ? 'success'
                : attempt.percentage >= 50
                  ? 'warning'
                  : 'primary';

            return (
              <Card
                key={attempt.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('AnswerReview', {result: attempt})
                }
                accessibilityLabel={`${attempt.testName}, ${attempt.percentage} percent. Review answers`}>
                <View style={styles.top}>
                  <AppText variant="heading" style={styles.name}>
                    {attempt.testName}
                  </AppText>
                  <Badge label={`${attempt.percentage}%`} tone={tone} />
                </View>
                {category ? (
                  <AppText variant="caption" color="secondary">
                    {category.emoji} {category.name}
                  </AppText>
                ) : null}
                <AppText variant="body" style={styles.meta}>
                  Score {attempt.score} / {attempt.totalMarks} •{' '}
                  {attempt.correct} correct
                </AppText>
                <AppText
                  variant="caption"
                  color="secondary"
                  style={styles.meta}>
                  {formatDateTime(attempt.completedAt)} •{' '}
                  {formatTimeTaken(attempt.timeTakenSeconds)}
                  {attempt.timedOut ? ' • timed out' : ''}
                </AppText>
              </Card>
            );
          })}
        </>
      )}
    </Screen>
  );
}
