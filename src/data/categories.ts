import type {Category} from '../types/category';

export const CATEGORIES: Category[] = [
  {
    id: 'general-knowledge',
    name: 'General Knowledge',
    emoji: '🌍',
    description: 'Current affairs, history, geography and more',
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    emoji: '➗',
    description: 'Arithmetic, algebra, geometry and data',
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    emoji: '🧩',
    description: 'Logic, puzzles and pattern recognition',
  },
  {
    id: 'english',
    name: 'English',
    emoji: '📖',
    description: 'Grammar, vocabulary and comprehension',
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    emoji: '💻',
    description: 'Programming, networks and fundamentals',
  },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(category => category.id === id);
}

/** Keeps only known ids, in the standard category order. */
export function sanitizeCategoryIds(ids: string[]): string[] {
  return CATEGORIES.filter(category => ids.includes(category.id)).map(
    category => category.id,
  );
}
