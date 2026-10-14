import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  AppText,
  Badge,
  Button,
  Card,
  MessageBanner,
  Screen,
  StatItem,
} from '../components';
import type {RootScreenProps} from '../navigation/types';
import {useTheme, type Theme} from '../theme';
import {formatTimeTaken} from '../utils/format';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {marginTop: theme.spacing.lg, marginBottom: theme.spacing.lg},
    hero: {alignItems: 'center', marginBottom: theme.spacing.lg},
    emoji: {fontSize: 56, lineHeight: 68},
    message: {marginTop: theme.spacing.sm},
    score: {marginTop: theme.spacing.md, fontSize: 40, lineHeight: 48},
    badge: {marginTop: theme.spacing.md},
    row: {flexDirection: 'row', marginBottom: theme.spacing.sm},
    gap: {width: theme.spacing.sm},
    buttons: {marginTop: theme.spacing.lg},
    buttonGap: {marginBottom: theme.spacing.md},
  });

function getFeedback(percentage: number) {
  if (percentage >= 80) {
    return {emoji: '🏆', title: 'Excellent work!', tone: 'success' as const};
  }
  if (percentage >= 50) {
    return {emoji: '👍', title: 'Good effort!', tone: 'warning' as const};
  }
  return {emoji: '💪', title: 'Keep practising!', tone: 'primary' as const};
}

export default function TestResultScreen({
  navigation,
  route,
}: RootScreenProps<'TestResult'>) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {result, saved} = route.params;
  const feedback = getFeedback(result.percentage);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="caption" color="secondary">
          Test result
        </AppText>
        <AppText variant="heading">{result.testName}</AppText>
      </View>

      {saved === false ? (
        <MessageBanner message="This attempt could not be saved to your history." />
      ) : null}

      {result.timedOut ? (
        <MessageBanner message="Time is up. Your test was submitted automatically." />
      ) : null}

      <Card style={styles.hero}>
        <AppText style={styles.emoji}>{feedback.emoji}</AppText>
        <AppText variant="heading" style={styles.message}>
          {feedback.title}
        </AppText>
        <AppText variant="title" style={styles.score}>
          {result.score} / {result.totalMarks}
        </AppText>
        <View style={styles.badge}>
          <Badge label={`${result.percentage}%`} tone={feedback.tone} />
        </View>
      </Card>

      <View style={styles.row}>
        <StatItem label="Correct" value={`${result.correct}`} />
        <View style={styles.gap} />
        <StatItem label="Incorrect" value={`${result.incorrect}`} />
        <View style={styles.gap} />
        <StatItem label="Unanswered" value={`${result.unanswered}`} />
      </View>
      <View style={styles.row}>
        <StatItem
          label="Time taken"
          value={formatTimeTaken(result.timeTakenSeconds)}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          title="Retake test"
          onPress={() =>
            navigation.replace('TakeTest', {testSeriesId: result.testSeriesId})
          }
          style={styles.buttonGap}
        />
        <Button
          title="Review answers"
          variant="secondary"
          onPress={() => navigation.navigate('AnswerReview', {result})}
          style={styles.buttonGap}
        />
        <Button
          title="Back to test series"
          variant="ghost"
          onPress={() => navigation.popToTop()}
        />
      </View>
    </Screen>
  );
}
