import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  AppText,
  Badge,
  Button,
  Card,
  ReviewQuestionCard,
  Screen,
  StatusView,
} from '../components';
import type {RootScreenProps} from '../navigation/types';
import {getQuestionsForTest} from '../services/questionService';
import {useTheme, type Theme} from '../theme';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    back: {alignSelf: 'flex-start', paddingHorizontal: 0},
    header: {marginTop: theme.spacing.sm, marginBottom: theme.spacing.lg},
    summary: {marginBottom: theme.spacing.lg},
    summaryNote: {marginTop: theme.spacing.sm},
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.sm,
    },
  });

export default function AnswerReviewScreen({
  navigation,
  route,
}: RootScreenProps<'AnswerReview'>) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {result} = route.params;

  const questions = useMemo(
    () =>
      // Newer attempts carry the exact paper; older ones used the first questions.
      result.questions ??
      getQuestionsForTest(result.testSeriesId).slice(0, result.totalQuestions),
    [result.questions, result.testSeriesId, result.totalQuestions],
  );

  const back = (
    <Button
      title="‹ Back"
      variant="ghost"
      onPress={() => navigation.goBack()}
      style={styles.back}
    />
  );

  if (questions.length === 0) {
    return (
      <Screen>
        {back}
        <StatusView
          emoji="🔍"
          title="Questions not available"
          message="The questions for this attempt could not be found."
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      {back}
      <View style={styles.header}>
        <AppText variant="title">Review answers</AppText>
        <AppText variant="body" color="secondary">
          {result.testName}
        </AppText>
      </View>

      <Card style={styles.summary}>
        <AppText variant="label" color="secondary">
          Your score
        </AppText>
        <View style={styles.summaryRow}>
          <AppText variant="heading">
            {result.score} / {result.totalMarks}
          </AppText>
          <Badge
            label={`${result.percentage}%`}
            tone={
              result.percentage >= 80
                ? 'success'
                : result.percentage >= 50
                  ? 'warning'
                  : 'primary'
            }
          />
        </View>
        <AppText variant="caption" color="secondary" style={styles.summaryNote}>
          {result.correct} correct • {result.incorrect} incorrect •{' '}
          {result.unanswered} not answered
        </AppText>
      </Card>

      {questions.map((question, index) => (
        <ReviewQuestionCard
          key={question.id}
          index={index}
          question={question}
          chosenIndex={result.answers[question.id]}
        />
      ))}
    </Screen>
  );
}
