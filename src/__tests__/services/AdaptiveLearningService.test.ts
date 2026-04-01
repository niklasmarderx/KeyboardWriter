/**
 * AdaptiveLearningService Tests
 */
import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  AdaptiveLearningService,
  TypingSessionData,
  KeystrokeData,
} from '../../services/AdaptiveLearningService';

// Mock GamificationService
vi.mock('../../services/GamificationService', () => ({
  gamificationService: {
    addXP: vi.fn(),
    getAllLessonResults: vi.fn(() => ({})),
  },
}));

// Mock lessons data
vi.mock('../../data/lessons', () => ({
  ALL_LESSONS: [
    { id: 'lesson-1', level: 1, title: 'Home Row' },
    { id: 'lesson-2', level: 1, title: 'Top Row' },
    { id: 'lesson-3', level: 2, title: 'Numbers' },
    { id: 'lesson-4', level: 3, title: 'Symbols' },
  ],
  getLessonsByLevel: vi.fn((level: number) => {
    const lessons = [
      { id: 'lesson-1', level: 1, title: 'Home Row' },
      { id: 'lesson-2', level: 1, title: 'Top Row' },
      { id: 'lesson-3', level: 2, title: 'Numbers' },
      { id: 'lesson-4', level: 3, title: 'Symbols' },
    ];
    return lessons.filter(l => l.level === level);
  }),
}));

function makeKeystroke(key: string, correct: boolean, responseTime = 150): KeystrokeData {
  return {
    key: correct ? key : 'x',
    expectedKey: key,
    timestamp: Date.now(),
    correct,
    responseTime,
  };
}

function makeSession(overrides: Partial<TypingSessionData> = {}): TypingSessionData {
  return {
    timestamp: new Date().toISOString(),
    wpm: 35,
    accuracy: 92,
    duration: 120,
    keystrokes: [makeKeystroke('a', true), makeKeystroke('b', true), makeKeystroke('c', false)],
    errors: [],
    ...overrides,
  };
}

