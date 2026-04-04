/**
 * Skill Tree Service - Manages skill unlocking and effects
 */

import { EventBus } from '../core/EventBus';
import { StorageService } from '../core/StorageService';
import {
  PlayerSkillProgress,
  SKILL_TREE_STRUCTURE,
  SkillCategory,
  SkillConnection,
  SkillEffect,
  SkillEffectType,
  SkillNode,
  SkillTier,
  SkillTreeCategory,
  SkillTreeData,
} from '../domain/models/SkillTree';

const STORAGE_KEY = 'typecraft_skill_tree';

interface SerializedSkillProgress {
  totalSkillPoints: number;
  availableSkillPoints: number;
  spentSkillPoints: number;
  unlockedSkills: string[];
  skillLevels: Record<string, number>;
  activeEffects: SkillEffect[];
}

class SkillTreeServiceImpl {
  private progress: PlayerSkillProgress;
  private readonly skillMap: Map<string, SkillNode> = new Map();
  private readonly treeData: SkillTreeData;

  constructor() {
    this.treeData = SKILL_TREE_STRUCTURE;
    this.progress = this.loadProgress();
    this.initializeSkillMap();
  }

  private loadProgress(): PlayerSkillProgress {
    const saved = StorageService.load<SerializedSkillProgress>(STORAGE_KEY);
    if (saved) {
      return {
        totalSkillPoints: saved.totalSkillPoints,
        availableSkillPoints: saved.availableSkillPoints,
        spentSkillPoints: saved.spentSkillPoints,
        unlockedSkills: saved.unlockedSkills,
        skillLevels: saved.skillLevels,
        activeEffects: saved.activeEffects,
      };
    }

    return {
      totalSkillPoints: 0,
      availableSkillPoints: 0,
      spentSkillPoints: 0,
      unlockedSkills: [],
      skillLevels: {},
      activeEffects: [],
    };
  }

  private saveProgress(): void {
    const serialized: SerializedSkillProgress = {
      totalSkillPoints: this.progress.totalSkillPoints,
      availableSkillPoints: this.progress.availableSkillPoints,
      spentSkillPoints: this.progress.spentSkillPoints,
      unlockedSkills: this.progress.unlockedSkills,
      skillLevels: this.progress.skillLevels,
      activeEffects: this.progress.activeEffects,
    };
    StorageService.save(STORAGE_KEY, serialized);
  }

  private initializeSkillMap(): void {
    // Build skill map for quick lookups
    for (const category of this.treeData.categories) {
      for (const skill of category.skills) {
        this.skillMap.set(skill.id, skill);
      }
    }
  }

  private getSkillWithState(skill: SkillNode): SkillNode {
    const currentLevel = this.progress.skillLevels[skill.id] || 0;
    return {
      ...skill,
      currentLevel,
      isUnlocked: this.progress.unlockedSkills.includes(skill.id) || skill.isUnlocked,
    };
  }

  // Get all categories with current states
  getCategories(): SkillTreeCategory[] {
    return this.treeData.categories.map(category => ({
      ...category,
      skills: category.skills.map(skill => this.getSkillWithState(skill)),
    }));
  }

  // Get all connections
  getConnections(): SkillConnection[] {
    return this.treeData.connections;
  }

  // Get a specific skill
  getSkill(skillId: string): SkillNode | undefined {
    const skill = this.skillMap.get(skillId);
    if (!skill) {
      return undefined;
    }
    return this.getSkillWithState(skill);
  }

  // Check if a skill can be upgraded
  canUpgradeSkill(skillId: string): { canUpgrade: boolean; reason?: string } {
    const skill = this.skillMap.get(skillId);
    if (!skill) {
      return { canUpgrade: false, reason: 'Skill nicht gefunden' };
    }

    const currentLevel = this.progress.skillLevels[skillId] || 0;

    // Check max level
    if (currentLevel >= skill.maxLevel) {
      return { canUpgrade: false, reason: 'Maximales Level erreicht' };
    }

    // Check skill points
    if (this.progress.availableSkillPoints < skill.costPerLevel) {
      return {
        canUpgrade: false,
        reason: `Nicht genug Skill-Punkte (benoetigt: ${skill.costPerLevel})`,
      };
    }

    // Check prerequisites (only for level 0 -> 1)
    if (currentLevel === 0 && skill.prerequisites.length > 0) {
      const unmetPrereqs = skill.prerequisites.filter(
        prereq => !this.progress.unlockedSkills.includes(prereq)
      );
      if (unmetPrereqs.length > 0) {
        return { canUpgrade: false, reason: 'Voraussetzungen nicht erfuellt' };
      }
    }

    return { canUpgrade: true };
  }

  // Upgrade a skill
  upgradeSkill(skillId: string): {
    success: boolean;
    pointsSpent: number;
    newLevel: number;
    reason?: string;
  } {
    const checkResult = this.canUpgradeSkill(skillId);
    if (!checkResult.canUpgrade) {
      return { success: false, pointsSpent: 0, newLevel: 0, reason: checkResult.reason };
    }

    const skill = this.skillMap.get(skillId)!;
    const currentLevel = this.progress.skillLevels[skillId] || 0;
    const newLevel = currentLevel + 1;

    // Spend points
    this.progress.availableSkillPoints -= skill.costPerLevel;
    this.progress.spentSkillPoints += skill.costPerLevel;

    // Update level
    this.progress.skillLevels[skillId] = newLevel;

    // Add to unlocked skills if first level
    if (currentLevel === 0 && !this.progress.unlockedSkills.includes(skillId)) {
      this.progress.unlockedSkills.push(skillId);
    }

    // Apply effects (only once when first unlocked)
    if (currentLevel === 0) {
      this.applySkillEffects(skill);
    }

    this.saveProgress();

    // Emit event
    EventBus.emit('skill:unlocked', { skillId, category: skill.category });

    return { success: true, pointsSpent: skill.costPerLevel, newLevel };
  }

