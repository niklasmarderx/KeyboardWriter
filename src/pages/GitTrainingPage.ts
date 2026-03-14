/**
 * Git Training Page
 * Practice Git commands, GitHub CLI, and workflows
 */

import { VirtualKeyboard } from '../components/keyboard/VirtualKeyboard';
import { EventBus, t } from '../core';
import { GIT_COMMANDS, GIT_WORKFLOWS, GitCommand, GitWorkflow } from '../data/programmingExercises';

type GitCategory = 'basic' | 'branching' | 'remote' | 'advanced' | 'github' | 'workflows';

export class GitTrainingPage {
  private readonly container: HTMLElement;
  private keyboard: VirtualKeyboard | null = null;
  private currentCategory: GitCategory = 'basic';
  private currentCommands: GitCommand[] = [];
  private currentWorkflow: GitWorkflow | null = null;
  private currentWorkflowStep = 0;
  private currentIndex = 0;
  private currentInput = '';
  private isActive = false;
  private startTime = 0;
  private correctChars = 0;
  private totalChars = 0;
  private errors = 0;
  private boundHandleKeyDown: ((e: KeyboardEvent) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(): void {
    this.container.innerHTML = `
      <div class="git-training-page">
        <header class="page-header">
          <h1>${t('git.title')}</h1>
          <p>${t('git.subtitle')}</p>
        </header>

        <div class="category-tabs">
          <button class="tab-btn ${this.currentCategory === 'basic' ? 'active' : ''}" data-category="basic">
            ${t('git.basics')}
          </button>
          <button class="tab-btn ${this.currentCategory === 'branching' ? 'active' : ''}" data-category="branching">
            ${t('git.branching')}
          </button>
          <button class="tab-btn ${this.currentCategory === 'remote' ? 'active' : ''}" data-category="remote">
            ${t('git.remote')}
          </button>
          <button class="tab-btn ${this.currentCategory === 'advanced' ? 'active' : ''}" data-category="advanced">
            ${t('git.advanced')}
          </button>
          <button class="tab-btn ${this.currentCategory === 'github' ? 'active' : ''}" data-category="github">
            ${t('git.githubCli')}
          </button>
          <button class="tab-btn ${this.currentCategory === 'workflows' ? 'active' : ''}" data-category="workflows">
            ${t('git.workflow')}
          </button>
        </div>

        <div class="git-training-content">
          ${this.currentCategory === 'workflows' ? this.renderWorkflowMode() : this.renderCommandMode()}
        </div>

        <div class="keyboard-container">
          <div id="git-virtual-keyboard"></div>
        </div>
      </div>
    `;

    this.addStyles();
    this.attachEventListeners();
    this.initializeKeyboard();
    this.loadCategory();
  }

  private renderCommandMode(): string {
    const currentCommand = this.currentCommands[this.currentIndex];

    return `
      <div class="command-mode">
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-label">${t('git.command')}</span>
            <span class="stat-value">${this.currentIndex + 1}/${this.currentCommands.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${t('git.wpm')}</span>
            <span class="stat-value" id="wpm">0</span>
          </div>
          <div class="stat">
            <span class="stat-label">${t('git.accuracy')}</span>
            <span class="stat-value" id="accuracy">100%</span>
          </div>
          <div class="stat">
            <span class="stat-label">${t('git.errors')}</span>
            <span class="stat-value" id="errors">0</span>
          </div>
        </div>

        ${
          currentCommand
            ? `
          <div class="command-card">
            <div class="command-description">
              <span class="difficulty-badge ${currentCommand.difficulty}">${currentCommand.difficulty}</span>
              ${currentCommand.description}
            </div>
            
            <div class="terminal-display">
              <div class="terminal-header">
                <span class="terminal-dot red"></span>
                <span class="terminal-dot yellow"></span>
                <span class="terminal-dot green"></span>
                <span class="terminal-title">Terminal</span>
              </div>
              <div class="terminal-body">
                <div class="terminal-prompt">
                  <span class="prompt-symbol">$</span>
                  <span class="command-text" id="command-display"></span>
                  <span class="cursor-blink">|</span>
                </div>
              </div>
            </div>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(this.currentIndex / this.currentCommands.length) * 100}%"></div>
          </div>

          <div class="navigation-hint">
            ${t('git.navigationHint')}
          </div>
        `
            : `
          <div class="empty-state">
            <p>${t('git.noCommands')}</p>
          </div>
        `
        }
      </div>
    `;
  }

