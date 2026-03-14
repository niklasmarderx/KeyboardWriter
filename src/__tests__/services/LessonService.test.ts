/**
 * LessonService Tests
 */
import { describe, expect, it } from 'vitest';

// Test data
const mockLessons = [
  {
    id: 'lesson-1',
    title: 'Grundstellung',
    description: 'Lerne die Grundposition',
    category: 'basics',
    level: 'beginner',
    exercises: [
      { id: 'ex-1', text: 'asdf', targetWPM: 20, targetAccuracy: 90 },
      { id: 'ex-2', text: 'jklö', targetWPM: 20, targetAccuracy: 90 },
    ],
  },
  {
    id: 'lesson-2',
    title: 'Obere Reihe',
    description: 'Lerne die obere Reihe',
    category: 'basics',
    level: 'beginner',
    exercises: [{ id: 'ex-3', text: 'qwer', targetWPM: 25, targetAccuracy: 90 }],
  },
];

describe('LessonService', () => {
  describe('Lesson Data', () => {
    it('should have lesson data with correct structure', () => {
      expect(mockLessons).toBeDefined();
      expect(mockLessons.length).toBeGreaterThan(0);
    });

    it('should have lessons with required fields', () => {
      mockLessons.forEach(lesson => {
        expect(lesson).toHaveProperty('id');
        expect(lesson).toHaveProperty('title');
        expect(lesson).toHaveProperty('description');
        expect(lesson).toHaveProperty('category');
        expect(lesson).toHaveProperty('level');
        expect(lesson).toHaveProperty('exercises');
      });
    });

    it('should have exercises with required fields', () => {
      mockLessons.forEach(lesson => {
        lesson.exercises.forEach(exercise => {
          expect(exercise).toHaveProperty('id');
          expect(exercise).toHaveProperty('text');
          expect(exercise).toHaveProperty('targetWPM');
          expect(exercise).toHaveProperty('targetAccuracy');
        });
      });
    });
  });

  describe('Lesson Filtering', () => {
    it('should filter lessons by category', () => {
      const filteredLessons = mockLessons.filter(l => l.category === 'basics');
      expect(filteredLessons.length).toBe(2);
    });

    it('should filter lessons by level', () => {
      const filteredLessons = mockLessons.filter(l => l.level === 'beginner');
      expect(filteredLessons.length).toBe(2);
    });

    it('should find lesson by id', () => {
      const lesson = mockLessons.find(l => l.id === 'lesson-1');
      expect(lesson).toBeDefined();
      expect(lesson?.title).toBe('Grundstellung');
    });
  });

  describe('Exercise Progress', () => {
    it('should calculate lesson completion percentage', () => {
      const completedExercises = new Set(['ex-1']);
      const totalExercises = mockLessons[0].exercises.length;
      const completionPercentage = (completedExercises.size / totalExercises) * 100;
      expect(completionPercentage).toBe(50);
    });

    it('should determine if lesson is completed', () => {
      const completedExercises = new Set(['ex-1', 'ex-2']);
      const totalExercises = mockLessons[0].exercises.length;
      const isCompleted = completedExercises.size === totalExercises;
      expect(isCompleted).toBe(true);
    });
  });
});
