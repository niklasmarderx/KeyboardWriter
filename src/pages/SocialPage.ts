/**
 * Social Page
 * Leaderboard, Export/Import, Share functionality
 */

import { EventBus, Store } from '../core';
import { SocialService } from '../services';

type SortField = 'wpm' | 'accuracy' | 'level' | 'streak' | 'lessonsCompleted' | 'achievements';

export class SocialPage {
  private currentSort: SortField = 'wpm';
  private fileInput: HTMLInputElement | null = null;

  constructor() {}

  /**
   * Render the page
   */
  render(): string {
    return `
      <div class="social-page">
        ${this.renderHeader()}
        <div class="social-content">
          <div class="social-main">
            ${this.renderUserRankCard()}
            ${this.renderLeaderboard()}
          </div>
          <div class="social-sidebar">
            ${this.renderExportCard()}
            ${this.renderShareCard()}
            ${this.renderBackupCard()}
          </div>
        </div>
      </div>
      ${this.renderStyles()}
    `;
  }

  /**
   * Render header
   */
  private renderHeader(): string {
    return `
      <div class="social-header">
        <div class="header-content">
          <h1>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Community & Export
          </h1>
          <p>Vergleiche dich mit anderen, exportiere und teile deine Fortschritte</p>
        </div>
      </div>
    `;
  }

