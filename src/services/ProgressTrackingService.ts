/**
 * Progress Tracking Service
 * Tracks learning time, session history, and provides progress visualization data
 */

import { ALL_LESSONS } from '../data/lessons';
// getLessonsByLevel available if needed for future features
import { Lesson } from '../domain/models';
import { gamificationService } from './GamificationService';

/**
 * Daily practice session record
 */
export interface DailySession {
  date: string; // ISO date (YYYY-MM-DD)
  totalMinutes: number;
  sessionsCount: number;
  lessonsCompleted: number;
  averageWPM: number;
  averageAccuracy: number;
  peakWPM: number;
}

/**
 * Weekly summary
 */
export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalMinutes: number;
  totalSessions: number;
  lessonsCompleted: number;
  averageWPM: number;
  averageAccuracy: number;
  improvement: {
    wpm: number; // difference from previous week
    accuracy: number;
  };
}

/**
 * Learning path node for visualization
 */
export interface LearningPathNode {
  lesson: Lesson;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  stars: 0 | 1 | 2 | 3;
  position: { x: number; y: number };
  connections: string[]; // IDs of connected lessons
  isCurrentFocus: boolean;
}

/**
 * Progress milestone
 */
export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: {
    type: 'lessons' | 'stars' | 'wpm' | 'accuracy' | 'time' | 'streak';
    target: number;
  };
  achieved: boolean;
  achievedAt?: string;
  xpReward: number;
}

/**
 * Performance comparison data
 */
export interface PerformanceComparison {
  period: 'week' | 'month' | 'allTime';
  current: {
    wpm: number;
    accuracy: number;
    practiceMinutes: number;
    lessonsCompleted: number;
  };
  previous: {
    wpm: number;
    accuracy: number;
    practiceMinutes: number;
    lessonsCompleted: number;
  };
  change: {
    wpm: number;
    wpmPercent: number;
    accuracy: number;
    accuracyPercent: number;
    practiceMinutes: number;
    practicePercent: number;
    lessonsCompleted: number;
  };
}

/**
 * Progress tracking data
 */
export interface ProgressData {
  dailySessions: Record<string, DailySession>;
  weeklyHistory: WeeklySummary[];
  milestones: Milestone[];
  totalPracticeMinutes: number;
  currentSessionStart: string | null;
  lastActivityDate: string | null;
  bestWPM: number;
  bestAccuracy: number;
  averageWPMHistory: Array<{ date: string; wpm: number }>;
  averageAccuracyHistory: Array<{ date: string; accuracy: number }>;
}

// Storage key
const STORAGE_KEY = 'progress_tracking_data';

