import { LessonType } from '../../domain/enums';
import { Lesson, LessonCategory, ProgrammingLesson, ShortcutLesson } from '../../domain/models';
import {
  COMPLEX_TEXTS,
  EXPERT_TEXTS,
  MEDIUM_TEXTS,
  MICRO_EXERCISES,
  PracticeText,
  SIMPLE_TEXTS,
} from '../practiceTexts';
import { practiceTextsToExercises } from './utils';
import { MICRO_LESSONS } from './micro';
import { PRACTICE_TEXT_LESSONS } from './practice-text';
import { BEGINNER_LESSONS } from './beginner';
import { BASIC_LESSONS } from './basic';
import { INTERMEDIATE_LESSONS } from './intermediate';
import { WORD_LESSONS } from './word';
import { ADVANCED_LESSONS } from './advanced';
import { EXPERT_LESSONS } from './expert';
import { PROGRAMMING_LESSONS } from './programming';
import { SHORTCUT_LESSONS } from './shortcut';

/**
 * ============================================================================
 * COMBINED EXPORTS
 * ============================================================================
 */

/**
 * All lessons combined (including new micro and practice lessons)
 */
export const ALL_LESSONS: Lesson[] = [
  ...MICRO_LESSONS,
  ...BEGINNER_LESSONS,
  ...BASIC_LESSONS,
  ...INTERMEDIATE_LESSONS,
  ...WORD_LESSONS,
  ...ADVANCED_LESSONS,
  ...EXPERT_LESSONS,
  ...PRACTICE_TEXT_LESSONS,
  ...PROGRAMMING_LESSONS,
  ...SHORTCUT_LESSONS,
];

/**
 * Lesson categories
 */
export const LESSON_CATEGORIES: LessonCategory[] = [
  {
    id: 'micro',
    name: 'Mikro-Lektionen',
    description: 'Einzelne Tasten und kürzeste Übungen - Level 0',
    icon: '',
    lessonIds: MICRO_LESSONS.map(l => l.id),
  },
  {
    id: 'beginner',
    name: 'Anfänger',
    description: 'Absolute Grundlagen - nur Grundreihe',
    icon: '',
    lessonIds: BEGINNER_LESSONS.map(l => l.id),
  },
  {
    id: 'basics',
    name: 'Grundlagen',
    description: 'Alle Buchstaben und erste Sätze',
    icon: '',
    lessonIds: BASIC_LESSONS.map(l => l.id),
  },
  {
    id: 'intermediate',
    name: 'Fortgeschritten',
    description: 'Zahlen und Sonderzeichen',
    icon: '',
    lessonIds: INTERMEDIATE_LESSONS.map(l => l.id),
  },
  {
    id: 'words',
    name: 'Wörter & Sätze',
    description: 'Wortschatz und Textübungen',
    icon: '',
    lessonIds: WORD_LESSONS.map(l => l.id),
  },
  {
    id: 'advanced',
    name: 'Fortgeschritten+',
    description: 'Komplexe Texte und alle Zeichen',
    icon: '',
    lessonIds: ADVANCED_LESSONS.map(l => l.id),
  },
  {
    id: 'expert',
    name: 'Experte',
    description: 'Maximale Herausforderung',
    icon: '',
    lessonIds: EXPERT_LESSONS.map(l => l.id),
  },
  {
    id: 'programming',
    name: 'Programmierung',
    description: 'Code-Snippets in verschiedenen Sprachen',
    icon: '',
    lessonIds: PROGRAMMING_LESSONS.map(l => l.id),
  },
  {
    id: 'shortcuts',
    name: 'IDE Shortcuts',
    description: 'Tastenkürzel für VS Code, IntelliJ, Vim',
    icon: '',
    lessonIds: SHORTCUT_LESSONS.map(l => l.id),
  },
  {
    id: 'practice',
    name: 'Übungstexte (DE/EN)',
    description: 'Zweisprachige Texte von einfach bis Experte',
    icon: '',
    lessonIds: PRACTICE_TEXT_LESSONS.map(l => l.id),
  },
];

/**
 * ============================================================================
 * HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * Get lesson by ID
 */
export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find(lesson => lesson.id === id);
}

/**
 * Get lessons by category
 */
export function getLessonsByCategory(categoryId: string): Lesson[] {
  return ALL_LESSONS.filter(lesson => lesson.category === categoryId);
}

/**
 * Get lessons by type
 */
export function getLessonsByType(type: LessonType): Lesson[] {
  return ALL_LESSONS.filter(lesson => lesson.type === type);
}

/**
 * Get lessons by level
 */
export function getLessonsByLevel(level: number): Lesson[] {
  return ALL_LESSONS.filter(lesson => lesson.level === level);
}

/**
 * Get lessons by level range
 */
export function getLessonsByLevelRange(minLevel: number, maxLevel: number): Lesson[] {
  return ALL_LESSONS.filter(lesson => lesson.level >= minLevel && lesson.level <= maxLevel);
}

/**
 * Get lessons by difficulty (based on level)
 */