  /**
   * Render user rank card
   */
  private renderUserRankCard(): string {
    const ranks = {
      wpm: SocialService.getUserRank('wpm'),
      accuracy: SocialService.getUserRank('accuracy'),
      streak: SocialService.getUserRank('streak'),
    };

    return `
      <div class="rank-card">
        <h3> Deine Platzierungen</h3>
        <div class="rank-grid">
          <div class="rank-item">
            <span class="rank-position">#${ranks.wpm.rank}</span>
            <span class="rank-label">WPM</span>
            <span class="rank-total">von ${ranks.wpm.total}</span>
          </div>
          <div class="rank-item">
            <span class="rank-position">#${ranks.accuracy.rank}</span>
            <span class="rank-label">Genauigkeit</span>
            <span class="rank-total">von ${ranks.accuracy.total}</span>
          </div>
          <div class="rank-item">
            <span class="rank-position">#${ranks.streak.rank}</span>
            <span class="rank-label">Streak</span>
            <span class="rank-total">von ${ranks.streak.total}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render leaderboard
   */
  private renderLeaderboard(): string {
    const entries = SocialService.getLeaderboard(this.currentSort);

    const sortOptions: { value: SortField; label: string }[] = [
      { value: 'wpm', label: 'WPM' },
      { value: 'accuracy', label: 'Genauigkeit' },
      { value: 'level', label: 'Level' },
      { value: 'streak', label: 'Streak' },
      { value: 'lessonsCompleted', label: 'Lektionen' },
      { value: 'achievements', label: 'Achievements' },
    ];

    return `
      <div class="leaderboard-card">
        <div class="leaderboard-header">
          <h3> Rangliste</h3>
          <select class="sort-select" id="leaderboard-sort">
            ${sortOptions
              .map(
                opt => `
              <option value="${opt.value}" ${this.currentSort === opt.value ? 'selected' : ''}>
                ${opt.label}
              </option>
            `
              )
              .join('')}
          </select>
        </div>
        <div class="leaderboard-table">
          <div class="leaderboard-row header">
            <span class="col-rank">#</span>
            <span class="col-user">Spieler</span>
            <span class="col-wpm">WPM</span>
            <span class="col-acc">Acc</span>
            <span class="col-level">Lvl</span>
            <span class="col-streak"></span>
          </div>
          ${entries
            .map(
              (entry, index) => `
            <div class="leaderboard-row ${entry.isCurrentUser ? 'current-user' : ''} ${index < 3 ? 'top-' + (index + 1) : ''}">
              <span class="col-rank">
                ${index + 1}
              </span>
              <span class="col-user">
                <span class="user-avatar">${entry.avatar}</span>
                <span class="user-name">${entry.name}</span>
              </span>
              <span class="col-wpm">${entry.wpm}</span>
              <span class="col-acc">${entry.accuracy}%</span>
              <span class="col-level">${entry.level}</span>
              <span class="col-streak">${entry.streak}</span>
            </div>
          `
            )
            .join('')}
        </div>
        <p class="leaderboard-note">
          * Daten sind simuliert für Demo-Zwecke
        </p>
      </div>
    `;
  }

  /**
   * Render export card
   */
  private renderExportCard(): string {
    return `
      <div class="action-card">
        <h3> Daten exportieren</h3>
        <p>Exportiere deine Statistiken und Fortschritte</p>
        <div class="export-buttons">
          <button class="btn btn-secondary btn-sm" id="btn-export-json">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            JSON Backup
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-export-stats-csv">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            Stats CSV
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-export-achievements-csv">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88"></polyline>
            </svg>
            Achievements CSV
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render share card
   */
  private renderShareCard(): string {
    const user = Store.getState().user;
    const stats = user.statistics;

    return `
      <div class="action-card">
        <h3> Teilen</h3>
        <p>Teile deine Erfolge mit Freunden</p>
        <div class="share-preview">
          <div class="share-stat">
            <span class="value">${stats.averageWPM}</span>
            <span class="label">WPM</span>
          </div>
          <div class="share-stat">
            <span class="value">${stats.averageAccuracy}%</span>
            <span class="label">Genauigkeit</span>
          </div>
          <div class="share-stat">
            <span class="value">Lvl ${user.level}</span>
            <span class="label">Level</span>
          </div>
        </div>
        <button class="btn btn-primary" id="btn-share-stats">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Statistiken teilen
        </button>
      </div>
    `;
  }

  /**
   * Render backup card
   */
  private renderBackupCard(): string {
    return `
      <div class="action-card">
        <h3> Backup wiederherstellen</h3>
        <p>Lade ein zuvor exportiertes Backup</p>
        <div class="import-area" id="import-drop-zone">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17,8 12,3 7,8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span>JSON-Datei hierhin ziehen</span>
          <span class="or">oder</span>
          <button class="btn btn-ghost btn-sm" id="btn-import-browse">
            Datei auswählen
          </button>
        </div>
        <input type="file" id="import-file-input" accept=".json" style="display: none;">
      </div>
    `;
  }

  /**
   * Render styles
   */
  private renderStyles(): string {
    return `
      <style>
        .social-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--space-4);
        }

        .social-header {
          margin-bottom: var(--space-6);
        }

        .social-header h1 {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-2xl);
          margin-bottom: var(--space-2);
        }

        .social-header p {
          color: var(--text-secondary);
        }

        .social-content {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: var(--space-4);
        }

        .social-main {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .social-sidebar {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        /* Rank Card */
        .rank-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
        }

        .rank-card h3 {
          margin-bottom: var(--space-3);
        }

        .rank-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-3);
        }

        .rank-item {
          text-align: center;
          padding: var(--space-3);
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
        }

        .rank-position {
          display: block;
          font-size: var(--font-size-2xl);
          font-weight: bold;
          color: var(--accent-primary);
        }

        .rank-label {
          display: block;
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin-top: var(--space-1);
        }

        .rank-total {
          display: block;
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        /* Leaderboard */
        .leaderboard-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
        }

        .leaderboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
        }

        .leaderboard-header h3 {
          margin: 0;
        }

        .sort-select {
          padding: var(--space-1) var(--space-2);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: var(--font-size-sm);
          cursor: pointer;
        }

        .leaderboard-table {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .leaderboard-row {
          display: grid;
          grid-template-columns: 50px 1fr 60px 60px 50px 50px;
          align-items: center;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
        }

        .leaderboard-row.header {
          background: var(--bg-tertiary);
          font-weight: 600;
          color: var(--text-secondary);
          font-size: var(--font-size-xs);
          text-transform: uppercase;
        }

        .leaderboard-row:not(.header):hover {
          background: var(--bg-tertiary);
        }

        .leaderboard-row.current-user {
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid var(--accent-primary);
        }

        .leaderboard-row.top-1 .col-rank { font-size: var(--font-size-lg); }
        .leaderboard-row.top-2 .col-rank { font-size: var(--font-size-lg); }
        .leaderboard-row.top-3 .col-rank { font-size: var(--font-size-lg); }

        .col-user {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .user-avatar {
          font-size: var(--font-size-lg);
        }

        .user-name {
          font-weight: 500;
        }

        .current-user .user-name {
          color: var(--accent-primary);
        }

        .col-wpm, .col-acc, .col-level, .col-streak {
          text-align: center;
        }

        .leaderboard-note {
          margin-top: var(--space-3);
          font-size: var(--font-size-xs);
          color: var(--text-muted);
          text-align: center;
          font-style: italic;
        }

        /* Action Cards */
        .action-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
        }

        .action-card h3 {
          margin-bottom: var(--space-2);
        }

        .action-card p {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin-bottom: var(--space-3);
        }

        .export-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .export-buttons .btn {
          justify-content: flex-start;
          gap: var(--space-2);
        }

        /* Share Preview */
        .share-preview {
          display: flex;
          justify-content: space-between;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          padding: var(--space-3);
          margin-bottom: var(--space-3);
        }

        .share-stat {
          text-align: center;
        }

        .share-stat .value {
          display: block;
          font-size: var(--font-size-lg);
          font-weight: bold;
          color: var(--accent-primary);
        }

        .share-stat .label {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        /* Import Area */
        .import-area {
          border: 2px dashed var(--border-primary);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          text-align: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .import-area:hover,
        .import-area.drag-over {
          border-color: var(--accent-primary);
          background: rgba(59, 130, 246, 0.05);
        }

        .import-area svg {
          color: var(--text-muted);
          margin-bottom: var(--space-2);
        }

        .import-area span {
          display: block;
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .import-area .or {
          color: var(--text-muted);
          margin: var(--space-2) 0;
        }

        @media (max-width: 900px) {
          .social-content {
            grid-template-columns: 1fr;
          }

          .social-sidebar {
            order: -1;
          }

          .rank-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .leaderboard-row {
            grid-template-columns: 40px 1fr 50px 50px 40px 40px;
            font-size: var(--font-size-xs);
          }
        }
      </style>
    `;
  }

  /**
   * Initialize the page
   */
  init(): void {
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Sort select
    const sortSelect = document.getElementById('leaderboard-sort') as HTMLSelectElement;
    sortSelect?.addEventListener('change', () => {
      this.currentSort = sortSelect.value as SortField;
      this.updateLeaderboard();
    });

    // Export buttons
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      SocialService.downloadJSONExport();
      EventBus.emit('ui:toast', { message: 'Backup heruntergeladen!', type: 'success' });
    });

