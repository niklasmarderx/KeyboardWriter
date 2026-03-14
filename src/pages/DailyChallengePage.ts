/**
 * Daily Challenge Page
 * Shows daily challenges, XP progress, streaks, and gamification stats
 */

import { EventBus } from '../core';
import {
  DailyChallenge,
  GamificationData,
  gamificationService,
  XP_REWARDS,
} from '../services/GamificationService';

export class DailyChallengePage {
  private data: GamificationData;
  private challenge: DailyChallenge | null = null;
  private unsubscribe: (() => void) | null = null;

  constructor() {
    this.data = gamificationService.getData();
    this.challenge = gamificationService.generateDailyChallenge();
  }

  /**
   * Render the page
   */
  render(): string {
    const levelProgress = gamificationService.getLevelProgress();
    const streakMultiplier = gamificationService.getStreakMultiplier();
    const todayXP = gamificationService.getTodayXP();

    return `
      <div class="typing-container">
        <!-- Header -->
        <div class="challenge-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
          <h1> Daily Challenge</h1>
          <div style="display: flex; gap: var(--space-4); align-items: center;">
            ${
              streakMultiplier > 1
                ? `
              <span style="
                background: linear-gradient(135deg, var(--accent-warning), var(--accent-error));
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
                color: white;
              "> ${streakMultiplier}x XP Bonus</span>
            `
                : ''
            }
            <span style="color: var(--text-muted);">Heute: <strong style="color: var(--accent-success);">+${todayXP} XP</strong></span>
          </div>
        </div>

        <!-- XP & Level Card -->
        <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-6); background: linear-gradient(135deg, var(--accent-primary)15, var(--accent-secondary)15);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
            <div>
              <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-1);">
                Level ${this.data.currentLevel}
              </h2>
              <p style="color: var(--text-muted);">${this.data.totalXP.toLocaleString()} XP insgesamt</p>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 48px;">${this.getLevelBadge()}</span>
            </div>
          </div>
          
          <!-- XP Progress Bar -->
          <div style="margin-top: var(--space-4);">
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
              <span style="font-size: 12px; color: var(--text-muted);">Fortschritt zum nächsten Level</span>
              <span style="font-size: 12px; color: var(--accent-primary);">${levelProgress.current} / ${levelProgress.max} XP</span>
            </div>
            <div style="height: 12px; background: var(--bg-tertiary); border-radius: 6px; overflow: hidden;">
              <div style="
                height: 100%;
                width: ${levelProgress.percentage}%;
                background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
                border-radius: 6px;
                transition: width 0.5s ease;
              "></div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-panel" style="margin-bottom: var(--space-6);">
          <div class="stat-card">
            <span class="stat-card-value"> ${this.data.currentStreak}</span>
            <span class="stat-card-label">Tage Streak</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value"> ${this.data.longestStreak}</span>
            <span class="stat-card-label">Längste Serie</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value"> ${this.data.challengesCompleted}</span>
            <span class="stat-card-label">Challenges</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value"> ${this.data.perfectChallenges}</span>
            <span class="stat-card-label">Perfekt</span>
          </div>
        </div>

        <!-- Daily Challenge Card -->
        ${this.renderDailyChallengeCard()}

        <!-- XP History Chart -->
        ${this.renderXPHistoryChart()}

        <!-- XP Rewards Info -->
        ${this.renderXPRewardsInfo()}
      </div>
    `;
  }