describe('AdaptiveLearningService', () => {
  let service: AdaptiveLearningService;

  beforeEach(() => {
    localStorage.clear();
    service = new AdaptiveLearningService();
  });

  describe('initialization', () => {
    it('starts with default data when no storage exists', () => {
      const data = service.getData();
      expect(data.skillLevel).toBe('beginner');
      expect(data.sessions).toEqual([]);
      expect(data.averageWPM).toBe(0);
      expect(data.averageAccuracy).toBe(0);
      expect(data.totalPracticeTime).toBe(0);
    });

    it('loads persisted data from localStorage', () => {
      const stored = {
        keyPerformance: {},
        patternPerformance: {},
        sessions: [],
        dailyGoals: [],
        lastAnalysisDate: null,
        skillLevel: 'advanced',
        preferredDifficulty: 65,
        learningPace: 'fast',
        totalPracticeTime: 120,
        averageWPM: 45,
        averageAccuracy: 93,
      };
      localStorage.setItem('adaptive_learning_data', JSON.stringify(stored));

      const loaded = new AdaptiveLearningService();
      expect(loaded.getData().skillLevel).toBe('advanced');
      expect(loaded.getData().averageWPM).toBe(45);
    });
  });

  describe('recordSession', () => {
    it('stores session and updates practice time', () => {
      const session = makeSession({ duration: 300 });
      service.recordSession(session);

      const data = service.getData();
      expect(data.sessions).toHaveLength(1);
      expect(data.totalPracticeTime).toBe(5); // 300s = 5min
    });

    it('keeps at most 100 sessions', () => {
      for (let i = 0; i < 105; i++) {
        service.recordSession(makeSession());
      }
      expect(service.getData().sessions).toHaveLength(100);
    });

    it('updates running averages from sessions', () => {
      service.recordSession(makeSession({ wpm: 30, accuracy: 90 }));
      service.recordSession(makeSession({ wpm: 50, accuracy: 96 }));

      const data = service.getData();
      expect(data.averageWPM).toBe(40);
      expect(data.averageAccuracy).toBe(93);
    });

    it('tracks key performance from keystrokes', () => {
      const keystrokes = [
        makeKeystroke('a', true, 100),
        makeKeystroke('a', true, 120),
        makeKeystroke('a', false, 200),
        makeKeystroke('b', true, 150),
      ];
      service.recordSession(makeSession({ keystrokes }));

      const data = service.getData();
      const aPerf = data.keyPerformance['a'];
      expect(aPerf).toBeDefined();
      expect(aPerf.totalAttempts).toBe(3);
      expect(aPerf.correctAttempts).toBe(2);
      expect(aPerf.accuracy).toBeCloseTo(66.67, 1);
      expect(aPerf.lastPracticed).not.toBeNull();

      const bPerf = data.keyPerformance['b'];
      expect(bPerf.totalAttempts).toBe(1);
      expect(bPerf.accuracy).toBe(100);
    });

    it('persists data to localStorage', () => {
      service.recordSession(makeSession());
      const stored = localStorage.getItem('adaptive_learning_data');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.sessions).toHaveLength(1);
    });
  });

  describe('skill level progression', () => {
    it('stays beginner with low stats', () => {
      service.recordSession(makeSession({ wpm: 15, accuracy: 75 }));
      expect(service.getData().skillLevel).toBe('beginner');
    });

    it('advances to intermediate at 25+ WPM and 85%+ accuracy', () => {
      for (let i = 0; i < 5; i++) {
        service.recordSession(makeSession({ wpm: 30, accuracy: 88 }));
      }
      expect(service.getData().skillLevel).toBe('intermediate');
    });

    it('advances to advanced at 40+ WPM and 90%+ accuracy', () => {
      for (let i = 0; i < 5; i++) {
        service.recordSession(makeSession({ wpm: 45, accuracy: 93 }));
      }
      expect(service.getData().skillLevel).toBe('advanced');
    });

    it('reaches expert at 60+ WPM and 95%+ accuracy', () => {
      for (let i = 0; i < 5; i++) {
        service.recordSession(makeSession({ wpm: 65, accuracy: 97 }));
      }
      expect(service.getData().skillLevel).toBe('expert');
    });
  });

  describe('analyzeWeaknesses', () => {
    it('returns empty analysis with no data', () => {
      const analysis = service.analyzeWeaknesses();
      expect(analysis.weakKeys).toEqual([]);
      expect(analysis.weakPatterns).toEqual([]);
      expect(analysis.overallStrength).toBeGreaterThanOrEqual(0);
    });

    it('identifies weak keys below 85% accuracy', () => {
      // Record sessions with a consistently weak key
      for (let i = 0; i < 3; i++) {
        const keystrokes = [
          makeKeystroke('a', true),
          makeKeystroke('z', false),
          makeKeystroke('z', false),
          makeKeystroke('z', true),
        ];
        service.recordSession(makeSession({ keystrokes }));
      }

      const analysis = service.analyzeWeaknesses();
      const weakKeyIds = analysis.weakKeys.map(k => k.key);
      expect(weakKeyIds).toContain('z');
    });

    it('suggests accuracy focus when average is low', () => {
      for (let i = 0; i < 3; i++) {
        service.recordSession(makeSession({ wpm: 40, accuracy: 80 }));
      }

      const analysis = service.analyzeWeaknesses();
      expect(analysis.improvementAreas.some(a => a.includes('fehlerfreies'))).toBe(true);
    });

    it('suggests speed focus when WPM is low', () => {
      for (let i = 0; i < 3; i++) {
        service.recordSession(makeSession({ wpm: 20, accuracy: 95 }));
      }

      const analysis = service.analyzeWeaknesses();
      expect(analysis.improvementAreas.some(a => a.includes('einfachen Texten'))).toBe(true);
    });
  });

  describe('generateDailyGoals', () => {
    it('creates three default goals', () => {
      const goals = service.generateDailyGoals();
      expect(goals).toHaveLength(3);
      expect(goals.map(g => g.type)).toEqual([
        'practice_time',
        'lessons_complete',
        'accuracy_target',
      ]);
    });

    it('scales targets with skill level', () => {
      // Record enough expert-level sessions
      for (let i = 0; i < 10; i++) {
        service.recordSession(makeSession({ wpm: 70, accuracy: 98 }));
      }

      const goals = service.generateDailyGoals();
      const practiceGoal = goals.find(g => g.type === 'practice_time')!;
      // Expert multiplier is 2.0, so 15 * 2 = 30
      expect(practiceGoal.target).toBe(30);
    });

    it('goals start at 0 progress and not completed', () => {
      const goals = service.generateDailyGoals();
      for (const goal of goals) {
        expect(goal.current).toBe(0);
        expect(goal.completed).toBe(false);
        expect(goal.xpReward).toBeGreaterThan(0);
      }
    });
  });

  describe('getRecommendedPath', () => {
    it('returns a valid recommendation structure', () => {
      const rec = service.getRecommendedPath();
      expect(rec).toHaveProperty('nextLesson');
      expect(rec).toHaveProperty('reviewLessons');
      expect(rec).toHaveProperty('practiceRecommendations');
      expect(rec).toHaveProperty('estimatedTimeMinutes');
      expect(rec.estimatedTimeMinutes).toBeGreaterThan(0);
    });

    it('includes warmup in recommendations', () => {
      const rec = service.getRecommendedPath();
      const hasWarmup = rec.practiceRecommendations.some(r => r.type === 'warmup');
      expect(hasWarmup).toBe(true);
    });

    it('recommends accuracy focus when accuracy is below 90%', () => {
      for (let i = 0; i < 5; i++) {
        service.recordSession(makeSession({ wpm: 40, accuracy: 82 }));
      }

      const rec = service.getRecommendedPath();
      const hasAccuracy = rec.practiceRecommendations.some(r => r.type === 'accuracy_focus');
      expect(hasAccuracy).toBe(true);
    });

    it('recommends speed drill when accuracy is good', () => {
      for (let i = 0; i < 5; i++) {
        service.recordSession(makeSession({ wpm: 35, accuracy: 95 }));
      }

      const rec = service.getRecommendedPath();
      const hasSpeed = rec.practiceRecommendations.some(r => r.type === 'speed_drill');
      expect(hasSpeed).toBe(true);
    });
  });

  describe('weak key helpers', () => {
    it('getWeakKeys returns empty array initially', () => {
      expect(service.getWeakKeys()).toEqual([]);
    });

    it('getWeakKeys filters by minimum attempts', () => {
      // Record a few attempts — not enough to pass the threshold
      service.recordSession(
        makeSession({
          keystrokes: [makeKeystroke('q', false)],
        })
      );

      // Fewer than 10 attempts, should be filtered out
      expect(service.getWeakKeys()).toEqual([]);
    });

    it('getUnpracticedKeys lists keys not yet typed', () => {
      const unpracticed = service.getUnpracticedKeys();
      // All a-z and 0-9 should be unpracticed initially
      expect(unpracticed.length).toBe(36);
    });

    it('generateWeakKeyPracticeText returns fallback with no data', () => {
      const text = service.generateWeakKeyPracticeText();
      expect(text).toContain('Keine schwachen Tasten');
    });
  });

  describe('subscribe / notify', () => {
    it('calls listeners when data changes', () => {
      const listener = vi.fn();
      service.subscribe(listener);

      service.recordSession(makeSession());
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('unsubscribe stops notifications', () => {
      const listener = vi.fn();
      const unsub = service.subscribe(listener);
      unsub();

      service.recordSession(makeSession());
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('clears all data and storage', () => {
      service.recordSession(makeSession());
      expect(service.getData().sessions).toHaveLength(1);

      service.reset();

      expect(service.getData().sessions).toEqual([]);
      expect(service.getData().skillLevel).toBe('beginner');
      expect(localStorage.getItem('adaptive_learning_data')).toBeNull();
    });
  });
});
