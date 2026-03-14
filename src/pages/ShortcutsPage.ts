/**
 * Shortcuts Page Controller
 * Displays and allows practice of keyboard shortcuts
 */

import { EventBus } from '../core';
import { i18n } from '../core/i18n';
import {
  ALL_SHORTCUT_COLLECTIONS,
  getCategories,
  getShortcutCollection,
  getTranslatedCategory,
  getTranslatedCollectionInfo,
  getTranslatedDescription,
  Shortcut,
  ShortcutCollection,
} from '../data/shortcuts';

export class ShortcutsPage {
  private selectedCollection: ShortcutCollection;
  private selectedCategory: string | null = null;
  private searchQuery: string = '';
  private viewMode: 'browse' | 'practice' = 'browse';
  private practiceShortcuts: Shortcut[] = [];
  private currentPracticeIndex: number = 0;
  private practiceScore: number = 0;
  private practiceErrors: number = 0;
  private readonly pressedKeys: Set<string> = new Set();

  // Bound event handlers
  private readonly boundKeyDown = (e: KeyboardEvent): void => this.handlePracticeKeyDown(e);
  private readonly boundKeyUp = (e: KeyboardEvent): void => this.handlePracticeKeyUp(e);

  constructor() {
    this.selectedCollection = ALL_SHORTCUT_COLLECTIONS[0];
  }

  /**
   * Get current language
   */
  private get lang(): 'en' | 'de' {
    return i18n.getLanguage();
  }

  /**
   * Get translated text based on language
   */
  private t(de: string, en: string): string {
    return this.lang === 'de' ? de : en;
  }

  /**
   * Get translated shortcut description
   */
  private getShortcutDescription(shortcut: Shortcut): string {
    return getTranslatedDescription(shortcut.description, this.lang);
  }

  /**
   * Get translated category
   */
  private getCategoryTranslated(category: string): string {
    return getTranslatedCategory(category, this.lang);
  }

  /**
   * Get translated collection name
   */
  private getCollectionName(collection: ShortcutCollection): string {
    const info = getTranslatedCollectionInfo(collection.id, this.lang);
    return info?.name || collection.name;
  }

  /**
   * Render the shortcuts page
   */
  render(): string {
    return `
      <div class="typing-container">
        <div class="shortcuts-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
          <h1> ${this.t('Tastenkürzel', 'Keyboard Shortcuts')}</h1>
          <div class="view-mode-toggle" style="display: flex; gap: var(--space-2);">
            <button id="mode-browse" class="btn ${this.viewMode === 'browse' ? 'btn-primary' : 'btn-secondary'}">
               ${this.t('Durchsuchen', 'Browse')}
            </button>
            <button id="mode-practice" class="btn ${this.viewMode === 'practice' ? 'btn-primary' : 'btn-secondary'}">
               ${this.t('Üben', 'Practice')}
            </button>
          </div>
        </div>

        <!-- Collection Selector -->
        <div class="collection-tabs" style="display: flex; gap: var(--space-2); margin-bottom: var(--space-6); flex-wrap: wrap;">
          ${ALL_SHORTCUT_COLLECTIONS.map(
            col => `
            <button class="collection-tab btn ${col.id === this.selectedCollection.id ? 'btn-primary' : 'btn-secondary'}" 
                    data-collection="${col.id}">
              ${col.icon} ${this.getCollectionName(col)}
            </button>
          `
          ).join('')}
        </div>

        ${this.viewMode === 'browse' ? this.renderBrowseMode() : this.renderPracticeMode()}
      </div>
    `;
  }

