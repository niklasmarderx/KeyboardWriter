/**
 * SkillTreeService Tests
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SkillEffectType } from '../../domain/models/SkillTree';

// Mock StorageService before importing SkillTreeService
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
  },
}));

// We must dynamically import the singleton so we can reset modules between tests.
// However, vi.mock hoists stay active across resets, so the mocks remain.
let SkillTreeService: typeof import('../../services/SkillTreeService').SkillTreeService;
let StorageService: typeof import('../../core/StorageService').StorageService;
let EventBus: typeof import('../../core/EventBus').EventBus;

async function freshImports() {
  vi.resetModules();
  const stsMod = await import('../../services/SkillTreeService');
  const storageMod = await import('../../core/StorageService');
  const eventMod = await import('../../core/EventBus');
  SkillTreeService = stsMod.SkillTreeService;
  StorageService = storageMod.StorageService;
  EventBus = eventMod.EventBus;
}

describe('SkillTreeService', () => {
  beforeEach(async () => {
    await freshImports();
  });

  // ==========================================================================
  // canUpgradeSkill
  // ==========================================================================

  describe('canUpgradeSkill', () => {
    it('returns false for a non-existent skill', () => {
      const result = SkillTreeService.canUpgradeSkill('non_existent_skill');
      expect(result.canUpgrade).toBe(false);
      expect(result.reason).toBeDefined();
    });

    it('returns false when insufficient skill points', () => {
      // home_row_master costs 1 point per level, and we have 0 points
      const result = SkillTreeService.canUpgradeSkill('home_row_master');
      expect(result.canUpgrade).toBe(false);
      expect(result.reason).toContain('Skill-Punkte');
    });

    it('returns false when prerequisites are not met', () => {
      // finger_independence requires home_row_master
      SkillTreeService.addSkillPoints(10);

      const result = SkillTreeService.canUpgradeSkill('finger_independence');
      expect(result.canUpgrade).toBe(false);
      expect(result.reason).toContain('Voraussetzungen');
    });

    it('returns true when enough points and no prerequisites', () => {
      SkillTreeService.addSkillPoints(5);

      // home_row_master has no prerequisites and costs 1 point
      const result = SkillTreeService.canUpgradeSkill('home_row_master');
      expect(result.canUpgrade).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('returns true when prerequisites are met', () => {
      SkillTreeService.addSkillPoints(10);

      // Unlock home_row_master first
      SkillTreeService.upgradeSkill('home_row_master');

      // Now finger_independence should be upgradeable
      const result = SkillTreeService.canUpgradeSkill('finger_independence');
      expect(result.canUpgrade).toBe(true);
    });

    it('returns false when at max level', () => {
      SkillTreeService.addSkillPoints(20);

      // home_row_master has maxLevel=3, upgrade it 3 times
      SkillTreeService.upgradeSkill('home_row_master');
      SkillTreeService.upgradeSkill('home_row_master');
      SkillTreeService.upgradeSkill('home_row_master');

      const result = SkillTreeService.canUpgradeSkill('home_row_master');
      expect(result.canUpgrade).toBe(false);
      expect(result.reason).toContain('Maximales Level');
    });

    it('only checks prerequisites for level 0 -> 1', () => {
      SkillTreeService.addSkillPoints(20);

      // Unlock home_row_master, then finger_independence
      SkillTreeService.upgradeSkill('home_row_master');
      SkillTreeService.upgradeSkill('finger_independence');

      // Upgrading finger_independence from level 1 -> 2 should not re-check prerequisites
      const result = SkillTreeService.canUpgradeSkill('finger_independence');
      expect(result.canUpgrade).toBe(true);
    });
  });

  // ==========================================================================
  // upgradeSkill
  // ==========================================================================

  describe('upgradeSkill', () => {
    it('returns failure when skill cannot be upgraded', () => {
      const result = SkillTreeService.upgradeSkill('home_row_master');
      expect(result.success).toBe(false);
      expect(result.pointsSpent).toBe(0);
      expect(result.newLevel).toBe(0);
    });

    it('deducts points and updates level on success', () => {
      SkillTreeService.addSkillPoints(5);

      const result = SkillTreeService.upgradeSkill('home_row_master');
      expect(result.success).toBe(true);
      expect(result.pointsSpent).toBe(1); // costPerLevel = 1
      expect(result.newLevel).toBe(1);

      const progress = SkillTreeService.getProgress();
      expect(progress.availableSkillPoints).toBe(4);
      expect(progress.spentSkillPoints).toBe(1);
    });

    it('adds skill to unlockedSkills on first upgrade', () => {
      SkillTreeService.addSkillPoints(5);
      SkillTreeService.upgradeSkill('home_row_master');

      const progress = SkillTreeService.getProgress();
      expect(progress.unlockedSkills).toContain('home_row_master');
    });

    it('does not duplicate in unlockedSkills on subsequent upgrades', () => {
      SkillTreeService.addSkillPoints(5);
      SkillTreeService.upgradeSkill('home_row_master');
      SkillTreeService.upgradeSkill('home_row_master');

      const progress = SkillTreeService.getProgress();
      const count = progress.unlockedSkills.filter(s => s === 'home_row_master').length;
      expect(count).toBe(1);
    });

    it('applies effects only when first unlocked (level 0 -> 1)', () => {
      SkillTreeService.addSkillPoints(10);

      SkillTreeService.upgradeSkill('home_row_master');
      const effectsAfterFirst = SkillTreeService.getActiveEffects();
      const effectCountAfterFirst = effectsAfterFirst.length;

      SkillTreeService.upgradeSkill('home_row_master');
      const effectsAfterSecond = SkillTreeService.getActiveEffects();
      expect(effectsAfterSecond.length).toBe(effectCountAfterFirst);
    });

    it('emits skill:unlocked event', () => {
      SkillTreeService.addSkillPoints(5);
      vi.mocked(EventBus.emit).mockClear();

      SkillTreeService.upgradeSkill('home_row_master');

      expect(EventBus.emit).toHaveBeenCalledWith('skill:unlocked', {
        skillId: 'home_row_master',
        category: 'typing_basics',
      });
    });

    it('emits skill:effect:applied event when effects are applied', () => {
      SkillTreeService.addSkillPoints(5);
      vi.mocked(EventBus.emit).mockClear();

      SkillTreeService.upgradeSkill('home_row_master');

      expect(EventBus.emit).toHaveBeenCalledWith('skill:effect:applied', {
        skillId: 'home_row_master',
        effectType: SkillEffectType.ACCURACY_BONUS,
      });
    });

    it('saves progress to storage', () => {
      SkillTreeService.addSkillPoints(5);
      vi.mocked(StorageService.save).mockClear();

      SkillTreeService.upgradeSkill('home_row_master');

      expect(StorageService.save).toHaveBeenCalledWith(
        'keyboardwriter_skill_tree',
        expect.objectContaining({
          spentSkillPoints: 1,
          unlockedSkills: expect.arrayContaining(['home_row_master']),
        })
      );
    });
  });

  // ==========================================================================
  // getEffectBonus
  // ==========================================================================

  describe('getEffectBonus', () => {
    it('returns 0 when no effects are active', () => {
      const bonus = SkillTreeService.getEffectBonus(SkillEffectType.WPM_BONUS);
      expect(bonus).toBe(0);
    });

    it('returns the effect value after unlocking a skill', () => {
      SkillTreeService.addSkillPoints(5);
      SkillTreeService.upgradeSkill('home_row_master');

      // home_row_master gives ACCURACY_BONUS with value 2
      const bonus = SkillTreeService.getEffectBonus(SkillEffectType.ACCURACY_BONUS);
      expect(bonus).toBe(2);
    });

    it('aggregates multiple active effects of the same type', () => {
      SkillTreeService.addSkillPoints(50);

      // Unlock home_row_master (ACCURACY_BONUS = 2)
      SkillTreeService.upgradeSkill('home_row_master');
      // Unlock steady_hands (ACCURACY_BONUS = 2), prereq: home_row_master
      SkillTreeService.upgradeSkill('steady_hands');

      const bonus = SkillTreeService.getEffectBonus(SkillEffectType.ACCURACY_BONUS);
      expect(bonus).toBe(4); // 2 + 2
    });

    it('returns 0 for effect types not present in active effects', () => {
      SkillTreeService.addSkillPoints(5);
      SkillTreeService.upgradeSkill('home_row_master');

      // home_row_master gives ACCURACY_BONUS, not WPM_BONUS
      const bonus = SkillTreeService.getEffectBonus(SkillEffectType.WPM_BONUS);
      expect(bonus).toBe(0);
    });
  });

  // ==========================================================================
  // addSkillPoints
  // ==========================================================================

  describe('addSkillPoints', () => {
    it('increments available and total skill points', () => {
      SkillTreeService.addSkillPoints(10);
      const progress = SkillTreeService.getProgress();

      expect(progress.totalSkillPoints).toBe(10);
      expect(progress.availableSkillPoints).toBe(10);
    });

    it('accumulates points across multiple calls', () => {
      SkillTreeService.addSkillPoints(5);
      SkillTreeService.addSkillPoints(3);
      const progress = SkillTreeService.getProgress();

      expect(progress.totalSkillPoints).toBe(8);
      expect(progress.availableSkillPoints).toBe(8);
    });

    it('saves progress after adding points', () => {
      vi.mocked(StorageService.save).mockClear();
      SkillTreeService.addSkillPoints(5);

      expect(StorageService.save).toHaveBeenCalledWith(
        'keyboardwriter_skill_tree',
        expect.objectContaining({
          totalSkillPoints: 5,
          availableSkillPoints: 5,
        })
      );
    });
  });

  // ==========================================================================
  // getProgress
  // ==========================================================================

  describe('getProgress', () => {
    it('returns default progress initially', () => {
      const progress = SkillTreeService.getProgress();

      expect(progress.totalSkillPoints).toBe(0);
      expect(progress.availableSkillPoints).toBe(0);
      expect(progress.spentSkillPoints).toBe(0);
      expect(progress.unlockedSkills).toEqual([]);
      expect(progress.skillLevels).toEqual({});
      expect(progress.activeEffects).toEqual([]);
    });

    it('returns a copy (not a reference) of the progress', () => {
      const progress1 = SkillTreeService.getProgress();
      progress1.totalSkillPoints = 999;

      const progress2 = SkillTreeService.getProgress();
      expect(progress2.totalSkillPoints).toBe(0);
    });

    it('reflects changes after skill upgrades', () => {
      SkillTreeService.addSkillPoints(10);
      SkillTreeService.upgradeSkill('home_row_master');

      const progress = SkillTreeService.getProgress();
      expect(progress.spentSkillPoints).toBe(1);
      expect(progress.availableSkillPoints).toBe(9);
      expect(progress.skillLevels['home_row_master']).toBe(1);
      expect(progress.unlockedSkills).toContain('home_row_master');
      expect(progress.activeEffects.length).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // getSkill / getCategories
  // ==========================================================================

  describe('getSkill', () => {
    it('returns undefined for non-existent skill', () => {
      expect(SkillTreeService.getSkill('not_a_skill')).toBeUndefined();
    });

    it('returns skill with current state', () => {
      SkillTreeService.addSkillPoints(5);
      SkillTreeService.upgradeSkill('home_row_master');

      const skill = SkillTreeService.getSkill('home_row_master');
      expect(skill).toBeDefined();
      expect(skill!.currentLevel).toBe(1);
      expect(skill!.isUnlocked).toBe(true);
    });
  });

  // ==========================================================================
  // resetSkillTree
  // ==========================================================================

  describe('resetSkillTree', () => {
    it('refunds all spent points', () => {
      SkillTreeService.addSkillPoints(10);
      SkillTreeService.upgradeSkill('home_row_master');
      SkillTreeService.upgradeSkill('home_row_master');

      const refunded = SkillTreeService.resetSkillTree();
      expect(refunded).toBe(2); // 1 + 1

      const progress = SkillTreeService.getProgress();
      expect(progress.availableSkillPoints).toBe(10);
      expect(progress.spentSkillPoints).toBe(0);
      expect(progress.unlockedSkills).toEqual([]);
      expect(progress.skillLevels).toEqual({});
      expect(progress.activeEffects).toEqual([]);
    });
  });

  // ==========================================================================
  // Convenience methods
  // ==========================================================================

  describe('convenience methods', () => {
    it('getXpMultiplier returns 1 when no XP effects are active', () => {
      expect(SkillTreeService.getXpMultiplier()).toBe(1);
    });

    it('getCoinMultiplier returns 1 when no coin effects are active', () => {
      expect(SkillTreeService.getCoinMultiplier()).toBe(1);
    });

    it('getWpmBonus returns 0 when no WPM effects are active', () => {
      expect(SkillTreeService.getWpmBonus()).toBe(0);
    });

    it('getAccuracyBonus returns the bonus after unlocking accuracy skills', () => {
      SkillTreeService.addSkillPoints(5);
      SkillTreeService.upgradeSkill('home_row_master');
      expect(SkillTreeService.getAccuracyBonus()).toBe(2);
    });

    it('getStatistics returns correct structure', () => {
      SkillTreeService.addSkillPoints(5);
      SkillTreeService.upgradeSkill('home_row_master');

      const stats = SkillTreeService.getStatistics();
      expect(stats.totalSkills).toBeGreaterThan(0);
      expect(stats.unlockedSkills).toBe(1);
      expect(stats.totalPointsSpent).toBe(1);
      expect(stats.availablePoints).toBe(4);
      expect(stats.categoriesStarted).toBe(1);
    });
  });
});