// Default milestones
const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'first-lesson',
    title: 'Erster Schritt',
    description: 'Schließe deine erste Lektion ab',
    icon: 'rocket',
    requirement: { type: 'lessons', target: 1 },
    achieved: false,
    xpReward: 50,
  },
  {
    id: 'ten-lessons',
    title: 'Fleißiger Lerner',
    description: 'Schließe 10 Lektionen ab',
    icon: 'book',
    requirement: { type: 'lessons', target: 10 },
    achieved: false,
    xpReward: 100,
  },
  {
    id: 'fifty-lessons',
    title: 'Wissensdurstig',
    description: 'Schließe 50 Lektionen ab',
    icon: 'library',
    requirement: { type: 'lessons', target: 50 },
    achieved: false,
    xpReward: 250,
  },
  {
    id: 'first-star',
    title: 'Stern sammeln',
    description: 'Verdiene deinen ersten 3-Sterne-Abschluss',
    icon: 'star',
    requirement: { type: 'stars', target: 1 },
    achieved: false,
    xpReward: 75,
  },
  {
    id: 'ten-stars',
    title: 'Sternensammler',
    description: 'Verdiene 10x drei Sterne',
    icon: 'stars',
    requirement: { type: 'stars', target: 10 },
    achieved: false,
    xpReward: 150,
  },
  {
    id: 'wpm-30',
    title: 'Aufwärmphase',
    description: 'Erreiche 30 WPM',
    icon: 'speedometer',
    requirement: { type: 'wpm', target: 30 },
    achieved: false,
    xpReward: 100,
  },
  {
    id: 'wpm-50',
    title: 'Temporeich',
    description: 'Erreiche 50 WPM',
    icon: 'zap',
    requirement: { type: 'wpm', target: 50 },
    achieved: false,
    xpReward: 200,
  },
  {
    id: 'wpm-80',
    title: 'Blitzschnell',
    description: 'Erreiche 80 WPM',
    icon: 'lightning',
    requirement: { type: 'wpm', target: 80 },
    achieved: false,
    xpReward: 300,
  },
  {
    id: 'accuracy-95',
    title: 'Präzise',
    description: 'Erreiche 95% Genauigkeit',
    icon: 'target',
    requirement: { type: 'accuracy', target: 95 },
    achieved: false,
    xpReward: 150,
  },
  {
    id: 'accuracy-99',
    title: 'Perfektionist',
    description: 'Erreiche 99% Genauigkeit',
    icon: 'bullseye',
    requirement: { type: 'accuracy', target: 99 },
    achieved: false,
    xpReward: 250,
  },
  {
    id: 'time-60',
    title: 'Erste Stunde',
    description: 'Übe insgesamt 60 Minuten',
    icon: 'clock',
    requirement: { type: 'time', target: 60 },
    achieved: false,
    xpReward: 100,
  },
  {
    id: 'time-300',
    title: '5-Stunden-Marke',
    description: 'Übe insgesamt 5 Stunden',
    icon: 'hourglass',
    requirement: { type: 'time', target: 300 },
    achieved: false,
    xpReward: 200,
  },
  {
    id: 'time-1000',
    title: 'Ausdauer-Meister',
    description: 'Übe insgesamt 1000 Minuten',
    icon: 'trophy',
    requirement: { type: 'time', target: 1000 },
    achieved: false,
    xpReward: 500,
  },
  {
    id: 'streak-7',
    title: 'Wochenstreak',
    description: 'Übe 7 Tage in Folge',
    icon: 'fire',
    requirement: { type: 'streak', target: 7 },
    achieved: false,
    xpReward: 150,
  },
  {
    id: 'streak-30',
    title: 'Monatsstreak',
    description: 'Übe 30 Tage in Folge',
    icon: 'flame',
    requirement: { type: 'streak', target: 30 },
    achieved: false,
    xpReward: 400,
  },
];

/**
 * Progress Tracking Service Class
 */
export class ProgressTrackingService {
  private data: ProgressData;
  private readonly listeners: Set<(data: ProgressData) => void> = new Set();
  private sessionTimer: number | null = null;

  constructor() {
    this.data = this.loadFromStorage();
    this.initMilestones();
  }