  /**
   * Render the daily challenge card
   */
  private renderDailyChallengeCard(): string {
    if (!this.challenge) {
      return `
        <div class="card" style="padding: var(--space-6); text-align: center;">
          <h3>Keine Challenge verfügbar</h3>
          <p style="color: var(--text-muted);">Komm morgen wieder für eine neue Challenge!</p>
        </div>
      `;
    }

    const progress = (this.challenge.current / this.challenge.target) * 100;
    const timeRemaining = this.getTimeRemaining();
    const difficultyColors: Record<string, string> = {
      easy: 'var(--accent-success)',
      medium: 'var(--accent-warning)',
      hard: 'var(--accent-error)',
      legendary: 'var(--accent-secondary)',
    };

    return `
      <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-6); ${this.challenge.isCompleted ? 'border: 2px solid var(--accent-success);' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4);">
          <div>
            <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-2);">
              <span style="font-size: 32px;">${this.challenge.icon}</span>
              <div>
                <span style="
                  font-size: 11px;
                  padding: 2px 8px;
                  background: ${difficultyColors[this.challenge.difficulty]}20;
                  color: ${difficultyColors[this.challenge.difficulty]};
                  border-radius: 10px;
                  text-transform: uppercase;
                  font-weight: bold;
                ">${this.challenge.difficulty}</span>
              </div>
            </div>
            <h2 style="margin-bottom: var(--space-1);">${this.challenge.title}</h2>
            <p style="color: var(--text-muted);">${this.challenge.description}</p>
          </div>
          <div style="text-align: right;">
            ${
              this.challenge.isCompleted
                ? `
              <span style="
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 8px 16px;
                background: var(--accent-success);
                color: white;
                border-radius: 20px;
                font-weight: bold;
              ">
                ✓ Abgeschlossen
              </span>
            `
                : `
              <span style="color: var(--text-muted); font-size: 14px;">⏰ ${timeRemaining}</span>
            `
            }
          </div>
        </div>

        <!-- Progress -->
        <div style="margin-bottom: var(--space-4);">
          <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
            <span style="font-weight: bold; color: ${this.challenge.isCompleted ? 'var(--accent-success)' : 'var(--text-primary)'};">
              ${this.challenge.current} / ${this.challenge.target}
            </span>
            <span style="color: var(--text-muted);">${Math.round(progress)}%</span>
          </div>
          <div style="height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
            <div style="
              height: 100%;
              width: ${progress}%;
              background: ${this.challenge.isCompleted ? 'var(--accent-success)' : 'var(--accent-primary)'};
              border-radius: 4px;
              transition: width 0.3s ease;
            "></div>
          </div>
        </div>

        <!-- Rewards -->
        <div style="display: flex; gap: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--border-primary);">
          <div style="display: flex; align-items: center; gap: var(--space-2);">
            <span style="font-size: 20px;"></span>
            <div>
              <div style="font-weight: bold; color: var(--accent-primary);">+${this.challenge.xpReward} XP</div>
              <div style="font-size: 11px; color: var(--text-muted);">Belohnung</div>
            </div>
          </div>
          ${
            this.challenge.bonusXP
              ? `
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <span style="font-size: 20px;"></span>
              <div>
                <div style="font-weight: bold; color: var(--accent-warning);">+${this.challenge.bonusXP} XP</div>
                <div style="font-size: 11px; color: var(--text-muted);">Perfekt-Bonus</div>
              </div>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;
  }

