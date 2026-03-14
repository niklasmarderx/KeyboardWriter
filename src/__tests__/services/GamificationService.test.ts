/**
 * GamificationService Tests
 */
import { describe, expect, it } from 'vitest';

// Mock XP and Level calculations
const XP_PER_LEVEL = 1000;

const calculateLevel = (totalXP: number): number => {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
};

const calculateXPForNextLevel = (currentLevel: number): number => {
  return currentLevel * XP_PER_LEVEL;
};

const calculateXPProgress = (totalXP: number): number => {
  return totalXP % XP_PER_LEVEL;
};

const calculateXPFromSession = (wpm: number, accuracy: number, timeSeconds: number): number => {
  // Base XP from time spent
  const timeXP = Math.floor(timeSeconds / 10);

  // Bonus XP for speed
  const speedBonus = wpm >= 60 ? 20 : wpm >= 40 ? 10 : 0;

  // Bonus XP for accuracy
  const accuracyBonus = accuracy >= 95 ? 15 : accuracy >= 90 ? 10 : 0;

  return timeXP + speedBonus + accuracyBonus;
};

// Mock Achievement System
interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  type: 'wpm' | 'accuracy' | 'lessons' | 'streak';
}

const achievements: Achievement[] = [
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Reach 60 WPM',
    requirement: 60,
    type: 'wpm',
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: '100% accuracy',
    requirement: 100,
    type: 'accuracy',
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Complete 10 lessons',
    requirement: 10,
    type: 'lessons',
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: '7 day streak',
    requirement: 7,
    type: 'streak',
  },
];

const checkAchievement = (achievement: Achievement, value: number): boolean => {
  return value >= achievement.requirement;
};

describe('GamificationService', () => {
  describe('XP Calculation', () => {
    it('should calculate XP from typing session', () => {
      // 30 seconds, 50 WPM, 92% accuracy
      const xp = calculateXPFromSession(50, 92, 30);
      // 3 (time) + 10 (speed) + 10 (accuracy) = 23
      expect(xp).toBe(23);
    });

    it('should give maximum bonus for excellent performance', () => {
      const xp = calculateXPFromSession(70, 98, 60);
      // 6 (time) + 20 (speed) + 15 (accuracy) = 41
      expect(xp).toBe(41);
    });

    it('should give no bonus for poor performance', () => {
      const xp = calculateXPFromSession(20, 80, 30);
      // 3 (time) + 0 (speed) + 0 (accuracy) = 3
      expect(xp).toBe(3);
    });
  });

  describe('Level Calculation', () => {
    it('should start at level 1', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('should level up at 1000 XP', () => {
      expect(calculateLevel(1000)).toBe(2);
    });

    it('should calculate correct level for high XP', () => {
      expect(calculateLevel(5500)).toBe(6);
    });

    it('should calculate XP needed for next level', () => {
      expect(calculateXPForNextLevel(1)).toBe(1000);
      expect(calculateXPForNextLevel(5)).toBe(5000);
    });

    it('should calculate XP progress within current level', () => {
      expect(calculateXPProgress(500)).toBe(500);
      expect(calculateXPProgress(1500)).toBe(500);
      expect(calculateXPProgress(2000)).toBe(0);
    });
  });

  describe('Achievement System', () => {
    it('should unlock speed achievement', () => {
      const speedAchievement = achievements.find(a => a.id === 'speed-demon')!;
      expect(checkAchievement(speedAchievement, 65)).toBe(true);
      expect(checkAchievement(speedAchievement, 50)).toBe(false);
    });

    it('should unlock perfectionist achievement', () => {
      const accuracyAchievement = achievements.find(a => a.id === 'perfectionist')!;
      expect(checkAchievement(accuracyAchievement, 100)).toBe(true);
      expect(checkAchievement(accuracyAchievement, 99)).toBe(false);
    });

    it('should unlock lesson completion achievement', () => {
      const lessonAchievement = achievements.find(a => a.id === 'dedicated')!;
      expect(checkAchievement(lessonAchievement, 15)).toBe(true);
      expect(checkAchievement(lessonAchievement, 5)).toBe(false);
    });

    it('should unlock streak achievement', () => {
      const streakAchievement = achievements.find(a => a.id === 'streak-master')!;
      expect(checkAchievement(streakAchievement, 7)).toBe(true);
      expect(checkAchievement(streakAchievement, 3)).toBe(false);
    });
  });

  describe('Streak System', () => {
    it('should track daily streak', () => {
      const lastPracticeDate = new Date('2026-03-13');
      const today = new Date('2026-03-14');
      const diffDays = Math.floor(
        (today.getTime() - lastPracticeDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(diffDays).toBe(1);
    });

    it('should break streak after missing a day', () => {
      const lastPracticeDate = new Date('2026-03-12');
      const today = new Date('2026-03-14');
      const diffDays = Math.floor(
        (today.getTime() - lastPracticeDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(diffDays).toBeGreaterThan(1);
    });

    it('should not increment streak for same day', () => {
      const lastPracticeDate = new Date('2026-03-14');
      const today = new Date('2026-03-14');
      const diffDays = Math.floor(
        (today.getTime() - lastPracticeDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(diffDays).toBe(0);
    });
  });
});
