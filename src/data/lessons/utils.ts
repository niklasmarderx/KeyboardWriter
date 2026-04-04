import { PracticeText } from '../practiceTexts';

/**
 * Helper function to convert PracticeText to Lesson exercises
 */
export function practiceTextsToExercises(
  texts: PracticeText[],
  language: 'de' | 'en' = 'de'
): Array<{ id: string; text: string; description: string }> {
  return texts.map(t => ({
    id: t.id,
    text: language === 'de' ? t.textDe : t.textEn,
    description: t.description || `Level ${t.level} - ${t.category}`,
  }));
}
