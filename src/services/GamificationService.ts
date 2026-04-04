/**
 * Gamification Service
 * Manages XP, levels, streaks, daily challenges, and rewards
 */

import { EventBus } from '../core/EventBus';

/**
 * XP rewards for different actions
 */
export const XP_REWARDS = {
  // Typing exercises
  lessonComplete: 50,
  lessonPerfect: 100, // 100% accuracy bonus
  practiceMinute: 5, // Per minute of practice

  // SRS reviews
  srsReviewCorrect: 10,
  srsReviewPerfect: 20, // Rating 5
  srsItemMastered: 50,

  // Terminal training
  terminalCommandCorrect: 15,
  terminalSessionComplete: 30,

  // Streaks
  dailyGoalComplete: 100,
  weekStreak: 200, // 7 days
  monthStreak: 500, // 30 days

  // Achievements
  achievementUnlock: 100,

  // Daily challenges
  dailyChallengeComplete: 150,
  dailyChallengePerfect: 250,
} as const;

/**
 * Level thresholds (cumulative XP)
 */
export const LEVEL_THRESHOLDS: readonly number[] = [
  0, // Level 1
  100, // Level 2
  300, // Level 3
  600, // Level 4
  1000, // Level 5
  1500, // Level 6
  2200, // Level 7
  3000, // Level 8
  4000, // Level 9
  5200, // Level 10
  6600, // Level 11
  8200, // Level 12
  10000, // Level 13
  12000, // Level 14
  14500, // Level 15
  17500, // Level 16
  21000, // Level 17
  25000, // Level 18
  30000, // Level 19
  36000, // Level 20
  // Add more as needed
];

/**
 * Daily challenge types
 */
export type ChallengeType =
  | 'speed' // Reach target WPM
  | 'accuracy' // Maintain accuracy threshold
  | 'endurance' // Practice for X minutes
  | 'srs_reviews' // Complete X SRS reviews
  | 'terminal' // Complete X terminal commands
  | 'perfect_streak' // Get X perfect answers in a row
  | 'new_items' // Learn X new items
  | 'combo'; // Multiple objectives

/**
 * Challenge difficulty
 */
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';

/**
 * Daily challenge definition
 */
export interface DailyChallenge {
  id: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  title: string;
  description: string;
  icon: string;

  // Requirements
  target: number;
  current: number;

  // Rewards
  xpReward: number;
  bonusXP?: number; // For completing within time limit

  // Time
  date: string; // ISO date
  expiresAt: string; // ISO datetime
  completedAt?: string; // ISO datetime

  // Status
  isCompleted: boolean;
  isPerfect: boolean; // Completed with bonus conditions
}

/**
 * Star rating (1-3 stars) based on performance
 */
export type StarRating = 1 | 2 | 3;

/**
 * Lesson result with star rating
 */
export interface LessonResult {
  lessonId: string;
  stars: StarRating;
  wpm: number;
  accuracy: number;
  completedAt: string;
  timeSpent: number; // in seconds
}

/**
 * Calculate star rating based on WPM and accuracy
 */
export function calculateStarRating(
  wpm: number,
  accuracy: number,
  targetWPM: number = 30,
  targetAccuracy: number = 90
): StarRating {
  // 3 stars: exceed targets by 20%+
  const exceeds = wpm >= targetWPM * 1.2 && accuracy >= Math.min(targetAccuracy + 5, 100);
  // 2 stars: meet or slightly exceed targets
  const meets = wpm >= targetWPM && accuracy >= targetAccuracy;
  // 1 star: completed but below targets

  if (exceeds) {
    return 3;
  }
  if (meets) {
    return 2;
  }
  return 1;
}

/**
 * User gamification data
 */
export interface GamificationData {
  // XP & Level
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;

  // Daily challenges
  challengesCompleted: number;
  perfectChallenges: number;
  currentChallenge: DailyChallenge | null;

  // Stats
  totalPracticeMinutes: number;
  totalReviews: number;
  totalLessonsCompleted: number;

  // XP History (last 30 days)
  xpHistory: Array<{ date: string; xp: number; actions: string[] }>;

  // Star ratings per lesson
  lessonResults: Record<string, LessonResult>;

  // Total stars earned
  totalStars: number;
  threeStarLessons: number;
}

/**
 * XP gain event
 */
export interface XPGainEvent {
  amount: number;
  reason: string;
  action: keyof typeof XP_REWARDS;
  timestamp: string;
  bonusMultiplier?: number;
}

// Storage key
const STORAGE_KEY = 'gamification_data';

/**
 * Gamification Service Class
 */
export class GamificationService {
  private data: GamificationData;
  private readonly listeners: Set<(data: GamificationData) => void> = new Set();

  constructor() {
    this.data = this.loadFromStorage();
  }

