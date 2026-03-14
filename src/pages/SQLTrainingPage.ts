/**
 * SQL Training Page
 * Lerne SQL durch Tippen echter Queries
 */

import { VirtualKeyboard } from '../components/keyboard/VirtualKeyboard';
import { TypingArea } from '../components/typing-area/TypingArea';
import { EventBus, t } from '../core';
import { SQL_CATEGORIES, SQL_EXERCISES, SQLExercise } from '../data/sqlExercises';
import { ConfettiService, SoundService } from '../services';
import { gamificationService } from '../services/GamificationService';

export class SQLTrainingPage {
  private keyboard: VirtualKeyboard | null = null;
  private typingArea: TypingArea | null = null;
  private selectedCategory: string = 'select';
  private currentExercise: SQLExercise | null = null;
  private completedExercises: Set<string> = new Set();
  private isCompleted: boolean = false;
  private eventSubscription: { unsubscribe: () => void } | null = null;
  private boundHandleKeyDown: ((e: KeyboardEvent) => void) | null = null;

  constructor() {
    this.loadProgress();
  }

  /**
   * Load saved progress from localStorage
   */
  private loadProgress(): void {
    try {
      const saved = localStorage.getItem('keyboardwriter_sql_progress');
      if (saved) {
        this.completedExercises = new Set(JSON.parse(saved) as string[]);
      }
    } catch {
      // Ignore errors
    }
  }

  /**
   * Save progress to localStorage
   */
  private saveProgress(): void {
    try {
      localStorage.setItem(
        'keyboardwriter_sql_progress',
        JSON.stringify([...this.completedExercises])
      );
    } catch {
      // Ignore errors
    }
  }

  /**
   * Render the page
   */
  render(): string {
    const totalExercises = SQL_EXERCISES.length;
    const completedCount = this.completedExercises.size;
    const progress = Math.round((completedCount / totalExercises) * 100);

    return `
      <div class="sql-training-container">
        ${this.renderHeader(completedCount, totalExercises, progress)}
        <div class="sql-content">
          ${this.renderCategoryNav()}
          <div class="sql-main">
            ${this.renderExerciseList()}
            ${this.renderExerciseArea()}
          </div>
        </div>
        <div class="keyboard-section">
          <div id="sql-keyboard"></div>
        </div>
      </div>
      ${this.renderStyles()}
    `;
  }

