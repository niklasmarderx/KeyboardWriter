/**
 * Adaptive Learning Service
 * Analyzes user weaknesses and provides personalized exercise recommendations
 */

import { ALL_LESSONS, getLessonsByLevel } from '../data/lessons';
import { Lesson } from '../domain/models';
import { gamificationService } from './GamificationService';

/**
 * Key performance metrics tracked for adaptive learning
 */
export interface KeyPerformance {
  key: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  averageResponseTime: number; // ms
  lastPracticed: string | null;
  trend: 'improving' | 'stable' | 'declining';
}

/**
 * Weakness analysis result
 */
export interface WeaknessAnalysis {
  weakKeys: KeyPerformance[];
  weakPatterns: PatternPerformance[];
  recommendedFocus: string[];
  overallStrength: number; // 0-100
  improvementAreas: string[];
}

/**
 * Pattern performance (digraphs, trigraphs, etc.)
 */
export interface PatternPerformance {
  pattern: string;
  totalAttempts: number;
  accuracy: number;
  category: 'digraph' | 'trigraph' | 'word' | 'punctuation';
}

/**
 * Learning path recommendation
 */
export interface LearningPathRecommendation {
  nextLesson: Lesson | null;
  reviewLessons: Lesson[];
  practiceRecommendations: PracticeRecommendation[];
  dailyGoals: DailyGoal[];
  estimatedTimeMinutes: number;
}

/**
 * Practice recommendation
 */
export interface PracticeRecommendation {
  type: 'weak_keys' | 'speed_drill' | 'accuracy_focus' | 'pattern_practice' | 'warmup';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  targetKeys?: string[];
  targetWPM?: number;
  targetAccuracy?: number;
  estimatedMinutes: number;
}

/**
 * Daily learning goal
 */
export interface DailyGoal {
  id: string;
  type: 'practice_time' | 'lessons_complete' | 'accuracy_target' | 'new_lesson' | 'review';
  title: string;
  target: number;
  current: number;
  completed: boolean;
  xpReward: number;
}

/**
 * User session data for tracking
 */
export interface TypingSessionData {
  timestamp: string;
  lessonId?: string;
  wpm: number;
  accuracy: number;
  duration: number; // seconds
  keystrokes: KeystrokeData[];
  errors: ErrorData[];
}

/**
 * Individual keystroke data
 */
export interface KeystrokeData {
  key: string;
  expectedKey: string;
  timestamp: number;
  correct: boolean;
  responseTime: number; // ms since last keystroke
}

/**
 * Error data
 */
export interface ErrorData {
  position: number;
  expected: string;
  actual: string;
  context: string; // surrounding text
}

/**
 * Adaptive learning data stored in localStorage
 */
export interface AdaptiveLearningData {
  keyPerformance: Record<string, KeyPerformance>;
  patternPerformance: Record<string, PatternPerformance>;
  sessions: TypingSessionData[];
  dailyGoals: DailyGoal[];
  lastAnalysisDate: string | null;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredDifficulty: number; // 0-100
  learningPace: 'slow' | 'moderate' | 'fast';
  totalPracticeTime: number; // minutes
  averageWPM: number;
  averageAccuracy: number;
}

// Storage key
const STORAGE_KEY = 'adaptive_learning_data';

// Common digraphs for pattern analysis
const COMMON_DIGRAPHS = [
  'th',
  'he',
  'in',
  'er',
  'an',
  'en',
  'on',
  'at',
  'es',
  'ed',
  'or',
  'ti',
  'te',
  'ng',
  'nd',
  'to',
  'it',
  'is',
  'ar',
  'al',
  'de',
  'ei',
  'ie',
  'ch',
  'sc',
  'st',
  'un',
  'be',
  'ge',
  'au',
];

/**
 * Adaptive Learning Service Class
 */
export class AdaptiveLearningService {
  private data: AdaptiveLearningData;
  private readonly listeners: Set<(data: AdaptiveLearningData) => void> = new Set();

