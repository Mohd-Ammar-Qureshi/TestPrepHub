import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme, type Theme} from '../theme';
import type {Question} from '../types/test';
import {AppText} from './AppText';
import {Badge} from './Badge';
import {Card} from './Card';

interface ReviewQuestionCardProps {
  index: number;
  question: Question;
  /** The option the student chose, or undefined when unanswered. */
  chosenIndex?: number;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {marginBottom: theme.spacing.lg},
    top: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    text: {marginBottom: theme.spacing.md},
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.radius.md,
      borderWidth: 1.5,
    },
    marker: {width: 26},
    optionBody: {flex: 1},
  });

/** One question with the student's answer and the correct answer marked. */
export function ReviewQuestionCard({
  index,
  question,
  chosenIndex,
}: ReviewQuestionCardProps) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {colors} = theme;

  const status =
    chosenIndex === undefined
      ? 'unanswered'
      : chosenIndex === question.correctIndex
        ? 'correct'
        : 'incorrect';

  const badge = {
    correct: {label: 'Correct', tone: 'success' as const},
    incorrect: {label: 'Incorrect', tone: 'error' as const},
    unanswered: {label: 'Not answered', tone: 'warning' as const},
  }[status];

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <AppText variant="label" color="secondary">
          Question {index + 1}
        </AppText>
        <Badge label={badge.label} tone={badge.tone} />
      </View>
      <AppText variant="heading" style={styles.text}>
        {question.text}
      </AppText>

      {question.options.map((option, optionIndex) => {
        const isCorrect = optionIndex === question.correctIndex;
        const isChosen = optionIndex === chosenIndex;
        const isWrongChoice = isChosen && !isCorrect;

        const background = isCorrect
          ? colors.successBackground
          : isWrongChoice
            ? colors.errorBackground
            : colors.surface;
        const border = isCorrect
          ? colors.success
          : isWrongChoice
            ? colors.error
            : colors.border;
        const marker = isCorrect
          ? '✓'
          : isWrongChoice
            ? '✗'
            : (OPTION_LETTERS[optionIndex] ?? '');
        const tag = isChosen
          ? 'Your answer'
          : isCorrect
            ? 'Correct answer'
            : null;

        return (
          <View
            key={`${question.id}-${optionIndex}`}
            accessible
            accessibilityLabel={`${option}${
              isCorrect ? ', correct answer' : ''
            }${isChosen ? ', your answer' : ''}`}
            style={[
              styles.option,
              {backgroundColor: background, borderColor: border},
            ]}>
            <AppText
              variant="label"
              color={
                isCorrect ? 'success' : isWrongChoice ? 'error' : 'secondary'
              }
              style={styles.marker}>
              {marker}
            </AppText>
            <View style={styles.optionBody}>
              <AppText variant="body">{option}</AppText>
              {tag ? (
                <AppText
                  variant="caption"
                  color={isWrongChoice ? 'error' : 'success'}>
                  {tag}
                </AppText>
              ) : null}
            </View>
          </View>
        );
      })}
    </Card>
  );
}