    document.getElementById('btn-export-stats-csv')?.addEventListener('click', () => {
      SocialService.downloadStatisticsCSV();
      EventBus.emit('ui:toast', { message: 'Statistiken exportiert!', type: 'success' });
    });

    document.getElementById('btn-export-achievements-csv')?.addEventListener('click', () => {
      SocialService.downloadAchievementsCSV();
      EventBus.emit('ui:toast', { message: 'Achievements exportiert!', type: 'success' });
    });

    // Share button
    document.getElementById('btn-share-stats')?.addEventListener('click', () => {
      void SocialService.shareStatistics().then(success => {
        if (success) {
          EventBus.emit('ui:toast', { message: 'In Zwischenablage kopiert!', type: 'success' });
        }
      });
    });

    // Import functionality
    this.fileInput = document.getElementById('import-file-input') as HTMLInputElement;
    const dropZone = document.getElementById('import-drop-zone');
    const browseBtn = document.getElementById('btn-import-browse');

    browseBtn?.addEventListener('click', () => {
      this.fileInput?.click();
    });

    dropZone?.addEventListener('click', () => {
      this.fileInput?.click();
    });

    this.fileInput?.addEventListener('change', e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.handleImport(file);
      }
    });

    // Drag and drop
    dropZone?.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone?.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone?.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const file = e.dataTransfer?.files[0];
      if (file && file.type === 'application/json') {
        this.handleImport(file);
      } else {
        EventBus.emit('ui:toast', { message: 'Nur JSON-Dateien erlaubt', type: 'error' });
      }
    });
  }

  /**
   * Handle file import
   */
  private handleImport(file: File): void {
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      const result = SocialService.importFromJSON(content);
      EventBus.emit('ui:toast', {
        message: result.message,
        type: result.success ? 'success' : 'error',
      });
      if (result.success) {
        // Refresh the page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    };
    reader.onerror = () => {
      EventBus.emit('ui:toast', { message: 'Fehler beim Lesen der Datei', type: 'error' });
    };
    reader.readAsText(file);
  }

  /**
   * Update leaderboard display
   */
  private updateLeaderboard(): void {
    const container = document.querySelector('.leaderboard-card');
    if (container) {
      container.outerHTML = this.renderLeaderboard();
      // Re-attach sort listener
      const sortSelect = document.getElementById('leaderboard-sort') as HTMLSelectElement;
      sortSelect?.addEventListener('change', () => {
        this.currentSort = sortSelect.value as SortField;
        this.updateLeaderboard();
      });
    }
  }

  /**
   * Destroy the page
   */
  destroy(): void {
    this.fileInput = null;
  }
}
