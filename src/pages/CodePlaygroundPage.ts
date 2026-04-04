/**
 * Code Playground Page
 * Type code and see it execute in real-time
 */

import { VirtualKeyboard } from '../components/keyboard/VirtualKeyboard';
import { EventBus } from '../core';
import { ConfettiService, PythonService, SoundService } from '../services';
import { CODE_CHALLENGES, CodeChallenge } from '../data/codeChallenges';

/* eslint-disable @typescript-eslint/no-implied-eval */

type Language = 'javascript' | 'python' | 'java' | 'typescript';

// Track Pyodide loading state
let pyodideLoadingPromise: Promise<void> | null = null;

export class CodePlaygroundPage {
  private keyboard: VirtualKeyboard | null = null;
  private currentChallenge: CodeChallenge | null = null;
  private userCode: string = '';
  private output: string = '';
  private isRunning: boolean = false;
  private showHints: boolean = false;
  private currentHintIndex: number = 0;
  private completedChallenges: Set<string> = new Set();

  constructor() {
    this.loadCompletedChallenges();
  }

  /**
   * Load completed challenges from localStorage
   */
  private loadCompletedChallenges(): void {
    try {
      const stored = localStorage.getItem('keyboardwriter_completed_challenges');
      if (stored) {
        this.completedChallenges = new Set(JSON.parse(stored) as string[]);
      }
    } catch {
      // Ignore errors
    }
  }

  /**
   * Save completed challenges
   */
  private saveCompletedChallenges(): void {
    try {
      localStorage.setItem(
        'keyboardwriter_completed_challenges',
        JSON.stringify([...this.completedChallenges])
      );
    } catch {
      // Ignore errors
    }
  }

  /**
   * Render the page
   */
  render(): string {
    return `
      <div class="code-playground-container">
        ${this.renderHeader()}
        <div class="playground-content">
          ${this.renderChallengeList()}
          ${this.renderCodeEditor()}
        </div>
        ${this.renderKeyboard()}
      </div>
      ${this.renderStyles()}
    `;
  }

