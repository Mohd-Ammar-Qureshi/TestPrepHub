import rawQuestions from '../data/questions.json';
import type {Question} from '../types/test';
import {shuffle, type RandomFn} from '../utils/random';

const QUESTION_BANK = rawQuestions as unknown as Record<string, Question[]>;

/** Every question available for a test series (the pool tests are drawn from). */
export function getQuestionsForTest(testSeriesId: string): Question[] {
  return QUESTION_BANK[testSeriesId] ?? [];
}

/** Returns the same question with its options in a random order. */
function shuffleOptions(question: Question, random: RandomFn): Question {
  const order = shuffle(
    question.options.map((_, index) => index),
    random,
  );
  return {
    ...question,
    options: order.map(index => question.options[index]),
    correctIndex: order.indexOf(question.correctIndex),
  };
}

/**
 * Builds one test paper: `count` different questions picked at random from the
 * pool, in random order, each with its options shuffled. The returned
 * questions are what the student sees, and their correctIndex matches the
 * shuffled options, so scoring and review use them as they are.
 */
export function buildTestPaper(
  testSeriesId: string,
  count: number,
  random: RandomFn = Math.random,
): Question[] {
  const pool = getQuestionsForTest(testSeriesId);
  return shuffle(pool, random)
    .slice(0, count)
    .map(question => shuffleOptions(question, random));
}