export function getLessonsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
): Lesson[] {
  switch (difficulty) {
    case 'beginner':
      return getLessonsByLevelRange(1, 2);
    case 'intermediate':
      return getLessonsByLevelRange(3, 4);
    case 'advanced':
      return getLessonsByLevelRange(5, 5);
    case 'expert':
      return getLessonsByLevelRange(6, 10);
    default:
      return ALL_LESSONS;
  }
}

/**
 * Get next lesson for user progress
 */
export function getNextLesson(completedLessonIds: string[]): Lesson | undefined {
  return ALL_LESSONS.find(lesson => !completedLessonIds.includes(lesson.id));
}

/**
 * Get programming lessons by language
 */
export function getProgrammingLessonsByLanguage(
  language: ProgrammingLesson['programmingLanguage']
): ProgrammingLesson[] {
  return PROGRAMMING_LESSONS.filter(lesson => lesson.programmingLanguage === language);
}

/**
 * Get shortcut lessons by IDE
 */
export function getShortcutLessonsByIDE(ide: ShortcutLesson['ide']): ShortcutLesson[] {
  return SHORTCUT_LESSONS.filter(lesson => lesson.ide === ide);
}

/**
 * Get random exercises from a lesson
 */
export function getRandomExercises(lesson: Lesson, count: number): typeof lesson.exercises {
  const shuffled = [...lesson.exercises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get total exercise count
 */
export function getTotalExerciseCount(): number {
  return ALL_LESSONS.reduce((sum, lesson) => sum + lesson.exercises.length, 0);
}

/**
 * Get statistics about lessons
 */
export function getLessonStats(): {
  totalLessons: number;
  totalExercises: number;
  byLevel: Record<number, number>;
  byCategory: Record<string, number>;
} {
  const stats = {
    totalLessons: ALL_LESSONS.length,
    totalExercises: getTotalExerciseCount(),
    byLevel: {} as Record<number, number>,
    byCategory: {} as Record<string, number>,
  };

  ALL_LESSONS.forEach(lesson => {
    stats.byLevel[lesson.level] = (stats.byLevel[lesson.level] || 0) + 1;
    stats.byCategory[lesson.category] = (stats.byCategory[lesson.category] || 0) + 1;
  });

  return stats;
}

/**
 * Mapping of lesson IDs to their PracticeText source for language-dependent exercises
 */
const LESSON_PRACTICE_TEXT_MAP: Record<string, { texts: PracticeText[] }> = {
  'micro-single-keys': { texts: MICRO_EXERCISES.slice(0, 7) },
  'micro-two-letter-same': { texts: MICRO_EXERCISES.slice(7, 11) },
  'micro-two-letter-alt': { texts: MICRO_EXERCISES.slice(11, 15) },
  'micro-short-words': { texts: MICRO_EXERCISES.slice(15, 23) },
  'micro-vowels-ei': { texts: MICRO_EXERCISES.slice(23, 30) },
  'practice-simple-de': { texts: SIMPLE_TEXTS },
  'practice-simple-en': { texts: SIMPLE_TEXTS },
  'practice-medium-de': { texts: MEDIUM_TEXTS },
  'practice-medium-en': { texts: MEDIUM_TEXTS },
  'practice-complex-de': { texts: COMPLEX_TEXTS },
  'practice-complex-en': { texts: COMPLEX_TEXTS },
  'practice-expert-de': { texts: EXPERT_TEXTS },
  'practice-expert-en': { texts: EXPERT_TEXTS },
};

/**
 * Get a lesson with exercises in the specified language
 * @param id - Lesson ID
 * @param language - Target language for exercises ('de' or 'en')
 * @returns Lesson with localized exercises, or undefined if not found
 */
export function getLessonWithLanguage(id: string, language: 'de' | 'en'): Lesson | undefined {
  const lesson = getLessonById(id);
  if (!lesson) {
    return undefined;
  }

  // Check if this lesson has practice texts that need language transformation
  const practiceTextSource = LESSON_PRACTICE_TEXT_MAP[id];
  if (practiceTextSource) {
    // Transform exercises using the specified language
    const localizedExercises = practiceTextsToExercises(practiceTextSource.texts, language);
    return {
      ...lesson,
      exercises: localizedExercises,
    };
  }

  // Return original lesson if no transformation needed
  return lesson;
}

// ============================================================================
// Barrel re-exports
// ============================================================================
export { practiceTextsToExercises } from './utils';
export { MICRO_LESSONS } from './micro';
export { PRACTICE_TEXT_LESSONS } from './practice-text';
export { BEGINNER_LESSONS } from './beginner';
export { BASIC_LESSONS } from './basic';
export { INTERMEDIATE_LESSONS } from './intermediate';
export { WORD_LESSONS } from './word';
export { ADVANCED_LESSONS } from './advanced';
export { EXPERT_LESSONS } from './expert';
export { PROGRAMMING_LESSONS } from './programming';
export { SHORTCUT_LESSONS } from './shortcut';