  /**
   * Render header
   */
  private renderHeader(): string {
    const completed = this.completedChallenges.size;
    const total = CODE_CHALLENGES.length;
    const progress = Math.round((completed / total) * 100);

    return `
      <div class="playground-header">
        <div class="header-left">
          <h1>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16,18 22,12 16,6"></polyline>
              <polyline points="8,6 2,12 8,18"></polyline>
            </svg>
            Code Playground
          </h1>
          <p>Type code and see it execute in real-time</p>
        </div>
        <div class="header-stats">
          <div class="stat">
            <span class="stat-value">${completed}/${total}</span>
            <span class="stat-label">Challenges</span>
          </div>
          <div class="stat">
            <div class="progress-ring" style="--progress: ${progress}%">
              <span>${progress}%</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render challenge list
   */
  private renderChallengeList(): string {
    const jsChallenges = CODE_CHALLENGES.filter(c => c.language === 'javascript');
    const pyChallenges = CODE_CHALLENGES.filter(c => c.language === 'python');
    const javaChallenges = CODE_CHALLENGES.filter(c => c.language === 'java');
    const tsChallenges = CODE_CHALLENGES.filter(c => c.language === 'typescript');

    return `
      <div class="challenge-list">
        <h3>JavaScript</h3>
        <div class="challenge-items">
          ${jsChallenges.map(c => this.renderChallengeItem(c)).join('')}
        </div>
        <h3 style="margin-top: var(--space-4);">Python</h3>
        <div class="challenge-items">
          ${pyChallenges.map(c => this.renderChallengeItem(c)).join('')}
        </div>
        <h3 style="margin-top: var(--space-4);">Java</h3>
        <div class="challenge-items">
          ${javaChallenges.map(c => this.renderChallengeItem(c)).join('')}
        </div>
        <h3 style="margin-top: var(--space-4);">TypeScript</h3>
        <div class="challenge-items">
          ${tsChallenges.map(c => this.renderChallengeItem(c)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render single challenge item
   */
  private renderChallengeItem(challenge: CodeChallenge): string {
    const isCompleted = this.completedChallenges.has(challenge.id);
    const isActive = this.currentChallenge?.id === challenge.id;
    const difficultyColors = {
      easy: 'var(--accent-success)',
      medium: 'var(--accent-warning)',
      hard: 'var(--accent-error)',
    };

    return `
      <button class="challenge-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-challenge="${challenge.id}">
        <div class="challenge-status">
          ${
            isCompleted
              ? `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent-success)" stroke="none">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          `
              : `
            <span class="difficulty-dot" style="background: ${difficultyColors[challenge.difficulty]}"></span>
          `
          }
        </div>
        <div class="challenge-info">
          <span class="challenge-title">${challenge.title}</span>
          <span class="challenge-xp">+${challenge.xp} XP</span>
        </div>
      </button>
    `;
  }

  /**
   * Render code editor
   */
  private renderCodeEditor(): string {
    if (!this.currentChallenge) {
      return `
        <div class="code-editor-panel empty">
          <div class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1">
              <polyline points="16,18 22,12 16,6"></polyline>
              <polyline points="8,6 2,12 8,18"></polyline>
            </svg>
            <h3>Select a Challenge</h3>
            <p>Click on a challenge on the left to start</p>
          </div>
        </div>
      `;
    }

    const challenge = this.currentChallenge;
    const languageIcons: Record<Language, string> = {
      javascript: 'JS',
      python: 'PY',
      java: 'JAVA',
      typescript: 'TS',
    };

    // Determine if this is a type-only challenge (Java/TypeScript)
    const isTypeOnly = challenge.language === 'java' || challenge.language === 'typescript';

    return `
      <div class="code-editor-panel">
        <div class="challenge-header">
          <div class="challenge-title-row">
            <span class="language-badge ${challenge.language}">${languageIcons[challenge.language]}</span>
            <h2>${challenge.title}</h2>
          </div>
          <p class="challenge-description">${challenge.description}</p>
          <div class="challenge-meta">
            <span class="difficulty ${challenge.difficulty}">${challenge.difficulty}</span>
            <span class="xp-badge">+${challenge.xp} XP</span>
            ${isTypeOnly ? '<span class="type-only-badge">Type to verify</span>' : ''}
          </div>
        </div>

        <div class="editor-container">
          <div class="editor-header">
            <span>Code Editor</span>
            <div class="editor-actions">
              <button class="btn-icon" id="btn-reset-code" title="Reset code">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="1,4 1,10 7,10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
              </button>
              <button class="btn-icon" id="btn-show-solution" title="Show solution">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
          <div class="code-input-area" id="code-input-area">
            <textarea 
              id="code-textarea" 
              class="code-textarea"
              spellcheck="false"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
            >${this.userCode || challenge.starterCode}</textarea>
          </div>
        </div>

        <div class="output-container">
          <div class="output-header">
            <span>Output</span>
            <button class="btn btn-primary btn-sm" id="btn-run-code" ${this.isRunning ? 'disabled' : ''}>
              ${this.isRunning ? 'Running...' : isTypeOnly ? 'Verify Code' : 'Run Code'}
            </button>
          </div>
          <div class="output-area" id="output-area">
            ${this.output ? `<pre>${this.escapeHtml(this.output)}</pre>` : `<span class="placeholder">Click "${isTypeOnly ? 'Verify Code' : 'Run Code'}" to see the output</span>`}
          </div>
        </div>

        ${
          this.showHints
            ? this.renderHints()
            : `
          <button class="btn btn-ghost btn-sm" id="btn-show-hints" style="margin-top: var(--space-2);">
             Show hint
          </button>
        `
        }
      </div>
    `;
  }

  /**
   * Render hints
   */
  private renderHints(): string {
    if (!this.currentChallenge) {
      return '';
    }
    const hints = this.currentChallenge.hints;

    return `
      <div class="hints-container">
        <h4>Hints</h4>
        ${hints
          .slice(0, this.currentHintIndex + 1)
          .map(
            (hint, i) => `
          <div class="hint-item">
            <span class="hint-number">${i + 1}</span>
            <span>${hint}</span>
          </div>
        `
          )
          .join('')}
        ${
          this.currentHintIndex < hints.length - 1
            ? `
          <button class="btn btn-ghost btn-sm" id="btn-next-hint">
            Next hint (${this.currentHintIndex + 2}/${hints.length})
          </button>
        `
            : ''
        }
      </div>
    `;
  }

  /**
   * Render keyboard
   */
  private renderKeyboard(): string {
    return `
      <div class="keyboard-section" style="margin-top: var(--space-4);">
        <div id="playground-keyboard"></div>
      </div>
    `;
  }

  /**
   * Render styles
   */
  private renderStyles(): string {
    return `
      <style>
        .code-playground-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--space-4);
        }

