/**
 * Vim Training Page
 * Practice Vim commands and key combinations
 */

import { EventBus, t } from '../core';
import { VIM_COMMANDS, VimCommand } from '../data/programmingExercises';

type VimCategory = 'movement' | 'editing' | 'visual' | 'search' | 'files' | 'advanced';

export class VimTrainingPage {
  private readonly container: HTMLElement;
  private currentCategory: VimCategory = 'movement';
  private currentCommands: VimCommand[] = [];
  private currentIndex = 0;
  private currentInput = '';
  private isActive = false;
  private startTime = 0;
  private correctChars = 0;
  private totalChars = 0;
  private errors = 0;
  private readonly vimMode: 'normal' | 'insert' | 'visual' | 'command' = 'normal';
  private boundHandleKeyDown: ((e: KeyboardEvent) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(): void {
    // Load category first to ensure currentCommands is populated
    this.loadCategory();

    this.container.innerHTML = `
      <div class="vim-training-page">
        <header class="page-header">
          <h1>${t('vim.title')}</h1>
          <p>${t('vim.subtitle')}</p>
        </header>

        <div class="vim-mode-indicator">
          <span class="mode-label">${t('vim.currentMode')}:</span>
          <span class="mode-badge ${this.vimMode}">${this.vimMode.toUpperCase()}</span>
        </div>

        <div class="category-tabs">
          <button class="tab-btn ${this.currentCategory === 'movement' ? 'active' : ''}" data-category="movement">
            ${t('vim.movement')}
          </button>
          <button class="tab-btn ${this.currentCategory === 'editing' ? 'active' : ''}" data-category="editing">
            ${t('vim.editing')}
          </button>
          <button class="tab-btn ${this.currentCategory === 'visual' ? 'active' : ''}" data-category="visual">
            ${t('vim.visualMode')}
          </button>
          <button class="tab-btn ${this.currentCategory === 'search' ? 'active' : ''}" data-category="search">
            ${t('vim.search')}
          </button>
          <button class="tab-btn ${this.currentCategory === 'files' ? 'active' : ''}" data-category="files">
            ${t('vim.files')}
          </button>
          <button class="tab-btn ${this.currentCategory === 'advanced' ? 'active' : ''}" data-category="advanced">
            ${t('vim.advanced')}
          </button>
        </div>

        <div class="vim-training-content">
          ${this.renderCommandList()}
        </div>
      </div>
    `;

    this.addStyles();
    this.attachEventListeners();
  }

  private renderCommandList(): string {
    const currentCommand = this.currentCommands[this.currentIndex];

    return `
      <div class="vim-command-mode">
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-label">${t('vim.command')}</span>
            <span class="stat-value">${this.currentIndex + 1}/${this.currentCommands.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${t('vim.wpm')}</span>
            <span class="stat-value" id="wpm">0</span>
          </div>
          <div class="stat">
            <span class="stat-label">${t('vim.accuracy')}</span>
            <span class="stat-value" id="accuracy">100%</span>
          </div>
          <div class="stat">
            <span class="stat-label">${t('vim.errors')}</span>
            <span class="stat-value" id="errors">0</span>
          </div>
        </div>

        ${
          currentCommand
            ? `
          <div class="vim-command-card">
            <div class="command-info">
              <span class="mode-badge small ${currentCommand.mode}">${currentCommand.mode}</span>
              <span class="command-description">${currentCommand.description}</span>
            </div>

            <div class="vim-editor">
              <div class="editor-header">
                <span class="editor-title">vim</span>
                <span class="editor-mode">[${this.vimMode.toUpperCase()}]</span>
              </div>
              <div class="editor-body">
                <div class="editor-line-numbers">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
                <div class="editor-content">
                  <div class="sample-text">
                    <span class="line">const hello = "world";</span>
                    <span class="line">function greet() {</span>
                    <span class="line">  return hello;</span>
                    <span class="line">}</span>
                    <span class="line">greet();</span>
                  </div>
                </div>
              </div>
              <div class="editor-footer">
                <span class="command-prompt">${currentCommand.mode === 'command' ? ':' : ''}</span>
                <span class="command-input" id="vim-display"></span>
                <span class="cursor-blink">|</span>
              </div>
            </div>

            <div class="target-command">
              <span class="target-label">${t('vim.type')}</span>
              <code class="target-keys">${this.escapeHtml(currentCommand.keys)}</code>
            </div>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(this.currentIndex / this.currentCommands.length) * 100}%"></div>
          </div>

          <div class="navigation-hint">
            ${t('vim.navigationHint')}
          </div>

          <div class="vim-cheatsheet">
            <h4>${t('vim.quickRef')} - ${this.getCategoryTitle(this.currentCategory)}</h4>
            <div class="cheatsheet-grid">
              ${this.currentCommands
                .slice(0, 8)
                .map(
                  cmd => `
                <div class="cheatsheet-item ${cmd.id === currentCommand.id ? 'current' : ''}">
                  <code>${this.escapeHtml(cmd.keys)}</code>
                  <span>${cmd.description}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : `
          <div class="empty-state">
            <p>${t('vim.noCommands')}</p>
          </div>
        `
        }
      </div>
    `;
  }

  private getCategoryTitle(category: VimCategory): string {
    const titleKeys: Record<VimCategory, string> = {
      movement: 'vim.movement',
      editing: 'vim.editing',
      visual: 'vim.visualMode',
      search: 'vim.search',
      files: 'vim.files',
      advanced: 'vim.advanced',
    };
    return t(titleKeys[category]);
  }

  private addStyles(): void {
    if (document.getElementById('vim-training-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'vim-training-styles';
    styles.textContent = `
      .vim-training-page {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-header {
        text-align: center;
        margin-bottom: 1.5rem;
      }

      .page-header h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #019733, #000000);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .page-header p {
        color: var(--text-secondary);
      }

      .vim-mode-indicator {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }

      .mode-label {
        color: var(--text-secondary);
        font-size: 0.875rem;
      }

      .mode-badge {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.875rem;
      }

      .mode-badge.small {
        padding: 0.25rem 0.5rem;
        font-size: 0.7rem;
      }

      .mode-badge.normal {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
      }

      .mode-badge.insert {
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
      }

      .mode-badge.visual {
        background: rgba(168, 85, 247, 0.2);
        color: #a855f7;
      }

      .mode-badge.command {
        background: rgba(234, 179, 8, 0.2);
        color: #eab308;
      }

      .category-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        justify-content: center;
      }

      .tab-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
      }

      .tab-btn:hover {
        background: var(--bg-tertiary);
      }

      .tab-btn.active {
        background: linear-gradient(135deg, #019733, #000000);
        color: white;
      }

      .stats-bar {
        display: flex;
        gap: 2rem;
        justify-content: center;
        margin-bottom: 2rem;
        padding: 1rem;
        background: var(--bg-secondary);
        border-radius: 12px;
      }

      .stat {
        text-align: center;
      }

      .stat-label {
        display: block;
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-bottom: 0.25rem;
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--text-primary);
      }

      .vim-command-card {
        background: var(--bg-secondary);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .command-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .command-description {
        font-size: 1.1rem;
      }

      .vim-editor {
        background: #1e1e1e;
        border-radius: 12px;
        overflow: hidden;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        margin-bottom: 1rem;
      }

      .editor-header {
        background: #323232;
        padding: 0.5rem 1rem;
        display: flex;
        justify-content: space-between;
        color: #888;
        font-size: 0.75rem;
      }

      .editor-mode {
        color: #22c55e;
      }

      .editor-body {
        display: flex;
        min-height: 150px;
      }

      .editor-line-numbers {
        display: flex;
        flex-direction: column;
        padding: 1rem 0.75rem;
        background: #252525;
        color: #666;
        font-size: 0.875rem;
        text-align: right;
        user-select: none;
      }

      .editor-line-numbers span {
        line-height: 1.5;
      }

      .editor-content {
        flex: 1;
        padding: 1rem;
        color: #f0f0f0;
        font-size: 0.875rem;
      }

      .sample-text .line {
        display: block;
        line-height: 1.5;
      }

      .editor-footer {
        background: #252525;
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        color: #f0f0f0;
        font-size: 1rem;
      }

      .command-prompt {
        color: #22c55e;
        margin-right: 0.25rem;
      }

      .command-input .correct {
        color: #22c55e;
      }

      .command-input .incorrect {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.2);
      }

      .command-input .pending {
        color: #666;
      }

      .command-input .current {
        background: rgba(59, 130, 246, 0.3);
      }

      .cursor-blink {
        animation: blink 1s infinite;
        color: #22c55e;
      }

      @keyframes blink {
        0%, 50% {
          opacity: 1;
        }
        51%, 100% {
          opacity: 0;
        }
      }

      .target-command {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--bg-tertiary);
        border-radius: 8px;
      }

      .target-label {
        color: var(--text-secondary);
      }

      .target-keys {
        font-size: 1.5rem;
        padding: 0.5rem 1rem;
        background: var(--bg-primary);
        border-radius: 8px;
        font-family: monospace;
      }

      .progress-bar {
        height: 4px;
        background: var(--bg-tertiary);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 1rem;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #019733, #000000);
        transition: width 0.3s;
      }

      .navigation-hint {
        text-align: center;
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin-bottom: 2rem;
      }

      .navigation-hint kbd {
        background: var(--bg-tertiary);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: inherit;
      }

      .vim-cheatsheet {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.5rem;
      }

      .vim-cheatsheet h4 {
        margin-bottom: 1rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
        text-transform: uppercase;
      }

      .cheatsheet-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.75rem;
      }

      .cheatsheet-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        border-radius: 6px;
        background: var(--bg-tertiary);
        transition: all 0.2s;
      }

      .cheatsheet-item.current {
        background: rgba(34, 197, 94, 0.2);
        border: 1px solid #22c55e;
      }

      .cheatsheet-item code {
        font-family: monospace;
        background: var(--bg-primary);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        min-width: 60px;
        text-align: center;
      }

      .cheatsheet-item span {
        font-size: 0.75rem;
        color: var(--text-secondary);
      }

      .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
      }
    `;
    document.head.appendChild(styles);
  }

  private attachEventListeners(): void {
    // Category tabs
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category') as VimCategory;
        this.currentCategory = category;
        this.currentIndex = 0;
        this.currentInput = '';
        this.render();
      });
    });

    // Keyboard input - only add if not already added
    if (!this.boundHandleKeyDown) {
      this.boundHandleKeyDown = this.handleKeyDown.bind(this);
      document.addEventListener('keydown', this.boundHandleKeyDown);
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const currentCommand = this.currentCommands[this.currentIndex];
    if (!currentCommand) {
      return;
    }

    const target = currentCommand.keys;

    // Prevent default for Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      this.currentInput = '';
      this.updateDisplay();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      this.skipCurrent();
      return;
    }

    // Backspace - allow deleting to correct errors
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (this.currentInput.length > 0) {
        this.currentInput = this.currentInput.slice(0, -1);
        this.updateDisplay();
      }
      return;
    }