  /**
   * Render header
   */
  private renderHeader(completed: number, total: number, progress: number): string {
    return `
      <div class="sql-header">
        <div class="header-title">
          <h1>
            ${t('sql.title')}
          </h1>
          <p>${t('sql.subtitle')}</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">${completed}/${total}</span>
            <span class="stat-label">${t('sql.exercises')}</span>
          </div>
          <div class="stat-item">
            <div class="progress-circle" style="--progress: ${progress}%">
              <span>${progress}%</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render category navigation
   */
  private renderCategoryNav(): string {
    return `
      <div class="category-nav">
        ${SQL_CATEGORIES.map(cat => {
          const count = SQL_EXERCISES.filter(e => e.category === cat.id).length;
          const completed = SQL_EXERCISES.filter(
            e => e.category === cat.id && this.completedExercises.has(e.id)
          ).length;
          const isActive = this.selectedCategory === cat.id;

          return `
            <button class="category-btn ${isActive ? 'active' : ''}" data-category="${cat.id}">
              <span class="cat-icon">${cat.icon}</span>
              <span class="cat-name">${cat.name}</span>
              <span class="cat-progress">${completed}/${count}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * Render exercise list
   */
  private renderExerciseList(): string {
    const exercises = SQL_EXERCISES.filter(e => e.category === this.selectedCategory);

    return `
      <div class="exercise-list">
        <h3>${t('sql.exercises')}</h3>
        <div class="exercise-items">
          ${exercises
            .map(ex => {
              const isCompleted = this.completedExercises.has(ex.id);
              const isActive = this.currentExercise?.id === ex.id;
              const diffColors: Record<string, string> = {
                beginner: 'var(--accent-success)',
                intermediate: 'var(--accent-warning)',
                advanced: 'var(--accent-error)',
              };

              return `
              <button class="exercise-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-exercise="${ex.id}">
                <div class="ex-status">
                  ${isCompleted ? '✓' : `<span class="diff-dot" style="background: ${diffColors[ex.difficulty]}"></span>`}
                </div>
                <div class="ex-info">
                  <span class="ex-title">${ex.title}</span>
                  <span class="ex-xp">+${ex.xp} XP</span>
                </div>
              </button>
            `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render exercise area
   */
  private renderExerciseArea(): string {
    if (!this.currentExercise) {
      return `
        <div class="exercise-area empty">
          <div class="empty-state">
            <span class="empty-icon"></span>
            <h3>${t('sql.selectExercise')}</h3>
            <p>${t('sql.selectExerciseDesc')}</p>
          </div>
        </div>
      `;
    }

    const ex = this.currentExercise;
    const diffLabels: Record<string, string> = {
      beginner: t('sql.difficulty.beginner'),
      intermediate: t('sql.difficulty.intermediate'),
      advanced: t('sql.difficulty.advanced'),
    };
    const diffColors: Record<string, string> = {
      beginner: 'var(--accent-success)',
      intermediate: 'var(--accent-warning)',
      advanced: 'var(--accent-error)',
    };

    return `
      <div class="exercise-area">
        <div class="exercise-header">
          <div class="exercise-title">
            <h2>${ex.title}</h2>
            <span class="diff-badge" style="background: ${diffColors[ex.difficulty]}20; color: ${diffColors[ex.difficulty]}">${diffLabels[ex.difficulty]}</span>
            <span class="xp-badge">+${ex.xp} XP</span>
          </div>
          <p class="exercise-desc">${ex.description}</p>
        </div>

        <div class="query-preview">
          <div class="query-header">
            <span>SQL Query</span>
            <button class="copy-btn" id="copy-query" title="Query kopieren">Copy</button>
          </div>
          <pre class="query-code">${this.highlightSQL(ex.query)}</pre>
        </div>

        <div class="typing-section">
          <div class="typing-wrapper">
            <div id="sql-typing-area" class="typing-area-display"></div>
          </div>
        </div>

        <div class="explanation-box ${this.isCompleted ? 'visible' : ''}">
          <h4>${t('sql.explanation')}</h4>
          <p>${ex.explanation}</p>
        </div>

        <div class="exercise-actions">
          <button class="btn btn-secondary" id="btn-skip">
            ${t('sql.skipBtn')}
          </button>
          ${
            this.isCompleted
              ? `
            <button class="btn btn-primary" id="btn-next">
              ${t('sql.nextBtn')}
            </button>
          `
              : ''
          }
        </div>
      </div>
    `;
  }

  /**
   * Simple SQL syntax highlighting
   */
  private highlightSQL(sql: string): string {
    const keywords = [
      'SELECT',
      'FROM',
      'WHERE',
      'AND',
      'OR',
      'IN',
      'LIKE',
      'BETWEEN',
      'ORDER BY',
      'GROUP BY',
      'HAVING',
      'JOIN',
      'INNER JOIN',
      'LEFT JOIN',
      'RIGHT JOIN',
      'ON',
      'AS',
      'INSERT INTO',
      'VALUES',
      'UPDATE',
      'SET',
      'DELETE',
      'CREATE',
      'DROP',
      'INDEX',
      'VIEW',
      'TABLE',
      'NULL',
      'IS',
      'NOT',
      'DISTINCT',
      'LIMIT',
      'OFFSET',
      'COUNT',
      'SUM',
      'AVG',
      'MIN',
      'MAX',
      'CASE',
      'WHEN',
      'THEN',
      'ELSE',
      'END',
      'UNION',
      'ALL',
      'EXISTS',
      'WITH',
      'BEGIN',
      'COMMIT',
      'TRANSACTION',
      'ROLLBACK',
      'ASC',
      'DESC',
      'OVER',
      'PARTITION BY',
      'ROW_NUMBER',
      'RANK',
      'COALESCE',
      'TRUNCATE',
    ];

    let highlighted = this.escapeHtml(sql);

    // Keywords
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="sql-keyword">${kw}</span>`);
    });

    // Strings
    highlighted = highlighted.replace(/'([^']*)'/g, `<span class="sql-string">'$1'</span>`);

    // Numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, `<span class="sql-number">$1</span>`);

    // Comments
    highlighted = highlighted.replace(/--(.*)/g, `<span class="sql-comment">--$1</span>`);

    return highlighted;
  }

  /**
   * Escape HTML
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Render styles
   */
  private renderStyles(): string {
    return `
      <style>
        .sql-training-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: var(--space-4);
        }

        .sql-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }

        .header-title h1 {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-2xl);
        }

        .header-title .icon {
          font-size: 1.5em;
        }

        .header-title p {
          color: var(--text-secondary);
          margin-top: var(--space-1);
        }

        .header-stats {
          display: flex;
          gap: var(--space-4);
          align-items: center;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: var(--font-size-xl);
          font-weight: bold;
          color: var(--accent-primary);
        }

        .stat-label {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
          display: block;
        }

        .progress-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: conic-gradient(var(--accent-primary) var(--progress), var(--bg-tertiary) var(--progress));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: var(--font-size-sm);
          position: relative;
        }

        .progress-circle::before {
          content: '';
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-primary);
        }

        .progress-circle span {
          position: relative;
          z-index: 1;
        }

        .sql-content {
          display: flex;
          gap: var(--space-4);
        }

        .category-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          width: 200px;
          flex-shrink: 0;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: var(--bg-secondary);
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s ease;
          color: var(--text-primary);
          text-align: left;
        }

        .category-btn:hover {
          background: var(--bg-tertiary);
        }

        .category-btn.active {
          background: var(--accent-primary);
          color: white;
        }

        .cat-icon {
          font-size: 1.2em;
        }

        .cat-name {
          flex: 1;
          font-size: var(--font-size-sm);
        }

        .cat-progress {
          font-size: var(--font-size-xs);
          opacity: 0.7;
        }

        .sql-main {
          flex: 1;
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: var(--space-4);
        }

        .exercise-list {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-3);
        }

        .exercise-list h3 {
          font-size: var(--font-size-sm);
          color: var(--text-muted);
          margin-bottom: var(--space-2);
          text-transform: uppercase;
        }

        .exercise-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          max-height: 500px;
          overflow-y: auto;
        }