        .playground-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }

        .playground-header h1 {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-2xl);
        }

        .playground-header p {
          color: var(--text-secondary);
          margin-top: var(--space-1);
        }

        .header-stats {
          display: flex;
          gap: var(--space-4);
          align-items: center;
        }

        .header-stats .stat {
          text-align: center;
        }

        .header-stats .stat-value {
          font-size: var(--font-size-xl);
          font-weight: bold;
          color: var(--accent-primary);
        }

        .header-stats .stat-label {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        .progress-ring {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: conic-gradient(
            var(--accent-primary) var(--progress),
            var(--bg-tertiary) var(--progress)
          );
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-sm);
          font-weight: bold;
        }

        .progress-ring::before {
          content: '';
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-primary);
        }

        .progress-ring span {
          position: relative;
          z-index: 1;
        }

        .playground-content {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--space-4);
        }

        .challenge-list {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          max-height: 600px;
          overflow-y: auto;
        }

        .challenge-list h3 {
          font-size: var(--font-size-sm);
          color: var(--text-muted);
          margin-bottom: var(--space-2);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .challenge-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .challenge-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
          width: 100%;
          color: var(--text-primary);
        }

        .challenge-item:hover {
          background: var(--bg-tertiary);
        }

        .challenge-item.active {
          background: var(--accent-primary);
          color: white;
        }

        .challenge-item.completed .challenge-title {
          text-decoration: line-through;
          opacity: 0.7;
        }

        .challenge-status {
          width: 20px;
          display: flex;
          justify-content: center;
        }

        .difficulty-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .challenge-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .challenge-title {
          font-size: var(--font-size-sm);
        }

        .challenge-xp {
          font-size: var(--font-size-xs);
          color: var(--accent-warning);
        }

        .challenge-item.active .challenge-xp {
          color: rgba(255,255,255,0.8);
        }

        .code-editor-panel {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
        }

        .code-editor-panel.empty {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .empty-state {
          text-align: center;
          color: var(--text-muted);
        }

        .empty-state h3 {
          margin-top: var(--space-4);
          color: var(--text-secondary);
        }

        .challenge-header {
          margin-bottom: var(--space-4);
        }

        .challenge-title-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .language-badge {
          padding: var(--space-1) var(--space-2);
          background: var(--accent-primary);
          color: white;
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: bold;
          font-family: var(--font-mono);
        }

        .language-badge.java { background: #007396; }
        .language-badge.typescript { background: #3178c6; }
        .language-badge.python { background: #3776ab; }

        .challenge-description {
          color: var(--text-secondary);
          margin-top: var(--space-2);
        }

        .challenge-meta {
          display: flex;
          gap: var(--space-2);
          margin-top: var(--space-2);
        }

        .difficulty {
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          text-transform: capitalize;
        }

        .difficulty.easy { background: rgba(34, 197, 94, 0.2); color: var(--accent-success); }
        .difficulty.medium { background: rgba(245, 158, 11, 0.2); color: var(--accent-warning); }
        .difficulty.hard { background: rgba(239, 68, 68, 0.2); color: var(--accent-error); }

        .xp-badge {
          padding: var(--space-1) var(--space-2);
          background: rgba(245, 158, 11, 0.2);
          color: var(--accent-warning);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
        }

        .type-only-badge {
          padding: var(--space-1) var(--space-2);
          background: rgba(99, 102, 241, 0.2);
          color: var(--accent-primary);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
        }

        .editor-container {
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: var(--space-3);
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2) var(--space-3);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-primary);
          font-size: var(--font-size-sm);
          color: var(--text-muted);
        }

        .editor-actions {
          display: flex;
          gap: var(--space-1);
        }

        .btn-icon {
          padding: var(--space-1);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all 0.15s ease;
        }

        .btn-icon:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .code-textarea {
          width: 100%;
          min-height: 200px;
          padding: var(--space-3);
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: var(--font-size-sm);
          line-height: 1.6;
          resize: vertical;
          outline: none;
        }

        .output-container {
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2) var(--space-3);
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border-primary);
          font-size: var(--font-size-sm);
          color: var(--text-muted);
        }

        .btn-sm {
          padding: var(--space-1) var(--space-3);
          font-size: var(--font-size-sm);
        }

        .output-area {
          padding: var(--space-3);
          min-height: 60px;
          font-family: var(--font-mono);
          font-size: var(--font-size-sm);
        }

        .output-area pre {
          margin: 0;
          white-space: pre-wrap;
        }

        .output-area .placeholder {
          color: var(--text-muted);
        }

        .output-area.success {
          background: rgba(34, 197, 94, 0.1);
          border-left: 3px solid var(--accent-success);
        }

        .output-area.error {
          background: rgba(239, 68, 68, 0.1);
          border-left: 3px solid var(--accent-error);
        }

        .hints-container {
          margin-top: var(--space-3);
          padding: var(--space-3);
          background: rgba(59, 130, 246, 0.1);
          border-radius: var(--radius-md);
          border-left: 3px solid var(--accent-primary);
        }

        .hints-container h4 {
          margin-bottom: var(--space-2);
        }

        .hint-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
        }

        .hint-number {
          width: 20px;
          height: 20px;
          background: var(--accent-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xs);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .playground-content {
            grid-template-columns: 1fr;
          }

          .challenge-list {
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
    const keyboardContainer = document.getElementById('playground-keyboard');
    if (keyboardContainer) {
      this.keyboard = new VirtualKeyboard('playground-keyboard');
    }

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Challenge selection
    document.querySelectorAll('.challenge-item').forEach(item => {
      item.addEventListener('click', () => {
        const challengeId = (item as HTMLElement).dataset.challenge;
        if (challengeId) {
          this.selectChallenge(challengeId);
        }
      });
    });

    // Run code button
    const runBtn = document.getElementById('btn-run-code');
    runBtn?.addEventListener('click', () => this.runCode());

    // Reset code button
    const resetBtn = document.getElementById('btn-reset-code');
    resetBtn?.addEventListener('click', () => this.resetCode());

    // Show solution button
    const solutionBtn = document.getElementById('btn-show-solution');
    solutionBtn?.addEventListener('click', () => this.showSolution());

    // Show hints button
    const hintsBtn = document.getElementById('btn-show-hints');
    hintsBtn?.addEventListener('click', () => {
      this.showHints = true;
      this.updateEditor();
    });

    // Next hint button
    const nextHintBtn = document.getElementById('btn-next-hint');
    nextHintBtn?.addEventListener('click', () => {
      this.currentHintIndex++;
      this.updateEditor();
    });

    // Code textarea
    const textarea = document.getElementById('code-textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.addEventListener('input', () => {
        this.userCode = textarea.value;
      });

      // Tab support - insert 3 spaces
      textarea.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          textarea.value =
            textarea.value.substring(0, start) + '   ' + textarea.value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 3;
          this.userCode = textarea.value;
        }
      });
    }
  }

  /**
   * Select a challenge
   */
  private selectChallenge(challengeId: string): void {
    const challenge = CODE_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) {
      return;
    }

    this.currentChallenge = challenge;
    this.userCode = challenge.starterCode;
    this.output = '';
    this.showHints = false;
    this.currentHintIndex = 0;

    this.updateEditor();
    EventBus.emit('nav:change', { page: 'playground' });
  }

  /**
   * Update editor content
   */
  private updateEditor(): void {
    const panel = document.querySelector('.code-editor-panel');
    if (panel) {
      panel.outerHTML = this.renderCodeEditor();
      this.setupEventListeners();
    }
  }

  /**
   * Run the code
   */
  private runCode(): void {
    if (!this.currentChallenge || this.isRunning) {
      return;
    }

    const textarea = document.getElementById('code-textarea') as HTMLTextAreaElement;
    if (textarea) {
      this.userCode = textarea.value;
    }

    this.isRunning = true;
    this.output = '';
    this.updateEditor();

    // Execute code (async for Python, sync for JS, type-check for Java/TS)
    const executeAndHandle = async () => {
      try {
        let result: { output: string; isCorrect: boolean };

        if (this.currentChallenge!.language === 'python') {
          result = await this.executePythonAsync(this.userCode, this.currentChallenge!);
        } else if (
          this.currentChallenge!.language === 'java' ||
          this.currentChallenge!.language === 'typescript'
        ) {
          result = this.verifyTypeOnlyCode(this.userCode, this.currentChallenge!);
        } else {
          result = this.executeCode(this.userCode, this.currentChallenge!);
        }

        this.output = result.output;
        this.isRunning = false;

        // Check if correct
        if (result.isCorrect && !this.completedChallenges.has(this.currentChallenge!.id)) {
          this.completedChallenges.add(this.currentChallenge!.id);
          this.saveCompletedChallenges();

          // Celebrate!
          ConfettiService.celebrate('medium');
          SoundService.playSuccess();

          EventBus.emit('ui:toast', {
            message: `Challenge solved! +${this.currentChallenge!.xp} XP`,
            type: 'success',
          });
        }

        this.updateEditor();

        // Add success/error styling
        const outputArea = document.getElementById('output-area');
        if (outputArea) {
          outputArea.classList.remove('success', 'error');
          outputArea.classList.add(result.isCorrect ? 'success' : 'error');
        }
      } catch (error) {
        this.output = `Error: ${String(error)}`;
        this.isRunning = false;
        this.updateEditor();
      }
    };

    // Small delay for UI update, then execute
    setTimeout(() => {
      void executeAndHandle();
    }, 100);
  }

  /**
   * Verify type-only code (Java/TypeScript) by comparing with solution
   */
  private verifyTypeOnlyCode(
    code: string,
    challenge: CodeChallenge
  ): { output: string; isCorrect: boolean } {
    // Normalize whitespace for comparison
    const normalizeCode = (s: string): string => {
      return s
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, '  ')
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n')
        .trim();
    };

    const userNormalized = normalizeCode(code);
    const solutionNormalized = normalizeCode(challenge.solution);

    const isCorrect = userNormalized === solutionNormalized;

    if (isCorrect) {
      return {
        output: `Code verified successfully!\n\nExpected output: ${challenge.expectedOutput}\n\nCorrect!`,
        isCorrect: true,
      };
    } else {
      // Show difference hint
      const userLines = userNormalized.split('\n');
      const solutionLines = solutionNormalized.split('\n');
      let diffLine = -1;

      for (let i = 0; i < Math.max(userLines.length, solutionLines.length); i++) {
        if (userLines[i] !== solutionLines[i]) {
          diffLine = i + 1;
          break;
        }
      }

      return {
        output: `Code does not match expected solution.\n\n${diffLine > 0 ? `Difference found at line ${diffLine}.` : 'Check your code carefully.'}\n\nExpected output: ${challenge.expectedOutput}`,
        isCorrect: false,
      };
    }
  }

  /**
   * Execute code (sandboxed) - for JavaScript only
   */
  private executeCode(
    code: string,
    challenge: CodeChallenge
  ): { output: string; isCorrect: boolean } {
    if (challenge.language === 'javascript') {
      return this.executeJavaScript(code, challenge);
    }
    // Python is handled by executePythonAsync
    return { output: 'Unsupported language', isCorrect: false };
  }

  /**
   * Execute JavaScript code
   */
  private executeJavaScript(
    code: string,
    challenge: CodeChallenge
  ): { output: string; isCorrect: boolean } {
    try {
      // Create a sandboxed function
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const fn = new Function(`
        ${code}
        
        // Test cases based on challenge
        const testCases = {
          'js-hello': () => hello(),
          'js-sum': () => sum(2, 3),
          'js-multiply': () => multiply(4, 5),
          'js-max': () => max(7, 3),
          'js-even': () => isEven(4),
          'js-factorial': () => factorial(5),
          'js-fizzbuzz': () => fizzBuzz(15),
          'js-reverse': () => reverse("hello"),
          'js-palindrome': () => isPalindrome("Anna"),
          'js-fibonacci': () => fibonacci(6),
          'js-vowels': () => countVowels("Hello World"),
          'js-array-sum': () => arraySum([1,2,3,4,5]),
          'js-prime': () => isPrime(17),
          'js-flatten': () => flatten([[1,2],[3,[4,5]]]),
          'js-unique': () => unique([1,2,2,3,3,3]),
          'js-chunk': () => chunk([1,2,3,4,5], 2).map(c => c.join(',')).join('|'),
          'js-debounce': () => debounce(() => 42, 100)(),
          'js-curry': () => curry((a,b) => a+b)(2)(3),
          'js-deep-clone': () => deepClone({a:{b:1}}).a.b,
          'js-memoize': () => memoize(x => x*2)(5),
          'js-compose': () => compose(x=>x+1, x=>x*2)(3),
          'js-binary-search': () => binarySearch([1,3,5,7,9], 5),
          'js-anagram': () => isAnagram("listen", "silent"),
          'js-gcd': () => gcd(48, 18),
          'js-power': () => power(2, 10),
          'js-merge-sorted': () => mergeSorted([1,3,5], [2,4,6]),
          'js-rotate-array': () => rotate([1,2,3,4,5], 2),
          'js-intersection': () => intersection([1,2,3], [2,3,4]),
          'js-title-case': () => titleCase("hello world"),
          'js-camel-case': () => toCamelCase("hello_world"),
        };
        
        return testCases['${challenge.id}']();
      `);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const result: unknown = fn();

      // Handle undefined result (function doesn't return anything)
      if (result === undefined) {
        return {
          output:
            'undefined\n\nTip: Your function does not return anything.\nUse "return" to return a value!\n\nExpected: ' +
            challenge.expectedOutput,
          isCorrect: false,
        };
      }

      const output = String(result);
      const isCorrect = output === challenge.expectedOutput;

      // Add helpful message if wrong
      if (!isCorrect) {
        return {
          output: output + '\n\nNot quite right.\nExpected: ' + challenge.expectedOutput,
          isCorrect: false,
        };
      }

      return { output: output + '\n\nCorrect!', isCorrect };
    } catch (error) {
      return { output: `Error: ${(error as Error).message}`, isCorrect: false };
    }
  }

  /**
   * Execute Python code using Pyodide (real execution)
   */
  private async executePythonAsync(
    code: string,
    challenge: CodeChallenge
  ): Promise<{ output: string; isCorrect: boolean }> {
    try {
      // Load Pyodide if not already loaded
      if (!PythonService.isLoaded()) {
        if (!pyodideLoadingPromise) {
          this.output =
            'Loading Python environment (~11 MB)...\nThis may take a moment the first time.';
          this.updateEditor();
          pyodideLoadingPromise = PythonService.load();
        }
        await pyodideLoadingPromise;
      }

      // Build test code based on challenge - all Python challenges
      const testCases: Record<string, { functionName: string; args: unknown[] }> = {
        'py-hello': { functionName: 'hello', args: [] },
        'py-add': { functionName: 'add', args: [3, 4] },
        'py-list-sum': { functionName: 'list_sum', args: [[1, 2, 3, 4, 5]] },
        'py-max': { functionName: 'find_max', args: [[3, 7, 2, 9, 1]] },
        'py-even': { functionName: 'is_even', args: [8] },
        'py-reverse': { functionName: 'reverse_string', args: ['python'] },
        'py-factorial': { functionName: 'factorial', args: [5] },
        'py-fizzbuzz': { functionName: 'fizz_buzz', args: [15] },
        'py-palindrome': { functionName: 'is_palindrome', args: ['Anna'] },
        'py-fibonacci': { functionName: 'fibonacci', args: [7] },
        'py-count-vowels': { functionName: 'count_vowels', args: ['Hello World'] },
        'py-prime': { functionName: 'is_prime', args: [17] },
        'py-flatten': {
          functionName: 'flatten',
          args: [
            [
              [1, 2],
              [3, 4],
            ],
          ],
        },
        'py-unique': { functionName: 'unique', args: [[1, 2, 2, 3, 3, 3]] },
        'py-anagram': { functionName: 'is_anagram', args: ['listen', 'silent'] },
        'py-gcd': { functionName: 'gcd', args: [48, 18] },
        'py-binary-search': { functionName: 'binary_search', args: [[1, 3, 5, 7, 9], 5] },
        'py-merge-sorted': {
          functionName: 'merge_sorted',
          args: [
            [1, 3, 5],
            [2, 4, 6],
          ],
        },
        'py-power': { functionName: 'power', args: [2, 10] },
        'py-intersection': {
          functionName: 'intersection',
          args: [
            [1, 2, 3],
            [2, 3, 4],
          ],
        },
        'py-rotate': { functionName: 'rotate', args: [[1, 2, 3, 4, 5], 2] },
        'py-title-case': { functionName: 'title_case', args: ['hello world'] },
        'py-zip-dict': {
          functionName: 'lists_to_dict',
          args: [
            ['a', 'b'],
            [1, 2],
          ],
        },
        'py-word-freq': { functionName: 'word_freq', args: ['a b a'] },
        'py-matrix-transpose': {
          functionName: 'transpose',
          args: [
            [
              [1, 2],
              [3, 4],
            ],
          ],
        },
        'py-chunk': { functionName: 'chunk', args: [[1, 2, 3, 4, 5], 2] },
      };

      const testCase = testCases[challenge.id];
      if (!testCase) {
        return { output: `Unknown challenge: ${challenge.id}`, isCorrect: false };
      }

      // Execute the code and get result
      const result = await PythonService.executeWithReturn(
        code,
        testCase.functionName,
        testCase.args
      );

      if (result.error) {
        return { output: `Python Error: ${result.error}`, isCorrect: false };
      }

      // Handle None/null result (function doesn't return anything)
      if (result.result === null || result.result === undefined) {
        return {
          output:
            'None\n\nTip: Your function does not return anything.\nRemove "pass" and use "return" to return a value!\n\nExpected: ' +
            challenge.expectedOutput,
          isCorrect: false,
        };
      }

      const output = String(result.result);
      const isCorrect = output === challenge.expectedOutput;

      // Add helpful feedback
      if (!isCorrect) {
        return {
          output: output + '\n\nNot quite right.\nExpected: ' + challenge.expectedOutput,
          isCorrect: false,
        };
      }

      return { output: output + '\n\nCorrect!', isCorrect };
    } catch (error) {
      return { output: `Error: ${(error as Error).message}`, isCorrect: false };
    }
  }

  /**
   * Reset code to starter
   */
  private resetCode(): void {
    if (this.currentChallenge) {
      this.userCode = this.currentChallenge.starterCode;
      this.output = '';
      this.updateEditor();
    }
  }

  /**
   * Show solution
   */
  private showSolution(): void {
    if (this.currentChallenge) {
      this.userCode = this.currentChallenge.solution;
      this.updateEditor();
    }
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
   * Destroy the page
   */
  destroy(): void {
    if (this.keyboard) {
      this.keyboard.destroy();
      this.keyboard = null;
    }
  }
}
