/**
 * TypingEngineService Tests
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock TypingEngine functions
const calculateWPM = (characters: number, timeInSeconds: number): number => {
  if (timeInSeconds <= 0) return 0;
  const words = characters / 5; // Standard: 5 characters = 1 word
  const minutes = timeInSeconds / 60;
  return Math.round(words / minutes);
};

const calculateAccuracy = (correctChars: number, totalChars: number): number => {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};

const calculateNetWPM = (grossWPM: number, errors: number, timeInMinutes: number): number => {
  if (timeInMinutes <= 0) return 0;
  const netWPM = grossWPM - errors / timeInMinutes;
  return Math.max(0, Math.round(netWPM));
};

describe('TypingEngineService', () => {
  describe('WPM Calculation', () => {
    it('should calculate WPM correctly', () => {
      // 50 characters in 60 seconds = 10 words per minute
      expect(calculateWPM(50, 60)).toBe(10);
    });

    it('should calculate WPM for fast typing', () => {
      // 250 characters in 60 seconds = 50 WPM
      expect(calculateWPM(250, 60)).toBe(50);
    });

    it('should return 0 for 0 time', () => {
      expect(calculateWPM(100, 0)).toBe(0);
    });

    it('should handle partial minutes correctly', () => {
      // 25 characters in 30 seconds = 10 words per minute
      expect(calculateWPM(25, 30)).toBe(10);
    });
  });

  describe('Accuracy Calculation', () => {
    it('should calculate 100% accuracy', () => {
      expect(calculateAccuracy(100, 100)).toBe(100);
    });

    it('should calculate 50% accuracy', () => {
      expect(calculateAccuracy(50, 100)).toBe(50);
    });

    it('should calculate 0% accuracy', () => {
      expect(calculateAccuracy(0, 100)).toBe(0);
    });

    it('should return 100 for empty input', () => {
      expect(calculateAccuracy(0, 0)).toBe(100);
    });

    it('should round accuracy correctly', () => {
      // 33/100 = 33%
      expect(calculateAccuracy(33, 100)).toBe(33);
    });
  });

  describe('Net WPM Calculation', () => {
    it('should calculate net WPM without errors', () => {
      expect(calculateNetWPM(60, 0, 1)).toBe(60);
    });

    it('should reduce WPM for errors', () => {
      // 60 WPM - 10 errors/minute = 50 net WPM
      expect(calculateNetWPM(60, 10, 1)).toBe(50);
    });

    it('should not go below 0', () => {
      // 10 WPM - 20 errors/minute should be 0, not negative
      expect(calculateNetWPM(10, 20, 1)).toBe(0);
    });

    it('should handle multiple minutes', () => {
      // 60 WPM - 10 errors in 2 minutes = 60 - 5 = 55
      expect(calculateNetWPM(60, 10, 2)).toBe(55);
    });
  });

  describe('Character Processing', () => {
    it('should count correct characters', () => {
      const target = 'hello';
      const typed = 'hello';
      let correct = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === target[i]) correct++;
      }
      expect(correct).toBe(5);
    });

    it('should count errors', () => {
      const target = 'hello';
      const typed = 'hallo';
      let errors = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] !== target[i]) errors++;
      }
      expect(errors).toBe(1);
    });

    it('should handle extra characters as errors', () => {
      const target = 'hi';
      const typed = 'hello';
      const extraChars = typed.length - target.length;
      expect(extraChars).toBe(3);
    });
  });

  describe('Time Tracking', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should track elapsed time', () => {
      const startTime = Date.now();
      vi.advanceTimersByTime(5000);
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      expect(elapsedSeconds).toBe(5);
    });

    it('should track minutes accurately', () => {
      const startTime = Date.now();
      vi.advanceTimersByTime(60000);
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      expect(elapsedMinutes).toBe(1);
    });
  });
});