  /**
   * Load data from storage
   */
  private loadFromStorage(): ProgressData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as ProgressData;
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
    return this.getDefaultData();
  }

  /**
   * Get default data structure
   */
  private getDefaultData(): ProgressData {
    return {
      dailySessions: {},
      weeklyHistory: [],
      milestones: DEFAULT_MILESTONES.map(m => ({ ...m })),
      totalPracticeMinutes: 0,
      currentSessionStart: null,
      lastActivityDate: null,
      bestWPM: 0,
      bestAccuracy: 0,
      averageWPMHistory: [],
      averageAccuracyHistory: [],
    };
  }

  /**
   * Initialize milestones (add any new ones)
   */
  private initMilestones(): void {
    const existingIds = new Set(this.data.milestones.map(m => m.id));
    for (const milestone of DEFAULT_MILESTONES) {
      if (!existingIds.has(milestone.id)) {
        this.data.milestones.push({ ...milestone });
      }
    }
    this.saveToStorage();
  }

  /**
   * Save data to storage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving progress data:', error);
    }
  }

  /**
   * Notify listeners
   */
  private notify(): void {
    this.listeners.forEach(listener => listener(this.data));
  }

  /**
   * Subscribe to changes
   */
  subscribe(listener: (data: ProgressData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current data
   */
  getData(): ProgressData {
    return { ...this.data };
  }

  /**
   * Start a practice session
   */
  startSession(): void {
    this.data.currentSessionStart = new Date().toISOString();
    this.saveToStorage();

    // Start timer to track session duration
    this.sessionTimer = window.setInterval(() => {
      this.updateSessionDuration();
    }, 60000); // Update every minute
  }

  /**
   * End current session
   */
  endSession(wpm?: number, accuracy?: number, lessonsCompleted: number = 0): void {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }

    if (!this.data.currentSessionStart) {
      return;
    }

    const sessionStart = new Date(this.data.currentSessionStart);
    const sessionEnd = new Date();
    const durationMinutes = Math.round((sessionEnd.getTime() - sessionStart.getTime()) / 60000);

    if (durationMinutes >= 1) {
      this.recordSession(durationMinutes, wpm ?? 0, accuracy ?? 0, lessonsCompleted);
    }

    this.data.currentSessionStart = null;
    this.saveToStorage();
    this.notify();
  }

  /**
   * Update session duration (called periodically)
   */
  private updateSessionDuration(): void {
    // Just updates the visual timer, actual recording happens on endSession
  }

  /**
   * Record a completed session
   */
  recordSession(
    durationMinutes: number,
    wpm: number,
    accuracy: number,
    lessonsCompleted: number = 0
  ): void {
    const today = new Date().toISOString().split('T')[0];

    // Get or create daily session
    if (!this.data.dailySessions[today]) {
      this.data.dailySessions[today] = {
        date: today,
        totalMinutes: 0,
        sessionsCount: 0,
        lessonsCompleted: 0,
        averageWPM: 0,
        averageAccuracy: 0,
        peakWPM: 0,
      };
    }

    const daily = this.data.dailySessions[today];

    // Update daily stats
    daily.totalMinutes += durationMinutes;
    daily.sessionsCount++;
    daily.lessonsCompleted += lessonsCompleted;

    // Update running averages
    const totalSessions = daily.sessionsCount;
    if (wpm > 0) {
      daily.averageWPM = Math.round((daily.averageWPM * (totalSessions - 1) + wpm) / totalSessions);
      daily.peakWPM = Math.max(daily.peakWPM, wpm);
    }
    if (accuracy > 0) {
      daily.averageAccuracy = Math.round(
        (daily.averageAccuracy * (totalSessions - 1) + accuracy) / totalSessions
      );
    }

    // Update global stats
    this.data.totalPracticeMinutes += durationMinutes;
    this.data.lastActivityDate = today;

    if (wpm > this.data.bestWPM) {
      this.data.bestWPM = wpm;
    }
    if (accuracy > this.data.bestAccuracy) {
      this.data.bestAccuracy = accuracy;
    }

    // Update history
    this.updateHistory(today, wpm, accuracy);

    // Check milestones
    this.checkMilestones(wpm, accuracy);

    // Update weekly summary
    this.updateWeeklySummary();

    this.saveToStorage();
    this.notify();
  }

  /**
   * Update WPM and accuracy history
   */
  private updateHistory(date: string, wpm: number, accuracy: number): void {
    // Keep last 90 days of history
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    const cutoff = cutoffDate.toISOString().split('T')[0];

    // Update WPM history
    if (wpm > 0) {
      const existingWPM = this.data.averageWPMHistory.find(h => h.date === date);
      if (existingWPM) {
        existingWPM.wpm = Math.round((existingWPM.wpm + wpm) / 2);
      } else {
        this.data.averageWPMHistory.push({ date, wpm: Math.round(wpm) });
      }
      this.data.averageWPMHistory = this.data.averageWPMHistory
        .filter(h => h.date >= cutoff)
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    // Update accuracy history
    if (accuracy > 0) {
      const existingAcc = this.data.averageAccuracyHistory.find(h => h.date === date);
      if (existingAcc) {
        existingAcc.accuracy = Math.round((existingAcc.accuracy + accuracy) / 2);
      } else {
        this.data.averageAccuracyHistory.push({ date, accuracy: Math.round(accuracy) });
      }
      this.data.averageAccuracyHistory = this.data.averageAccuracyHistory
        .filter(h => h.date >= cutoff)
        .sort((a, b) => a.date.localeCompare(b.date));
    }
  }

  /**
   * Check and update milestones
   */
  private checkMilestones(currentWPM: number, currentAccuracy: number): void {
    const gamificationData = gamificationService.getData();
    const starStats = gamificationService.getStarStats();

    for (const milestone of this.data.milestones) {
      if (milestone.achieved) {
        continue;
      }

      let achieved = false;

      switch (milestone.requirement.type) {
        case 'lessons':
          achieved = gamificationData.totalLessonsCompleted >= milestone.requirement.target;
          break;
        case 'stars':
          achieved = starStats.threeStars >= milestone.requirement.target;
          break;
        case 'wpm':
          achieved =
            currentWPM >= milestone.requirement.target ||
            this.data.bestWPM >= milestone.requirement.target;
          break;
        case 'accuracy':
          achieved =
            currentAccuracy >= milestone.requirement.target ||
            this.data.bestAccuracy >= milestone.requirement.target;
          break;
        case 'time':
          achieved = this.data.totalPracticeMinutes >= milestone.requirement.target;
          break;
        case 'streak':
          achieved =
            gamificationData.currentStreak >= milestone.requirement.target ||
            gamificationData.longestStreak >= milestone.requirement.target;
          break;
      }

      if (achieved) {
        milestone.achieved = true;
        milestone.achievedAt = new Date().toISOString();
        gamificationService.addXP('achievementUnlock', milestone.xpReward / 100);
      }
    }
  }

  /**
   * Update weekly summary
   */
  private updateWeeklySummary(): void {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    // Collect this week's sessions
    let totalMinutes = 0;
    let totalSessions = 0;
    let lessonsCompleted = 0;
    let wpmSum = 0;
    let accSum = 0;
    let daysWithData = 0;

    for (const [date, session] of Object.entries(this.data.dailySessions)) {
      if (date >= weekStartStr && date <= weekEndStr) {
        totalMinutes += session.totalMinutes;
        totalSessions += session.sessionsCount;
        lessonsCompleted += session.lessonsCompleted;
        if (session.averageWPM > 0) {
          wpmSum += session.averageWPM;
          daysWithData++;
        }
        if (session.averageAccuracy > 0) {
          accSum += session.averageAccuracy;
        }
      }
    }

    const avgWPM = daysWithData > 0 ? Math.round(wpmSum / daysWithData) : 0;
    const avgAcc = daysWithData > 0 ? Math.round(accSum / daysWithData) : 0;

    // Find or create this week's summary
    let weeklySummary = this.data.weeklyHistory.find(w => w.weekStart === weekStartStr);

    // Get previous week for comparison
    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevWeek = this.data.weeklyHistory.find(
      w => w.weekStart === prevWeekStart.toISOString().split('T')[0]
    );

    if (!weeklySummary) {
      weeklySummary = {
        weekStart: weekStartStr,
        weekEnd: weekEndStr,
        totalMinutes: 0,
        totalSessions: 0,
        lessonsCompleted: 0,
        averageWPM: 0,
        averageAccuracy: 0,
        improvement: { wpm: 0, accuracy: 0 },
      };
      this.data.weeklyHistory.push(weeklySummary);
    }

    weeklySummary.totalMinutes = totalMinutes;
    weeklySummary.totalSessions = totalSessions;
    weeklySummary.lessonsCompleted = lessonsCompleted;
    weeklySummary.averageWPM = avgWPM;
    weeklySummary.averageAccuracy = avgAcc;

    if (prevWeek) {
      weeklySummary.improvement = {
        wpm: avgWPM - prevWeek.averageWPM,
        accuracy: avgAcc - prevWeek.averageAccuracy,
      };
    }

    // Keep only last 12 weeks
    this.data.weeklyHistory = this.data.weeklyHistory
      .sort((a, b) => b.weekStart.localeCompare(a.weekStart))
      .slice(0, 12);
  }

  /**
   * Get learning path visualization data
   */
  getLearningPath(): LearningPathNode[] {
    const nodes: LearningPathNode[] = [];
    const lessonResults = gamificationService.getAllLessonResults();

    // Group lessons by level
    const levelGroups: Record<number, Lesson[]> = {};
    for (const lesson of ALL_LESSONS) {
      if (!levelGroups[lesson.level]) {
        levelGroups[lesson.level] = [];
      }
      levelGroups[lesson.level].push(lesson);
    }

    // Calculate node positions
    const levels = Object.keys(levelGroups)
      .map(Number)
      .sort((a, b) => a - b);
    const levelSpacing = 150;
    const lessonSpacing = 140;

    for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
      const level = levels[levelIndex];
      const lessons = levelGroups[level];
      const levelY = levelIndex * levelSpacing + 50;

      // Calculate starting X to center lessons
      const totalWidth = (lessons.length - 1) * lessonSpacing;
      const startX = Math.max(50, (800 - totalWidth) / 2);

      for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex++) {
        const lesson = lessons[lessonIndex];
        const result = lessonResults[lesson.id];

        // Determine status
        let status: LearningPathNode['status'] = 'locked';
        const stars = (result?.stars ?? 0) as 0 | 1 | 2 | 3;

        if (result) {
          status = 'completed';
        } else {
          // Check if available (previous level completed or first lesson)
          const prevLevel = levels[levelIndex - 1];
          if (!prevLevel) {
            status = 'available';
          } else {
            const prevLessons = levelGroups[prevLevel];
            const prevCompleted = prevLessons.some(l => lessonResults[l.id]);
            if (prevCompleted) {
              status = 'available';
            }
          }
        }

        // Find connections (lessons that depend on this one)
        const connections: string[] = [];
        if (levelIndex < levels.length - 1) {
          const nextLevel = levels[levelIndex + 1];
          const nextLessons = levelGroups[nextLevel];
          // Connect to adjacent lessons in next level
          const connectionIndex = Math.min(lessonIndex, nextLessons.length - 1);
          if (nextLessons[connectionIndex]) {
            connections.push(nextLessons[connectionIndex].id);
          }
        }

        nodes.push({
          lesson,
          status,
          stars,
          position: {
            x: startX + lessonIndex * lessonSpacing,
            y: levelY,
          },
          connections,
          isCurrentFocus: status === 'available' && lessonIndex === 0,
        });
      }
    }

    return nodes;
  }

  /**
   * Get performance comparison data
   */
  getPerformanceComparison(period: 'week' | 'month' | 'allTime'): PerformanceComparison {
    const today = new Date();
    let currentStart: Date;
    let previousStart: Date;
    let previousEnd: Date;

    if (period === 'week') {
      currentStart = new Date(today);
      currentStart.setDate(today.getDate() - 7);
      previousStart = new Date(currentStart);
      previousStart.setDate(currentStart.getDate() - 7);
      previousEnd = new Date(currentStart);
    } else if (period === 'month') {
      currentStart = new Date(today);
      currentStart.setDate(today.getDate() - 30);
      previousStart = new Date(currentStart);
      previousStart.setDate(currentStart.getDate() - 30);
      previousEnd = new Date(currentStart);
    } else {
      // All time - compare first half to second half
      const sessions = Object.values(this.data.dailySessions);
      if (sessions.length === 0) {
        return this.getEmptyComparison(period);
      }
      const dates = Object.keys(this.data.dailySessions).sort();
      const midIndex = Math.floor(dates.length / 2);
      currentStart = new Date(dates[midIndex] || dates[0]);
      previousStart = new Date(dates[0]);
      previousEnd = new Date(dates[midIndex - 1] || dates[0]);
    }

    const currentStartStr = currentStart.toISOString().split('T')[0];
    const previousStartStr = previousStart.toISOString().split('T')[0];
    const previousEndStr = previousEnd.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    // Aggregate current period
    const current = this.aggregateSessions(currentStartStr, todayStr);

    // Aggregate previous period
    const previous = this.aggregateSessions(previousStartStr, previousEndStr);

    // Calculate changes
    const change = {
      wpm: current.wpm - previous.wpm,
      wpmPercent:
        previous.wpm > 0 ? Math.round(((current.wpm - previous.wpm) / previous.wpm) * 100) : 0,
      accuracy: current.accuracy - previous.accuracy,
      accuracyPercent:
        previous.accuracy > 0
          ? Math.round(((current.accuracy - previous.accuracy) / previous.accuracy) * 100)
          : 0,
      practiceMinutes: current.practiceMinutes - previous.practiceMinutes,
      practicePercent:
        previous.practiceMinutes > 0
          ? Math.round(
              ((current.practiceMinutes - previous.practiceMinutes) / previous.practiceMinutes) *
                100
            )
          : 0,
      lessonsCompleted: current.lessonsCompleted - previous.lessonsCompleted,
    };

    return { period, current, previous, change };
  }

  /**
   * Aggregate sessions for a date range
   */
  private aggregateSessions(
    startDate: string,
    endDate: string
  ): {
    wpm: number;
    accuracy: number;
    practiceMinutes: number;
    lessonsCompleted: number;
  } {
    let totalMinutes = 0;
    let totalLessons = 0;
    let wpmSum = 0;
    let accSum = 0;
    let count = 0;

    for (const [date, session] of Object.entries(this.data.dailySessions)) {
      if (date >= startDate && date <= endDate) {
        totalMinutes += session.totalMinutes;
        totalLessons += session.lessonsCompleted;
        if (session.averageWPM > 0) {
          wpmSum += session.averageWPM;
          count++;
        }
        if (session.averageAccuracy > 0) {
          accSum += session.averageAccuracy;
        }
      }
    }

    return {
      wpm: count > 0 ? Math.round(wpmSum / count) : 0,
      accuracy: count > 0 ? Math.round(accSum / count) : 0,
      practiceMinutes: totalMinutes,
      lessonsCompleted: totalLessons,
    };
  }

  /**
   * Get empty comparison
   */
  private getEmptyComparison(period: 'week' | 'month' | 'allTime'): PerformanceComparison {
    const empty = { wpm: 0, accuracy: 0, practiceMinutes: 0, lessonsCompleted: 0 };
    return {
      period,
      current: empty,
      previous: empty,
      change: {
        wpm: 0,
        wpmPercent: 0,
        accuracy: 0,
        accuracyPercent: 0,
        practiceMinutes: 0,
        practicePercent: 0,
        lessonsCompleted: 0,
      },
    };
  }

  /**
   * Get today's session
   */
  getTodaySession(): DailySession | null {
    const today = new Date().toISOString().split('T')[0];
    return this.data.dailySessions[today] || null;
  }

  /**
   * Get sessions for last N days
   */
  getRecentSessions(days: number = 7): DailySession[] {
    const result: DailySession[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      if (this.data.dailySessions[dateStr]) {
        result.push(this.data.dailySessions[dateStr]);
      } else {
        result.push({
          date: dateStr,
          totalMinutes: 0,
          sessionsCount: 0,
          lessonsCompleted: 0,
          averageWPM: 0,
          averageAccuracy: 0,
          peakWPM: 0,
        });
      }
    }

    return result;
  }

  /**
   * Get milestones
   */
  getMilestones(): Milestone[] {
    return [...this.data.milestones];
  }

  /**
   * Get achieved milestones count
   */
  getAchievedMilestonesCount(): { achieved: number; total: number } {
    const achieved = this.data.milestones.filter(m => m.achieved).length;
    return { achieved, total: this.data.milestones.length };
  }

  /**
   * Get practice time statistics
   */
  getPracticeTimeStats(): {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    averagePerDay: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const todaySession = this.data.dailySessions[today];

    // Calculate week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    // Calculate month
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split('T')[0];

    let thisWeek = 0;
    let thisMonth = 0;
    let daysWithPractice = 0;

    for (const [date, session] of Object.entries(this.data.dailySessions)) {
      if (date >= weekStartStr) {
        thisWeek += session.totalMinutes;
      }
      if (date >= monthStartStr) {
        thisMonth += session.totalMinutes;
      }
      if (session.totalMinutes > 0) {
        daysWithPractice++;
      }
    }

    return {
      total: this.data.totalPracticeMinutes,
      today: todaySession?.totalMinutes ?? 0,
      thisWeek,
      thisMonth,
      averagePerDay:
        daysWithPractice > 0 ? Math.round(this.data.totalPracticeMinutes / daysWithPractice) : 0,
    };
  }

  /**
   * Format minutes as readable string
   */
  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} Min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} Std`;
    }
    return `${hours} Std ${mins} Min`;
  }

  /**
   * Reset data
   */
  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.getDefaultData();
    this.initMilestones();
    this.notify();
  }
}

// Singleton instance
export const progressTrackingService = new ProgressTrackingService();
