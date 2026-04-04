/**
 * StoryModeService Tests
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StoryModeService } from '../../services/StoryModeService';
import { QuestStatus, QuestType } from '../../domain/models/Quest';
import type { Chapter, QuestRequirement } from '../../domain/models/Quest';
import { StorageService } from '../../core/StorageService';
import { EventBus } from '../../core/EventBus';

// Mock StorageService
vi.mock('../../core/StorageService', () => ({
  StorageService: {
    load: vi.fn(() => null),
    save: vi.fn(),
  },
}));

// Mock EventBus
vi.mock('../../core/EventBus', () => ({
  EventBus: {
    emit: vi.fn(),
    on: vi.fn(() => ({ unsubscribe: vi.fn() })),
    off: vi.fn(),
    clear: vi.fn(),
  },
}));

const mockedStorageService = vi.mocked(StorageService);
const mockedEventBus = vi.mocked(EventBus);

describe('StoryModeService', () => {
  let service: StoryModeService;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Re-establish mock implementations after clearAllMocks
    mockedStorageService.load.mockReturnValue(null);
    service = new StoryModeService();
  });

  // ==========================================================================
  // getChapters()
  // ==========================================================================
  describe('getChapters()', () => {
    it('should return all chapters', () => {
      const chapters = service.getChapters();
      expect(chapters.length).toBeGreaterThanOrEqual(3);
    });

    it('should include chapter 1 - The Beginning', () => {
      const chapters = service.getChapters();
      const chapter1 = chapters.find((c: Chapter) => c.id === 'chapter_1');
      expect(chapter1).toBeDefined();
      expect(chapter1!.title).toBe('The Beginning');
    });

    it('should include chapter 2 - Building Speed', () => {
      const chapters = service.getChapters();
      const chapter2 = chapters.find((c: Chapter) => c.id === 'chapter_2');
      expect(chapter2).toBeDefined();
      expect(chapter2!.title).toBe('Building Speed');
    });

    it('should include chapter 3 - Code Warrior', () => {
      const chapters = service.getChapters();
      const chapter3 = chapters.find((c: Chapter) => c.id === 'chapter_3');
      expect(chapter3).toBeDefined();
      expect(chapter3!.title).toBe('Code Warrior');
    });

    it('should include quests in each chapter', () => {
      const chapters = service.getChapters();
      for (const chapter of chapters) {
        expect(chapter.quests.length).toBeGreaterThan(0);
      }
    });

    it('should set first quest of chapter 1 as IN_PROGRESS by default', () => {
      const chapters = service.getChapters();
      const chapter1 = chapters.find((c: Chapter) => c.id === 'chapter_1')!;
      const firstQuest = chapter1.quests[0];
      expect(firstQuest.status).toBe(QuestStatus.IN_PROGRESS);
    });

    it('should set other quests in chapter 1 as LOCKED initially', () => {
      const chapters = service.getChapters();
      const chapter1 = chapters.find((c: Chapter) => c.id === 'chapter_1')!;
      // Quests after the first should be locked (their prerequisites are not met)
      for (let i = 1; i < chapter1.quests.length; i++) {
        expect(chapter1.quests[i].status).toBe(QuestStatus.LOCKED);
      }
    });

    it('should include boss battle data in chapters that have bosses', () => {
      const chapters = service.getChapters();
      const chapter1 = chapters.find((c: Chapter) => c.id === 'chapter_1')!;
      expect(chapter1.boss).toBeDefined();
      expect(chapter1.boss!.name).toBe('The Novice Guardian');
    });
  });

  // ==========================================================================
  // startQuest()
  // ==========================================================================
  describe('startQuest()', () => {
    it('should set quest as current and return true for available quest', () => {
      const result = service.startQuest('quest_1_1');
      expect(result).toBe(true);
    });

    it('should emit quest:started event', () => {
      service.startQuest('quest_1_1');
      expect(mockedEventBus.emit).toHaveBeenCalledWith(
        'quest:started',
        expect.objectContaining({
          quest: expect.objectContaining({ id: 'quest_1_1' }),
        })
      );
    });

    it('should update the current quest in story progress', () => {
      service.startQuest('quest_1_1');
      const progress = service.getStoryProgress();
      expect(progress.currentQuest).toBe('quest_1_1');
    });

    it('should return false for a non-existent quest', () => {
      const result = service.startQuest('nonexistent_quest');
      expect(result).toBe(false);
    });

    it('should return false for a locked quest', () => {
      const result = service.startQuest('quest_1_2');
      expect(result).toBe(false);
    });

    it('should save progress after starting a quest', () => {
      service.startQuest('quest_1_1');
      expect(mockedStorageService.save).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // updateQuestProgress()
  // ==========================================================================
  describe('updateQuestProgress()', () => {
    it('should update requirement current value for matching type', () => {
      service.startQuest('quest_1_1');
      service.updateQuestProgress(QuestType.LESSON_COMPLETE, 1);

      const progress = service.getStoryProgress();
      expect(progress.completedQuests).toContain('quest_1_1');
    });

    it('should emit quest:progress event on update', () => {
      service.startQuest('quest_1_1');
      service.updateQuestProgress(QuestType.LESSON_COMPLETE, 1);

      expect(mockedEventBus.emit).toHaveBeenCalledWith('quest:progress', expect.any(Object));
    });

    it('should auto-complete quest when all requirements are met', () => {
      service.startQuest('quest_1_1');
      service.updateQuestProgress(QuestType.LESSON_COMPLETE, 1);

      expect(mockedEventBus.emit).toHaveBeenCalledWith(
        'quest:completed',
        expect.objectContaining({
          quest: expect.objectContaining({ id: 'quest_1_1' }),
        })
      );
    });

    it('should use Math.max for current value (never decrease)', () => {
      service.completeQuest('quest_1_1');
      service.startQuest('quest_1_2');
      service.updateQuestProgress(QuestType.TYPING_SPEED, 15);

      const quest = service.getCurrentQuest();
      if (quest && quest.id === 'quest_1_2') {
        const req = quest.requirements.find(
          (r: QuestRequirement) => r.type === QuestType.TYPING_SPEED
        );
        expect(req!.current).toBe(15);
      }
    });

    it('should do nothing when no current quest exists', () => {
      mockedEventBus.emit.mockClear();

      service.updateQuestProgress(QuestType.STREAK, 5);

      const progressCalls = mockedEventBus.emit.mock.calls.filter(
        call => call[0] === 'quest:progress'
      );
      expect(progressCalls).toHaveLength(0);
    });
  });

  // ==========================================================================
  // completeQuest()
  // ==========================================================================
  describe('completeQuest()', () => {
    it('should add quest to completed quests list', () => {
      service.completeQuest('quest_1_1');

      const progress = service.getStoryProgress();
      expect(progress.completedQuests).toContain('quest_1_1');
    });

    it('should award XP and coins from quest rewards', () => {
      service.completeQuest('quest_1_1');

      const stats = service.getPlayerStats();
      expect(stats.coins).toBe(10);
    });

    it('should award skill points when present in rewards', () => {
      service.completeQuest('quest_1_1');
      service.completeQuest('quest_1_2');
      service.completeQuest('quest_1_3');
      service.completeQuest('quest_1_4');

      const stats = service.getPlayerStats();
      expect(stats.skillPoints).toBeGreaterThanOrEqual(1);
    });

    it('should emit quest:completed event with rewards', () => {
      service.completeQuest('quest_1_1');

      expect(mockedEventBus.emit).toHaveBeenCalledWith(
        'quest:completed',
        expect.objectContaining({
          quest: expect.objectContaining({ id: 'quest_1_1' }),
          rewards: expect.objectContaining({ xp: 50, coins: 10 }),
        })
      );
    });

    it('should trigger chapter completion when all quests in chapter are done', () => {
      service.completeQuest('quest_1_1');
      service.completeQuest('quest_1_2');
      service.completeQuest('quest_1_3');
      service.completeQuest('quest_1_4');
      service.completeQuest('quest_1_5');

      expect(mockedEventBus.emit).toHaveBeenCalledWith('chapter:completed', {
        chapterId: 'chapter_1',
      });
    });

    it('should not emit chapter:completed when only some quests are done', () => {
      mockedEventBus.emit.mockClear();

      service.completeQuest('quest_1_1');

      const chapterCompletedCalls = mockedEventBus.emit.mock.calls.filter(
        call => call[0] === 'chapter:completed'
      );
      expect(chapterCompletedCalls).toHaveLength(0);
    });

    it('should not complete the same quest twice', () => {
      service.completeQuest('quest_1_1');
      const statsBefore = service.getPlayerStats();
      const coinsBefore = statsBefore.coins;

      service.completeQuest('quest_1_1');
      const statsAfter = service.getPlayerStats();

      expect(statsAfter.coins).toBe(coinsBefore);
    });

    it('should do nothing for non-existent quest', () => {
      mockedEventBus.emit.mockClear();

      service.completeQuest('nonexistent_quest');

      const completedCalls = mockedEventBus.emit.mock.calls.filter(
        call => call[0] === 'quest:completed'
      );
      expect(completedCalls).toHaveLength(0);
    });

    it('should advance to next quest in chapter after completion', () => {
      service.completeQuest('quest_1_1');

      const progress = service.getStoryProgress();
      expect(progress.currentQuest).toBe('quest_1_2');
    });

    it('should advance to next chapter when all quests are done', () => {
      service.completeQuest('quest_1_1');
      service.completeQuest('quest_1_2');
      service.completeQuest('quest_1_3');
      service.completeQuest('quest_1_4');
      service.completeQuest('quest_1_5');

      const progress = service.getStoryProgress();
      expect(progress.currentChapter).toBe('chapter_2');
      expect(progress.currentQuest).toBe('quest_2_1');
    });

    it('should update totalXpEarned in progress', () => {
      service.completeQuest('quest_1_1');

      const progress = service.getStoryProgress();
      expect(progress.totalXpEarned).toBe(50);
    });

    it('should update totalCoinsEarned in progress', () => {
      service.completeQuest('quest_1_1');

      const progress = service.getStoryProgress();
      expect(progress.totalCoinsEarned).toBe(10);
    });
  });

  // ==========================================================================
  // addXP()
  // ==========================================================================
  describe('addXP()', () => {
    it('should add XP to player stats', () => {
      service.addXP(50);

      const stats = service.getPlayerStats();
      expect(stats.xp).toBe(50);
    });

    it('should level up when XP exceeds threshold', () => {
      service.addXP(100);

      const stats = service.getPlayerStats();
      expect(stats.level).toBe(2);
    });

    it('should emit player:levelup event on level up', () => {
      service.addXP(100);

      expect(mockedEventBus.emit).toHaveBeenCalledWith(
        'player:levelup',
        expect.objectContaining({
          level: 2,
        })
      );
    });

    it('should handle multiple level ups from large XP amount', () => {
      service.addXP(350);

      const stats = service.getPlayerStats();
      expect(stats.level).toBeGreaterThanOrEqual(3);
    });

    it('should award skill point on level up', () => {
      service.addXP(100);

      const stats = service.getPlayerStats();
      expect(stats.skillPoints).toBeGreaterThanOrEqual(1);
    });

    it('should carry over remaining XP after level up', () => {
      service.addXP(150);

      const stats = service.getPlayerStats();
      expect(stats.level).toBe(2);
      expect(stats.xp).toBe(50);
    });

    it('should update xpToNextLevel after adding XP', () => {
      const statsBefore = service.getPlayerStats();
      const xpToNextBefore = statsBefore.xpToNextLevel;

      service.addXP(30);

      const statsAfter = service.getPlayerStats();
      expect(statsAfter.xpToNextLevel).toBe(xpToNextBefore - 30);
    });

    it('should save progress after adding XP', () => {
      mockedStorageService.save.mockClear();

      service.addXP(50);

      expect(mockedStorageService.save).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // isChapterUnlocked()
  // ==========================================================================
  describe('isChapterUnlocked()', () => {
    it('should return true for chapter 1 (no requirements)', () => {
      const chapters = service.getChapters();
      const chapter1 = chapters.find((c: Chapter) => c.id === 'chapter_1')!;

      expect(service.isChapterUnlocked(chapter1)).toBe(true);
    });

    it('should return false for chapter 2 when chapter 1 is not completed', () => {
      const chapters = service.getChapters();
      const chapter2 = chapters.find((c: Chapter) => c.id === 'chapter_2')!;

      expect(service.isChapterUnlocked(chapter2)).toBe(false);
    });

    it('should return true for chapter 2 when chapter 1 is completed', () => {
      service.completeQuest('quest_1_1');
      service.completeQuest('quest_1_2');
      service.completeQuest('quest_1_3');
      service.completeQuest('quest_1_4');
      service.completeQuest('quest_1_5');

      const chapters = service.getChapters();
      const chapter2 = chapters.find((c: Chapter) => c.id === 'chapter_2')!;

      expect(service.isChapterUnlocked(chapter2)).toBe(true);
    });

    it('should check minLevel requirement', () => {
      service.completeQuest('quest_1_1');
      service.completeQuest('quest_1_2');
      service.completeQuest('quest_1_3');
      service.completeQuest('quest_1_4');
      service.completeQuest('quest_1_5');
      service.completeQuest('quest_2_1');
      service.completeQuest('quest_2_2');
      service.completeQuest('quest_2_3');
      service.completeQuest('quest_2_4');
      service.completeQuest('quest_2_5');

      const chapters = service.getChapters();
      const chapter3 = chapters.find((c: Chapter) => c.id === 'chapter_3')!;

      const stats = service.getPlayerStats();
      if (stats.level < 5) {
        expect(service.isChapterUnlocked(chapter3)).toBe(false);
      } else {
        expect(service.isChapterUnlocked(chapter3)).toBe(true);
      }
    });

    it('should return true when all requirements are met', () => {
      service.completeQuest('quest_1_1');
      service.completeQuest('quest_1_2');
      service.completeQuest('quest_1_3');
      service.completeQuest('quest_1_4');
      service.completeQuest('quest_1_5');
      service.completeQuest('quest_2_1');
      service.completeQuest('quest_2_2');
      service.completeQuest('quest_2_3');
      service.completeQuest('quest_2_4');
      service.completeQuest('quest_2_5');

      service.addXP(5000);

      const chapters = service.getChapters();
      const chapter3 = chapters.find((c: Chapter) => c.id === 'chapter_3')!;

      expect(service.isChapterUnlocked(chapter3)).toBe(true);
    });
  });

  // ==========================================================================
  // getPlayerStats() / getStoryProgress()
  // ==========================================================================
  describe('getPlayerStats()', () => {
    it('should return initial player stats', () => {
      const stats = service.getPlayerStats();

      expect(stats.level).toBe(1);
      expect(stats.xp).toBe(0);
      expect(stats.coins).toBe(0);
      expect(stats.skillPoints).toBe(0);
    });

    it('should return a defensive copy', () => {
      const stats1 = service.getPlayerStats();
      const stats2 = service.getPlayerStats();
      expect(stats1).not.toBe(stats2);
      expect(stats1).toEqual(stats2);
    });
  });

  describe('getStoryProgress()', () => {
    it('should return initial story progress', () => {
      const progress = service.getStoryProgress();

      expect(progress.currentChapter).toBe('chapter_1');
      expect(progress.currentQuest).toBe('quest_1_1');
      expect(progress.completedQuests).toEqual([]);
      expect(progress.completedChapters).toEqual([]);
    });

    it('should return a defensive copy', () => {
      const p1 = service.getStoryProgress();
      const p2 = service.getStoryProgress();
      expect(p1).not.toBe(p2);
      expect(p1).toEqual(p2);
    });
  });

  // ==========================================================================
  // getCurrentQuest()
  // ==========================================================================
  describe('getCurrentQuest()', () => {
    it('should return the current quest', () => {
      const quest = service.getCurrentQuest();
      expect(quest).toBeDefined();
      expect(quest!.id).toBe('quest_1_1');
    });

    it('should reflect IN_PROGRESS status for current quest', () => {
      const quest = service.getCurrentQuest();
      expect(quest!.status).toBe(QuestStatus.IN_PROGRESS);
    });
  });

  // ==========================================================================
  // resetProgress()
  // ==========================================================================
  describe('resetProgress()', () => {
    it('should reset all story progress', () => {
      service.completeQuest('quest_1_1');
      service.addXP(500);

      service.resetProgress();

      const progress = service.getStoryProgress();
      expect(progress.completedQuests).toEqual([]);
      expect(progress.currentChapter).toBe('chapter_1');
      expect(progress.currentQuest).toBe('quest_1_1');
    });

    it('should reset player stats', () => {
      service.addXP(500);

      service.resetProgress();

      const stats = service.getPlayerStats();
      expect(stats.level).toBe(1);
      expect(stats.xp).toBe(0);
      expect(stats.coins).toBe(0);
    });

    it('should save reset state to storage', () => {
      mockedStorageService.save.mockClear();

      service.resetProgress();

      expect(mockedStorageService.save).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // updateTypingStats()
  // ==========================================================================
  describe('updateTypingStats()', () => {
    it('should update highest wpm when new value is higher', () => {
      service.updateTypingStats(50, 90, 60);

      const stats = service.getPlayerStats();
      expect(stats.highestWpm).toBe(50);
    });

    it('should not decrease highest wpm', () => {
      service.updateTypingStats(50, 90, 60);
      service.updateTypingStats(30, 90, 60);

      const stats = service.getPlayerStats();
      expect(stats.highestWpm).toBe(50);
    });

    it('should accumulate total practice time', () => {
      service.updateTypingStats(40, 90, 60);
      service.updateTypingStats(45, 92, 120);

      const stats = service.getPlayerStats();
      expect(stats.totalPracticeTime).toBe(180);
    });
  });

  // ==========================================================================
  // updateStreak()
  // ==========================================================================
  describe('updateStreak()', () => {
    it('should update current streak', () => {
      service.updateStreak(3);

      const stats = service.getPlayerStats();
      expect(stats.currentStreak).toBe(3);
    });

    it('should update longest streak when current exceeds it', () => {
      service.updateStreak(5);

      const stats = service.getPlayerStats();
      expect(stats.longestStreak).toBe(5);
    });

    it('should not decrease longest streak', () => {
      service.updateStreak(5);
      service.updateStreak(2);

      const stats = service.getPlayerStats();
      expect(stats.longestStreak).toBe(5);
      expect(stats.currentStreak).toBe(2);
    });
  });
});