  /**
   * Render XP history chart
   */
  private renderXPHistoryChart(): string {
    const history = gamificationService.getXPHistory(7);
    const maxXP = Math.max(...history.map(h => h.xp), 100);

    return `
      <div class="card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
        <h3 style="margin-bottom: var(--space-4);"> XP der letzten 7 Tage</h3>
        <div style="display: flex; gap: var(--space-3); justify-content: space-between; align-items: flex-end; height: 120px;">
          ${history
            .map(day => {
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('de-DE', { weekday: 'short' });
              const height = maxXP > 0 ? (day.xp / maxXP) * 100 : 0;
              const isToday = day.date === new Date().toISOString().split('T')[0];

              return `
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                <div style="
                  width: 100%;
                  height: ${height}px;
                  min-height: 4px;
                  background: ${isToday ? 'linear-gradient(180deg, var(--accent-primary), var(--accent-secondary))' : 'var(--accent-primary)'};
                  border-radius: 4px 4px 0 0;
                  opacity: ${isToday ? 1 : 0.7};
                "></div>
                <div style="font-size: 12px; color: ${isToday ? 'var(--accent-primary)' : 'var(--text-muted)'}; margin-top: var(--space-2); font-weight: ${isToday ? 'bold' : 'normal'};">
                  ${dayName}
                </div>
                <div style="font-size: 11px; color: var(--text-muted);">
                  ${day.xp > 0 ? `+${day.xp}` : '-'}
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render XP rewards info
   */
  private renderXPRewardsInfo(): string {
    const rewards = [
      { action: 'srsReviewCorrect', icon: '', label: 'SRS Review' },
      { action: 'srsReviewPerfect', icon: '', label: 'Perfekter Review' },
      { action: 'terminalCommandCorrect', icon: '', label: 'Terminal Befehl' },
      { action: 'lessonComplete', icon: '', label: 'Lektion abgeschlossen' },
      { action: 'lessonPerfect', icon: '', label: 'Perfekte Lektion' },
      { action: 'dailyChallengeComplete', icon: '', label: 'Daily Challenge' },
    ] as const;

    return `
      <div class="card" style="padding: var(--space-6);">
        <h3 style="margin-bottom: var(--space-4);">XP Belohnungen</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-3);">
          ${rewards
            .map(
              r => `
            <div style="
              display: flex;
              align-items: center;
              gap: var(--space-3);
              padding: var(--space-3);
              background: var(--bg-secondary);
              border-radius: 8px;
            ">
              <span style="font-size: 20px;">${r.icon}</span>
              <div style="flex: 1;">
                <div style="font-size: 13px; color: var(--text-secondary);">${r.label}</div>
              </div>
              <div style="font-weight: bold; color: var(--accent-success);">+${XP_REWARDS[r.action]}</div>
            </div>
          `
            )
            .join('')}
        </div>
        
        <div style="margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid var(--border-primary);">
          <h4 style="margin-bottom: var(--space-3);"> Streak Boni</h4>
          <div style="display: flex; flex-wrap: wrap; gap: var(--space-4);">
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <span style="padding: 4px 8px; background: var(--bg-tertiary); border-radius: 4px;">3+ Tage</span>
              <span style="color: var(--accent-success);">1.1x XP</span>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <span style="padding: 4px 8px; background: var(--bg-tertiary); border-radius: 4px;">7+ Tage</span>
              <span style="color: var(--accent-warning);">1.25x XP</span>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <span style="padding: 4px 8px; background: var(--bg-tertiary); border-radius: 4px;">14+ Tage</span>
              <span style="color: var(--accent-error);">1.5x XP</span>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <span style="padding: 4px 8px; background: var(--bg-tertiary); border-radius: 4px;">30+ Tage</span>
              <span style="color: var(--accent-secondary);">2x XP</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get level badge emoji
   */
  private getLevelBadge(): string {
    const level = this.data.currentLevel;
    if (level >= 20) {
      return '';
    }
    if (level >= 15) {
      return '';
    }
    if (level >= 10) {
      return '';
    }
    if (level >= 5) {
      return '';
    }
    return '';
  }

  /**
   * Get time remaining for challenge
   */
  private getTimeRemaining(): string {
    if (!this.challenge) {
      return '';
    }

    const now = new Date();
    const expiry = new Date(this.challenge.expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) {
      return 'Abgelaufen';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m übrig`;
    }
    return `${minutes}m übrig`;
  }

  /**
   * Initialize the page
   */
  init(): void {
    // Subscribe to gamification updates
    this.unsubscribe = gamificationService.subscribe(data => {
      this.data = data;
      this.challenge = data.currentChallenge;
      this.rerender();
    });

    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Test button for adding XP (development only)
    document.getElementById('btn-test-xp')?.addEventListener('click', () => {
      gamificationService.addXP('srsReviewCorrect');
      EventBus.emit('ui:toast', {
        message: `+${XP_REWARDS.srsReviewCorrect} XP für Test Review!`,
        type: 'success',
      });
    });
  }

  /**
   * Rerender the page
   */
  private rerender(): void {
    const main = document.querySelector('.app-main');
    if (main) {
      main.innerHTML = this.render();
      this.setupEventListeners();
    }
  }

  /**
   * Destroy the page
   */
  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}
