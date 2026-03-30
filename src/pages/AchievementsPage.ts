import { Store, t } from '../core';
import {
  Achievement,
  AchievementCategory,
  ACHIEVEMENTS,
  getAchievementsByCategory,
  getLevelProgress,
  getRarityColor,
  getRarityLabel,
  User,
  xpForLevel,
} from '../domain/models';

/**
 * Achievements Page Controller
 * Displays user achievements, badges, and XP progress
 */
export class AchievementsPage {
  private selectedCategory: AchievementCategory | 'all' = 'all';

  constructor() {
    // Initialize with all achievements view
  }

  /**
   * Render the achievements page
   */
  render(): string {
    const state = Store.getState();
    const user = state.user;

    return `
      <div class="typing-container">
        <h1 style="margin-bottom: var(--space-6);">${t('achievements.title')}</h1>

        ${this.renderXPProgress(user)}
        ${this.renderCategoryTabs()}
        ${this.renderAchievementStats(user)}
        ${this.renderAchievementsGrid(user)}
      </div>
    `;
  }

  /**
   * Render XP and Level Progress
   */
  private renderXPProgress(user: User): string {
    const progress = getLevelProgress(user.xp);
    const nextLevelXP = xpForLevel(user.level);

    // Calculate XP in current level
    let xpToCurrentLevel = 0;
    for (let i = 1; i < user.level; i++) {
      xpToCurrentLevel += xpForLevel(i);
    }
    const xpInLevel = user.xp - xpToCurrentLevel;
    const xpNeeded = nextLevelXP;

    return `
      <div class="card" style="margin-bottom: var(--space-6); background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);">
        <div style="display: flex; align-items: center; gap: var(--space-6);">
          <div style="
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 0 30px rgba(88, 166, 255, 0.3);
          ">
            <span style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: white;">
              ${user.level}
            </span>
          </div>
          
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
              <span style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);">Level ${user.level}</span>
              <span style="font-size: var(--font-size-sm); color: var(--text-secondary);">${user.xp.toLocaleString()} XP</span>
            </div>
            
            <div class="progress-bar" style="height: 12px; margin-bottom: var(--space-2);">
              <div class="progress-bar-fill" style="width: ${progress}%;"></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: var(--font-size-xs); color: var(--text-muted);">
              <span>${xpInLevel.toLocaleString()} / ${xpNeeded.toLocaleString()} XP</span>
              <span>${t('achievements.nextLevel', { xp: (xpNeeded - xpInLevel).toLocaleString() })}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render category filter tabs
   */
  private renderCategoryTabs(): string {
    const categories: (AchievementCategory | 'all')[] = [
      'all',
      'speed',
      'accuracy',
      'consistency',
      'milestones',
      'special',
      'languages',
      'race',
    ];

    const categoryLabels: Record<AchievementCategory | 'all', string> = {
      all: t('achievements.all'),
      speed: t('achievements.speed'),
      accuracy: t('achievements.accuracy'),
      consistency: t('achievements.consistency'),
      milestones: t('achievements.milestones'),
      special: t('achievements.special'),
      languages: 'Sprachen',
      race: 'Rennen',
    };

    return `
      <div class="category-tabs" style="
        display: flex;
        gap: var(--space-2);
        margin-bottom: var(--space-6);
        flex-wrap: wrap;
      ">
        ${categories
          .map(
            cat => `
          <button 
            class="btn ${this.selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}"
            data-category="${cat}"
            style="font-size: var(--font-size-sm);"
          >
            ${categoryLabels[cat]}
          </button>
        `
          )
          .join('')}
      </div>
    `;
  }

  /**
   * Render achievement statistics summary
   */
  private renderAchievementStats(user: User): string {
    const totalAchievements = ACHIEVEMENTS.length;
    const unlockedAchievements = new Set(user.achievements);
    const unlockedCount = unlockedAchievements.size;
    const progress = Math.round((unlockedCount / totalAchievements) * 100);

    // Count by rarity
    const unlockedByRarity = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };

    unlockedAchievements.forEach(id => {
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) {
        unlockedByRarity[achievement.rarity]++;
      }
    });

    return `
      <div class="stats-panel" style="margin-bottom: var(--space-6);">
        <div class="stat-card">
          <span class="stat-card-value">${unlockedCount}/${totalAchievements}</span>
          <span class="stat-card-label">${t('achievements.unlocked')}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card-value">${progress}%</span>
          <span class="stat-card-label">${t('achievements.progress')}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card-value" style="color: ${getRarityColor('legendary')};">${unlockedByRarity.legendary}</span>
          <span class="stat-card-label">${t('achievements.legendary')}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card-value" style="color: ${getRarityColor('epic')};">${unlockedByRarity.epic}</span>
          <span class="stat-card-label">${t('achievements.epic')}</span>
        </div>
      </div>
    `;
  }

  /**
   * Render achievements grid
   */
  private renderAchievementsGrid(user: User): string {
    let achievements: Achievement[];

    if (this.selectedCategory === 'all') {
      achievements = ACHIEVEMENTS;
    } else {
      achievements = getAchievementsByCategory(this.selectedCategory);
    }

    const unlockedAchievements = new Set(user.achievements);

    // Sort: unlocked first, then by rarity (legendary first)
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
    achievements = [...achievements].sort((a, b) => {
      const aUnlocked = unlockedAchievements.has(a.id);
      const bUnlocked = unlockedAchievements.has(b.id);
      if (aUnlocked !== bUnlocked) {
        return aUnlocked ? -1 : 1;
      }
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });

    return `
      <div class="achievements-grid" style="
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-4);
      ">
        ${achievements.map(achievement => this.renderAchievementCard(achievement, user)).join('')}
      </div>
    `;
  }

  /**
   * Render individual achievement card
   */
  private renderAchievementCard(achievement: Achievement, user: User): string {
    const unlockedAchievements = new Set(user.achievements);
    const isUnlocked = unlockedAchievements.has(achievement.id);
    const progress = this.calculateProgress(achievement, user);
    const rarityColor = getRarityColor(achievement.rarity);

    const iconSvgs: Record<string, string> = {
      speedometer:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"></path><path d="M12 6v6l4 2"></path></svg>',
      target:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
      flame:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
      check:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"></polyline></svg>',
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
      keyboard:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="6" y1="8" x2="6" y2="8"></line><line x1="10" y1="8" x2="10" y2="8"></line><line x1="14" y1="8" x2="14" y2="8"></line><line x1="18" y1="8" x2="18" y2="8"></line><line x1="8" y1="16" x2="16" y2="16"></line></svg>',
      clock:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline></svg>',
      star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"></polygon></svg>',
      code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16,18 22,12 16,6"></polyline><polyline points="8,6 2,12 8,18"></polyline></svg>',
      trophy:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>',
    };

    return `
      <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}" style="
        background: var(--bg-secondary);
        border: 1px solid ${isUnlocked ? rarityColor : 'var(--border-primary)'};
        border-radius: var(--radius-lg);
        padding: var(--space-4);
        position: relative;
        overflow: hidden;
        opacity: ${isUnlocked ? '1' : '0.7'};
        transition: all var(--transition-normal);
      " data-achievement="${achievement.id}">
        ${
          isUnlocked
            ? `
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: ${rarityColor};
          "></div>
        `
            : ''
        }
        
        <div style="display: flex; gap: var(--space-3); align-items: flex-start;">
          <div style="
            width: 48px;
            height: 48px;
            border-radius: var(--radius-md);
            background: ${isUnlocked ? rarityColor : 'var(--bg-tertiary)'};
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            color: ${isUnlocked ? 'white' : 'var(--text-muted)'};
            ${isUnlocked ? `box-shadow: 0 0 20px ${rarityColor}40;` : ''}
          ">
            <span style="width: 24px; height: 24px;">${iconSvgs[achievement.icon] || iconSvgs.trophy}</span>
          </div>
          
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-1);">
              <span style="
                font-weight: var(--font-weight-semibold);
                color: ${isUnlocked ? 'var(--text-primary)' : 'var(--text-secondary)'};
              ">${achievement.name}</span>
              <span style="
                font-size: var(--font-size-xs);
                padding: 2px 6px;
                border-radius: var(--radius-sm);
                background: ${rarityColor}20;
                color: ${rarityColor};
              ">${getRarityLabel(achievement.rarity)}</span>
            </div>
            
            <p style="
              font-size: var(--font-size-sm);
              color: var(--text-muted);
              margin-bottom: var(--space-2);
            ">${achievement.description}</p>
            
            ${
              !isUnlocked
                ? `
              <div class="progress-bar" style="height: 6px; margin-bottom: var(--space-2);">
                <div class="progress-bar-fill" style="width: ${progress}%; background: ${rarityColor};"></div>
              </div>
              <div style="font-size: var(--font-size-xs); color: var(--text-muted);">
                ${t('achievements.completed', { progress })}
              </div>
            `
                : `
              <div style="font-size: var(--font-size-xs); color: ${rarityColor};">
                ${t('achievements.xpEarned', { xp: achievement.xpReward })}
              </div>
            `
            }
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Calculate progress for an achievement
   */
  private calculateProgress(achievement: Achievement, user: User): number {
    const req = achievement.requirement;
    const stats = user.statistics;

    let current = 0;
    const target = req.value;

    switch (req.type) {
      case 'wpm':
        current = stats.peakWPM;
        break;
      case 'accuracy':
        current = stats.averageAccuracy;
        break;
      case 'streak':
        current = stats.currentStreak;
        break;
      case 'sessions':
        current = stats.totalSessions;
        break;
      case 'lessons':
        current = stats.totalLessonsCompleted;
        break;
      case 'keystrokes':
        current = stats.totalKeystrokes;
        break;
      case 'practice_time':
        current = Math.floor(stats.totalPracticeTimeMs / 60000); // Convert to minutes
        break;
      case 'perfect_sessions':
        current = 0; // Would need to track this separately
        break;
      case 'code_snippets':
        current = 0; // Would need to track this separately
        break;
      case 'level':
        current = user.level;
        break;
    }

    return Math.min(Math.round((current / target) * 100), 100);
  }

  /**
   * Initialize the page (setup event listeners)
   */
  init(): void {
    // Category tab clicks
    document.querySelectorAll('.category-tabs button').forEach(btn => {
      btn.addEventListener('click', (e: Event) => {
        const targetEl = e.currentTarget as HTMLElement;
        const category = targetEl.dataset.category as AchievementCategory | 'all';
        this.selectedCategory = category;
        this.rerender();
      });
    });

    // Achievement card hover effects
    document.querySelectorAll('.achievement-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        (card as HTMLElement).style.transform = 'translateY(-2px)';
        (card as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
      });
      card.addEventListener('mouseleave', () => {
        (card as HTMLElement).style.transform = '';
        (card as HTMLElement).style.boxShadow = '';
      });
    });
  }

  /**
   * Re-render the page content
   */
  private rerender(): void {
    const container = document.querySelector('.app-main');
    if (container) {
      container.innerHTML = this.render();
      this.init();
    }
  }

  /**
   * Destroy the page (cleanup)
   */
  destroy(): void {
    // No cleanup needed
  }
}