  // Apply skill effects
  private applySkillEffects(skill: SkillNode): void {
    for (const effect of skill.effects) {
      this.progress.activeEffects.push(effect);

      // Emit effect applied event
      EventBus.emit('skill:effect:applied', { skillId: skill.id, effectType: effect.type });
    }
  }

  // Add skill points (called when player earns points)
  addSkillPoints(points: number): void {
    this.progress.totalSkillPoints += points;
    this.progress.availableSkillPoints += points;
    this.saveProgress();
  }

  // Get player progress
  getProgress(): PlayerSkillProgress {
    return { ...this.progress };
  }

  // Get all active effects of a specific type
  getActiveEffects(effectType?: SkillEffectType): SkillEffect[] {
    if (effectType) {
      return this.progress.activeEffects.filter(effect => effect.type === effectType);
    }
    return [...this.progress.activeEffects];
  }

  // Get total bonus for a specific effect type
  getEffectBonus(effectType: SkillEffectType): number {
    const effects = this.getActiveEffects(effectType);
    return effects.reduce((total, effect) => total + effect.value, 0);
  }

  // Get XP multiplier from skills
  getXpMultiplier(): number {
    const xpBonus = this.getEffectBonus(SkillEffectType.XP_MULTIPLIER);
    // XP_MULTIPLIER values are already multipliers (e.g., 1.5)
    return xpBonus > 0 ? xpBonus : 1;
  }

  // Get WPM bonus from skills
  getWpmBonus(): number {
    return this.getEffectBonus(SkillEffectType.WPM_BONUS);
  }

  // Get accuracy bonus from skills
  getAccuracyBonus(): number {
    return this.getEffectBonus(SkillEffectType.ACCURACY_BONUS);
  }

  // Get error reduction from skills
  getErrorReduction(): number {
    return this.getEffectBonus(SkillEffectType.REDUCE_ERRORS);
  }

  // Get coin multiplier from skills
  getCoinMultiplier(): number {
    const coinBonus = this.getEffectBonus(SkillEffectType.COIN_MULTIPLIER);
    return coinBonus > 0 ? coinBonus : 1;
  }

  // Get streak bonus from skills
  getStreakBonus(): number {
    return this.getEffectBonus(SkillEffectType.STREAK_BONUS);
  }

  // Check if a feature is unlocked
  isFeatureUnlocked(_featureName: string): boolean {
    // Check for UNLOCK_FEATURE effects
    const unlockEffects = this.getActiveEffects(SkillEffectType.UNLOCK_FEATURE);
    return unlockEffects.length > 0;
  }

  // Get unlocked skills count by category
  getUnlockedCountByCategory(): Map<SkillCategory, { unlocked: number; total: number }> {
    const counts = new Map<SkillCategory, { unlocked: number; total: number }>();

    for (const category of this.treeData.categories) {
      const unlocked = category.skills.filter(s =>
        this.progress.unlockedSkills.includes(s.id)
      ).length;
      counts.set(category.id, { unlocked, total: category.skills.length });
    }

    return counts;
  }

  // Get total unlocked skills
  getTotalUnlocked(): number {
    return this.progress.unlockedSkills.length;
  }

  // Get total skill points spent
  getTotalSkillPointsSpent(): number {
    return this.progress.spentSkillPoints;
  }

  // Get available skill points
  getAvailableSkillPoints(): number {
    return this.progress.availableSkillPoints;
  }

  // Get skills available to upgrade
  getAvailableSkills(): SkillNode[] {
    const available: SkillNode[] = [];

    for (const [skillId, skill] of this.skillMap) {
      const { canUpgrade } = this.canUpgradeSkill(skillId);
      if (canUpgrade) {
        available.push(this.getSkillWithState(skill));
      }
    }

    return available;
  }

  // Get skill tree statistics
  getStatistics(): {
    totalSkills: number;
    unlockedSkills: number;
    totalPointsSpent: number;
    availablePoints: number;
    categoriesStarted: number;
    maxTierReached: SkillTier;
  } {
    let maxTier = SkillTier.NOVICE;
    const categoriesWithUnlocks = new Set<SkillCategory>();

    for (const skillId of this.progress.unlockedSkills) {
      const skill = this.skillMap.get(skillId);
      if (skill) {
        categoriesWithUnlocks.add(skill.category);
        if (skill.tier > maxTier) {
          maxTier = skill.tier;
        }
      }
    }

    return {
      totalSkills: this.skillMap.size,
      unlockedSkills: this.progress.unlockedSkills.length,
      totalPointsSpent: this.progress.spentSkillPoints,
      availablePoints: this.progress.availableSkillPoints,
      categoriesStarted: categoriesWithUnlocks.size,
      maxTierReached: maxTier,
    };
  }

  // Reset skill tree (for testing or respec feature)
  resetSkillTree(): number {
    const pointsToRefund = this.progress.spentSkillPoints;

    this.progress = {
      totalSkillPoints: this.progress.totalSkillPoints,
      availableSkillPoints: this.progress.totalSkillPoints,
      spentSkillPoints: 0,
      unlockedSkills: [],
      skillLevels: {},
      activeEffects: [],
    };

    this.saveProgress();

    return pointsToRefund;
  }
}

export const SkillTreeService = new SkillTreeServiceImpl();