    // Start timer on first meaningful input
    if (!this.isActive) {
      this.isActive = true;
      this.startTime = Date.now();
    }

    // Build the expected sequence to match against
    // Vim commands can be like: "dd", "yy", "Ctrl+d", "Ctrl+u", "/pattern", ":w", etc.

    // Determine what the user typed
    let typedSequence = '';

    if (e.ctrlKey && e.key !== 'Control') {
      // Ctrl+key combination - normalize the key to lowercase
      typedSequence = `Ctrl+${e.key.toLowerCase()}`;
      e.preventDefault(); // Prevent browser shortcuts
    } else if (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Meta') {
      // Modifier key alone - ignore
      return;
    } else if (e.key.length === 1) {
      // Regular character
      typedSequence = e.key;
    } else {
      // Other special keys (Enter, etc.) - ignore for now
      return;
    }

    // Check what we expect at the current position
    const remainingTarget = target.slice(this.currentInput.length);

    // Check if we're expecting a Ctrl+ combination
    const ctrlMatch = remainingTarget.match(/^Ctrl\+([a-zA-Z])/);

    if (ctrlMatch) {
      // We expect a Ctrl+key combination
      const expectedCtrlCombo = `Ctrl+${ctrlMatch[1].toLowerCase()}`;
      this.totalChars++;

      if (typedSequence.toLowerCase() === expectedCtrlCombo.toLowerCase()) {
        this.correctChars++;
        // Add the full "Ctrl+x" to the input
        this.currentInput += ctrlMatch[0];
      } else {
        this.errors++;
        // On error, add what they typed (for visual feedback) but mark as error
        this.currentInput += typedSequence;
      }
    } else {
      // Regular character expected
      const expectedChar = remainingTarget[0];
      this.totalChars++;

      if (typedSequence === expectedChar) {
        this.correctChars++;
        this.currentInput += typedSequence;
      } else {
        this.errors++;
        // Add the wrong character so it shows as red
        this.currentInput += typedSequence;
      }
    }

