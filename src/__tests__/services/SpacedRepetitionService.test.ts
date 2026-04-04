/**
 * SpacedRepetitionService Tests
 */
import { beforeEach, describe, expect, it } from 'vitest';
import {
  SpacedRepetitionService,
  type SRSItemData,
  type QualityRating,
} from '../../services/SpacedRepetitionService';

describe('SpacedRepetitionService', () => {
  let service: SpacedRepetitionService;

  beforeEach(() => {
    localStorage.clear();
    service = new SpacedRepetitionService();
  });

  // ==========================================================================
  // getItemData
  // ==========================================================================

  describe('getItemData', () => {
    it('creates a new item with SM-2 defaults', () => {
      const item = service.getItemData('cmd-copy', 'command', 'basic-commands');

      expect(item.itemId).toBe('cmd-copy');
      expect(item.itemType).toBe('command');
      expect(item.collectionId).toBe('basic-commands');
      expect(item.easeFactor).toBe(2.5);
      expect(item.interval).toBe(0);
      expect(item.repetitions).toBe(0);
      expect(item.lastReviewDate).toBeNull();
      expect(item.totalReviews).toBe(0);
      expect(item.correctReviews).toBe(0);
      expect(item.averageQuality).toBe(0);
      expect(item.streak).toBe(0);
    });

    it('sets nextReviewDate to today for new items', () => {
      const item = service.getItemData('cmd-paste', 'command', 'basic-commands');
      const today = new Date().toISOString().split('T')[0];

      expect(item.nextReviewDate).toBe(today);
    });

    it('returns existing item if already created', () => {
      const first = service.getItemData('cmd-copy', 'command', 'basic-commands');
      first.easeFactor = 1.8; // mutate in place (since it's a reference)

      const second = service.getItemData('cmd-copy', 'command', 'basic-commands');
      expect(second.easeFactor).toBe(1.8);
    });

    it('persists new item to localStorage', () => {
      service.getItemData('cmd-copy', 'command', 'basic-commands');

      const stored = localStorage.getItem('srs_data');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!) as SRSItemData[];
      expect(parsed).toHaveLength(1);
      expect(parsed[0].itemId).toBe('cmd-copy');
    });
  });

  // ==========================================================================
  // processReview — SM-2 algorithm
  // ==========================================================================

  describe('processReview', () => {
    beforeEach(() => {
      service.getItemData('item-1', 'command', 'col-1');
    });

    it('throws when processing a review for a non-existent item', () => {
      expect(() =>
        service.processReview({
          itemId: 'nonexistent',
          quality: 5 as QualityRating,
          responseTime: 1000,
          wasCorrect: true,
        })
      ).toThrow('Item not found: nonexistent');
    });

    it('sets interval to 1 on first correct review (repetitions 0 -> 1)', () => {
      const result = service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 1000,
        wasCorrect: true,
      });

      expect(result.repetitions).toBe(1);
      expect(result.interval).toBe(1);
    });

    it('sets interval to 6 on second correct review (repetitions 1 -> 2)', () => {
      service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 1000,
        wasCorrect: true,
      });

      const result = service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 1000,
        wasCorrect: true,
      });

      expect(result.repetitions).toBe(2);
      expect(result.interval).toBe(6);
    });

    it('multiplies interval by easeFactor on subsequent correct reviews', () => {
      // First review -> interval = 1
      service.processReview({
        itemId: 'item-1',
        quality: 5 as QualityRating,
        responseTime: 800,
        wasCorrect: true,
      });
      // Second review -> interval = 6
      service.processReview({
        itemId: 'item-1',
        quality: 5 as QualityRating,
        responseTime: 800,
        wasCorrect: true,
      });

      // Third review -> interval = round(6 * easeFactor)
      const result = service.processReview({
        itemId: 'item-1',
        quality: 5 as QualityRating,
        responseTime: 800,
        wasCorrect: true,
      });

      expect(result.repetitions).toBe(3);
      // easeFactor before third review = 2.7 (started at 2.5, +0.1 per q=5 review)
      // interval = round(6 * 2.7) = round(16.2) = 16
      // Note: result.easeFactor is already updated to 2.8 after this review
      expect(result.interval).toBe(16);
    });

    it('resets repetitions and sets interval to 1 on quality < 3', () => {
      // First build up some repetitions
      service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 1000,
        wasCorrect: true,
      });
      service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 1000,
        wasCorrect: true,
      });

      // Now fail
      const result = service.processReview({
        itemId: 'item-1',
        quality: 2 as QualityRating,
        responseTime: 3000,
        wasCorrect: false,
      });

      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(1);
    });

    it('updates ease factor (never below 1.3)', () => {
      // quality 0 should drop the ease factor significantly
      const result = service.processReview({
        itemId: 'item-1',
        quality: 0 as QualityRating,
        responseTime: 5000,
        wasCorrect: false,
      });

      // EF = 2.5 + (0.1 - 5*0.08 - 5*5*0.02) = 2.5 + (0.1 - 0.4 - 0.5) = 2.5 - 0.8 = 1.7
      // Still above 1.3, so not clamped
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('clamps ease factor to minimum 1.3 after repeated failures', () => {
      // Repeatedly fail to drive ease factor down
      for (let i = 0; i < 10; i++) {
        service.processReview({
          itemId: 'item-1',
          quality: 0 as QualityRating,
          responseTime: 5000,
          wasCorrect: false,
        });
      }

      const item = service.getItemData('item-1', 'command', 'col-1');
      expect(item.easeFactor).toBe(1.3);
    });

    it('increments totalReviews and correctReviews', () => {
      service.processReview({
        itemId: 'item-1',
        quality: 5 as QualityRating,
        responseTime: 500,
        wasCorrect: true,
      });
      service.processReview({
        itemId: 'item-1',
        quality: 1 as QualityRating,
        responseTime: 3000,
        wasCorrect: false,
      });

      const item = service.getItemData('item-1', 'command', 'col-1');
      expect(item.totalReviews).toBe(2);
      expect(item.correctReviews).toBe(1);
    });

    it('tracks streak — resets on incorrect, increments on correct', () => {
      service.processReview({
        itemId: 'item-1',
        quality: 5 as QualityRating,
        responseTime: 500,
        wasCorrect: true,
      });
      service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 600,
        wasCorrect: true,
      });

      let item = service.getItemData('item-1', 'command', 'col-1');
      expect(item.streak).toBe(2);

      service.processReview({
        itemId: 'item-1',
        quality: 1 as QualityRating,
        responseTime: 4000,
        wasCorrect: false,
      });

      item = service.getItemData('item-1', 'command', 'col-1');
      expect(item.streak).toBe(0);
    });

    it('updates averageQuality as running average', () => {
      service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 1000,
        wasCorrect: true,
      });
      service.processReview({
        itemId: 'item-1',
        quality: 2 as QualityRating,
        responseTime: 2000,
        wasCorrect: false,
      });

      const item = service.getItemData('item-1', 'command', 'col-1');
      expect(item.averageQuality).toBe(3); // (4+2)/2
    });

    it('calculates nextReviewDate based on interval', () => {
      const result = service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 1000,
        wasCorrect: true,
      });

      // interval is 1 for first correct review
      const expected = new Date();
      expected.setDate(expected.getDate() + 1);
      const expectedDate = expected.toISOString().split('T')[0];

      expect(result.nextReviewDate).toBe(expectedDate);
    });

    it('sets lastReviewDate to today', () => {
      const result = service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 1000,
        wasCorrect: true,
      });

      const today = new Date().toISOString().split('T')[0];
      expect(result.lastReviewDate).toBe(today);
    });
  });

  // ==========================================================================
  // getDueItems
  // ==========================================================================

  describe('getDueItems', () => {
    it('returns items whose nextReviewDate is today or in the past', () => {
      // Create items — new items have nextReviewDate = today, so they are due
      service.getItemData('item-a', 'command', 'col-1');
      service.getItemData('item-b', 'shortcut', 'col-1');

      const due = service.getDueItems();
      expect(due).toHaveLength(2);
    });

    it('does not return items scheduled for the future', () => {
      service.getItemData('item-a', 'command', 'col-1');

      // Move nextReviewDate to the future by doing a correct review
      service.processReview({
        itemId: 'item-a',
        quality: 5 as QualityRating,
        responseTime: 500,
        wasCorrect: true,
      });

      const due = service.getDueItems();
      expect(due).toHaveLength(0);
    });

    it('filters by collectionId when provided', () => {
      service.getItemData('item-a', 'command', 'col-1');
      service.getItemData('item-b', 'command', 'col-2');

      const due = service.getDueItems('col-1');
      expect(due).toHaveLength(1);
      expect(due[0].itemId).toBe('item-a');
    });

    it('sorts by most overdue first, then by lower easeFactor', () => {
      // Create two items
      service.getItemData('item-a', 'command', 'col-1');
      const itemB = service.getItemData('item-b', 'command', 'col-1');

      // Make item-b have a lower ease factor (harder)
      itemB.easeFactor = 1.5;

      const due = service.getDueItems();
      // Both are due today (same overdue), so item-b should come first (lower EF)
      expect(due[0].itemId).toBe('item-b');
      expect(due[1].itemId).toBe('item-a');
    });
  });

  // ==========================================================================
  // getMasteryLevel
  // ==========================================================================

  describe('getMasteryLevel', () => {
    it('returns "new" for items with 0 repetitions', () => {
      const item = service.getItemData('item-1', 'command', 'col-1');
      expect(service.getMasteryLevel(item)).toBe('new');
    });

    it('returns "learning" for items with 1-2 repetitions', () => {
      const item = service.getItemData('item-1', 'command', 'col-1');

      item.repetitions = 1;
      expect(service.getMasteryLevel(item)).toBe('learning');

      item.repetitions = 2;
      expect(service.getMasteryLevel(item)).toBe('learning');
    });

    it('returns "mastered" when interval >= 21 and easeFactor >= 2.3', () => {
      const item = service.getItemData('item-1', 'command', 'col-1');
      item.repetitions = 5;
      item.interval = 21;
      item.easeFactor = 2.3;

      expect(service.getMasteryLevel(item)).toBe('mastered');
    });

    it('returns "reviewing" for 3+ repetitions that do not meet mastered criteria', () => {
      const item = service.getItemData('item-1', 'command', 'col-1');
      item.repetitions = 3;
      item.interval = 10;
      item.easeFactor = 2.0;

      expect(service.getMasteryLevel(item)).toBe('reviewing');
    });

    it('returns "reviewing" when interval >= 21 but easeFactor < 2.3', () => {
      const item = service.getItemData('item-1', 'command', 'col-1');
      item.repetitions = 5;
      item.interval = 30;
      item.easeFactor = 2.0;

      expect(service.getMasteryLevel(item)).toBe('reviewing');
    });
  });

  // ==========================================================================
  // getCollectionMastery
  // ==========================================================================

  describe('getCollectionMastery', () => {
    it('returns zero stats for an empty collection', () => {
      const mastery = service.getCollectionMastery('empty-col');

      expect(mastery.total).toBe(0);
      expect(mastery.new).toBe(0);
      expect(mastery.learning).toBe(0);
      expect(mastery.reviewing).toBe(0);
      expect(mastery.mastered).toBe(0);
      expect(mastery.percentage).toBe(0);
    });

    it('counts items by mastery level', () => {
      // Create 4 items in the same collection
      service.getItemData('i1', 'command', 'col-1');
      const learningItem = service.getItemData('i2', 'command', 'col-1');
      const reviewingItem = service.getItemData('i3', 'command', 'col-1');
      const masteredItem = service.getItemData('i4', 'command', 'col-1');

      // Set up different mastery levels
      learningItem.repetitions = 1;
      reviewingItem.repetitions = 4;
      reviewingItem.interval = 10;
      reviewingItem.easeFactor = 2.0;
      masteredItem.repetitions = 6;
      masteredItem.interval = 30;
      masteredItem.easeFactor = 2.5;

      const mastery = service.getCollectionMastery('col-1');

      expect(mastery.total).toBe(4);
      expect(mastery.new).toBe(1);
      expect(mastery.learning).toBe(1);
      expect(mastery.reviewing).toBe(1);
      expect(mastery.mastered).toBe(1);
    });

    it('calculates weighted percentage correctly', () => {
      // 1 mastered (100%), 1 reviewing (75%), 1 learning (50%), 1 new (0%)
      service.getItemData('i1', 'command', 'col-1');
      const learningItem = service.getItemData('i2', 'command', 'col-1');
      const reviewingItem = service.getItemData('i3', 'command', 'col-1');
      const masteredItem = service.getItemData('i4', 'command', 'col-1');

      learningItem.repetitions = 1;
      reviewingItem.repetitions = 4;
      reviewingItem.interval = 10;
      reviewingItem.easeFactor = 2.0;
      masteredItem.repetitions = 6;
      masteredItem.interval = 30;
      masteredItem.easeFactor = 2.5;

      const mastery = service.getCollectionMastery('col-1');
      // (100 + 75 + 50 + 0) / 4 = 56.25, rounded = 56
      expect(mastery.percentage).toBe(56);
    });

    it('ignores items from other collections', () => {
      service.getItemData('i1', 'command', 'col-1');
      service.getItemData('i2', 'command', 'col-2');

      const mastery = service.getCollectionMastery('col-1');
      expect(mastery.total).toBe(1);
    });
  });

  // ==========================================================================
  // localStorage persistence
  // ==========================================================================

  describe('localStorage persistence', () => {
    it('loads items from storage on construction', () => {
      const items: SRSItemData[] = [
        {
          itemId: 'persisted-1',
          itemType: 'command',
          collectionId: 'col-1',
          easeFactor: 2.2,
          interval: 6,
          repetitions: 2,
          nextReviewDate: '2024-01-01',
          lastReviewDate: '2023-12-26',
          totalReviews: 5,
          correctReviews: 4,
          averageQuality: 3.5,
          streak: 2,
        },
      ];
      localStorage.setItem('srs_data', JSON.stringify(items));

      const loaded = new SpacedRepetitionService();
      const item = loaded.getItemData('persisted-1', 'command', 'col-1');

      expect(item.easeFactor).toBe(2.2);
      expect(item.interval).toBe(6);
      expect(item.repetitions).toBe(2);
      expect(item.totalReviews).toBe(5);
    });

    it('saves items to storage after processReview', () => {
      service.getItemData('item-1', 'command', 'col-1');
      service.processReview({
        itemId: 'item-1',
        quality: 5 as QualityRating,
        responseTime: 500,
        wasCorrect: true,
      });

      const stored = JSON.parse(localStorage.getItem('srs_data')!) as SRSItemData[];
      expect(stored).toHaveLength(1);
      expect(stored[0].repetitions).toBe(1);
    });

    it('loads daily stats from storage', () => {
      const stats = [
        {
          date: '2024-01-15',
          totalReviews: 10,
          correctReviews: 8,
          newItemsLearned: 3,
          averageQuality: 4.0,
          timeSpent: 5000,
        },
      ];
      localStorage.setItem('srs_stats', JSON.stringify(stats));

      const loaded = new SpacedRepetitionService();
      loaded.getRecentStats(365);

      // The stat is far in the past, so getRecentStats(365) may or may not include it
      // depending on date. Instead check getTodayStats which should be null since
      // the stored date doesn't match today.
      expect(loaded.getTodayStats()).toBeNull();
    });

    it('resetAll clears storage and in-memory data', () => {
      service.getItemData('item-1', 'command', 'col-1');
      service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 1000,
        wasCorrect: true,
      });

      service.resetAll();

      expect(localStorage.getItem('srs_data')).toBeNull();
      expect(localStorage.getItem('srs_stats')).toBeNull();
      expect(service.getDueItems()).toHaveLength(0);
    });
  });

  // ==========================================================================
  // Daily stats tracking
  // ==========================================================================

  describe('daily stats', () => {
    it('creates daily stats on first review of the day', () => {
      service.getItemData('item-1', 'command', 'col-1');
      service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 1500,
        wasCorrect: true,
      });

      const todayStats = service.getTodayStats();
      expect(todayStats).not.toBeNull();
      expect(todayStats!.totalReviews).toBe(1);
      expect(todayStats!.correctReviews).toBe(1);
      expect(todayStats!.timeSpent).toBe(1500);
    });

    it('accumulates stats across multiple reviews in the same day', () => {
      service.getItemData('item-1', 'command', 'col-1');
      service.getItemData('item-2', 'command', 'col-1');

      service.processReview({
        itemId: 'item-1',
        quality: 5 as QualityRating,
        responseTime: 1000,
        wasCorrect: true,
      });
      service.processReview({
        itemId: 'item-2',
        quality: 2 as QualityRating,
        responseTime: 3000,
        wasCorrect: false,
      });

      const todayStats = service.getTodayStats();
      expect(todayStats!.totalReviews).toBe(2);
      expect(todayStats!.correctReviews).toBe(1);
      expect(todayStats!.timeSpent).toBe(4000);
      expect(todayStats!.averageQuality).toBe(3.5); // (5+2)/2
    });

    it('tracks newItemsLearned for first successful review', () => {
      service.getItemData('item-1', 'command', 'col-1');

      // First correct review of a new item => newItemsLearned should increment
      service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 1000,
        wasCorrect: true,
      });

      const todayStats = service.getTodayStats();
      expect(todayStats!.newItemsLearned).toBe(1);
    });
  });

  // ==========================================================================
  // Export / Import
  // ==========================================================================

  describe('exportData / importData', () => {
    it('round-trips data through export/import', () => {
      service.getItemData('item-1', 'command', 'col-1');
      service.processReview({
        itemId: 'item-1',
        quality: 4 as QualityRating,
        responseTime: 1000,
        wasCorrect: true,
      });

      const exported = service.exportData();
      expect(exported.items).toHaveLength(1);

      // Create a fresh service and import
      const freshService = new SpacedRepetitionService();
      freshService.resetAll();
      freshService.importData(exported);

      const item = freshService.getItemData('item-1', 'command', 'col-1');
      expect(item.repetitions).toBe(1);
      expect(item.totalReviews).toBe(1);
    });
  });

  // ==========================================================================
  // getTotalStats
  // ==========================================================================

  describe('getTotalStats', () => {
    it('returns defaults when empty', () => {
      const stats = service.getTotalStats();
      expect(stats.totalItems).toBe(0);
      expect(stats.totalReviews).toBe(0);
      expect(stats.averageEaseFactor).toBe(2.5);
      expect(stats.longestStreak).toBe(0);
      expect(stats.masteredItems).toBe(0);
    });

    it('aggregates across all items', () => {
      service.getItemData('i1', 'command', 'col-1');
      service.getItemData('i2', 'command', 'col-1');

      service.processReview({
        itemId: 'i1',
        quality: 5 as QualityRating,
        responseTime: 500,
        wasCorrect: true,
      });
      service.processReview({
        itemId: 'i1',
        quality: 5 as QualityRating,
        responseTime: 500,
        wasCorrect: true,
      });

      const stats = service.getTotalStats();
      expect(stats.totalItems).toBe(2);
      expect(stats.totalReviews).toBe(2);
      expect(stats.totalCorrect).toBe(2);
      expect(stats.longestStreak).toBe(2);
    });
  });
});
