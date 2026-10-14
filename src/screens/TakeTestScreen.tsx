import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AppText,
  Button,
  Card,
  OptionButton,
  ProgressBar,
  QuestionPalette,
  Screen,
  StatusView,
} from '../components';
import {useAttempts} from '../context/AttemptsContext';
import {useDialog} from '../context/DialogContext';
import {useCountdown} from '../hooks/useCountdown';
import type {RootScreenProps, RootStackParamList} from '../navigation/types';
import {buildTestPaper} from '../services/questionService';
import {getTestSeriesById} from '../services/testSeriesService';
import {useTheme, type Theme} from '../theme';
import type {AnswerMap, Question} from '../types/test';
import type {TestSeries} from '../types/testSeries';
import {formatClock} from '../utils/format';
import {calculateResult} from '../utils/scoring';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const LOW_TIME_SECONDS = 60;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    exit: {paddingHorizontal: 0},
    timer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.surfaceAlt,
    },
    testName: {marginTop: theme.spacing.sm},
    progressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    questionCard: {marginTop: theme.spacing.lg, marginBottom: theme.spacing.lg},
    options: {marginBottom: theme.spacing.sm},
    clear: {alignSelf: 'flex-start', paddingHorizontal: 0},
    navRow: {flexDirection: 'row', marginTop: theme.spacing.md},
    navButton: {flex: 1},
    navGap: {width: theme.spacing.md},
    palette: {marginTop: theme.spacing.xl},
    paletteTitle: {marginBottom: theme.spacing.md},
  });

interface TestRunnerProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TakeTest'>;
  testSeries: TestSeries;
  questions: Question[];
}