    this.updateDisplay();
    this.updateStats();

    // Check if complete and all correct
    if (this.currentInput === target) {
      setTimeout(() => this.completeCurrentItem(), 300);
    }
  }

  private updateDisplay(): void {
    const displayEl = document.getElementById('vim-display');
    if (!displayEl) {
      return;
    }

    const currentCommand = this.currentCommands[this.currentIndex];
    if (!currentCommand) {
      return;
    }

    const target = currentCommand.keys;
    let html = '';

    for (let i = 0; i < target.length; i++) {
      const inputChar = this.currentInput[i];
      const targetChar = target[i];

      if (i < this.currentInput.length) {
        if (inputChar === targetChar) {
          html += `<span class="correct">${this.escapeHtml(targetChar)}</span>`;
        } else {
          html += `<span class="incorrect">${this.escapeHtml(inputChar)}</span>`;
        }
      } else if (i === this.currentInput.length) {
        html += `<span class="current">${this.escapeHtml(targetChar)}</span>`;
      } else {
        html += `<span class="pending">${this.escapeHtml(targetChar)}</span>`;
      }
    }

    displayEl.innerHTML = html;
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  private updateStats(): void {
    const wpmEl = document.getElementById('wpm');
    const accuracyEl = document.getElementById('accuracy');
    const errorsEl = document.getElementById('errors');

    if (this.startTime && wpmEl) {
      const minutes = (Date.now() - this.startTime) / 60000;
      const words = this.correctChars / 5;
      const wpm = Math.round(words / Math.max(minutes, 0.01));
      wpmEl.textContent = wpm.toString();
    }

    if (accuracyEl && this.totalChars > 0) {
      const accuracy = Math.round((this.correctChars / this.totalChars) * 100);
      accuracyEl.textContent = `${accuracy}%`;
    }

    if (errorsEl) {
      errorsEl.textContent = this.errors.toString();
    }
  }

  private completeCurrentItem(): void {
    this.currentIndex++;
    if (this.currentIndex >= this.currentCommands.length) {
      // Only show completion message if there were commands
      if (this.currentCommands.length > 0) {
        EventBus.emit('ui:toast', {
          message: t('vim.allComplete', {
            count: this.currentCommands.length,
            category: this.getCategoryTitle(this.currentCategory),
          }),
          type: 'success',
        });
      }
      this.currentIndex = 0;
    }

    this.currentInput = '';
    this.render();
  }

  private skipCurrent(): void {
    this.currentInput = '';
    this.currentIndex++;
    if (this.currentIndex >= this.currentCommands.length) {
      this.currentIndex = 0;
    }
    this.render();
  }

  private loadCategory(): void {
    this.currentCommands = VIM_COMMANDS.filter(cmd => cmd.category === this.currentCategory);
    this.updateDisplay();
  }

  destroy(): void {
    if (this.boundHandleKeyDown) {
      document.removeEventListener('keydown', this.boundHandleKeyDown);
      this.boundHandleKeyDown = null;
    }
  }
}
