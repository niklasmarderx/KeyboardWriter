import { LessonType } from '../../domain/enums';
import { Lesson } from '../../domain/models';
import { COMPLEX_TEXTS, EXPERT_TEXTS, MEDIUM_TEXTS, SIMPLE_TEXTS } from '../practiceTexts';
import { practiceTextsToExercises } from './utils';

/**
 * ============================================================================
 * PRACTICE TEXT LESSONS - Bilingual exercises from practiceTexts.ts
 * ============================================================================
 */
export const PRACTICE_TEXT_LESSONS: Lesson[] = [
  // Simple texts - German
  {
    id: 'practice-simple-de',
    title: 'Einfache Sätze (Deutsch)',
    description: 'Kurze, einfache Sätze für Anfänger',
    type: LessonType.WORDS,
    category: 'practice',
    level: 1,
    targetWPM: 20,
    targetAccuracy: 90,
    exercises: practiceTextsToExercises(SIMPLE_TEXTS, 'de'),
  },
  // Simple texts - English
  {
    id: 'practice-simple-en',
    title: 'Simple Sentences (English)',
    description: 'Short, simple sentences for beginners',
    type: LessonType.WORDS,
    category: 'practice',
    level: 1,
    targetWPM: 20,
    targetAccuracy: 90,
    exercises: practiceTextsToExercises(SIMPLE_TEXTS, 'en'),
  },
  // Medium texts - German
  {
    id: 'practice-medium-de',
    title: 'Mittlere Sätze (Deutsch)',
    description: 'Sprichwörter, Alltagssituationen, Arbeit',
    type: LessonType.WORDS,
    category: 'practice',
    level: 3,
    targetWPM: 30,
    targetAccuracy: 88,
    exercises: practiceTextsToExercises(MEDIUM_TEXTS, 'de'),
  },
  // Medium texts - English
  {
    id: 'practice-medium-en',
    title: 'Medium Sentences (English)',
    description: 'Proverbs, everyday situations, work',
    type: LessonType.WORDS,
    category: 'practice',
    level: 3,
    targetWPM: 30,
    targetAccuracy: 88,
    exercises: practiceTextsToExercises(MEDIUM_TEXTS, 'en'),
  },
  // Complex texts - German
  {
    id: 'practice-complex-de',
    title: 'Komplexe Texte (Deutsch)',
    description: 'Zitate, Business, Technologie, Wissenschaft',
    type: LessonType.WORDS,
    category: 'practice',
    level: 5,
    targetWPM: 40,
    targetAccuracy: 85,
    exercises: practiceTextsToExercises(COMPLEX_TEXTS, 'de'),
  },
  // Complex texts - English
  {
    id: 'practice-complex-en',
    title: 'Complex Texts (English)',
    description: 'Quotes, business, technology, science',
    type: LessonType.WORDS,
    category: 'practice',
    level: 5,
    targetWPM: 40,
    targetAccuracy: 85,
    exercises: practiceTextsToExercises(COMPLEX_TEXTS, 'en'),
  },
  // Expert texts - German
  {
    id: 'practice-expert-de',
    title: 'Experten-Texte (Deutsch)',
    description: 'Technische Dokumentation, Rechtliches, Wissenschaft',
    type: LessonType.WORDS,
    category: 'practice',
    level: 6,
    targetWPM: 35,
    targetAccuracy: 88,
    exercises: practiceTextsToExercises(EXPERT_TEXTS, 'de'),
  },
  // Expert texts - English
  {
    id: 'practice-expert-en',
    title: 'Expert Texts (English)',
    description: 'Technical documentation, legal, scientific',
    type: LessonType.WORDS,
    category: 'practice',
    level: 6,
    targetWPM: 35,
    targetAccuracy: 88,
    exercises: practiceTextsToExercises(EXPERT_TEXTS, 'en'),
  },
];