function TestRunner({navigation, testSeries, questions}: TestRunnerProps) {
  const {theme} = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {saveResult} = useAttempts();
  const {confirm, hideDialog} = useDialog();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const answersRef = useRef<AnswerMap>({});
  const submittedRef = useRef(false);
  const allowLeaveRef = useRef(false);
  const finishRef = useRef<(timedOut: boolean) => void>(() => {});

  const {remaining, getElapsedSeconds} = useCountdown(
    testSeries.durationMinutes * 60,
    () => finishRef.current(true),
  );

  const finish = useCallback(
    async (timedOut: boolean) => {
      if (submittedRef.current) {
        return;
      }
      submittedRef.current = true;
      allowLeaveRef.current = true;
      // Close any open "submit" or "leave" dialog, e.g. when time runs out.
      hideDialog();
      const result = calculateResult(
        testSeries,
        questions,
        answersRef.current,
        getElapsedSeconds(),
        timedOut,
      );
      const attempt = await saveResult(result);
      navigation.replace('TestResult', {result, saved: attempt !== null});
    },
    [
      getElapsedSeconds,
      hideDialog,
      navigation,
      questions,
      saveResult,
      testSeries,
    ],
  );
  finishRef.current = finish;

  // Ask before leaving a test that is in progress (back button or swipe).
  useEffect(() => {
    return navigation.addListener('beforeRemove', event => {
      if (allowLeaveRef.current) {
        return;
      }
      event.preventDefault();
      confirm({
        emoji: '⚠️',
        title: 'Leave test?',
        message: 'Your answers will be lost.',
        confirmLabel: 'Leave',
        cancelLabel: 'Stay',
        destructive: true,
      }).then(leave => {
        if (leave) {
          allowLeaveRef.current = true;
          navigation.dispatch(event.data.action);
        }
      });
    });
  }, [confirm, navigation]);

  const question = questions[index];
  const selected = answers[question.id];
  const isLast = index === questions.length - 1;
  const answeredFlags = questions.map(q => answers[q.id] !== undefined);
  const answeredCount = answeredFlags.filter(Boolean).length;

  const setAnswer = (optionIndex: number) => {
    const next = {...answersRef.current, [question.id]: optionIndex};
    answersRef.current = next;
    setAnswers(next);
  };

  const clearAnswer = () => {
    const next = {...answersRef.current};
    delete next[question.id];
    answersRef.current = next;
    setAnswers(next);
  };

  const confirmSubmit = async () => {
    const unanswered = questions.length - answeredCount;
    const message =
      unanswered > 0
        ? `You have ${unanswered} unanswered question${
            unanswered === 1 ? '' : 's'
          }. Submit anyway?`
        : 'You have answered every question. Submit now?';
    const submit = await confirm({
      emoji: '📝',
      title: 'Submit test?',
      message,
      confirmLabel: 'Submit',
      cancelLabel: 'Keep working',
    });
    if (submit) {
      finish(false);
    }
  };

  const lowTime = remaining <= LOW_TIME_SECONDS;

  return (
    <Screen>
      <View style={styles.topRow}>
        <Button
          title="‹ Exit"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={styles.exit}
        />
        <View
          style={styles.timer}
          accessible
          accessibilityLabel={`Time remaining ${formatClock(remaining)}`}>
          <AppText variant="heading" color={lowTime ? 'error' : 'text'}>
            {formatClock(remaining)}
          </AppText>
        </View>
      </View>

      <AppText variant="label" color="secondary" style={styles.testName}>
        {testSeries.name}
      </AppText>

      <View style={styles.progressRow}>
        <AppText variant="label">
          Question {index + 1} of {questions.length}
        </AppText>
        <AppText variant="label" color="secondary">
          {answeredCount} answered
        </AppText>
      </View>
      <ProgressBar progress={(index + 1) / questions.length} />

      <Card style={styles.questionCard}>
        <AppText variant="heading">{question.text}</AppText>
      </Card>

      <View style={styles.options} accessibilityRole="radiogroup">
        {question.options.map((option, optionIndex) => (
          <OptionButton
            key={`${question.id}-${optionIndex}`}
            letter={OPTION_LETTERS[optionIndex] ?? `${optionIndex + 1}`}
            text={option}
            selected={selected === optionIndex}
            onPress={() => setAnswer(optionIndex)}
          />
        ))}
      </View>

      {selected !== undefined ? (
        <Button
          title="Clear answer"
          variant="ghost"
          onPress={clearAnswer}
          style={styles.clear}
        />
      ) : null}

      <View style={styles.navRow}>
        <Button
          title="Previous"
          variant="secondary"
          disabled={index === 0}
          onPress={() => setIndex(i => Math.max(0, i - 1))}
          style={styles.navButton}
        />
        <View style={styles.navGap} />
        {isLast ? (
          <Button
            title="Submit"
            onPress={confirmSubmit}
            style={styles.navButton}
          />
        ) : (
          <Button
            title="Next"
            onPress={() => setIndex(i => Math.min(questions.length - 1, i + 1))}
            style={styles.navButton}
          />
        )}
      </View>

      <View style={styles.palette}>
        <AppText variant="label" color="secondary" style={styles.paletteTitle}>
          Jump to question
        </AppText>
        <QuestionPalette
          answered={answeredFlags}
          currentIndex={index}
          onSelect={setIndex}
        />
        {!isLast ? (
          <Button
            title="Submit test"
            variant="ghost"
            onPress={confirmSubmit}
            style={styles.clear}
          />
        ) : null}
      </View>
    </Screen>
  );
}

export default function TakeTestScreen({
  navigation,
  route,
}: RootScreenProps<'TakeTest'>) {
  const testSeries = getTestSeriesById(route.params.testSeriesId);
  // A fresh random paper is built each time this screen opens (so a retake
  // gets different questions) and stays fixed while the test is in progress.
  const questions = useMemo(
    () =>
      testSeries
        ? buildTestPaper(testSeries.id, testSeries.totalQuestions)
        : [],
    [testSeries],
  );

  if (!testSeries || questions.length === 0) {
    return (
      <Screen>
        <StatusView
          emoji="🔍"
          title="Test not available"
          message="The questions for this test could not be found."
          actionLabel="Go back"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  return (
    <TestRunner
      navigation={navigation}
      testSeries={testSeries}
      questions={questions}
    />
  );
}