  /**
   * Render browse mode
   */
  private renderBrowseMode(): string {
    const categories = getCategories(this.selectedCollection);
    const filteredShortcuts = this.getFilteredShortcuts();

    return `
      <div class="browse-mode">
        <!-- Search and Filter -->
        <div class="search-filter" style="display: flex; gap: var(--space-4); margin-bottom: var(--space-6); flex-wrap: wrap;">
          <input type="text" 
                 id="shortcut-search" 
                 class="btn btn-secondary" 
                 placeholder=" ${this.t('Suchen...', 'Search...')}" 
                 value="${this.searchQuery}"
                 style="flex: 1; min-width: 200px; padding: var(--space-3);">
          
          <select id="category-filter" class="btn btn-secondary" style="min-width: 150px;">
            <option value="">${this.t('Alle Kategorien', 'All Categories')}</option>
            ${categories
              .map(
                cat => `
              <option value="${cat}" ${this.selectedCategory === cat ? 'selected' : ''}>${this.getCategoryTranslated(cat)}</option>
            `
              )
              .join('')}
          </select>
        </div>

        <!-- Shortcuts Grid -->
        <div class="shortcuts-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-2);">
          ${
            filteredShortcuts.length > 0
              ? filteredShortcuts.map(shortcut => this.renderShortcutCard(shortcut)).join('')
              : `
            <div class="card" style="grid-column: 1 / -1; text-align: center; padding: var(--space-8);">
              <p style="color: var(--text-muted);">${this.t('Keine Shortcuts gefunden.', 'No shortcuts found.')}</p>
            </div>
          `
          }
        </div>

        <!-- Stats -->
        <div class="shortcut-stats" style="margin-top: var(--space-6); display: flex; justify-content: center; gap: var(--space-6);">
          <div style="text-align: center;">
            <div style="font-size: var(--font-size-2xl); font-weight: bold; color: var(--accent-primary);">
              ${this.selectedCollection.shortcuts.length}
            </div>
            <div style="font-size: var(--font-size-sm); color: var(--text-muted);">Shortcuts</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: var(--font-size-2xl); font-weight: bold; color: var(--accent-primary);">
              ${categories.length}
            </div>
            <div style="font-size: var(--font-size-sm); color: var(--text-muted);">${this.t('Kategorien', 'Categories')}</div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render a single shortcut card
   */
  private renderShortcutCard(shortcut: Shortcut): string {
    return `
      <div class="shortcut-card card" style="padding: var(--space-2) var(--space-3); display: flex; align-items: center; gap: var(--space-2);">
        <div class="shortcut-keys" style="display: flex; gap: 2px; flex-shrink: 0;">
          ${shortcut.keys
            .map(
              key => `
            <span class="key-badge" style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              min-width: 24px;
              height: 24px;
              padding: 0 5px;
              background: var(--bg-tertiary);
              border: 1px solid var(--border-primary);
              border-radius: 4px;
              font-family: var(--font-mono);
              font-size: 11px;
              font-weight: 500;
            ">${key}</span>
          `
            )
            .join('')}
        </div>
        <div class="shortcut-info" style="flex: 1; min-width: 0; overflow: hidden;">
          <div style="font-weight: 500; color: var(--text-primary); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.getShortcutDescription(shortcut)}</div>
        </div>
      </div>
    `;
  }

  /**
   * Render practice mode
   */
  private renderPracticeMode(): string {
    if (this.practiceShortcuts.length === 0) {
      return this.renderPracticeSetup();
    }

    const currentShortcut = this.practiceShortcuts[this.currentPracticeIndex];
    const progress = ((this.currentPracticeIndex + 1) / this.practiceShortcuts.length) * 100;

    return `
      <div class="practice-mode">
        <!-- Progress -->
        <div class="practice-progress" style="margin-bottom: var(--space-6);">
          <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
            <span style="color: var(--text-muted);">${this.t('Fortschritt', 'Progress')}</span>
            <span style="color: var(--text-primary);">${this.currentPracticeIndex + 1} / ${this.practiceShortcuts.length}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${progress}%;"></div>
          </div>
        </div>

        <!-- Stats Panel -->
        <div class="stats-panel" style="margin-bottom: var(--space-6);">
          <div class="stat-card">
            <span class="stat-card-value" style="color: var(--accent-success);">${this.practiceScore}</span>
            <span class="stat-card-label">${this.t('Richtig', 'Correct')}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value" style="color: var(--accent-error);">${this.practiceErrors}</span>
            <span class="stat-card-label">${this.t('Fehler', 'Errors')}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value">${Math.round((this.practiceScore / Math.max(1, this.practiceScore + this.practiceErrors)) * 100)}%</span>
            <span class="stat-card-label">${this.t('Genauigkeit', 'Accuracy')}</span>
          </div>
        </div>

        <!-- Current Shortcut -->
        <div class="practice-card card" style="text-align: center; padding: var(--space-8);">
          <div style="font-size: 12px; color: var(--text-muted); margin-bottom: var(--space-2);">
            ${this.getCategoryTranslated(currentShortcut.category)}
          </div>
          <div style="font-size: var(--font-size-2xl); font-weight: bold; margin-bottom: var(--space-6);">
            ${this.getShortcutDescription(currentShortcut)}
          </div>
          
          <div id="practice-feedback" style="min-height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="color: var(--text-muted); margin-bottom: var(--space-4);">
              ${this.t('Drücke die richtige Tastenkombination', 'Press the correct key combination')}
            </div>
            <div id="pressed-keys" style="display: flex; gap: 8px; min-height: 40px;">
              ${Array.from(this.pressedKeys)
                .map(
                  key => `
                <span class="key-badge" style="
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  min-width: 40px;
                  height: 40px;
                  padding: 0 12px;
                  background: var(--accent-primary);
                  border-radius: 8px;
                  font-family: var(--font-mono);
                  font-size: 16px;
                  font-weight: bold;
                  color: var(--text-inverse);
                ">${key}</span>
              `
                )
                .join('')}
            </div>
          </div>

          <div style="margin-top: var(--space-6);">
            <button id="btn-show-answer" class="btn btn-secondary">
               ${this.t('Lösung anzeigen', 'Show Solution')}
            </button>
            <button id="btn-skip" class="btn btn-ghost" style="margin-left: var(--space-2);">
              ${this.t('Überspringen', 'Skip')} →
            </button>
          </div>
        </div>

        <!-- Solution (hidden) -->
        <div id="solution-display" style="display: none; margin-top: var(--space-4);">
          <div class="card" style="text-align: center; padding: var(--space-4); background: var(--bg-tertiary);">
            <div style="color: var(--text-muted); font-size: 12px; margin-bottom: var(--space-2);">${this.t('Lösung:', 'Solution:')}</div>
            <div style="display: flex; gap: 8px; justify-content: center;">
              ${currentShortcut.keys
                .map(
                  key => `
                <span class="key-badge" style="
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  min-width: 40px;
                  height: 40px;
                  padding: 0 12px;
                  background: var(--accent-warning);
                  border-radius: 8px;
                  font-family: var(--font-mono);
                  font-size: 16px;
                  font-weight: bold;
                  color: var(--bg-primary);
                ">${key}</span>
              `
                )
                .join('')}
            </div>
          </div>
        </div>

        <!-- End Practice Button -->
        <div style="text-align: center; margin-top: var(--space-6);">
          <button id="btn-end-practice" class="btn btn-ghost">
             ${this.t('Übung beenden', 'End Practice')}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render practice setup
   */
  private renderPracticeSetup(): string {
    const categories = getCategories(this.selectedCollection);

    return `
      <div class="practice-setup card" style="text-align: center; padding: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4);"> ${this.t('Shortcut-Übung', 'Shortcut Practice')}</h2>
        <p style="color: var(--text-muted); margin-bottom: var(--space-6);">
          ${this.t('Wähle die Kategorien, die du üben möchtest:', 'Choose the categories you want to practice:')}
        </p>

        <div class="category-selection" style="display: flex; flex-wrap: wrap; gap: var(--space-2); justify-content: center; margin-bottom: var(--space-6);">
          <button class="category-btn btn btn-primary" data-category="all">
            ${this.t('Alle', 'All')} (${this.selectedCollection.shortcuts.length})
          </button>
          ${categories
            .map(cat => {
              const count = this.selectedCollection.shortcuts.filter(
                s => s.category === cat
              ).length;
              return `
              <button class="category-btn btn btn-secondary" data-category="${cat}">
                ${this.getCategoryTranslated(cat)} (${count})
              </button>
            `;
            })
            .join('')}
        </div>

        <div style="color: var(--text-muted); font-size: 14px;">
          <p>${this.t('Drücke die angezeigte Tastenkombination so schnell wie möglich!', 'Press the displayed key combination as fast as possible!')}</p>
        </div>
      </div>
    `;
  }

  /**
   * Get filtered shortcuts
   */
  private getFilteredShortcuts(): Shortcut[] {
    let shortcuts = this.selectedCollection.shortcuts;

    if (this.selectedCategory) {
      shortcuts = shortcuts.filter(s => s.category === this.selectedCategory);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      shortcuts = shortcuts.filter(
        s =>
          s.description.toLowerCase().includes(query) ||
          this.getShortcutDescription(s).toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query) ||
          this.getCategoryTranslated(s.category).toLowerCase().includes(query) ||
          s.keys.some(k => k.toLowerCase().includes(query))
      );
    }

    return shortcuts;
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
    // Collection tabs
    document.querySelectorAll('.collection-tab').forEach(tab => {
      tab.addEventListener('click', e => {
        const id = (e.currentTarget as HTMLElement).dataset.collection;
        if (id) {
          const collection = getShortcutCollection(id);
          if (collection) {
            this.selectedCollection = collection;
            this.selectedCategory = null;
            this.searchQuery = '';
            this.rerender();
          }
        }
      });
    });

    // View mode toggle
    document.getElementById('mode-browse')?.addEventListener('click', () => {
      this.viewMode = 'browse';
      this.rerender();
    });

    document.getElementById('mode-practice')?.addEventListener('click', () => {
      this.viewMode = 'practice';
      this.practiceShortcuts = [];
      this.rerender();
    });

    // Search
    document.getElementById('shortcut-search')?.addEventListener('input', e => {
      this.searchQuery = (e.target as HTMLInputElement).value;
      this.rerender();
    });

    // Category filter
    document.getElementById('category-filter')?.addEventListener('change', e => {
      const value = (e.target as HTMLSelectElement).value;
      this.selectedCategory = value || null;
      this.rerender();
    });

    // Practice mode setup
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const category = (e.currentTarget as HTMLElement).dataset.category;
        this.startPractice(category === 'all' ? null : (category ?? null));
      });
    });

    // Practice controls
    document.getElementById('btn-show-answer')?.addEventListener('click', () => {
      const solution = document.getElementById('solution-display');
      if (solution) {
        solution.style.display = 'block';
      }
    });

    document.getElementById('btn-skip')?.addEventListener('click', () => {
      this.nextPracticeShortcut();
    });

    document.getElementById('btn-end-practice')?.addEventListener('click', () => {
      this.endPractice();
    });

    // Keyboard input for practice
    if (this.viewMode === 'practice' && this.practiceShortcuts.length > 0) {
      document.addEventListener('keydown', this.boundKeyDown);
      document.addEventListener('keyup', this.boundKeyUp);
    }
  }

  /**
   * Start practice session
   */
  private startPractice(category: string | null): void {
    let shortcuts = this.selectedCollection.shortcuts;

    if (category) {
      shortcuts = shortcuts.filter(s => s.category === category);
    }

    // Shuffle shortcuts
    this.practiceShortcuts = [...shortcuts].sort(() => Math.random() - 0.5);
    this.currentPracticeIndex = 0;
    this.practiceScore = 0;
    this.practiceErrors = 0;
    this.pressedKeys.clear();

    this.rerender();
  }

  /**
   * Handle keydown in practice mode
   */
  private handlePracticeKeyDown(e: KeyboardEvent): void {
    if (this.viewMode !== 'practice' || this.practiceShortcuts.length === 0) {
      return;
    }

    e.preventDefault();

    const keySymbol = this.getKeySymbol(e);
    this.pressedKeys.add(keySymbol);
    this.updatePressedKeysDisplay();
  }

  /**
   * Handle keyup in practice mode
   */
  private handlePracticeKeyUp(e: KeyboardEvent): void {
    if (this.viewMode !== 'practice' || this.practiceShortcuts.length === 0) {
      return;
    }

    // Check if the combination is complete
    const currentShortcut = this.practiceShortcuts[this.currentPracticeIndex];
    const pressedArray = Array.from(this.pressedKeys);
    const expectedKeys = currentShortcut.keys;

    // Check if all expected keys are pressed
    const isCorrect =
      expectedKeys.every(key => pressedArray.includes(key)) &&
      pressedArray.length === expectedKeys.length;

    if (isCorrect) {
      this.practiceScore++;
      this.showFeedback(true);
      setTimeout(() => {
        this.nextPracticeShortcut();
      }, 500);
    } else if (pressedArray.length >= expectedKeys.length) {
      this.practiceErrors++;
      this.showFeedback(false);
      setTimeout(() => {
        this.pressedKeys.clear();
        this.updatePressedKeysDisplay();
      }, 500);
    }

    // Clear the released key
    const keySymbol = this.getKeySymbol(e);
    setTimeout(() => {
      this.pressedKeys.delete(keySymbol);
      this.updatePressedKeysDisplay();
    }, 100);
  }

  /**
   * Get key symbol from event
   */
  private getKeySymbol(e: KeyboardEvent): string {
    const keyMap: Record<string, string> = {
      Meta: '⌘',
      Control: '⌃',
      Alt: '⌥',
      Shift: '⇧',
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→',
      Enter: '↵',
      Backspace: '⌫',
      Delete: '⌦',
      Escape: 'Esc',
      Tab: '⇥',
      ' ': 'Space',
    };

    if (keyMap[e.key]) {
      return keyMap[e.key];
    }

    // Function keys
    if (e.key.startsWith('F') && e.key.length <= 3) {
      return e.key;
    }

    return e.key.toUpperCase();
  }

  /**
   * Update pressed keys display
   */
  private updatePressedKeysDisplay(): void {
    const container = document.getElementById('pressed-keys');
    if (container) {
      container.innerHTML = Array.from(this.pressedKeys)
        .map(
          key => `
        <span class="key-badge" style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          height: 40px;
          padding: 0 12px;
          background: var(--accent-primary);
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 16px;
          font-weight: bold;
          color: var(--text-inverse);
          animation: popIn 0.15s ease;
        ">${key}</span>
      `
        )
        .join('');
    }
  }

  /**
   * Show feedback
   */
  private showFeedback(correct: boolean): void {
    const feedback = document.getElementById('practice-feedback');
    if (feedback) {
      const color = correct ? 'var(--accent-success)' : 'var(--accent-error)';
      const text = correct ? this.t('✓ Richtig!', '✓ Correct!') : this.t('✗ Falsch!', '✗ Wrong!');

      feedback.innerHTML = `
        <div style="font-size: var(--font-size-xl); color: ${color}; font-weight: bold;">
          ${text}
        </div>
      `;
    }
  }

  /**
   * Move to next practice shortcut
   */
  private nextPracticeShortcut(): void {
    this.currentPracticeIndex++;
    this.pressedKeys.clear();

    if (this.currentPracticeIndex >= this.practiceShortcuts.length) {
      this.showPracticeResults();
    } else {
      this.rerender();
    }
  }

  /**
   * Show practice results
   */
  private showPracticeResults(): void {
    const accuracy = Math.round(
      (this.practiceScore / (this.practiceScore + this.practiceErrors)) * 100
    );

    const message =
      this.lang === 'de'
        ? `Übung beendet! ${this.practiceScore} richtig, ${accuracy}% Genauigkeit`
        : `Practice complete! ${this.practiceScore} correct, ${accuracy}% accuracy`;

    EventBus.emit('ui:toast', {
      message,
      type: 'success',
    });

    this.endPractice();
  }

  /**
   * End practice session
   */
  private endPractice(): void {
    this.practiceShortcuts = [];
    this.currentPracticeIndex = 0;
    this.practiceScore = 0;
    this.practiceErrors = 0;
    this.pressedKeys.clear();
    this.rerender();
  }

  /**
   * Rerender the page
   */
  private rerender(): void {
    const main = document.querySelector('.app-main');
    if (main) {
      main.innerHTML = this.render();
      this.init();
    }
  }

  /**
   * Destroy the page
   */
  destroy(): void {
    document.removeEventListener('keydown', this.boundKeyDown);
    document.removeEventListener('keyup', this.boundKeyUp);
  }
}
