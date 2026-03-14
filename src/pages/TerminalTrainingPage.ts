/**
 * Terminal Training Page Controller
 * Interactive terminal command learning environment
 */

import { EventBus, t } from '../core';
import {
  ALL_COMMAND_COLLECTIONS,
  Command,
  CommandCollection,
  getCommandCategories,
  getCommandCollection,
} from '../data/shortcuts';

interface TerminalTask {
  id: string;
  description: string;
  expectedCommand: string;
  alternativeCommands?: string[];
  hint?: string;
  explanation?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface TerminalHistory {
  input: string;
  output: string;
  isError: boolean;
  timestamp: Date;
}

export class TerminalTrainingPage {
  private selectedCollection: CommandCollection;
  private selectedCategory: string | null = null;
  private viewMode: 'browse' | 'training' | 'freemode' = 'browse';

  // Training state
  private trainingTasks: TerminalTask[] = [];
  private currentTaskIndex: number = 0;
  private score: number = 0;
  private errors: number = 0;
  private startTime: Date | null = null;
  private showHint: boolean = false;

  // Terminal state
  private terminalHistory: TerminalHistory[] = [];
  private currentInput: string = '';
  private readonly inputHistory: string[] = [];
  private inputHistoryIndex: number = -1;

  // Bound handlers
  private readonly boundKeyDown = (e: KeyboardEvent): void => this.handleTerminalKeyDown(e);

  constructor() {
    this.selectedCollection = ALL_COMMAND_COLLECTIONS[0]; // Terminal commands
  }

  /**
   * Render the terminal training page
   */
  render(): string {
    return `
      <div class="typing-container">
        <div class="terminal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
          <h1> ${t('terminal.title')}</h1>
          <div class="view-mode-toggle" style="display: flex; gap: var(--space-2);">
            <button id="mode-browse" class="btn ${this.viewMode === 'browse' ? 'btn-primary' : 'btn-secondary'}">
               ${t('terminal.commands')}
            </button>
            <button id="mode-training" class="btn ${this.viewMode === 'training' ? 'btn-primary' : 'btn-secondary'}">
               ${t('terminal.training')}
            </button>
            <button id="mode-freemode" class="btn ${this.viewMode === 'freemode' ? 'btn-primary' : 'btn-secondary'}">
               ${t('terminal.freeMode')}
            </button>
          </div>
        </div>

        <!-- Collection Selector -->
        <div class="collection-tabs" style="display: flex; gap: var(--space-2); margin-bottom: var(--space-6); flex-wrap: wrap;">
          ${ALL_COMMAND_COLLECTIONS.map(
            col => `
            <button class="collection-tab btn ${col.id === this.selectedCollection.id ? 'btn-primary' : 'btn-secondary'}" 
                    data-collection="${col.id}">
              ${col.icon} ${col.name}
              <span style="opacity: 0.7; font-size: 12px;">(${col.commands.length})</span>
            </button>
          `
          ).join('')}
        </div>

        ${this.viewMode === 'browse' ? this.renderBrowseMode() : ''}
        ${this.viewMode === 'training' ? this.renderTrainingMode() : ''}
        ${this.viewMode === 'freemode' ? this.renderFreeMode() : ''}
      </div>
    `;
  }

