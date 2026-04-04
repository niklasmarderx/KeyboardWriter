import { LessonType } from '../../domain/enums';
import { Lesson } from '../../domain/models';
import { MICRO_EXERCISES } from '../practiceTexts';
import { practiceTextsToExercises } from './utils';

/**
 * ============================================================================
 * MICRO LESSONS - Level 0 (Pre-Beginner / Absolute Anfänger)
 * Single keys, two-letter combinations - the most basic building blocks
 * ============================================================================
 */
export const MICRO_LESSONS: Lesson[] = [
  {
    id: 'micro-single-keys',
    title: 'Einzelne Tasten',
    description: 'Die allerersten Schritte - einzelne Tasten der Grundreihe',
    type: LessonType.BASICS,
    category: 'micro',
    level: 0,
    targetWPM: 5,
    targetAccuracy: 98,
    requiredKeys: ['f', 'j', 'd', 'k', 's', 'l', 'a'],
    exercises: practiceTextsToExercises(MICRO_EXERCISES.slice(0, 7)),
  },
  {
    id: 'micro-two-letter-same',
    title: 'Zwei-Buchstaben (gleiche Hand)',
    description: 'Kombinationen mit der gleichen Hand',
    type: LessonType.BASICS,
    category: 'micro',
    level: 0,
    targetWPM: 8,
    targetAccuracy: 95,
    requiredKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
    exercises: practiceTextsToExercises(MICRO_EXERCISES.slice(7, 11)),
  },
  {
    id: 'micro-two-letter-alt',
    title: 'Zwei-Buchstaben (Handwechsel)',
    description: 'Kombinationen mit Handwechsel - schneller tippen',
    type: LessonType.BASICS,
    category: 'micro',
    level: 0,
    targetWPM: 10,
    targetAccuracy: 95,
    requiredKeys: ['f', 'j', 'd', 'k', 's', 'l', 'a'],
    exercises: practiceTextsToExercises(MICRO_EXERCISES.slice(11, 15)),
  },
  {
    id: 'micro-short-words',
    title: 'Kürzeste Wörter',
    description: 'Zwei- und Drei-Buchstaben-Wörter',
    type: LessonType.BASICS,
    category: 'micro',
    level: 0,
    targetWPM: 10,
    targetAccuracy: 92,
    exercises: practiceTextsToExercises(MICRO_EXERCISES.slice(15, 23)),
  },
  {
    id: 'micro-vowels-ei',
    title: 'Vokale E und I',
    description: 'Die wichtigsten Vokale hinzufügen',
    type: LessonType.BASICS,
    category: 'micro',
    level: 0,
    targetWPM: 10,
    targetAccuracy: 92,
    requiredKeys: ['e', 'i'],
    exercises: practiceTextsToExercises(MICRO_EXERCISES.slice(23, 30)),
  },
];
