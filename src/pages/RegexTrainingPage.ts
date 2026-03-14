/**
 * Regex Training Page
 * Practice regular expressions with interactive examples
 */

import { EventBus } from '../core';
import { REGEX_PATTERNS, RegexPattern } from '../data/programmingExercises';

export class RegexTrainingPage {
  private readonly container: HTMLElement;
  private readonly currentPatterns: RegexPattern[] = REGEX_PATTERNS;
  private currentIndex = 0;
  private currentInput = '';
  private isActive = false;
  private startTime = 0;
  private correctChars = 0;
  private totalChars = 0;
  private errors = 0;
  private testInput = '';
  private showMatches = false;
  private boundHandleKeyDown: ((e: KeyboardEvent) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(): void {
    const currentPattern = this.currentPatterns[this.currentIndex];

    this.container.innerHTML = `
      <div class="regex-training-page">
        <header class="page-header">
          <h1>Regex Training</h1>
          <p>Lerne regulaere Ausdruecke durch praktische Uebungen</p>
        </header>

        <div class="stats-bar">
          <div class="stat">
            <span class="stat-label">Muster</span>
            <span class="stat-value">${this.currentIndex + 1}/${this.currentPatterns.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">WPM</span>
            <span class="stat-value" id="wpm">0</span>
          </div>
          <div class="stat">
            <span class="stat-label">Genauigkeit</span>
            <span class="stat-value" id="accuracy">100%</span>
          </div>
          <div class="stat">
            <span class="stat-label">Fehler</span>
            <span class="stat-value" id="errors">0</span>
          </div>
        </div>

        ${currentPattern ? this.renderPatternCard(currentPattern) : this.renderEmptyState()}

        <div class="progress-bar">
          <div class="progress-fill" style="width: ${(this.currentIndex / this.currentPatterns.length) * 100}%"></div>
        </div>

        <div class="navigation-hint">
          Tippe das Regex-Muster. <kbd>Tab</kbd> zum Ueberspringen, <kbd>Enter</kbd> zum Bestaetigen.
        </div>

        <div class="regex-reference">
          <h4>Regex Schnellreferenz</h4>
          <div class="reference-grid">
            <div class="reference-item">
              <code>.</code>
              <span>Beliebiges Zeichen</span>
            </div>
            <div class="reference-item">
              <code>*</code>
              <span>0 oder mehr</span>
            </div>
            <div class="reference-item">
              <code>+</code>
              <span>1 oder mehr</span>
            </div>
            <div class="reference-item">
              <code>?</code>
              <span>0 oder 1</span>
            </div>
            <div class="reference-item">
              <code>^</code>
              <span>Zeilenanfang</span>
            </div>
            <div class="reference-item">
              <code>$</code>
              <span>Zeilenende</span>
            </div>
            <div class="reference-item">
              <code>[abc]</code>
              <span>Zeichenklasse</span>
            </div>
            <div class="reference-item">
              <code>[^abc]</code>
              <span>Negierte Klasse</span>
            </div>
            <div class="reference-item">
              <code>\\d</code>
              <span>Ziffer [0-9]</span>
            </div>
            <div class="reference-item">
              <code>\\w</code>
              <span>Wortzeichen</span>
            </div>
            <div class="reference-item">
              <code>\\s</code>
              <span>Whitespace</span>
            </div>
            <div class="reference-item">
              <code>\\b</code>
              <span>Wortgrenze</span>
            </div>
            <div class="reference-item">
              <code>()</code>
              <span>Gruppe</span>
            </div>
            <div class="reference-item">
              <code>|</code>
              <span>Oder</span>
            </div>
            <div class="reference-item">
              <code>{n}</code>
              <span>Genau n-mal</span>
            </div>
            <div class="reference-item">
              <code>{n,m}</code>
              <span>n bis m-mal</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.addStyles();
    this.attachEventListeners();
  }

  private renderPatternCard(pattern: RegexPattern): string {
    return `
      <div class="regex-card">
        <div class="pattern-header">
          <span class="difficulty-badge ${pattern.difficulty}">${pattern.difficulty}</span>
          <span class="pattern-description">${pattern.description}</span>
        </div>

        <div class="regex-editor">
          <div class="editor-header">
            <span class="editor-label">Regex Pattern</span>
          </div>
          <div class="editor-body">
            <span class="regex-delimiter">/</span>
            <span class="regex-input" id="regex-display"></span>
            <span class="cursor-blink">|</span>
            <span class="regex-delimiter">/g</span>
          </div>
        </div>

        <div class="target-pattern">
          <span class="target-label">Ziel:</span>
          <code class="target-code">${this.escapeHtml(pattern.pattern)}</code>
        </div>

        <div class="example-section">
          <div class="example-label">Beispiel-Match:</div>
          <div class="example-text">
            <code>${this.escapeHtml(pattern.example)}</code>
          </div>
        </div>

        <div class="test-section">
          <div class="test-header">
            <span>Testen</span>
            <button class="test-btn" id="toggle-test">
              ${this.showMatches ? 'Ausblenden' : 'Testen'}
            </button>
          </div>
          ${this.showMatches ? this.renderTestSection(pattern) : ''}
        </div>

        <div class="matches-preview">
          <span class="matches-label">Matches:</span>
          <div class="matches-list">
            ${pattern.matches.map(m => `<span class="match-item">${this.escapeHtml(m)}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  private renderTestSection(pattern: RegexPattern): string {
    let matchResult = '';
    try {
      const regex = new RegExp(this.currentInput || pattern.pattern, 'g');
      const testStr = this.testInput || pattern.example;
      const matches = testStr.match(regex);
      matchResult = matches ? `${matches.length} Treffer: ${matches.join(', ')}` : 'Keine Treffer';
    } catch {
      matchResult = 'Ungueltiges Pattern';
    }

    return `
      <div class="test-area">
        <textarea 
          class="test-input" 
          id="test-input" 
          placeholder="Text zum Testen eingeben..."
        >${this.testInput}</textarea>
        <div class="test-result">${matchResult}</div>
      </div>
    `;
  }

  private renderEmptyState(): string {
    return `
      <div class="empty-state">
        <p>Keine Muster verfuegbar.</p>
      </div>
    `;
  }

  private addStyles(): void {
    if (document.getElementById('regex-training-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'regex-training-styles';
    styles.textContent = `
      .regex-training-page {
        padding: 2rem;
        max-width: 1000px;
        margin: 0 auto;
      }

      .page-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .page-header h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #e879f9, #6366f1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .page-header p {
        color: var(--text-secondary);
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

      .regex-card {
        background: var(--bg-secondary);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .pattern-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .difficulty-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .difficulty-badge.beginner {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
      }

      .difficulty-badge.intermediate {
        background: rgba(234, 179, 8, 0.2);
        color: #eab308;
      }

      .difficulty-badge.advanced {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
      }

      .pattern-description {
        font-size: 1.2rem;
        font-weight: 500;
      }

      .regex-editor {
        background: #1e1e1e;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 1rem;
      }

      .editor-header {
        background: #323232;
        padding: 0.5rem 1rem;
        color: #888;
        font-size: 0.75rem;
      }

      .editor-body {
        padding: 1.5rem;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        color: #f0f0f0;
      }

      .regex-delimiter {
        color: #e879f9;
      }

      .regex-input {
        flex: 1;
        margin: 0 0.25rem;
      }

      .regex-input .correct {
        color: #22c55e;
      }

      .regex-input .incorrect {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.2);
      }

      .regex-input .pending {
        color: #666;
      }

      .regex-input .current {
        background: rgba(59, 130, 246, 0.3);
      }

      .cursor-blink {
        animation: blink 1s infinite;
        color: #e879f9;
      }

      @keyframes blink {
        0%, 50% {
          opacity: 1;
        }
        51%, 100% {
          opacity: 0;
        }
      }

      .target-pattern {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: var(--bg-tertiary);
        border-radius: 8px;
      }

      .target-label {
        color: var(--text-secondary);
      }

      .target-code {
        font-family: monospace;
        font-size: 1rem;
        background: var(--bg-primary);
        padding: 0.5rem 1rem;
        border-radius: 6px;
        word-break: break-all;
      }

      .example-section {
        margin-bottom: 1rem;
        padding: 1rem;
        background: var(--bg-tertiary);
        border-radius: 8px;
      }

      .example-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
      }

      .example-text code {
        font-family: monospace;
        color: #22c55e;
      }

      .test-section {
        border-top: 1px solid var(--bg-tertiary);
        padding-top: 1rem;
        margin-bottom: 1rem;
      }

      .test-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .test-btn {
        padding: 0.5rem 1rem;
        background: var(--bg-tertiary);
        border: none;
        border-radius: 6px;
        color: var(--text-primary);
        cursor: pointer;
        font-size: 0.875rem;
      }

      .test-btn:hover {
        background: var(--bg-primary);
      }

      .test-area {
        margin-top: 0.75rem;
      }

      .test-input {
        width: 100%;
        min-height: 80px;
        padding: 0.75rem;
        border: 2px solid var(--bg-tertiary);
        border-radius: 8px;
        background: var(--bg-primary);
        color: var(--text-primary);
        font-family: monospace;
        resize: vertical;
      }

      .test-input:focus {
        outline: none;
        border-color: #e879f9;
      }

      .test-result {
        margin-top: 0.5rem;
        padding: 0.5rem;
        background: var(--bg-tertiary);
        border-radius: 6px;
        font-family: monospace;
        font-size: 0.875rem;
        color: #22c55e;
      }

      .matches-preview {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
      }

      .matches-label {
        color: var(--text-secondary);
        font-size: 0.875rem;
        flex-shrink: 0;
      }

      .matches-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .match-item {
        padding: 0.25rem 0.75rem;
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid #22c55e;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.875rem;
        color: #22c55e;
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
        background: linear-gradient(90deg, #e879f9, #6366f1);
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

      .regex-reference {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.5rem;
      }

      .regex-reference h4 {
        margin-bottom: 1rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
        text-transform: uppercase;
      }

      .reference-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 0.5rem;
      }

      .reference-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background: var(--bg-tertiary);
        border-radius: 6px;
      }

      .reference-item code {
        font-family: monospace;
        background: var(--bg-primary);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        color: #e879f9;
        min-width: 50px;
        text-align: center;
      }

      .reference-item span {
        font-size: 0.7rem;
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
    // Keyboard input - only add if not already added
    if (!this.boundHandleKeyDown) {
      this.boundHandleKeyDown = this.handleKeyDown.bind(this);
      document.addEventListener('keydown', this.boundHandleKeyDown);
    }

    // Toggle test
    const toggleBtn = this.container.querySelector('#toggle-test');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.showMatches = !this.showMatches;
        this.render();
      });
    }

    // Test input
    const testInput = this.container.querySelector('#test-input');
    if (testInput) {
      testInput.addEventListener('input', e => {
        this.testInput = (e.target as HTMLTextAreaElement).value;
        this.render();
      });
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Don't capture if typing in test input
    if ((e.target as HTMLElement).id === 'test-input') {
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      this.skipCurrent();
      return;
    }

    if (e.key === 'Enter') {
      const currentPattern = this.currentPatterns[this.currentIndex];
      if (currentPattern && this.currentInput === currentPattern.pattern) {
        this.completeCurrentItem();
      }
      return;
    }

    if (e.key === 'Backspace') {
      if (this.currentInput.length > 0) {
        this.currentInput = this.currentInput.slice(0, -1);
        this.updateDisplay();
      }
      return;
    }

    if (!this.isActive && e.key.length === 1) {
      this.isActive = true;
      this.startTime = Date.now();
    }

    const currentPattern = this.currentPatterns[this.currentIndex];
    if (!currentPattern) {
      return;
    }

    if (e.key.length === 1) {
      const expectedChar = currentPattern.pattern[this.currentInput.length];
      this.totalChars++;

      if (e.key === expectedChar) {
        this.correctChars++;
        this.currentInput += e.key;
      } else {
        this.errors++;
        this.currentInput += e.key;
      }

      this.updateDisplay();
      this.updateStats();

      // Auto-complete if matches
      if (this.currentInput === currentPattern.pattern) {
        setTimeout(() => this.completeCurrentItem(), 500);
      }
    }
  }

  private updateDisplay(): void {
    const displayEl = document.getElementById('regex-display');
    if (!displayEl) {
      return;
    }

    const currentPattern = this.currentPatterns[this.currentIndex];
    if (!currentPattern) {
      return;
    }

    const target = currentPattern.pattern;
    let html = '';

    for (let i = 0; i < Math.max(target.length, this.currentInput.length); i++) {
      const inputChar = this.currentInput[i];
      const targetChar = target[i];

      if (i < this.currentInput.length) {
        if (inputChar === targetChar) {
          html += `<span class="correct">${this.escapeHtml(targetChar)}</span>`;
        } else {
          html += `<span class="incorrect">${this.escapeHtml(inputChar)}</span>`;
        }
      } else if (i === this.currentInput.length) {
        html += `<span class="current">${this.escapeHtml(targetChar || ' ')}</span>`;
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
    if (this.currentIndex >= this.currentPatterns.length) {
      EventBus.emit('ui:toast', {
        message: 'Alle Regex-Muster abgeschlossen!',
        type: 'success',
      });
      this.currentIndex = 0;
    }

    this.currentInput = '';
    this.testInput = '';
    this.showMatches = false;
    this.render();
  }

  private skipCurrent(): void {
    this.currentInput = '';
    this.testInput = '';
    this.showMatches = false;
    this.currentIndex++;
    if (this.currentIndex >= this.currentPatterns.length) {
      this.currentIndex = 0;
    }
    this.render();
  }

  destroy(): void {
    if (this.boundHandleKeyDown) {
      document.removeEventListener('keydown', this.boundHandleKeyDown);
      this.boundHandleKeyDown = null;
    }
  }
}