        .exercise-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2);
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s ease;
          color: var(--text-primary);
          text-align: left;
          width: 100%;
        }

        .exercise-item:hover {
          background: var(--bg-tertiary);
        }

        .exercise-item.active {
          background: var(--accent-primary);
          color: white;
        }

        .exercise-item.completed .ex-title {
          text-decoration: line-through;
          opacity: 0.7;
        }

        .ex-status {
          width: 20px;
          display: flex;
          justify-content: center;
        }

        .diff-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .ex-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ex-title {
          font-size: var(--font-size-sm);
        }

        .ex-xp {
          font-size: var(--font-size-xs);
          color: var(--accent-warning);
        }

        .exercise-item.active .ex-xp {
          color: rgba(255,255,255,0.8);
        }

        .exercise-area {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
        }

        .exercise-area.empty {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .empty-state {
          text-align: center;
          color: var(--text-muted);
        }

        .empty-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: var(--space-2);
        }

        .exercise-header {
          margin-bottom: var(--space-4);
        }

        .exercise-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .exercise-title h2 {
          margin: 0;
        }

        .diff-badge, .xp-badge {
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 500;
        }

        .xp-badge {
          background: rgba(245, 158, 11, 0.2);
          color: var(--accent-warning);
        }

        .exercise-desc {
          color: var(--text-secondary);
          margin-top: var(--space-2);
        }

        .query-preview {
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: var(--space-4);
        }

        .query-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2) var(--space-3);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-primary);
          font-size: var(--font-size-sm);
          color: var(--text-muted);
        }

        .copy-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: var(--space-1);
          border-radius: var(--radius-sm);
          transition: background 0.15s ease;
        }

        .copy-btn:hover {
          background: var(--bg-tertiary);
        }

        .query-code {
          padding: var(--space-3);
          margin: 0;
          font-family: var(--font-mono);
          font-size: var(--font-size-sm);
          line-height: 1.6;
          overflow-x: auto;
          white-space: pre-wrap;
        }

        .sql-keyword { color: #c678dd; font-weight: bold; }
        .sql-string { color: #98c379; }
        .sql-number { color: #d19a66; }
        .sql-comment { color: #5c6370; font-style: italic; }

        .typing-section {
          margin-bottom: var(--space-4);
        }

        .typing-wrapper {
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          padding: var(--space-4);
        }

        .typing-area-display {
          font-family: var(--font-mono);
          font-size: var(--font-size-base);
          line-height: 1.8;
          white-space: pre-wrap;
        }

        .explanation-box {
          background: rgba(59, 130, 246, 0.1);
          border-left: 3px solid var(--accent-primary);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-4);
          display: none;
        }

        .explanation-box.visible {
          display: block;
        }

        .explanation-box h4 {
          margin-bottom: var(--space-1);
        }

        .exercise-actions {
          display: flex;
          gap: var(--space-2);
          justify-content: flex-end;
        }

        .keyboard-section {
          margin-top: var(--space-4);
        }

        @media (max-width: 1024px) {
          .sql-content {
            flex-direction: column;
          }

          .category-nav {
            flex-direction: row;
            width: 100%;
            overflow-x: auto;
          }

          .sql-main {
            grid-template-columns: 1fr;
          }

          .exercise-list {
            max-height: 200px;
            overflow-y: auto;
          }
        }
      </style>
    `;
  }

  /**
   * Initialize the page
   */
  init(): void {
    // Initialize keyboard
    const keyboardContainer = document.getElementById('sql-keyboard');
    if (keyboardContainer) {
      this.keyboard = new VirtualKeyboard('sql-keyboard');
    }

    // Setup event listeners
    this.setupEventListeners();

    // Setup keyboard input handler - only add if not already added
    if (!this.boundHandleKeyDown) {
      this.boundHandleKeyDown = this.handleKeyDown.bind(this);
      document.addEventListener('keydown', this.boundHandleKeyDown);
    }

    // If an exercise is selected, init typing area
    if (this.currentExercise) {
      this.initTypingArea();
    }
  }

  /**
   * Initialize typing area
   */
  private initTypingArea(): void {
    if (!this.currentExercise) {
      return;
    }

    const container = document.getElementById('sql-typing-area');
    if (!container) {
      return;
    }

    // Clear previous typing area
    if (this.typingArea) {
      this.typingArea.clear();
    }

    // Create new typing area
    this.typingArea = new TypingArea('sql-typing-area');
    this.typingArea.setText(this.currentExercise.query);

    // Listen for completion
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    this.eventSubscription = EventBus.on('typing:complete', this.handleComplete.bind(this));
  }

  /**
   * Handle keyboard input
   */
  private handleKeyDown(e: KeyboardEvent): void {
    // Only process if we have an active typing area and exercise
    if (!this.typingArea || !this.currentExercise || this.isCompleted) {
      return;
    }

    // Don't capture if target is an input/textarea
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    // Handle Tab to skip
    if (e.key === 'Tab') {
      e.preventDefault();
      this.nextExercise();
      return;
    }

    // Handle Backspace - allow correction
    if (e.key === 'Backspace') {
      e.preventDefault();
      this.typingArea.handleBackspace();
      return;
    }

    // Only process single characters
    if (e.key.length === 1) {
      e.preventDefault();
      this.typingArea.processKeystroke(e.key, e.code);
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategory = (btn as HTMLElement).dataset.category || 'select';
        this.currentExercise = null;
        this.isCompleted = false;
        this.updateUI();
      });
    });

    // Exercise buttons
    document.querySelectorAll('.exercise-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).dataset.exercise;
        this.selectExercise(id || '');
      });
    });

    // Copy button
    const copyBtn = document.getElementById('copy-query');
    copyBtn?.addEventListener('click', () => {
      if (this.currentExercise) {
        void navigator.clipboard.writeText(this.currentExercise.query);
        EventBus.emit('ui:toast', { message: t('sql.queryCopied'), type: 'success' });
      }
    });

    // Skip button
    const skipBtn = document.getElementById('btn-skip');
    skipBtn?.addEventListener('click', () => this.nextExercise());

    // Next button
    const nextBtn = document.getElementById('btn-next');
    nextBtn?.addEventListener('click', () => this.nextExercise());
  }

  /**
   * Select an exercise
   */
  private selectExercise(id: string): void {
    const exercise = SQL_EXERCISES.find(e => e.id === id);
    if (!exercise) {
      return;
    }

    this.currentExercise = exercise;
    this.isCompleted = false;
    this.updateUI();
    this.initTypingArea();
  }

  /**
   * Handle exercise completion
   */
  private handleComplete(data: { wpm: number; accuracy: number }): void {
    if (!this.currentExercise || this.isCompleted) {
      return;
    }

    this.isCompleted = true;

    // Mark as completed
    if (!this.completedExercises.has(this.currentExercise.id)) {
      this.completedExercises.add(this.currentExercise.id);
      this.saveProgress();

      // Award XP via gamification service
      gamificationService.addXP('lessonComplete');

      // Celebrate!
      if (data.accuracy >= 95) {
        ConfettiService.celebrate('medium');
      }
      SoundService.playSuccess();

      EventBus.emit('ui:toast', {
        message: t('sql.completed', { xp: this.currentExercise.xp }),
        type: 'success',
      });
    }

    this.updateUI();
  }

  /**
   * Go to next exercise
   */
  private nextExercise(): void {
    const exercises = SQL_EXERCISES.filter(e => e.category === this.selectedCategory);
    const currentIndex = exercises.findIndex(e => e.id === this.currentExercise?.id);

    if (currentIndex < exercises.length - 1) {
      this.selectExercise(exercises[currentIndex + 1].id);
    } else {
      // Go to next category or show completion
      const catIndex = SQL_CATEGORIES.findIndex(c => c.id === this.selectedCategory);
      if (catIndex < SQL_CATEGORIES.length - 1) {
        this.selectedCategory = SQL_CATEGORIES[catIndex + 1].id;
        this.currentExercise = null;
        this.isCompleted = false;
        this.updateUI();
      }
    }
  }

  /**
   * Update UI
   */
  private updateUI(): void {
    const container = document.querySelector('.sql-training-container');
    if (container) {
      container.outerHTML = this.render();
      this.init();
    }
  }

  /**
   * Destroy the page
   */
  destroy(): void {
    // Remove keyboard event listener
    if (this.boundHandleKeyDown) {
      document.removeEventListener('keydown', this.boundHandleKeyDown);
      this.boundHandleKeyDown = null;
    }
    if (this.keyboard) {
      this.keyboard.destroy();
      this.keyboard = null;
    }
    if (this.typingArea) {
      this.typingArea.clear();
      this.typingArea = null;
    }
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
      this.eventSubscription = null;
    }
  }
}
