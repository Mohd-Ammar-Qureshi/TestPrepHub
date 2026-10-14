import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  AppText,
  Badge,
  Button,
  Card,
  Chip,
  DIFFICULTY_TONE,
  Screen,
  StatItem,
  StatusView,
} from '../components';
import {useAttempts} from '../context/AttemptsContext';
import {getCategoryById} from '../data/categories';
import type {RootScreenProps} from '../navigation/types';
import {getTestSeriesById} from '../services/testSeriesService';
import {useTheme, type Theme} from '../theme';
import {formatDate, formatDuration} from '../utils/format';

const GENERAL_INSTRUCTIONS = [
  'The timer starts as soon as the test opens.',
  'You can move between questions and change answers before submitting.',
  'The test is submitted automatically when time runs out.',
  'Every question carries equal marks. There is no negative marking.',
];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    back: {alignSelf: 'flex-start', paddingHorizontal: 0},
    category: {marginTop: theme.spacing.md, marginBottom: theme.spacing.xs},
    title: {marginBottom: theme.spacing.md},
    description: {marginTop: theme.spacing.md, marginBottom: theme.spacing.lg},
    stats: {flexDirection: 'row'},
    gap: {width: theme.spacing.sm},
    section: {marginTop: theme.spacing.lg},
    sectionTitle: {marginBottom: theme.spacing.md},
    chips: {flexDirection: 'row', flexWrap: 'wrap'},
    instruction: {marginBottom: theme.spacing.sm},
    footer: {marginTop: theme.spacing.xl},
  });

export default function TestSeriesDetailsScreen({
  navigation,
  route,
}: RootScreenProps<'TestSeriesDetails'>) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {getTestStats} = useAttempts();
  const testSeries = getTestSeriesById(route.params.testSeriesId);
  const myStats = testSeries ? getTestStats(testSeries.id) : null;
  const category = testSeries ? getCategoryById(testSeries.categoryId) : null;

  const backButton = (
    <Button
      title="‹ Back"
      variant="ghost"
      onPress={() => navigation.goBack()}
      style={styles.back}
    />
  );

  if (!testSeries) {
    return (
      <Screen>
        {backButton}
        <StatusView
          emoji="🔍"
          title="Test series not found"
          message="This test series is no longer available."
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const handleStart = () =>
    navigation.navigate('TakeTest', {testSeriesId: testSeries.id});

  return (
    <Screen>
      {backButton}

      <AppText variant="caption" color="secondary" style={styles.category}>
        {category ? `${category.emoji} ${category.name}` : 'Category'}
      </AppText>
      <AppText variant="title" style={styles.title}>
        {testSeries.name}
      </AppText>
      <Badge
        label={testSeries.difficulty}
        tone={DIFFICULTY_TONE[testSeries.difficulty]}
      />
      <AppText variant="body" color="secondary" style={styles.description}>
        {testSeries.description}
      </AppText>

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

      {myStats ? (
        <Card style={styles.section}>
          <AppText variant="heading" style={styles.sectionTitle}>
            Your performance
          </AppText>
          <View style={styles.stats}>
            <StatItem label="Attempts" value={`${myStats.attempts}`} />
            <View style={styles.gap} />
            <StatItem label="Best score" value={`${myStats.bestPercentage}%`} />
            <View style={styles.gap} />
            <StatItem
              label="Last attempt"
              value={formatDate(myStats.lastCompletedAt)}
            />
          </View>
        </Card>
      ) : null}

      <Card style={styles.section}>
        <AppText variant="heading" style={styles.sectionTitle}>
          Topics covered
        </AppText>
        <View style={styles.chips}>
          {testSeries.topics.map(topic => (
            <Chip key={topic} label={topic} />
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <AppText variant="heading" style={styles.sectionTitle}>
          Before you begin
        </AppText>
        {GENERAL_INSTRUCTIONS.map(text => (
          <AppText
            key={text}
            variant="body"
            color="secondary"
            style={styles.instruction}>
            • {text}
          </AppText>
        ))}
      </Card>

      <View style={styles.footer}>
        <Button title="Start Test" onPress={handleStart} />
      </View>
    </Screen>
  );
}