  /**
   * Load data from storage
   */
  private loadFromStorage(): GamificationData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as GamificationData;
      }
    } catch (error) {
      console.error('Error loading gamification data:', error);
    }

    // Default data
    return {
      totalXP: 0,
      currentLevel: 1,
      xpToNextLevel: LEVEL_THRESHOLDS[1],
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      challengesCompleted: 0,
      perfectChallenges: 0,
      currentChallenge: null,
      totalPracticeMinutes: 0,
      totalReviews: 0,
      totalLessonsCompleted: 0,
      xpHistory: [],
      lessonResults: {},
      totalStars: 0,
      threeStarLessons: 0,
    };
  }

  /**
   * Save data to storage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        EventBus.emit('ui:toast', {
          message: 'Storage full. Please export your data or clear old data in Settings.',
          type: 'error',
        });
      }
    }
  }

  /**
   * Notify listeners of data changes
   */
  private notify(): void {
    this.listeners.forEach(listener => listener(this.data));
  }

  /**
   * Subscribe to data changes
   */
  subscribe(listener: (data: GamificationData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current gamification data
   */
  getData(): GamificationData {
    return { ...this.data };
  }

  /**
   * Add XP and handle level ups
   */
  addXP(action: keyof typeof XP_REWARDS, bonusMultiplier: number = 1): XPGainEvent {
    const baseAmount = XP_REWARDS[action];
    const amount = Math.round(baseAmount * bonusMultiplier);
    const timestamp = new Date().toISOString();
    const today = timestamp.split('T')[0];

    // Add XP
    this.data.totalXP += amount;

    // Update XP history
    const todayHistory = this.data.xpHistory.find(h => h.date === today);
    if (todayHistory) {
      todayHistory.xp += amount;
      todayHistory.actions.push(action);
    } else {
      this.data.xpHistory.push({
        date: today,
        xp: amount,
        actions: [action],
      });
    }

    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
    this.data.xpHistory = this.data.xpHistory.filter(h => h.date >= cutoffDate);

    // Check for level up
    this.checkLevelUp();

    // Update streak
    this.updateStreak();

    // Update challenge progress
    this.updateChallengeProgress(action);

    this.saveToStorage();
    this.notify();

    return {
      amount,
      reason: this.getActionDescription(action),
      action,
      timestamp,
      bonusMultiplier: bonusMultiplier > 1 ? bonusMultiplier : undefined,
    };
  }

  /**
   * Check and handle level up
   */
  private checkLevelUp(): void {
    let newLevel = 1;

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (this.data.totalXP >= LEVEL_THRESHOLDS[i]) {
        newLevel = i + 1;
      } else {
        break;
      }
    }

    if (newLevel > this.data.currentLevel) {
      this.data.currentLevel = newLevel;
      EventBus.emit('user:levelup', { level: newLevel, xp: this.data.totalXP });
    }

    // Calculate XP to next level
    const nextLevelIndex = Math.min(newLevel, LEVEL_THRESHOLDS.length - 1);
    const nextThreshold = LEVEL_THRESHOLDS[nextLevelIndex];
    this.data.xpToNextLevel = nextThreshold - this.data.totalXP;
  }

  /**
   * Update streak
   */
  private updateStreak(): void {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (this.data.lastActivityDate === today) {
      // Already active today
      return;
    }

    if (this.data.lastActivityDate === yesterdayStr) {
      // Continuing streak
      this.data.currentStreak++;
    } else if (this.data.lastActivityDate !== today) {
      // Streak broken or first activity
      this.data.currentStreak = 1;
    }

    this.data.lastActivityDate = today;

    // Update longest streak
    if (this.data.currentStreak > this.data.longestStreak) {
      this.data.longestStreak = this.data.currentStreak;
    }

    // Award streak bonuses
    if (this.data.currentStreak === 7) {
      this.addXP('weekStreak');
    } else if (this.data.currentStreak === 30) {
      this.addXP('monthStreak');
    }
  }

  /**
   * Get action description
   */
  private getActionDescription(action: keyof typeof XP_REWARDS): string {
    const descriptions: Record<keyof typeof XP_REWARDS, string> = {
      lessonComplete: 'Lektion abgeschlossen',
      lessonPerfect: 'Perfekte Lektion',
      practiceMinute: 'Übungsminute',
      srsReviewCorrect: 'SRS Review korrekt',
      srsReviewPerfect: 'Perfekter SRS Review',
      srsItemMastered: 'Item gemeistert',
      terminalCommandCorrect: 'Terminal Befehl korrekt',
      terminalSessionComplete: 'Terminal Session abgeschlossen',
      dailyGoalComplete: 'Tagesziel erreicht',
      weekStreak: '7-Tage Streak',
      monthStreak: '30-Tage Streak',
      achievementUnlock: 'Achievement freigeschaltet',
      dailyChallengeComplete: 'Daily Challenge abgeschlossen',
      dailyChallengePerfect: 'Perfekte Daily Challenge',
    };
    return descriptions[action];
  }

  /**
   * Generate daily challenge
   */
  generateDailyChallenge(): DailyChallenge {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    // If we already have a challenge for today, return it
    if (this.data.currentChallenge?.date === dateStr) {
      return this.data.currentChallenge;
    }

    // Generate new challenge based on day of week
    const dayOfWeek = today.getDay();
    const challenges = this.getChallengePool();

    // Use day of week and date as seed for consistent daily challenge
    const seed = parseInt(dateStr.replace(/-/g, ''), 10);
    const challengeIndex = seed % challenges.length;
    const template = challenges[challengeIndex];

    // Set expiry to end of day
    const expiry = new Date(today);
    expiry.setHours(23, 59, 59, 999);

    const challenge: DailyChallenge = {
      id: `challenge_${dateStr}`,
      type: template.type,
      difficulty: this.getDifficultyForDay(dayOfWeek),
      title: template.title,
      description: template.description,
      icon: template.icon,
      target: template.target,
      current: 0,
      xpReward: template.xpReward,
      bonusXP: template.bonusXP,
      date: dateStr,
      expiresAt: expiry.toISOString(),
      isCompleted: false,
      isPerfect: false,
    };

    this.data.currentChallenge = challenge;
    this.saveToStorage();
    this.notify();

    return challenge;
  }

  /**
   * Get challenge pool based on available features
   */
  private getChallengePool(): Array<{
    type: ChallengeType;
    title: string;
    description: string;
    icon: string;
    target: number;
    xpReward: number;
    bonusXP?: number;
  }> {
    return [
      {
        type: 'srs_reviews',
        title: 'Review Marathon',
        description: 'Schließe 20 SRS Reviews ab',
        icon: 'brain',
        target: 20,
        xpReward: 150,
        bonusXP: 50,
      },
      {
        type: 'accuracy',
        title: 'Präzisionsmeister',
        description: 'Behalte 95% Genauigkeit bei 10 Reviews',
        icon: 'target',
        target: 10,
        xpReward: 150,
        bonusXP: 75,
      },
      {
        type: 'terminal',
        title: 'Terminal Experte',
        description: 'Löse 15 Terminal-Befehle korrekt',
        icon: 'terminal',
        target: 15,
        xpReward: 150,
        bonusXP: 50,
      },
      {
        type: 'new_items',
        title: 'Wissensdurst',
        description: 'Lerne 10 neue Items',
        icon: 'book',
        target: 10,
        xpReward: 150,
        bonusXP: 50,
      },
      {
        type: 'perfect_streak',
        title: 'Perfektionist',
        description: 'Erreiche 5 perfekte Antworten in Folge',
        icon: 'star',
        target: 5,
        xpReward: 150,
        bonusXP: 100,
      },
      {
        type: 'endurance',
        title: 'Ausdauer Training',
        description: 'Übe 15 Minuten am Stück',
        icon: 'clock',
        target: 15,
        xpReward: 150,
        bonusXP: 50,
      },
      {
        type: 'speed',
        title: 'Geschwindigkeitsrausch',
        description: 'Erreiche 50 WPM',
        icon: 'zap',
        target: 50,
        xpReward: 150,
        bonusXP: 50,
      },
    ];
  }

  /**
   * Get difficulty for day of week (weekends are harder)
   */
  private getDifficultyForDay(dayOfWeek: number): ChallengeDifficulty {
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'hard';
    }
    if (dayOfWeek === 5) {
      return 'medium';
    }
    return 'easy';
  }

  /**
   * Update challenge progress
   */
  private updateChallengeProgress(action: keyof typeof XP_REWARDS): void {
    if (!this.data.currentChallenge || this.data.currentChallenge.isCompleted) {
      return;
    }

    const challenge = this.data.currentChallenge;

    // Map actions to challenge types
    const actionChallengeMap: Partial<Record<keyof typeof XP_REWARDS, ChallengeType[]>> = {
      srsReviewCorrect: ['srs_reviews', 'accuracy'],
      srsReviewPerfect: ['srs_reviews', 'accuracy', 'perfect_streak'],
      terminalCommandCorrect: ['terminal'],
      lessonComplete: ['endurance'],
    };

    const applicableChallenges = actionChallengeMap[action];
    if (applicableChallenges?.includes(challenge.type)) {
      challenge.current++;

      if (challenge.current >= challenge.target) {
        this.completeChallenge();
      }
    }
  }

  /**
   * Manually update challenge progress (for external tracking)
   */
  updateChallenge(progress: number, isPerfect?: boolean): void {
    if (!this.data.currentChallenge || this.data.currentChallenge.isCompleted) {
      return;
    }

    this.data.currentChallenge.current = Math.min(progress, this.data.currentChallenge.target);

    if (this.data.currentChallenge.current >= this.data.currentChallenge.target) {
      this.completeChallenge(isPerfect);
    } else {
      this.saveToStorage();
      this.notify();
    }
  }

  /**
   * Complete the current challenge
   */
  private completeChallenge(isPerfect: boolean = false): void {
    if (!this.data.currentChallenge) {
      return;
    }

    this.data.currentChallenge.isCompleted = true;
    this.data.currentChallenge.isPerfect = isPerfect;
    this.data.currentChallenge.completedAt = new Date().toISOString();
    this.data.challengesCompleted++;

    if (isPerfect) {
      this.data.perfectChallenges++;
      this.addXP('dailyChallengePerfect');
    } else {
      this.addXP('dailyChallengeComplete');
    }

    this.saveToStorage();
    this.notify();
  }

  /**
   * Get XP progress to next level
   */
  getLevelProgress(): { current: number; max: number; percentage: number } {
    const currentLevelXP = LEVEL_THRESHOLDS[this.data.currentLevel - 1] ?? 0;
    const nextLevelXP = LEVEL_THRESHOLDS[this.data.currentLevel] ?? currentLevelXP + 1000;
    const levelRange = nextLevelXP - currentLevelXP;
    const currentProgress = this.data.totalXP - currentLevelXP;

    return {
      current: currentProgress,
      max: levelRange,
      percentage: Math.round((currentProgress / levelRange) * 100),
    };
  }

  /**
   * Get streak bonus multiplier
   */
  getStreakMultiplier(): number {
    const streak = this.data.currentStreak;
    if (streak >= 30) {
      return 2.0;
    }
    if (streak >= 14) {
      return 1.5;
    }
    if (streak >= 7) {
      return 1.25;
    }
    if (streak >= 3) {
      return 1.1;
    }
    return 1.0;
  }

  /**
   * Get today's XP
   */
  getTodayXP(): number {
    const today = new Date().toISOString().split('T')[0];
    const todayHistory = this.data.xpHistory.find(h => h.date === today);
    return todayHistory?.xp ?? 0;
  }

  /**
   * Get XP history for chart
   */
  getXPHistory(days: number = 7): Array<{ date: string; xp: number }> {
    const result: Array<{ date: string; xp: number }> = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const history = this.data.xpHistory.find(h => h.date === dateStr);
      result.push({
        date: dateStr,
        xp: history?.xp ?? 0,
      });
    }

    return result;
  }

  /**
   * Record lesson completion with star rating
   */
  recordLessonResult(
    lessonId: string,
    wpm: number,
    accuracy: number,
    timeSpent: number,
    targetWPM: number = 30,
    targetAccuracy: number = 90
  ): LessonResult {
    const stars = calculateStarRating(wpm, accuracy, targetWPM, targetAccuracy);
    const result: LessonResult = {
      lessonId,
      stars,
      wpm,
      accuracy,
      completedAt: new Date().toISOString(),
      timeSpent,
    };

    // Check if this is a new best for this lesson
    const previousResult = this.data.lessonResults[lessonId];
    const isNewBest = !previousResult || stars > previousResult.stars;

    if (isNewBest) {
      // Update stars count
      if (previousResult) {
        this.data.totalStars -= previousResult.stars;
        if (previousResult.stars === 3) {
          this.data.threeStarLessons--;
        }
      }
      this.data.totalStars += stars;
      if (stars === 3) {
        this.data.threeStarLessons++;
      }

      this.data.lessonResults[lessonId] = result;
    }

    // Always count as completed
    this.data.totalLessonsCompleted++;

    // Add XP based on stars
    if (stars === 3) {
      this.addXP('lessonPerfect', 1);
    } else {
      this.addXP('lessonComplete', 1);
    }

    this.saveToStorage();
    this.notify();

    return result;
  }

  /**
   * Get lesson result by ID
   */
  getLessonResult(lessonId: string): LessonResult | undefined {
    return this.data.lessonResults[lessonId];
  }

  /**
   * Get star rating for a lesson (0 if not completed)
   */
  getLessonStars(lessonId: string): number {
    return this.data.lessonResults[lessonId]?.stars ?? 0;
  }

  /**
   * Get all lesson results
   */
  getAllLessonResults(): Record<string, LessonResult> {
    return { ...this.data.lessonResults };
  }

  /**
   * Get star statistics
   */
  getStarStats(): { total: number; threeStars: number; completed: number } {
    return {
      total: this.data.totalStars,
      threeStars: this.data.threeStarLessons,
      completed: Object.keys(this.data.lessonResults).length,
    };
  }

  /**
   * Reset all data (for testing)
   */
  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.loadFromStorage();
    this.notify();
  }
}

// Singleton instance
export const gamificationService = new GamificationService();