  constructor() {
    this.data = this.loadFromStorage();
  }

  /**
   * Load data from storage
   */
  private loadFromStorage(): AdaptiveLearningData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as AdaptiveLearningData;
      }
    } catch (error) {
      console.error('Error loading adaptive learning data:', error);
    }

    return this.getDefaultData();
  }

  /**
   * Get default data structure
   */
  private getDefaultData(): AdaptiveLearningData {
    return {
      keyPerformance: {},
      patternPerformance: {},
      sessions: [],
      dailyGoals: [],
      lastAnalysisDate: null,
      skillLevel: 'beginner',
      preferredDifficulty: 30,
      learningPace: 'moderate',
      totalPracticeTime: 0,
      averageWPM: 0,
      averageAccuracy: 0,
    };
  }

  /**
   * Save data to storage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving adaptive learning data:', error);
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
  subscribe(listener: (data: AdaptiveLearningData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current data
   */
  getData(): AdaptiveLearningData {
    return { ...this.data };
  }

  /**
   * Record a typing session with detailed keystroke data
   */
  recordSession(session: TypingSessionData): void {
    // Add session to history (keep last 100 sessions)
    this.data.sessions.unshift(session);
    if (this.data.sessions.length > 100) {
      this.data.sessions = this.data.sessions.slice(0, 100);
    }

    // Update total practice time
    this.data.totalPracticeTime += session.duration / 60;

    // Update averages
    this.updateAverages();

    // Process keystroke data for performance tracking
    this.processKeystrokes(session.keystrokes);

    // Update skill level based on performance
    this.updateSkillLevel();

    // Update daily goals
    this.updateDailyGoals(session);

    this.saveToStorage();
    this.notify();
  }

  /**
   * Process keystrokes to update key performance
   */
  private processKeystrokes(keystrokes: KeystrokeData[]): void {
    for (const keystroke of keystrokes) {
      const key = keystroke.expectedKey.toLowerCase();

      if (!this.data.keyPerformance[key]) {
        this.data.keyPerformance[key] = {
          key,
          totalAttempts: 0,
          correctAttempts: 0,
          accuracy: 0,
          averageResponseTime: 0,
          lastPracticed: null,
          trend: 'stable',
        };
      }

      const perf = this.data.keyPerformance[key];
      const oldAccuracy = perf.accuracy;

      perf.totalAttempts++;
      if (keystroke.correct) {
        perf.correctAttempts++;
      }
      perf.accuracy = (perf.correctAttempts / perf.totalAttempts) * 100;
      perf.averageResponseTime =
        (perf.averageResponseTime * (perf.totalAttempts - 1) + keystroke.responseTime) /
        perf.totalAttempts;
      perf.lastPracticed = new Date().toISOString();

      // Determine trend (compare to previous accuracy)
      if (perf.totalAttempts > 10) {
        if (perf.accuracy > oldAccuracy + 2) {
          perf.trend = 'improving';
        } else if (perf.accuracy < oldAccuracy - 2) {
          perf.trend = 'declining';
        } else {
          perf.trend = 'stable';
        }
      }
    }

    // Update pattern performance (digraphs)
    this.updatePatternPerformance(keystrokes);
  }

  /**
   * Update pattern performance from keystrokes
   */
  private updatePatternPerformance(keystrokes: KeystrokeData[]): void {
    // Build the typed text
    const typedText = keystrokes
      .map(k => k.key)
      .join('')
      .toLowerCase();
    const expectedText = keystrokes
      .map(k => k.expectedKey)
      .join('')
      .toLowerCase();

    // Check digraphs
    for (const digraph of COMMON_DIGRAPHS) {
      let index = 0;
      let occurrences = 0;
      let correct = 0;

      while ((index = expectedText.indexOf(digraph, index)) !== -1) {
        occurrences++;
        if (typedText.substring(index, index + 2) === digraph) {
          correct++;
        }
        index++;
      }

      if (occurrences > 0) {
        if (!this.data.patternPerformance[digraph]) {
          this.data.patternPerformance[digraph] = {
            pattern: digraph,
            totalAttempts: 0,
            accuracy: 0,
            category: 'digraph',
          };
        }

        const pattern = this.data.patternPerformance[digraph];
        const oldTotal = pattern.totalAttempts;
        const oldCorrect = (pattern.accuracy / 100) * oldTotal;

        pattern.totalAttempts += occurrences;
        pattern.accuracy = ((oldCorrect + correct) / pattern.totalAttempts) * 100;
      }
    }
  }

  /**
   * Update running averages
   */
  private updateAverages(): void {
    if (this.data.sessions.length === 0) {
      return;
    }

    const recentSessions = this.data.sessions.slice(0, 20); // Last 20 sessions
    this.data.averageWPM =
      recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length;
    this.data.averageAccuracy =
      recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;
  }

  /**
   * Update skill level based on performance
   */
  private updateSkillLevel(): void {
    const wpm = this.data.averageWPM;
    const accuracy = this.data.averageAccuracy;

    if (wpm >= 60 && accuracy >= 95) {
      this.data.skillLevel = 'expert';
      this.data.preferredDifficulty = 85;
    } else if (wpm >= 40 && accuracy >= 90) {
      this.data.skillLevel = 'advanced';
      this.data.preferredDifficulty = 65;
    } else if (wpm >= 25 && accuracy >= 85) {
      this.data.skillLevel = 'intermediate';
      this.data.preferredDifficulty = 45;
    } else {
      this.data.skillLevel = 'beginner';
      this.data.preferredDifficulty = 25;
    }
  }

  /**
   * Update daily goals progress
   */
  private updateDailyGoals(session: TypingSessionData): void {
    const today = new Date().toISOString().split('T')[0];

    // Generate daily goals if needed
    if (this.data.dailyGoals.length === 0 || !this.data.dailyGoals[0].id.startsWith(today)) {
      this.data.dailyGoals = this.generateDailyGoals();
    }

    // Update goals based on session
    for (const goal of this.data.dailyGoals) {
      if (goal.completed) {
        continue;
      }

      switch (goal.type) {
        case 'practice_time':
          goal.current += session.duration / 60;
          break;
        case 'accuracy_target':
          if (session.accuracy >= goal.target) {
            goal.current++;
          }
          break;
        case 'lessons_complete':
          if (session.lessonId) {
            goal.current++;
          }
          break;
      }

      if (goal.current >= goal.target) {
        goal.completed = true;
        // Award XP through GamificationService
        gamificationService.addXP('dailyGoalComplete');
      }
    }
  }

  /**
   * Generate daily learning goals
   */
  generateDailyGoals(): DailyGoal[] {
    const today = new Date().toISOString().split('T')[0];
    const skillMultiplier = this.getSkillMultiplier();

    return [
      {
        id: `${today}-practice`,
        type: 'practice_time',
        title: 'Übungszeit',
        target: Math.round(15 * skillMultiplier),
        current: 0,
        completed: false,
        xpReward: 100,
      },
      {
        id: `${today}-lessons`,
        type: 'lessons_complete',
        title: 'Lektionen abschließen',
        target: Math.round(3 * skillMultiplier),
        current: 0,
        completed: false,
        xpReward: 75,
      },
      {
        id: `${today}-accuracy`,
        type: 'accuracy_target',
        title: `${Math.round(90 + this.data.preferredDifficulty * 0.1)}% Genauigkeit`,
        target: 5, // 5 sessions with target accuracy
        current: 0,
        completed: false,
        xpReward: 50,
      },
    ];
  }

  /**
   * Get skill multiplier for goal scaling
   */
  private getSkillMultiplier(): number {
    switch (this.data.skillLevel) {
      case 'expert':
        return 2.0;
      case 'advanced':
        return 1.5;
      case 'intermediate':
        return 1.2;
      default:
        return 1.0;
    }
  }

  /**
   * Analyze weaknesses and return detailed analysis
   */
  analyzeWeaknesses(): WeaknessAnalysis {
    const weakKeys = Object.values(this.data.keyPerformance)
      .filter(k => k.accuracy < 85 || k.trend === 'declining')
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 10);

    const weakPatterns = Object.values(this.data.patternPerformance)
      .filter(p => p.accuracy < 80 && p.totalAttempts >= 5)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    const recommendedFocus: string[] = [];
    const improvementAreas: string[] = [];

    // Determine focus areas
    if (weakKeys.length > 0) {
      recommendedFocus.push('Problematische Tasten gezielt üben');
      improvementAreas.push(
        `Tasten mit niedriger Genauigkeit: ${weakKeys.map(k => k.key).join(', ')}`
      );
    }

    if (this.data.averageAccuracy < 90) {
      recommendedFocus.push('Genauigkeit vor Geschwindigkeit');
      improvementAreas.push('Fokus auf fehlerfreies Tippen');
    }

    if (this.data.averageWPM < 30) {
      recommendedFocus.push('Grundgeschwindigkeit aufbauen');
      improvementAreas.push('Mehr Übung mit einfachen Texten');
    }

    if (weakPatterns.length > 0) {
      recommendedFocus.push('Häufige Buchstabenkombinationen');
      improvementAreas.push(`Muster üben: ${weakPatterns.map(p => p.pattern).join(', ')}`);
    }

    // Calculate overall strength
    const keyAccuracies = Object.values(this.data.keyPerformance);
    const avgKeyAccuracy =
      keyAccuracies.length > 0
        ? keyAccuracies.reduce((sum, k) => sum + k.accuracy, 0) / keyAccuracies.length
        : 50;

    const overallStrength = Math.round(
      avgKeyAccuracy * 0.4 +
        this.data.averageAccuracy * 0.3 +
        Math.min((this.data.averageWPM / 60) * 100, 100) * 0.3
    );

    this.data.lastAnalysisDate = new Date().toISOString();
    this.saveToStorage();

    return {
      weakKeys,
      weakPatterns,
      recommendedFocus,
      overallStrength,
      improvementAreas,
    };
  }

  /**
   * Get personalized learning path recommendation
   */
  getRecommendedPath(): LearningPathRecommendation {
    const lessonResults = gamificationService.getAllLessonResults();
    const analysis = this.analyzeWeaknesses();

    // Find next uncompleted lesson at appropriate level
    const appropriateLevel = this.getAppropriateLevel();
    const levelLessons = getLessonsByLevel(appropriateLevel);
    const nextLesson = levelLessons.find(l => !lessonResults[l.id]) || null;

    // Find lessons that need review (completed but low stars)
    const reviewLessons = ALL_LESSONS.filter(lesson => {
      const result = lessonResults[lesson.id];
      return result && result.stars < 3 && lesson.level <= appropriateLevel;
    }).slice(0, 3);

    // Generate practice recommendations
    const practiceRecommendations: PracticeRecommendation[] = [];

    // Warmup recommendation
    practiceRecommendations.push({
      type: 'warmup',
      title: 'Aufwärmübung',
      description: 'Kurze Übung zum Eintippen',
      priority: 'medium',
      estimatedMinutes: 2,
    });

    // Weak keys practice
    if (analysis.weakKeys.length > 0) {
      practiceRecommendations.push({
        type: 'weak_keys',
        title: 'Schwache Tasten üben',
        description: `Fokus auf: ${analysis.weakKeys
          .slice(0, 5)
          .map(k => k.key.toUpperCase())
          .join(', ')}`,
        priority: 'high',
        targetKeys: analysis.weakKeys.slice(0, 5).map(k => k.key),
        targetAccuracy: 90,
        estimatedMinutes: 5,
      });
    }

    // Accuracy or speed focus based on current performance
    if (this.data.averageAccuracy < 90) {
      practiceRecommendations.push({
        type: 'accuracy_focus',
        title: 'Genauigkeitstraining',
        description: 'Langsam und präzise tippen',
        priority: 'high',
        targetAccuracy: 95,
        estimatedMinutes: 10,
      });
    } else {
      practiceRecommendations.push({
        type: 'speed_drill',
        title: 'Geschwindigkeitstraining',
        description: 'Tempo steigern mit bekannten Texten',
        priority: 'medium',
        targetWPM: Math.round(this.data.averageWPM * 1.1),
        estimatedMinutes: 10,
      });
    }

    // Pattern practice if needed
    if (analysis.weakPatterns.length > 0) {
      practiceRecommendations.push({
        type: 'pattern_practice',
        title: 'Muster-Übungen',
        description: `Häufige Kombinationen: ${analysis.weakPatterns.map(p => p.pattern).join(', ')}`,
        priority: 'medium',
        estimatedMinutes: 5,
      });
    }

    // Calculate estimated time
    const estimatedTimeMinutes =
      practiceRecommendations.reduce((sum, r) => sum + r.estimatedMinutes, 0) +
      (nextLesson ? 10 : 0) +
      reviewLessons.length * 5;

    return {
      nextLesson,
      reviewLessons,
      practiceRecommendations,
      dailyGoals: this.data.dailyGoals,
      estimatedTimeMinutes,
    };
  }

  /**
   * Get appropriate lesson level for user
   */
  private getAppropriateLevel(): number {
    switch (this.data.skillLevel) {
      case 'expert':
        return 6;
      case 'advanced':
        return 5;
      case 'intermediate':
        return 3;
      default:
        return 1;
    }
  }

  /**
   * Get weak keys for targeted practice
   */
  getWeakKeys(limit: number = 5): KeyPerformance[] {
    return Object.values(this.data.keyPerformance)
      .filter(k => k.totalAttempts >= 10)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, limit);
  }

  /**
   * Get keys that need more practice (few attempts)
   */
  getUnpracticedKeys(): string[] {
    const allKeys = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
    const practicedKeys = Object.keys(this.data.keyPerformance);

    return allKeys.filter(
      key => !practicedKeys.includes(key) || this.data.keyPerformance[key].totalAttempts < 20
    );
  }

  /**
   * Generate text that focuses on weak keys
   */
  generateWeakKeyPracticeText(): string {
    const weakKeys = this.getWeakKeys(5).map(k => k.key);
    if (weakKeys.length === 0) {
      return 'Keine schwachen Tasten gefunden. Gut gemacht!';
    }

    // Generate words containing weak keys
    const practiceWords: string[] = [];
    const wordPool = [
      // Words with common weak keys
      { keys: ['q', 'z'], words: ['quiz', 'quell', 'zeit', 'ziel', 'zucker'] },
      { keys: ['x', 'y'], words: ['text', 'extra', 'system', 'syntax', 'typ'] },
      { keys: ['j', 'k'], words: ['jetzt', 'jahr', 'kommen', 'kind', 'kann'] },
      { keys: ['v', 'b'], words: ['viel', 'von', 'bitte', 'beide', 'buch'] },
      { keys: ['p', 'w'], words: ['plus', 'preis', 'wenn', 'wir', 'wort'] },
    ];

    for (const weak of weakKeys) {
      const matching = wordPool.find(wp => wp.keys.includes(weak));
      if (matching) {
        practiceWords.push(...matching.words);
      }
    }

    // If no specific words found, create simple repetition
    if (practiceWords.length === 0) {
      return weakKeys
        .map(k => `${k}${k}${k} `)
        .join('')
        .repeat(5)
        .trim();
    }

    // Shuffle and join
    const shuffled = practiceWords.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 20).join(' ');
  }

  /**
   * Reset all data
   */
  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.getDefaultData();
    this.notify();
  }
}

// Singleton instance
export const adaptiveLearningService = new AdaptiveLearningService();
