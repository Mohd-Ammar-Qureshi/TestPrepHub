import type {TestSeries} from '../types/testSeries';
import type {AnswerMap, Question, TestResult} from '../types/test';

/**
 * Every question carries the same marks (total marks / number of questions).
 * There is no negative marking.
 */
export function calculateResult(
  testSeries: TestSeries,
  questions: Question[],
  answers: AnswerMap,
  timeTakenSeconds: number,
  timedOut: boolean,
): TestResult {
  let correct = 0;
  let incorrect = 0;

  questions.forEach(question => {
    const chosen = answers[question.id];
    if (chosen === undefined) {
      return;
    }
    if (chosen === question.correctIndex) {
      correct += 1;
    } else {
      incorrect += 1;
    }
  });

  const marksPerQuestion = testSeries.totalMarks / questions.length;
  const score = Math.round(correct * marksPerQuestion * 100) / 100;

  return {
    testSeriesId: testSeries.id,
    testName: testSeries.name,
    totalQuestions: questions.length,
    correct,
    incorrect,
    unanswered: questions.length - correct - incorrect,
    score,
    totalMarks: testSeries.totalMarks,
    percentage: Math.round((score / testSeries.totalMarks) * 100),
    timeTakenSeconds,
    timedOut,
    answers,
    questions,
  };
}
