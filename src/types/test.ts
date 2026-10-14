export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

/** Maps a question id to the option index the student chose. */
export type AnswerMap = Record<string, number>;

export interface TestResult {
  testSeriesId: string;
  testName: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTakenSeconds: number;
  /** True when the test was submitted automatically because time ran out. */
  timedOut: boolean;
  answers: AnswerMap;
  /**
   * The questions exactly as this student saw them (random selection and
   * shuffled options), so the review matches what they answered. Missing on
   * attempts saved by older versions of the app.
   */
  questions?: Question[];
}

/** A completed test saved on the device. */
export interface Attempt extends TestResult {
  id: string;
  studentId: string;
  /** ISO date string. */
  completedAt: string;
}
