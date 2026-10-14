export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestSeries {
  id: string;
  name: string;
  categoryId: string;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  difficulty: Difficulty;
  description: string;
  topics: string[];
}