  /**
   * Render browse mode - command reference
   */
  private renderBrowseMode(): string {
    const categories = getCommandCategories(this.selectedCollection);
    const filteredCommands = this.getFilteredCommands();

    return `
      <div class="browse-mode">
        <!-- Category Filter -->
        <div class="category-filter" style="display: flex; gap: var(--space-2); margin-bottom: var(--space-6); flex-wrap: wrap;">
          <button class="category-btn btn ${!this.selectedCategory ? 'btn-primary' : 'btn-secondary'}" data-category="">
            ${t('terminal.all')} (${this.selectedCollection.commands.length})
          </button>
          ${categories
            .map(cat => {
              const count = this.selectedCollection.commands.filter(c => c.category === cat).length;
              return `
              <button class="category-btn btn ${this.selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}" data-category="${cat}">
                ${cat} (${count})
              </button>
            `;
            })
            .join('')}
        </div>

        <!-- Commands List -->
        <div class="commands-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: var(--space-3);">
          ${filteredCommands.map(cmd => this.renderCommandCard(cmd)).join('')}
        </div>

        ${
          filteredCommands.length === 0
            ? `
          <div class="card" style="text-align: center; padding: var(--space-8);">
            <p style="color: var(--text-muted);">${t('terminal.noCommands')}</p>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  /**
   * Render a single command card
   */
  private renderCommandCard(cmd: Command): string {
    const difficultyColors = {
      beginner: 'var(--accent-success)',
      intermediate: 'var(--accent-warning)',
      advanced: 'var(--accent-error)',
    };
    const difficultyLabels = {
      beginner: t('terminal.beginner'),
      intermediate: t('terminal.intermediate'),
      advanced: t('terminal.advanced'),
    };

    return `
      <div class="command-card card" style="padding: var(--space-4);">
        <div style="display: flex; align-items: flex-start; gap: var(--space-3);">
          <code style="
            display: inline-block;
            padding: var(--space-2) var(--space-3);
            background: var(--bg-tertiary);
            border: 1px solid var(--border-primary);
            border-radius: 6px;
            font-family: var(--font-mono);
            font-size: 13px;
            color: var(--accent-success);
            white-space: nowrap;
            flex-shrink: 0;
          ">${this.escapeHtml(cmd.command)}</code>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 500; color: var(--text-primary); margin-bottom: 4px;">
              ${cmd.description}
            </div>
            <div style="display: flex; gap: var(--space-2); align-items: center; flex-wrap: wrap;">
              <span style="font-size: 11px; color: var(--text-muted);">${cmd.category}</span>
              ${
                cmd.difficulty
                  ? `
                <span style="
                  font-size: 10px;
                  padding: 2px 6px;
                  background: ${difficultyColors[cmd.difficulty]}20;
                  color: ${difficultyColors[cmd.difficulty]};
                  border-radius: 4px;
                ">${difficultyLabels[cmd.difficulty]}</span>
              `
                  : ''
              }
            </div>
          </div>
        </div>
        ${
          cmd.example
            ? `
          <div style="margin-top: var(--space-2); padding-top: var(--space-2); border-top: 1px solid var(--border-secondary);">
            <span style="font-size: 11px; color: var(--text-muted);">${t('terminal.example')}:</span>
            <code style="font-size: 12px; color: var(--text-secondary); margin-left: var(--space-2);">${this.escapeHtml(cmd.example)}</code>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  /**
   * Render training mode
   */
  private renderTrainingMode(): string {
    if (this.trainingTasks.length === 0) {
      return this.renderTrainingSetup();
    }

    const currentTask = this.trainingTasks[this.currentTaskIndex];
    const progress = ((this.currentTaskIndex + 1) / this.trainingTasks.length) * 100;
    const elapsedTime = this.startTime
      ? Math.floor((Date.now() - this.startTime.getTime()) / 1000)
      : 0;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    return `
      <div class="training-mode">
        <!-- Progress & Stats -->
        <div class="training-stats" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); margin-bottom: var(--space-6);">
          <div class="stat-card">
            <span class="stat-card-value">${this.currentTaskIndex + 1}/${this.trainingTasks.length}</span>
            <span class="stat-card-label">${t('terminal.task')}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value" style="color: var(--accent-success);">${this.score}</span>
            <span class="stat-card-label">${t('terminal.correct')}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value" style="color: var(--accent-error);">${this.errors}</span>
            <span class="stat-card-label">${t('terminal.errors')}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value">${minutes}:${seconds.toString().padStart(2, '0')}</span>
            <span class="stat-card-label">${t('terminal.time')}</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-bar" style="margin-bottom: var(--space-6);">
          <div class="progress-bar-fill" style="width: ${progress}%;"></div>
        </div>

        <!-- Task Card -->
        <div class="task-card card" style="padding: var(--space-6); margin-bottom: var(--space-4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
            <span style="
              font-size: 11px;
              padding: 4px 8px;
              background: var(--bg-tertiary);
              border-radius: 4px;
              color: var(--text-muted);
            ">${currentTask.category}</span>
            <span style="
              font-size: 11px;
              padding: 4px 8px;
              background: ${currentTask.difficulty === 'beginner' ? 'var(--accent-success)' : currentTask.difficulty === 'intermediate' ? 'var(--accent-warning)' : 'var(--accent-error)'}20;
              color: ${currentTask.difficulty === 'beginner' ? 'var(--accent-success)' : currentTask.difficulty === 'intermediate' ? 'var(--accent-warning)' : 'var(--accent-error)'};
              border-radius: 4px;
            ">${currentTask.difficulty === 'beginner' ? 'Anfänger' : currentTask.difficulty === 'intermediate' ? 'Fortgeschritten' : 'Experte'}</span>
          </div>

          <h2 style="font-size: var(--font-size-xl); margin-bottom: var(--space-6); text-align: center;">
            ${currentTask.description}
          </h2>

          <!-- Terminal Input -->
          ${this.renderTerminalInput()}

          <!-- Hint -->
          ${
            this.showHint && currentTask.hint
              ? `
            <div style="margin-top: var(--space-4); padding: var(--space-3); background: var(--accent-warning)10; border-left: 3px solid var(--accent-warning); border-radius: 4px;">
              <span style="color: var(--accent-warning); font-weight: 500;"> ${t('terminal.hint')}:</span>
              <span style="color: var(--text-secondary); margin-left: var(--space-2);">${currentTask.hint}</span>
            </div>
          `
              : ''
          }
        </div>

        <!-- Controls -->
        <div style="display: flex; justify-content: center; gap: var(--space-4);">
          <button id="btn-show-hint" class="btn btn-secondary" ${this.showHint ? 'disabled' : ''}>
             ${t('terminal.showHint')}
          </button>
          <button id="btn-show-solution" class="btn btn-secondary">
            ${t('terminal.showSolution')}
          </button>
          <button id="btn-skip" class="btn btn-ghost">
            ${t('terminal.skip')} →
          </button>
        </div>

        <!-- End Training -->
        <div style="text-align: center; margin-top: var(--space-6);">
          <button id="btn-end-training" class="btn btn-ghost">
             ${t('terminal.endTraining')}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render terminal input
   */
  private renderTerminalInput(): string {
    return `
      <div class="terminal-container" style="
        background: #1e1e1e;
        border-radius: 8px;
        overflow: hidden;
        font-family: var(--font-mono);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      ">
        <!-- Terminal Header -->
        <div style="
          background: #3c3c3c;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f57;"></div>
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e;"></div>
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #28c940;"></div>
          <span style="margin-left: 8px; color: #888; font-size: 12px;">Terminal — zsh</span>
        </div>

        <!-- Terminal Body -->
        <div style="padding: 12px 16px; min-height: 80px;">
          <!-- History -->
          ${this.terminalHistory
            .map(
              h => `
            <div style="margin-bottom: 8px;">
              <div style="color: #4ec9b0;">
                <span style="color: #569cd6;">user@mac</span>
                <span style="color: #888;">:</span>
                <span style="color: #ce9178;">~</span>
                <span style="color: #888;">$</span>
                <span style="color: #d4d4d4; margin-left: 8px;">${this.escapeHtml(h.input)}</span>
              </div>
              ${
                h.output
                  ? `
                <div style="color: ${h.isError ? '#f14c4c' : '#888'}; padding-left: 0; margin-top: 4px; white-space: pre-wrap;">
                  ${this.escapeHtml(h.output)}
                </div>
              `
                  : ''
              }
            </div>
          `
            )
            .join('')}

          <!-- Current Input Line -->
          <div style="display: flex; align-items: center;">
            <span style="color: #569cd6;">user@mac</span>
            <span style="color: #888;">:</span>
            <span style="color: #ce9178;">~</span>
            <span style="color: #888;">$</span>
            <input type="text" 
                   id="terminal-input"
                   value="${this.escapeHtml(this.currentInput)}"
                   autocomplete="off"
                   autocorrect="off"
                   autocapitalize="off"
                   spellcheck="false"
                   style="
                     flex: 1;
                     background: transparent;
                     border: none;
                     outline: none;
                     color: #d4d4d4;
                     font-family: var(--font-mono);
                     font-size: 14px;
                     margin-left: 8px;
                     caret-color: #fff;
                   "
                   placeholder="${t('terminal.typeHere')}">
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render training setup
   */
  private renderTrainingSetup(): string {
    const categories = getCommandCategories(this.selectedCollection);

    return `
      <div class="training-setup card" style="text-align: center; padding: var(--space-8);">
        <h2 style="margin-bottom: var(--space-4);"> ${t('terminal.title')}</h2>
        <p style="color: var(--text-muted); margin-bottom: var(--space-6);">
          ${t('terminal.learnCommands', { name: this.selectedCollection.name })}<br>
          ${t('terminal.chooseCategory')}
        </p>

        <div class="category-selection" style="display: flex; flex-wrap: wrap; gap: var(--space-2); justify-content: center; margin-bottom: var(--space-6);">
          <button class="training-category-btn btn btn-primary" data-category="all">
             ${t('terminal.all')} (${this.selectedCollection.commands.length})
          </button>
          ${categories
            .map(cat => {
              const count = this.selectedCollection.commands.filter(c => c.category === cat).length;
              return `
              <button class="training-category-btn btn btn-secondary" data-category="${cat}">
                ${cat} (${count})
              </button>
            `;
            })
            .join('')}
        </div>

        <div style="background: var(--bg-tertiary); padding: var(--space-4); border-radius: 8px; margin-top: var(--space-4);">
          <h3 style="font-size: var(--font-size-sm); color: var(--text-primary); margin-bottom: var(--space-2);">${t('terminal.howItWorks')}</h3>
          <ul style="text-align: left; color: var(--text-muted); font-size: 14px; margin: 0; padding-left: var(--space-6);">
            <li>${t('terminal.howItWorksDesc1')}</li>
            <li>${t('terminal.howItWorksDesc2')}</li>
            <li>${t('terminal.howItWorksDesc3')}</li>
            <li>${t('terminal.howItWorksDesc4')} </li>
          </ul>
        </div>
      </div>
    `;
  }

  /**
   * Render free mode - sandbox terminal
   */
  private renderFreeMode(): string {
    return `
      <div class="free-mode">
        <div class="card" style="padding: var(--space-4); margin-bottom: var(--space-4);">
          <h3 style="margin-bottom: var(--space-2);"> ${t('terminal.freeMode')}</h3>
          <p style="color: var(--text-muted); font-size: 14px;">
            ${t('terminal.freeDescription')}
          </p>
        </div>

        ${this.renderTerminalInput()}

        <!-- Quick Reference -->
        <div class="quick-reference" style="margin-top: var(--space-6);">
          <h3 style="margin-bottom: var(--space-3); font-size: var(--font-size-sm); color: var(--text-muted);">
             ${t('terminal.quickRef')} - ${this.selectedCollection.name}
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-2);">
            ${this.selectedCollection.commands
              .slice(0, 12)
              .map(
                cmd => `
              <div class="ref-item" style="
                padding: var(--space-2);
                background: var(--bg-secondary);
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.2s;
              " data-command="${this.escapeHtml(cmd.command)}">
                <code style="color: var(--accent-success); font-size: 12px;">${this.escapeHtml(cmd.command)}</code>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${cmd.description}
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get filtered commands
   */
  private getFilteredCommands(): Command[] {
    let commands = this.selectedCollection.commands;

    if (this.selectedCategory) {
      commands = commands.filter(c => c.category === this.selectedCategory);
    }

    return commands;
  }

  /**
   * Generate training tasks from commands
   */
  private generateTrainingTasks(category: string | null): TerminalTask[] {
    let commands = this.selectedCollection.commands;

    if (category) {
      commands = commands.filter(c => c.category === category);
    }

    // Shuffle and convert to tasks
    return [...commands]
      .sort(() => Math.random() - 0.5)
      .map(cmd => ({
        id: cmd.id,
        description: cmd.description,
        expectedCommand: cmd.command,
        hint: this.generateHint(cmd),
        explanation: cmd.example,
        category: cmd.category,
        difficulty: cmd.difficulty || 'beginner',
      }));
  }

  /**
   * Generate hint for a command
   */
  private generateHint(cmd: Command): string {
    const parts = cmd.command.split(' ');
    if (parts.length > 0) {
      return t('terminal.startsWith', { cmd: parts[0] });
    }
    return t('terminal.hint');
  }

  /**
   * Initialize the page
   */
  init(): void {
    this.setupEventListeners();

    // Focus terminal input if in training or free mode
    setTimeout(() => {
      const input = document.getElementById('terminal-input') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);

    // Start timer update if in training
    if (this.viewMode === 'training' && this.trainingTasks.length > 0) {
      this.startTimerUpdate();
    }
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
          const collection = getCommandCollection(id);
          if (collection) {
            this.selectedCollection = collection;
            this.selectedCategory = null;
            this.rerender();
          }
        }
      });
    });

    // View mode toggle
    document.getElementById('mode-browse')?.addEventListener('click', () => {
      this.viewMode = 'browse';
      this.resetTraining();
      this.rerender();
    });

    document.getElementById('mode-training')?.addEventListener('click', () => {
      this.viewMode = 'training';
      this.resetTraining();
      this.rerender();
    });

    document.getElementById('mode-freemode')?.addEventListener('click', () => {
      this.viewMode = 'freemode';
      this.resetTraining();
      this.terminalHistory = [];
      this.rerender();
    });

    // Category filter (browse mode)
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const category = (e.currentTarget as HTMLElement).dataset.category;
        this.selectedCategory = category || null;
        this.rerender();
      });
    });

    // Training category selection
    document.querySelectorAll('.training-category-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const category = (e.currentTarget as HTMLElement).dataset.category;
        this.startTraining(category === 'all' ? null : (category ?? null));
      });
    });

    // Terminal input
    const terminalInput = document.getElementById('terminal-input') as HTMLInputElement;
    if (terminalInput) {
      terminalInput.addEventListener('keydown', this.boundKeyDown);
      terminalInput.addEventListener('input', e => {
        this.currentInput = (e.target as HTMLInputElement).value;
      });
    }

    // Training controls
    document.getElementById('btn-show-hint')?.addEventListener('click', () => {
      this.showHint = true;
      this.rerender();
    });

    document.getElementById('btn-show-solution')?.addEventListener('click', () => {
      this.showSolution();
    });

    document.getElementById('btn-skip')?.addEventListener('click', () => {
      this.skipTask();
    });

    document.getElementById('btn-end-training')?.addEventListener('click', () => {
      this.endTraining();
    });

    // Quick reference click
    document.querySelectorAll('.ref-item').forEach(item => {
      item.addEventListener('click', e => {
        const command = (e.currentTarget as HTMLElement).dataset.command;
        if (command && terminalInput) {
          terminalInput.value = command;
          this.currentInput = command;
          terminalInput.focus();
        }
      });
    });
  }

  /**
   * Handle terminal keydown
   */
  private handleTerminalKeyDown(e: KeyboardEvent): void {
    const input = e.target as HTMLInputElement;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        this.executeCommand(this.currentInput.trim());
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.navigateHistory(-1, input);
        break;

      case 'ArrowDown':
        e.preventDefault();
        this.navigateHistory(1, input);
        break;

      case 'Tab':
        e.preventDefault();
        this.handleTabCompletion(input);
        break;

      case 'c':
        if (e.ctrlKey) {
          e.preventDefault();
          this.currentInput = '';
          input.value = '';
        }
        break;

      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          this.terminalHistory = [];
          this.rerender();
        }
        break;
    }
  }

  /**
   * Execute command
   */
  private executeCommand(command: string): void {
    if (!command) {
      return;
    }

    // Add to history
    this.inputHistory.push(command);
    this.inputHistoryIndex = this.inputHistory.length;

    if (this.viewMode === 'training' && this.trainingTasks.length > 0) {
      this.checkTrainingAnswer(command);
    } else {
      this.executeFreeCommand(command);
    }

    // Clear input
    this.currentInput = '';
    const input = document.getElementById('terminal-input') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  /**
   * Check training answer
   */
  private checkTrainingAnswer(command: string): void {
    const currentTask = this.trainingTasks[this.currentTaskIndex];
    const normalizedInput = this.normalizeCommand(command);
    const normalizedExpected = this.normalizeCommand(currentTask.expectedCommand);

    const isCorrect =
      normalizedInput === normalizedExpected ||
      (currentTask.alternativeCommands?.some(
        alt => this.normalizeCommand(alt) === normalizedInput
      ) ??
        false);

    // Add to terminal history
    this.terminalHistory.push({
      input: command,
      output: isCorrect
        ? `✓ ${t('terminal.correctAnswer')}`
        : `✗ ${t('terminal.wrongAnswer', { expected: currentTask.expectedCommand })}`,
      isError: !isCorrect,
      timestamp: new Date(),
    });

    if (isCorrect) {
      this.score++;
      EventBus.emit('ui:toast', { message: `✓ ${t('terminal.correctAnswer')}`, type: 'success' });
      setTimeout(() => this.nextTask(), 800);
    } else {
      this.errors++;
      EventBus.emit('ui:toast', {
        message: `✗ ${t('terminal.wrongAnswer', { expected: currentTask.expectedCommand })}`,
        type: 'error',
      });
    }

    this.showHint = false;
    this.rerender();
  }

  /**
   * Execute command in free mode
   */
  private executeFreeCommand(command: string): void {
    // Find matching command
    const matchedCmd = this.findMatchingCommand(command);

    let output = '';
    let isError = false;

    if (matchedCmd) {
      output = `${matchedCmd.description}`;
      if (matchedCmd.example) {
        output += `\n${t('terminal.example')}: ${matchedCmd.example}`;
      }
    } else {
      // Check if it's a recognized but not in our collection command
      const baseCmd = command.split(' ')[0];
      const recognizedBases = [
        'ls',
        'cd',
        'pwd',
        'mkdir',
        'rm',
        'cp',
        'mv',
        'cat',
        'grep',
        'find',
        'git',
        'npm',
        'docker',
        'brew',
      ];

      if (recognizedBases.includes(baseCmd)) {
        output = t('terminal.recognizedCmd', { cmd: baseCmd });
      } else {
        output = t('terminal.unknownCmd', { cmd: command });
        isError = true;
      }
    }

    this.terminalHistory.push({
      input: command,
      output,
      isError,
      timestamp: new Date(),
    });

    // Keep history manageable
    if (this.terminalHistory.length > 10) {
      this.terminalHistory = this.terminalHistory.slice(-10);
    }

    this.rerender();
  }

  /**
   * Find matching command
   */
  private findMatchingCommand(input: string): Command | null {
    const normalizedInput = this.normalizeCommand(input);

    // Exact match first
    for (const collection of ALL_COMMAND_COLLECTIONS) {
      const exact = collection.commands.find(
        c => this.normalizeCommand(c.command) === normalizedInput
      );
      if (exact) {
        return exact;
      }
    }

    // Partial match (base command)
    const baseInput = input.split(' ')[0];
    for (const collection of ALL_COMMAND_COLLECTIONS) {
      const partial = collection.commands.find(c => {
        const baseCmd = c.command.split(' ')[0];
        return baseCmd === baseInput;
      });
      if (partial) {
        return partial;
      }
    }

    return null;
  }

  /**
   * Normalize command for comparison
   */
  private normalizeCommand(cmd: string): string {
    return cmd.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  /**
   * Handle tab completion
   */
  private handleTabCompletion(input: HTMLInputElement): void {
    const currentValue = this.currentInput;
    if (!currentValue) {
      return;
    }

    // Find matching commands
    const matches = this.selectedCollection.commands.filter(c =>
      c.command.toLowerCase().startsWith(currentValue.toLowerCase())
    );

    if (matches.length === 1) {
      this.currentInput = matches[0].command;
      input.value = matches[0].command;
    } else if (matches.length > 1) {
      // Show options in terminal
      this.terminalHistory.push({
        input: currentValue,
        output:
          `${t('terminal.possibleOptions')}\n` +
          matches
            .slice(0, 5)
            .map(m => `  ${m.command}`)
            .join('\n'),
        isError: false,
        timestamp: new Date(),
      });
      this.rerender();
    }
  }

  /**
   * Navigate input history
   */
  private navigateHistory(direction: number, input: HTMLInputElement): void {
    if (this.inputHistory.length === 0) {
      return;
    }

    this.inputHistoryIndex += direction;
    this.inputHistoryIndex = Math.max(
      0,
      Math.min(this.inputHistory.length, this.inputHistoryIndex)
    );

    if (this.inputHistoryIndex < this.inputHistory.length) {
      this.currentInput = this.inputHistory[this.inputHistoryIndex];
      input.value = this.currentInput;
    } else {
      this.currentInput = '';
      input.value = '';
    }
  }

  /**
   * Start training session
   */
  private startTraining(category: string | null): void {
    this.trainingTasks = this.generateTrainingTasks(category);
    this.currentTaskIndex = 0;
    this.score = 0;
    this.errors = 0;
    this.startTime = new Date();
    this.terminalHistory = [];
    this.showHint = false;
    this.rerender();
  }

  /**
   * Show solution
   */
  private showSolution(): void {
    const currentTask = this.trainingTasks[this.currentTaskIndex];

    this.terminalHistory.push({
      input: t('terminal.solutionShown'),
      output: t('terminal.solution', { solution: currentTask.expectedCommand }),
      isError: false,
      timestamp: new Date(),
    });

    this.errors++;
    this.rerender();
  }

  /**
   * Skip current task
   */
  private skipTask(): void {
    this.errors++;
    this.nextTask();
  }

  /**
   * Move to next task
   */
  private nextTask(): void {
    this.currentTaskIndex++;
    this.terminalHistory = [];
    this.showHint = false;

    if (this.currentTaskIndex >= this.trainingTasks.length) {
      this.showResults();
    } else {
      this.rerender();
    }
  }

  /**
   * Show training results
   */
  private showResults(): void {
    const total = this.score + this.errors;
    const accuracy = total > 0 ? Math.round((this.score / total) * 100) : 0;
    const elapsedTime = this.startTime
      ? Math.floor((Date.now() - this.startTime.getTime()) / 1000)
      : 0;
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    EventBus.emit('ui:toast', {
      message: ` ${t('terminal.trainingComplete', { score: this.score, accuracy, time: `${minutes}:${seconds.toString().padStart(2, '0')}` })}`,
      type: 'success',
    });

    this.endTraining();
  }

  /**
   * End training session
   */
  private endTraining(): void {
    this.resetTraining();
    this.rerender();
  }

  /**
   * Reset training state
   */
  private resetTraining(): void {
    this.trainingTasks = [];
    this.currentTaskIndex = 0;
    this.score = 0;
    this.errors = 0;
    this.startTime = null;
    this.terminalHistory = [];
    this.showHint = false;
    this.currentInput = '';
  }

  /**
   * Start timer update interval
   */
  private startTimerUpdate(): void {
    const updateTimer = (): void => {
      if (this.viewMode !== 'training' || this.trainingTasks.length === 0) {
        return;
      }

      const statCard = document.querySelector('.stat-card:last-child .stat-card-value');
      if (statCard && this.startTime) {
        const elapsed = Math.floor((Date.now() - this.startTime.getTime()) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        statCard.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }

      requestAnimationFrame(() => setTimeout(updateTimer, 1000));
    };

    updateTimer();
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
    const input = document.getElementById('terminal-input');
    if (input) {
      input.removeEventListener('keydown', this.boundKeyDown);
    }
  }
}