  private renderWorkflowMode(): string {
    const workflows = GIT_WORKFLOWS;

    return `
      <div class="workflow-mode">
        ${
          !this.currentWorkflow
            ? `
          <div class="workflow-list">
            <h3>${t('git.chooseWorkflow')}</h3>
            <div class="workflow-cards">
              ${workflows
                .map(
                  wf => `
                <div class="workflow-card" data-workflow="${wf.id}">
                  <h4>${wf.title}</h4>
                  <p>${wf.description}</p>
                  <div class="workflow-meta">
                    <span class="difficulty-badge ${wf.difficulty}">${wf.difficulty}</span>
                    <span class="step-count">${t('git.steps', { count: wf.steps.length })}</span>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
            : `
          <div class="workflow-practice">
            <div class="workflow-header">
              <button class="back-btn" id="back-to-workflows">${t('git.back')}</button>
              <h3>${this.currentWorkflow.title}</h3>
              <span class="step-indicator">${t('git.step', { current: this.currentWorkflowStep + 1, total: this.currentWorkflow.steps.length })}</span>
            </div>

            <div class="stats-bar">
              <div class="stat">
                <span class="stat-label">${t('git.wpm')}</span>
                <span class="stat-value" id="wpm">0</span>
              </div>
              <div class="stat">
                <span class="stat-label">${t('git.accuracy')}</span>
                <span class="stat-value" id="accuracy">100%</span>
              </div>
              <div class="stat">
                <span class="stat-label">${t('git.errors')}</span>
                <span class="stat-value" id="errors">0</span>
              </div>
            </div>

            <div class="workflow-steps">
              ${this.currentWorkflow.steps
                .map(
                  (step, i) => `
                <div class="workflow-step ${i < this.currentWorkflowStep ? 'completed' : ''} ${i === this.currentWorkflowStep ? 'current' : ''}">
                  <span class="step-number">${i + 1}</span>
                  <code class="step-command">${step}</code>
                  ${i < this.currentWorkflowStep ? `<span class="check-mark">${t('git.done')}</span>` : ''}
                </div>
              `
                )
                .join('')}
            </div>

            <div class="terminal-display">
              <div class="terminal-header">
                <span class="terminal-dot red"></span>
                <span class="terminal-dot yellow"></span>
                <span class="terminal-dot green"></span>
                <span class="terminal-title">Terminal - ${this.currentWorkflow.title}</span>
              </div>
              <div class="terminal-body">
                <div class="terminal-prompt">
                  <span class="prompt-symbol">$</span>
                  <span class="command-text" id="command-display"></span>
                  <span class="cursor-blink">|</span>
                </div>
              </div>
            </div>

            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(this.currentWorkflowStep / this.currentWorkflow.steps.length) * 100}%"></div>
            </div>
          </div>
        `
        }
      </div>
    `;
  }

  private addStyles(): void {
    if (document.getElementById('git-training-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'git-training-styles';
    styles.textContent = `
      .git-training-page {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .page-header h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #f14e32, #24292e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .page-header p {
        color: var(--text-secondary);
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
        background: linear-gradient(135deg, #f14e32, #24292e);
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

      .command-card {
        background: var(--bg-secondary);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .command-description {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 1.1rem;
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

      .terminal-display {
        background: #1e1e1e;
        border-radius: 12px;
        overflow: hidden;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }

      .terminal-header {
        background: #323232;
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .terminal-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      .terminal-dot.red {
        background: #ff5f56;
      }
      .terminal-dot.yellow {
        background: #ffbd2e;
      }
      .terminal-dot.green {
        background: #27ca40;
      }

      .terminal-title {
        margin-left: auto;
        color: #888;
        font-size: 0.875rem;
      }

      .terminal-body {
        padding: 1.5rem;
        min-height: 80px;
      }

      .terminal-prompt {
        display: flex;
        align-items: center;
        font-size: 1.25rem;
        color: #f0f0f0;
      }

      .prompt-symbol {
        color: #22c55e;
        margin-right: 0.75rem;
      }

      .command-text .correct {
        color: #22c55e;
      }

      .command-text .incorrect {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.2);
        border-radius: 2px;
      }

      .command-text .pending {
        color: #666;
      }

      .command-text .current {
        background: rgba(59, 130, 246, 0.3);
        border-radius: 2px;
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

      .progress-bar {
        height: 4px;
        background: var(--bg-tertiary);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 1rem;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #f14e32, #24292e);
        transition: width 0.3s;
      }

      .navigation-hint {
        text-align: center;
        color: var(--text-secondary);
        font-size: 0.875rem;
      }

      .navigation-hint kbd {
        background: var(--bg-tertiary);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: inherit;
      }

      /* Workflow Mode */
      .workflow-list h3 {
        text-align: center;
        margin-bottom: 1.5rem;
      }

      .workflow-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
      }

      .workflow-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 2px solid transparent;
      }

      .workflow-card:hover {
        border-color: #f14e32;
        transform: translateY(-2px);
      }

      .workflow-card h4 {
        margin-bottom: 0.5rem;
      }

      .workflow-card p {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin-bottom: 1rem;
      }

      .workflow-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .step-count {
        color: var(--text-secondary);
        font-size: 0.875rem;
      }

      .workflow-practice {
        max-width: 800px;
        margin: 0 auto;
      }

      .workflow-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
      }

      .back-btn {
        padding: 0.5rem 1rem;
        background: var(--bg-secondary);
        border: none;
        border-radius: 8px;
        color: var(--text-primary);
        cursor: pointer;
      }

      .back-btn:hover {
        background: var(--bg-tertiary);
      }

      .step-indicator {
        color: var(--text-secondary);
      }

      .workflow-steps {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1.5rem;
      }

      .workflow-step {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        opacity: 0.5;
        transition: all 0.2s;
      }

      .workflow-step.current {
        background: rgba(59, 130, 246, 0.1);
        opacity: 1;
      }

      .workflow-step.completed {
        opacity: 0.7;
      }

      .step-number {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-tertiary);
        border-radius: 50%;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .workflow-step.completed .step-number {
        background: #22c55e;
        color: white;
      }

      .workflow-step.current .step-number {
        background: #3b82f6;
        color: white;
      }

      .step-command {
        flex: 1;
        font-family: monospace;
        font-size: 0.875rem;
      }

      .check-mark {
        color: #22c55e;
        font-size: 0.75rem;
      }

      .keyboard-container {
        margin-top: 2rem;
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
        const category = btn.getAttribute('data-category') as GitCategory;
        this.currentCategory = category;
        this.currentIndex = 0;
        this.currentInput = '';
        this.currentWorkflow = null;
        this.currentWorkflowStep = 0;
        this.render();
      });
    });

    // Workflow selection
    this.container.querySelectorAll('.workflow-card').forEach(card => {
      card.addEventListener('click', () => {
        const workflowId = card.getAttribute('data-workflow');
        const workflow = GIT_WORKFLOWS.find(w => w.id === workflowId);
        if (workflow) {
          this.currentWorkflow = workflow;
          this.currentWorkflowStep = 0;
          this.currentInput = '';
          this.resetStats();
          this.render();
        }
      });
    });

    // Back button
    const backBtn = this.container.querySelector('#back-to-workflows');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.currentWorkflow = null;
        this.currentWorkflowStep = 0;
        this.render();
      });
    }

    // Keyboard input - store bound reference for proper removal
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.boundHandleKeyDown);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.isActive && e.key.length === 1) {
      this.isActive = true;
      this.startTime = Date.now();
    }

    const target = this.getTargetText();
    if (!target) {
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      this.skipCurrent();
      return;
    }

    if (e.key === 'Enter') {
      if (this.currentInput === target) {
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

    if (e.key.length === 1) {
      const expectedChar = target[this.currentInput.length];
      this.totalChars++;

      if (e.key === expectedChar) {
        this.correctChars++;
        this.currentInput += e.key;
      } else {
        this.errors++;
        // Don't add wrong character - user must type correct character
      }

      this.updateDisplay();
      this.updateStats();

      // Auto-complete if input matches
      if (this.currentInput === target) {
        setTimeout(() => this.completeCurrentItem(), 300);
      }
    }
  }

  private getTargetText(): string {
    if (this.currentCategory === 'workflows' && this.currentWorkflow) {
      return this.currentWorkflow.steps[this.currentWorkflowStep] || '';
    }
    return this.currentCommands[this.currentIndex]?.command || '';
  }

  private updateDisplay(): void {
    const displayEl = document.getElementById('command-display');
    if (!displayEl) {
      return;
    }

    const target = this.getTargetText();
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
    if (this.currentCategory === 'workflows' && this.currentWorkflow) {
      this.currentWorkflowStep++;
      if (this.currentWorkflowStep >= this.currentWorkflow.steps.length) {
        // Workflow complete - show toast instead of blocking alert
        EventBus.emit('ui:toast', {
          message: t('git.workflowComplete'),
          type: 'success',
        });
        this.currentWorkflow = null;
        this.currentWorkflowStep = 0;
      }
    } else {
      this.currentIndex++;
      if (this.currentIndex >= this.currentCommands.length) {
        // All commands complete - show toast instead of blocking alert
        EventBus.emit('ui:toast', {
          message: t('git.allComplete'),
          type: 'success',
        });
        this.currentIndex = 0;
      }
    }

    this.currentInput = '';
    this.render();
  }

  private skipCurrent(): void {
    this.currentInput = '';

    if (this.currentCategory === 'workflows' && this.currentWorkflow) {
      this.currentWorkflowStep++;
      if (this.currentWorkflowStep >= this.currentWorkflow.steps.length) {
        this.currentWorkflowStep = 0;
      }
    } else {
      this.currentIndex++;
      if (this.currentIndex >= this.currentCommands.length) {
        this.currentIndex = 0;
      }
    }

    this.render();
  }

  private resetStats(): void {
    this.isActive = false;
    this.startTime = 0;
    this.correctChars = 0;
    this.totalChars = 0;
    this.errors = 0;
  }

  private loadCategory(): void {
    if (this.currentCategory === 'workflows') {
      this.currentCommands = [];
    } else {
      this.currentCommands = GIT_COMMANDS.filter(cmd => cmd.category === this.currentCategory);
    }
    this.resetStats();
    this.updateDisplay();
  }

  private initializeKeyboard(): void {
    const keyboardContainer = this.container.querySelector('#git-virtual-keyboard');
    if (keyboardContainer) {
      this.keyboard = new VirtualKeyboard('git-virtual-keyboard');
      this.keyboard.render();
    }
  }

  destroy(): void {
    if (this.boundHandleKeyDown) {
      document.removeEventListener('keydown', this.boundHandleKeyDown);
      this.boundHandleKeyDown = null;
    }
    if (this.keyboard) {
      this.keyboard.destroy();
    }
  }
}
