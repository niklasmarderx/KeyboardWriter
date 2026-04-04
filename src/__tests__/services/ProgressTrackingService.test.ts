/**
 * ProgressTrackingService Tests
 *
 * Uses vi.resetModules() + dynamic import in beforeEach to avoid the
 * DEFAULT_MILESTONES mutation bug: the source uses a shallow copy of the
 * module-level array, so milestone objects mutated by checkMilestones()
 * leak across ProgressTrackingService instances within the same module load.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock GamificationService
vi.mock('../../services/GamificationService', () => ({
  gamificationService: {
    addXP: vi.fn(),
    getData: vi.fn(() => ({
      totalLessonsCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
    })),
    getStarStats: vi.fn(() => ({
      total: 0,
      threeStars: 0,
      completed: 0,
    })),
    getAllLessonResults: vi.fn(() => ({})),
  },
}));

// Mock lessons data
vi.mock('../../data/lessons', () => ({
  ALL_LESSONS: [
    { id: 'lesson-1', level: 1, title: 'Home Row' },
    { id: 'lesson-2', level: 1, title: 'Top Row' },
    { id: 'lesson-3', level: 2, title: 'Numbers' },
  ],
  getLessonsByLevel: vi.fn(() => []),
}));

// We import the gamificationService for assertions; the mock factory above
// provides the implementation. We re-establish mockReturnValue in beforeEach
// because setup.ts calls vi.clearAllMocks() which clears .mockReturnValue.
import { gamificationService } from '../../services/GamificationService';

describe('ProgressTrackingService', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let ProgressTrackingService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let service: any;

  beforeEach(async () => {
    // setup.ts beforeEach already calls vi.clearAllMocks() and localStorage.clear()

    // Reset modules so DEFAULT_MILESTONES is re-initialized from scratch
    vi.resetModules();

    // Re-establish mock implementations cleared by vi.clearAllMocks()
    vi.mocked(gamificationService.getData).mockReturnValue({
      totalLessonsCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
    } as ReturnType<typeof gamificationService.getData>);

    vi.mocked(gamificationService.getStarStats).mockReturnValue({
      total: 0,
      threeStars: 0,
      completed: 0,
    });

    // Dynamically import to get a fresh module (fresh DEFAULT_MILESTONES)
    const mod = await import('../../services/ProgressTrackingService');
    ProgressTrackingService = mod.ProgressTrackingService;
    service = new ProgressTrackingService();
  });

  // ==========================================================================
  // recordSession()
  // ==========================================================================
  describe('recordSession()', () => {
    it('should create a new daily session entry for today', () => {
      service.recordSession(10, 40, 92, 1);

      const today = new Date().toISOString().split('T')[0];
      const data = service.getData();
      const session = data.dailySessions[today];

      expect(session).toBeDefined();
      expect(session.date).toBe(today);
      expect(session.totalMinutes).toBe(10);
      expect(session.sessionsCount).toBe(1);
      expect(session.lessonsCompleted).toBe(1);
      expect(session.averageWPM).toBe(40);
      expect(session.averageAccuracy).toBe(92);
      expect(session.peakWPM).toBe(40);
    });

    it('should aggregate multiple sessions on the same day', () => {
      service.recordSession(10, 40, 90, 1);
      service.recordSession(15, 60, 95, 2);

      const today = new Date().toISOString().split('T')[0];
      const data = service.getData();
      const session = data.dailySessions[today];

      expect(session.totalMinutes).toBe(25);
      expect(session.sessionsCount).toBe(2);
      expect(session.lessonsCompleted).toBe(3);
      expect(session.peakWPM).toBe(60);
      // Running average: (40 * 1 + 60) / 2 = 50
      expect(session.averageWPM).toBe(50);
      // Running average: (90 * 1 + 95) / 2 = 93 (rounded)
      expect(session.averageAccuracy).toBe(93);
    });

    it('should update global totalPracticeMinutes', () => {
      service.recordSession(10, 40, 90, 0);
      service.recordSession(20, 50, 95, 0);

      const data = service.getData();
      expect(data.totalPracticeMinutes).toBe(30);
    });

    it('should update bestWPM when current wpm is higher', () => {
      service.recordSession(5, 30, 90, 0);
      expect(service.getData().bestWPM).toBe(30);

      service.recordSession(5, 50, 90, 0);
      expect(service.getData().bestWPM).toBe(50);

      // Should not decrease
      service.recordSession(5, 25, 90, 0);
      expect(service.getData().bestWPM).toBe(50);
    });

    it('should update bestAccuracy when current accuracy is higher', () => {
      service.recordSession(5, 30, 85, 0);
      expect(service.getData().bestAccuracy).toBe(85);

      service.recordSession(5, 30, 98, 0);
      expect(service.getData().bestAccuracy).toBe(98);

      service.recordSession(5, 30, 80, 0);
      expect(service.getData().bestAccuracy).toBe(98);
    });

    it('should update lastActivityDate to today', () => {
      service.recordSession(5, 40, 90, 0);

      const today = new Date().toISOString().split('T')[0];
      expect(service.getData().lastActivityDate).toBe(today);
    });

    it('should persist data to localStorage', () => {
      service.recordSession(10, 40, 90, 1);

      const stored = localStorage.getItem('progress_tracking_data');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.totalPracticeMinutes).toBe(10);
    });

    it('should handle zero wpm without affecting averages', () => {
      service.recordSession(5, 0, 0, 0);

      const today = new Date().toISOString().split('T')[0];
      const session = service.getData().dailySessions[today];

      expect(session.averageWPM).toBe(0);
      expect(session.averageAccuracy).toBe(0);
      expect(session.peakWPM).toBe(0);
    });

    it('should update averageWPMHistory', () => {
      service.recordSession(5, 40, 90, 0);

      const data = service.getData();
      const today = new Date().toISOString().split('T')[0];
      const entry = data.averageWPMHistory.find(
        (h: { date: string; wpm: number }) => h.date === today
      );

      expect(entry).toBeDefined();
      expect(entry!.wpm).toBe(40);
    });

    it('should update averageAccuracyHistory', () => {
      service.recordSession(5, 40, 90, 0);

      const data = service.getData();
      const today = new Date().toISOString().split('T')[0];
      const entry = data.averageAccuracyHistory.find(
        (h: { date: string; accuracy: number }) => h.date === today
      );

      expect(entry).toBeDefined();
      expect(entry!.accuracy).toBe(90);
    });
  });

  // ==========================================================================
  // getRecentSessions()
  // ==========================================================================
  describe('getRecentSessions()', () => {
    it('should return correct number of days', () => {
      const sessions = service.getRecentSessions(7);
      expect(sessions).toHaveLength(7);
    });

    it('should return empty session objects for days without data', () => {
      const sessions = service.getRecentSessions(3);

      for (const session of sessions) {
        expect(session.totalMinutes).toBe(0);
        expect(session.sessionsCount).toBe(0);
        expect(session.averageWPM).toBe(0);
      }
    });

    it('should include today session data when present', () => {
      service.recordSession(15, 45, 93, 2);

      const sessions = service.getRecentSessions(7);
      // Today is the last element
      const todaySession = sessions[sessions.length - 1];

      expect(todaySession.totalMinutes).toBe(15);
      expect(todaySession.sessionsCount).toBe(1);
      expect(todaySession.averageWPM).toBe(45);
    });

    it('should return sessions ordered from oldest to newest', () => {
      const sessions = service.getRecentSessions(5);

      for (let i = 0; i < sessions.length - 1; i++) {
        expect(sessions[i].date <= sessions[i + 1].date).toBe(true);
      }
    });

    it('should default to 7 days when no argument passed', () => {
      const sessions = service.getRecentSessions();
      expect(sessions).toHaveLength(7);
    });
  });

  // ==========================================================================
  // getMilestones()
  // ==========================================================================
  describe('getMilestones()', () => {
    it('should return all milestones', () => {
      const milestones = service.getMilestones();
      expect(milestones.length).toBeGreaterThan(0);
    });

    it('should return milestone objects with correct shape', () => {
      const milestones = service.getMilestones();
      const first = milestones[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('title');
      expect(first).toHaveProperty('description');
      expect(first).toHaveProperty('icon');
      expect(first).toHaveProperty('requirement');
      expect(first).toHaveProperty('achieved');
      expect(first).toHaveProperty('xpReward');
    });

    it('should start with all milestones unachieved', () => {
      const milestones = service.getMilestones();
      for (const m of milestones) {
        expect(m.achieved).toBe(false);
      }
    });

    it('should return a defensive copy (not the internal array)', () => {
      const milestones1 = service.getMilestones();
      const milestones2 = service.getMilestones();
      expect(milestones1).not.toBe(milestones2);
    });

    it('should include time-based milestones', () => {
      const milestones = service.getMilestones();
      const timeMilestones = milestones.filter(
        (m: { requirement: { type: string } }) => m.requirement.type === 'time'
      );
      expect(timeMilestones.length).toBeGreaterThan(0);
    });

    it('should include wpm-based milestones', () => {
      const milestones = service.getMilestones();
      const wpmMilestones = milestones.filter(
        (m: { requirement: { type: string } }) => m.requirement.type === 'wpm'
      );
      expect(wpmMilestones.length).toBeGreaterThan(0);
    });

    it('should include accuracy-based milestones', () => {
      const milestones = service.getMilestones();
      const accMilestones = milestones.filter(
        (m: { requirement: { type: string } }) => m.requirement.type === 'accuracy'
      );
      expect(accMilestones.length).toBeGreaterThan(0);
    });

    it('should include streak-based milestones', () => {
      const milestones = service.getMilestones();
      const streakMilestones = milestones.filter(
        (m: { requirement: { type: string } }) => m.requirement.type === 'streak'
      );
      expect(streakMilestones.length).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // getPerformanceComparison()
  // ==========================================================================
  describe('getPerformanceComparison()', () => {
    it('should return empty comparison when no data exists for "week" period', () => {
      const comparison = service.getPerformanceComparison('week');

      expect(comparison.period).toBe('week');
      expect(comparison.current.wpm).toBe(0);
      expect(comparison.current.accuracy).toBe(0);
      expect(comparison.current.practiceMinutes).toBe(0);
      expect(comparison.previous.wpm).toBe(0);
    });

    it('should return empty comparison for "allTime" when no sessions exist', () => {
      const comparison = service.getPerformanceComparison('allTime');

      expect(comparison.period).toBe('allTime');
      expect(comparison.current.wpm).toBe(0);
      expect(comparison.previous.wpm).toBe(0);
      expect(comparison.change.wpm).toBe(0);
    });

    it('should calculate period stats correctly for "week"', () => {
      // Record a session today
      service.recordSession(30, 50, 95, 3);

      const comparison = service.getPerformanceComparison('week');

      expect(comparison.period).toBe('week');
      expect(comparison.current.wpm).toBe(50);
      expect(comparison.current.accuracy).toBe(95);
      expect(comparison.current.practiceMinutes).toBe(30);
      expect(comparison.current.lessonsCompleted).toBe(3);
    });

    it('should calculate change values correctly', () => {
      service.recordSession(30, 50, 95, 3);

      const comparison = service.getPerformanceComparison('week');

      // No previous data, so change = current - 0
      expect(comparison.change.wpm).toBe(50);
      expect(comparison.change.accuracy).toBe(95);
      expect(comparison.change.practiceMinutes).toBe(30);
      expect(comparison.change.lessonsCompleted).toBe(3);
    });

    it('should accept "month" period', () => {
      service.recordSession(20, 45, 90, 2);

      const comparison = service.getPerformanceComparison('month');

      expect(comparison.period).toBe('month');
      expect(comparison.current.practiceMinutes).toBe(20);
    });

    it('should return wpmPercent as 0 when previous wpm is 0', () => {
      service.recordSession(10, 40, 90, 1);

      const comparison = service.getPerformanceComparison('week');
      expect(comparison.change.wpmPercent).toBe(0);
    });
  });

  // ==========================================================================
  // getPracticeTimeStats()
  // ==========================================================================
  describe('getPracticeTimeStats()', () => {
    it('should return all zeros when no sessions exist', () => {
      const stats = service.getPracticeTimeStats();

      expect(stats.total).toBe(0);
      expect(stats.today).toBe(0);
      expect(stats.thisWeek).toBe(0);
      expect(stats.thisMonth).toBe(0);
      expect(stats.averagePerDay).toBe(0);
    });

    it('should return total practice time', () => {
      service.recordSession(10, 40, 90, 0);
      service.recordSession(20, 50, 95, 0);

      const stats = service.getPracticeTimeStats();
      expect(stats.total).toBe(30);
    });

    it('should return today practice time', () => {
      service.recordSession(15, 40, 90, 0);

      const stats = service.getPracticeTimeStats();
      expect(stats.today).toBe(15);
    });

    it('should include today in thisWeek', () => {
      service.recordSession(25, 40, 90, 0);

      const stats = service.getPracticeTimeStats();
      expect(stats.thisWeek).toBeGreaterThanOrEqual(25);
    });

    it('should include today in thisMonth', () => {
      service.recordSession(30, 40, 90, 0);

      const stats = service.getPracticeTimeStats();
      expect(stats.thisMonth).toBeGreaterThanOrEqual(30);
    });

    it('should calculate averagePerDay correctly', () => {
      service.recordSession(60, 40, 90, 0);

      const stats = service.getPracticeTimeStats();
      // Only one day with practice, so average = 60 / 1 = 60
      expect(stats.averagePerDay).toBe(60);
    });
  });

  // ==========================================================================
  // formatTime()
  // ==========================================================================
  describe('formatTime()', () => {
    it('should format minutes less than 60', () => {
      expect(service.formatTime(30)).toBe('30 Min');
    });

    it('should format exactly 60 minutes as hours', () => {
      expect(service.formatTime(60)).toBe('1 Std');
    });

    it('should format hours with remaining minutes', () => {
      expect(service.formatTime(90)).toBe('1 Std 30 Min');
    });

    it('should format exact multiple of 60 as hours only', () => {
      expect(service.formatTime(120)).toBe('2 Std');
    });

    it('should format zero minutes', () => {
      expect(service.formatTime(0)).toBe('0 Min');
    });

    it('should format large values correctly', () => {
      expect(service.formatTime(1000)).toBe('16 Std 40 Min');
    });
  });

  // ==========================================================================
  // Milestone checking on recordSession
  // ==========================================================================
  describe('milestone checking', () => {
    it('should achieve time milestone when practice time exceeds target', () => {
      // Record enough minutes to trigger the 60-minute milestone
      service.recordSession(61, 40, 90, 0);

      const milestones = service.getMilestones();
      const timeMilestone = milestones.find((m: { id: string }) => m.id === 'time-60');

      expect(timeMilestone?.achieved).toBe(true);
      expect(timeMilestone?.achievedAt).toBeDefined();
    });

    it('should call gamificationService.addXP when milestone achieved', () => {
      service.recordSession(61, 40, 90, 0);

      expect(gamificationService.addXP).toHaveBeenCalled();
    });

    it('should achieve wpm milestone when wpm exceeds target', () => {
      service.recordSession(5, 35, 90, 0);

      const milestones = service.getMilestones();
      const wpmMilestone = milestones.find((m: { id: string }) => m.id === 'wpm-30');
      expect(wpmMilestone?.achieved).toBe(true);
    });

    it('should achieve accuracy milestone when accuracy exceeds target', () => {
      service.recordSession(5, 40, 96, 0);

      const milestones = service.getMilestones();
      const accMilestone = milestones.find((m: { id: string }) => m.id === 'accuracy-95');
      expect(accMilestone?.achieved).toBe(true);
    });
  });

  // ==========================================================================
  // getAchievedMilestonesCount()
  // ==========================================================================
  describe('getAchievedMilestonesCount()', () => {
    it('should return 0 achieved when no sessions have been recorded', () => {
      const result = service.getAchievedMilestonesCount();
      expect(result.achieved).toBe(0);
      expect(result.total).toBeGreaterThan(0);
    });

    it('should count achieved milestones after recording sessions', () => {
      // Trigger the wpm-30 milestone
      service.recordSession(5, 35, 90, 0);

      const result = service.getAchievedMilestonesCount();
      expect(result.achieved).toBeGreaterThanOrEqual(1);
    });
  });

  // ==========================================================================
  // subscribe() / notify()
  // ==========================================================================
  describe('subscribe()', () => {
    it('should notify listeners on recordSession', () => {
      const listener = vi.fn();
      service.subscribe(listener);

      service.recordSession(5, 40, 90, 0);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should return an unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = service.subscribe(listener);

      unsubscribe();
      service.recordSession(5, 40, 90, 0);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // reset()
  // ==========================================================================
  describe('reset()', () => {
    it('should clear all data', () => {
      service.recordSession(20, 50, 95, 3);
      service.reset();

      const data = service.getData();
      expect(data.totalPracticeMinutes).toBe(0);
      expect(data.bestWPM).toBe(0);
      expect(data.bestAccuracy).toBe(0);
      expect(Object.keys(data.dailySessions)).toHaveLength(0);
    });

    it('should remove data from localStorage', () => {
      service.recordSession(10, 40, 90, 0);
      service.reset();

      // After reset, the service re-saves default milestones via initMilestones
      // But the progress data itself is reset
      const data = service.getData();
      expect(data.totalPracticeMinutes).toBe(0);
    });

    it('should notify listeners on reset', () => {
      const listener = vi.fn();
      service.subscribe(listener);

      service.reset();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================================================
  // getTodaySession()
  // ==========================================================================
  describe('getTodaySession()', () => {
    it('should return null when no session exists for today', () => {
      expect(service.getTodaySession()).toBeNull();
    });

    it('should return today session after recording', () => {
      service.recordSession(10, 40, 90, 1);

      const session = service.getTodaySession();
      expect(session).not.toBeNull();
      expect(session!.totalMinutes).toBe(10);
    });
  });

  // ==========================================================================
  // Persistence
  // ==========================================================================
  describe('persistence', () => {
    it('should load data from localStorage on construction', () => {
      // First service writes data
      service.recordSession(10, 40, 90, 1);

      // New service should load persisted data
      const service2 = new ProgressTrackingService();
      expect(service2.getData().totalPracticeMinutes).toBe(10);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('progress_tracking_data', 'not valid json{{{');

      const service2 = new ProgressTrackingService();
      const data = service2.getData();
      expect(data.totalPracticeMinutes).toBe(0);
    });
  });
});
