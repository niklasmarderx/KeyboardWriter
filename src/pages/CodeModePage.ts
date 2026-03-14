import { VirtualKeyboard } from '../components/keyboard/VirtualKeyboard';
import { EventBus, Store } from '../core';
import { PROGRAMMING_LESSONS, SHORTCUT_LESSONS } from '../data/lessons';
import { Exercise } from '../domain/models';

type ProgrammingLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'angular';
type IDE = 'vscode' | 'intellij';

interface CodeToken {
  text: string;
  type:
    | 'keyword'
    | 'string'
    | 'number'
    | 'operator'
    | 'function'
    | 'type'
    | 'comment'
    | 'bracket'
    | 'default';
}

/**
 * Code Mode Page Controller
 * Specialized typing practice for programmers with syntax highlighting
 */
export class CodeModePage {
  private keyboard: VirtualKeyboard | null = null;
  private currentLanguage: ProgrammingLanguage = 'typescript';
  private currentIDE: IDE = 'vscode';
  private currentMode: 'code' | 'shortcuts' = 'code';
  private currentExerciseIndex: number = 0;
  private currentInput: string = '';
  private isTyping: boolean = false;
  private startTime: number = 0;
  private errors: number = 0;

  // Bound event handler
  private readonly boundKeyboardInput = (e: KeyboardEvent): void => this.handleKeyboardInput(e);

  // Syntax highlighting patterns for different languages
  private readonly syntaxPatterns: Record<
    ProgrammingLanguage,
    { keywords: string[]; types: string[]; functions: string[] }
  > = {
    javascript: {
      keywords: [
        'const',
        'let',
        'var',
        'function',
        'return',
        'if',
        'else',
        'for',
        'while',
        'async',
        'await',
        'import',
        'export',
        'from',
        'class',
        'extends',
        'new',
        'this',
        'true',
        'false',
        'null',
        'undefined',
      ],
      types: [],
      functions: [
        'console',
        'log',
        'map',
        'filter',
        'reduce',
        'forEach',
        'find',
        'push',
        'pop',
        'slice',
        'split',
        'join',
      ],
    },
    typescript: {
      keywords: [
        'const',
        'let',
        'var',
        'function',
        'return',
        'if',
        'else',
        'for',
        'while',
        'async',
        'await',
        'import',
        'export',
        'from',
        'class',
        'extends',
        'implements',
        'new',
        'this',
        'true',
        'false',
        'null',
        'undefined',
        'interface',
        'type',
        'enum',
        'public',
        'private',
        'protected',
        'readonly',
      ],
      types: [
        'string',
        'number',
        'boolean',
        'void',
        'any',
        'never',
        'unknown',
        'object',
        'Array',
        'Promise',
        'Record',
        'Partial',
        'Required',
        'Pick',
        'Omit',
      ],
      functions: [
        'console',
        'log',
        'map',
        'filter',
        'reduce',
        'forEach',
        'find',
        'push',
        'pop',
        'slice',
        'split',
        'join',
      ],
    },
    python: {
      keywords: [
        'def',
        'return',
        'if',
        'else',
        'elif',
        'for',
        'while',
        'import',
        'from',
        'class',
        'self',
        'True',
        'False',
        'None',
        'and',
        'or',
        'not',
        'in',
        'is',
        'with',
        'as',
        'try',
        'except',
        'finally',
        'raise',
        'async',
        'await',
        'lambda',
      ],
      types: ['int', 'str', 'float', 'bool', 'list', 'dict', 'tuple', 'set'],
      functions: [
        'print',
        'range',
        'len',
        'open',
        'read',
        'write',
        'append',
        'extend',
        'keys',
        'values',
        'items',
      ],
    },
    java: {
      keywords: [
        'public',
        'private',
        'protected',
        'static',
        'final',
        'void',
        'class',
        'interface',
        'extends',
        'implements',
        'new',
        'return',
        'if',
        'else',
        'for',
        'while',
        'try',
        'catch',
        'throw',
        'throws',
        'import',
        'package',
        'this',
        'super',
        'true',
        'false',
        'null',
      ],
      types: [
        'int',
        'String',
        'boolean',
        'double',
        'float',
        'long',
        'char',
        'byte',
        'short',
        'Integer',
        'Boolean',
        'List',
        'ArrayList',
        'Map',
        'HashMap',
        'Set',
        'HashSet',
      ],
      functions: [
        'System',
        'out',
        'println',
        'print',
        'main',
        'toString',
        'equals',
        'hashCode',
        'get',
        'set',
        'add',
        'remove',
        'stream',
        'filter',
        'map',
        'collect',
      ],
    },
    angular: {
      keywords: [
        'const',
        'let',
        'var',
        'function',
        'return',
        'if',
        'else',
        'for',
        'while',
        'async',
        'await',
        'import',
        'export',
        'from',
        'class',
        'extends',
        'implements',
        'new',
        'this',
        'true',
        'false',
        'null',
        'undefined',
        'interface',
        'type',
      ],
      types: [
        'string',
        'number',
        'boolean',
        'void',
        'any',
        'Observable',
        'Subject',
        'BehaviorSubject',
      ],
      functions: [
        'Component',
        'Injectable',
        'Input',
        'Output',
        'EventEmitter',
        'OnInit',
        'OnDestroy',
        'ngOnInit',
        'ngOnDestroy',
        'subscribe',
        'pipe',
        'map',
        'filter',
      ],
    },
  };

  constructor() {
    // Select first available lesson
    this.selectLanguage('typescript');
  }

  /**
   * Render the code mode page
   */
  render(): string {
    return `
      <div class="code-mode-container">
        ${this.renderHeader()}
        ${this.renderModeSelector()}
        ${this.renderLanguageSelector()}
        ${this.renderCodeArea()}
        ${this.renderKeyboard()}
        ${this.renderStats()}
      </div>
    `;
  }

  /**
   * Render page header
   */
  private renderHeader(): string {
    return `
      <div class="code-mode-header">
        <h1>Code Modus</h1>
        <p style="color: var(--text-secondary); margin-top: var(--space-2);">
          Übe das Tippen von Code-Snippets mit Syntax-Highlighting
        </p>
      </div>
    `;
  }

  /**
   * Render mode selector (Code vs Shortcuts)
   */
  private renderModeSelector(): string {
    return `
      <div class="mode-selector" style="display: flex; gap: var(--space-2); margin-bottom: var(--space-4);">
        <button class="btn ${this.currentMode === 'code' ? 'btn-primary' : 'btn-secondary'}" data-mode="code">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: var(--space-2);">
            <polyline points="16,18 22,12 16,6"></polyline>
            <polyline points="8,6 2,12 8,18"></polyline>
          </svg>
          Code Snippets
        </button>
        <button class="btn ${this.currentMode === 'shortcuts' ? 'btn-primary' : 'btn-secondary'}" data-mode="shortcuts">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: var(--space-2);">
            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
          </svg>
          IDE Shortcuts
        </button>
      </div>
    `;
  }

  /**
   * Render language/IDE selector
   */
  private renderLanguageSelector(): string {
    if (this.currentMode === 'code') {
      const languages: { id: ProgrammingLanguage; name: string; icon: string }[] = [
        { id: 'typescript', name: 'TypeScript', icon: 'TS' },
        { id: 'javascript', name: 'JavaScript', icon: 'JS' },
        { id: 'python', name: 'Python', icon: 'PY' },
        { id: 'java', name: 'Java', icon: 'JV' },
        { id: 'angular', name: 'Angular', icon: 'NG' },
      ];

      return `
        <div class="language-selector card" style="margin-bottom: var(--space-4);">
          <div class="language-tabs" style="display: flex; gap: var(--space-1); flex-wrap: wrap;">
            ${languages
              .map(
                lang => `
              <button class="language-tab ${this.currentLanguage === lang.id ? 'active' : ''}" data-language="${lang.id}">
                <span class="language-icon">${lang.icon}</span>
                <span class="language-name">${lang.name}</span>
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      `;
    } else {
      const ides: { id: IDE; name: string }[] = [
        { id: 'vscode', name: 'VS Code' },
        { id: 'intellij', name: 'IntelliJ IDEA' },
      ];

      return `
        <div class="ide-selector card" style="margin-bottom: var(--space-4);">
          <div class="ide-tabs" style="display: flex; gap: var(--space-2);">
            ${ides
              .map(
                ide => `
              <button class="btn ${this.currentIDE === ide.id ? 'btn-primary' : 'btn-secondary'}" data-ide="${ide.id}">
                ${ide.name}
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      `;
    }
  }

  /**
   * Render the code typing area
   */
  private renderCodeArea(): string {
    const exercise = this.getCurrentExercise();
    if (!exercise) {
      return `
        <div class="card" style="padding: var(--space-8); text-align: center;">
          <p style="color: var(--text-muted);">Keine Übungen verfügbar.</p>
        </div>
      `;
    }

    // Syntax highlighting is applied per-character in renderTargetCode
    const inputChars = this.currentInput.split('');
    const targetChars = exercise.text.split('');

    return `
      <div class="code-editor card">
        <div class="code-editor-header">
          <div class="code-editor-tabs">
            <div class="code-editor-tab active">
              <span class="code-editor-tab-icon">${this.getFileIcon()}</span>
              <span>${this.getFileName()}</span>
            </div>
          </div>
          <div class="code-editor-info">
            <span class="exercise-counter">${this.currentExerciseIndex + 1} / ${this.getLessonExercises().length}</span>
          </div>
        </div>
        
        <div class="code-editor-content">
          <div class="code-line-numbers">
            <span>1</span>
          </div>
          <div class="code-area">
            <div class="code-target" id="code-target">
              ${this.renderTargetCode(targetChars, inputChars)}
            </div>
            <div class="code-cursor ${this.isTyping ? 'typing' : ''}" id="code-cursor"></div>
          </div>
        </div>

        <div class="code-editor-footer">
          <div class="exercise-description">
            <span style="color: var(--text-muted);">${exercise.description}</span>
          </div>
          <div class="exercise-controls">
            ${
              !this.isTyping
                ? `
              <button class="btn btn-primary" id="btn-start-typing">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: var(--space-2);">
                  <polygon points="5,3 19,12 5,21 5,3"></polygon>
                </svg>
                Starten
              </button>
            `
                : `
              <button class="btn btn-ghost" id="btn-reset">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: var(--space-2);">
                  <polyline points="1,4 1,10 7,10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                Reset
              </button>
            `
            }
          </div>
        </div>
      </div>

      <style>
        .code-mode-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: var(--space-4);
        }

        .code-mode-header {
          margin-bottom: var(--space-6);
        }

        .code-mode-header h1 {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
        }

        .language-tab {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s ease;
          color: var(--text-secondary);
        }

        .language-tab:hover {
          background: var(--bg-secondary);
          border-color: var(--border-hover);
        }

        .language-tab.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }

        .language-icon {
          font-family: var(--font-mono);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-xs);
        }

        .code-editor {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          overflow: hidden;
          font-family: var(--font-mono);
        }

        .code-editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-2) var(--space-4);
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-primary);
        }

        .code-editor-tabs {
          display: flex;
          gap: var(--space-1);
        }

        .code-editor-tab {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-1) var(--space-3);
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .code-editor-tab.active {
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .code-editor-tab-icon {
          font-size: var(--font-size-xs);
        }

        .code-editor-info {
          font-size: var(--font-size-sm);
          color: var(--text-muted);
        }

        .code-editor-content {
          display: flex;
          padding: var(--space-4);
          min-height: 120px;
        }

        .code-line-numbers {
          display: flex;
          flex-direction: column;
          padding-right: var(--space-4);
          border-right: 1px solid var(--border-primary);
          margin-right: var(--space-4);
          color: var(--text-muted);
          font-size: var(--font-size-sm);
          user-select: none;
        }

        .code-area {
          flex: 1;
          position: relative;
        }

        .code-target {
          font-size: var(--font-size-lg);
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .code-char {
          position: relative;
        }

        .code-char.correct {
          color: var(--accent-success);
        }

        .code-char.incorrect {
          color: var(--accent-error);
          background: rgba(239, 68, 68, 0.2);
          border-radius: 2px;
        }

        .code-char.current {
          background: var(--accent-primary);
          color: white;
          border-radius: 2px;
          animation: pulse 1s ease infinite;
        }

        .code-char.pending {
          color: var(--text-muted);
        }

        /* Syntax highlighting colors */
        .code-char.keyword { color: var(--syntax-keyword, #c678dd); }
        .code-char.keyword.correct { color: var(--accent-success); }
        .code-char.string { color: var(--syntax-string, #98c379); }
        .code-char.string.correct { color: var(--accent-success); }
        .code-char.number { color: var(--syntax-number, #d19a66); }
        .code-char.number.correct { color: var(--accent-success); }
        .code-char.function { color: var(--syntax-function, #61afef); }
        .code-char.function.correct { color: var(--accent-success); }
        .code-char.type { color: var(--syntax-type, #e5c07b); }
        .code-char.type.correct { color: var(--accent-success); }
        .code-char.operator { color: var(--syntax-operator, #56b6c2); }
        .code-char.operator.correct { color: var(--accent-success); }
        .code-char.bracket { color: var(--syntax-bracket, #abb2bf); }
        .code-char.bracket.correct { color: var(--accent-success); }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .code-cursor {
          position: absolute;
          width: 2px;
          height: 1.4em;
          background: var(--accent-primary);
          animation: blink 1s ease infinite;
        }

        .code-cursor.typing {
          animation: none;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .code-editor-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3) var(--space-4);
          background: var(--bg-tertiary);
          border-top: 1px solid var(--border-primary);
        }

        .exercise-counter {
          font-family: var(--font-mono);
          font-size: var(--font-size-sm);
        }
      </style>
    `;
  }

  /**
   * Render target code with character-level feedback
   */
  private renderTargetCode(targetChars: string[], inputChars: string[]): string {
    const tokens = this.tokenize(targetChars.join(''));
    let charIndex = 0;
    let result = '';

    for (const token of tokens) {
      for (const char of token.text) {
        let className = `code-char ${token.type}`;

        if (charIndex < inputChars.length) {
          if (inputChars[charIndex] === char) {
            className += ' correct';
          } else {
            className += ' incorrect';
          }
        } else if (charIndex === inputChars.length) {
          className += ' current';
        } else {
          className += ' pending';
        }

        result += `<span class="${className}">${this.escapeHtml(char)}</span>`;
        charIndex++;
      }
    }

    return result;
  }

  /**
   * Tokenize code for syntax highlighting
   */
  private tokenize(code: string): CodeToken[] {
    const patterns = this.syntaxPatterns[this.currentLanguage];
    const tokens: CodeToken[] = [];
    let remaining = code;

    while (remaining.length > 0) {
      let matched = false;

      // Check for strings
      const stringMatch = remaining.match(/^(["'`])(?:[^\\]|\\.)*?\1/);
      if (stringMatch) {
        tokens.push({ text: stringMatch[0], type: 'string' });
        remaining = remaining.slice(stringMatch[0].length);
        matched = true;
        continue;
      }

      // Check for numbers
      const numberMatch = remaining.match(/^\d+(\.\d+)?/);
      if (numberMatch) {
        tokens.push({ text: numberMatch[0], type: 'number' });
        remaining = remaining.slice(numberMatch[0].length);
        matched = true;
        continue;
      }

      // Check for words (keywords, types, functions, identifiers)
      const wordMatch = remaining.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
      if (wordMatch) {
        const word = wordMatch[0];
        let type: CodeToken['type'] = 'default';

        if (patterns.keywords.includes(word)) {
          type = 'keyword';
        } else if (patterns.types.includes(word)) {
          type = 'type';
        } else if (patterns.functions.includes(word)) {
          type = 'function';
        }

        tokens.push({ text: word, type });
        remaining = remaining.slice(word.length);
        matched = true;
        continue;
      }

      // Check for operators
      const operatorMatch = remaining.match(/^[+\-*/%=<>!&|^~?:]+/);
      if (operatorMatch) {
        tokens.push({ text: operatorMatch[0], type: 'operator' });
        remaining = remaining.slice(operatorMatch[0].length);
        matched = true;
        continue;
      }

      // Check for brackets
      const bracketMatch = remaining.match(/^[()[\]{}]/);
      if (bracketMatch) {
        tokens.push({ text: bracketMatch[0], type: 'bracket' });
        remaining = remaining.slice(bracketMatch[0].length);
        matched = true;
        continue;
      }

      // Default: single character
      if (!matched) {
        tokens.push({ text: remaining[0], type: 'default' });
        remaining = remaining.slice(1);
      }
    }

    return tokens;
  }

  /**
   * Render keyboard
   */
  private renderKeyboard(): string {
    return `
      <div class="keyboard-section" style="margin-top: var(--space-4);">
        <div id="code-keyboard-container"></div>
      </div>
    `;
  }

  /**
   * Render stats panel
   */
  private renderStats(): string {
    const wpm = this.calculateWPM();
    const accuracy = this.calculateAccuracy();

    return `
      <div class="code-stats" style="display: flex; gap: var(--space-4); margin-top: var(--space-4);">
        <div class="stat-card" style="flex: 1;">
          <span class="stat-card-value">${wpm}</span>
          <span class="stat-card-label">WPM</span>
        </div>
        <div class="stat-card" style="flex: 1;">
          <span class="stat-card-value">${accuracy}%</span>
          <span class="stat-card-label">Genauigkeit</span>
        </div>
        <div class="stat-card" style="flex: 1;">
          <span class="stat-card-value">${this.currentInput.length}</span>
          <span class="stat-card-label">Zeichen</span>
        </div>
        <div class="stat-card" style="flex: 1;">
          <span class="stat-card-value">${this.errors}</span>
          <span class="stat-card-label">Fehler</span>
        </div>
      </div>
    `;
  }

  /**
   * Calculate WPM
   */
  private calculateWPM(): number {
    if (!this.isTyping || this.currentInput.length === 0) {
      return 0;
    }
    const elapsedMinutes = (Date.now() - this.startTime) / 60000;
    if (elapsedMinutes === 0) {
      return 0;
    }
    const words = this.currentInput.length / 5;
    return Math.round(words / elapsedMinutes);
  }

  /**
   * Calculate accuracy
   */
  private calculateAccuracy(): number {
    if (this.currentInput.length === 0) {
      return 100;
    }
    const exercise = this.getCurrentExercise();
    if (!exercise) {
      return 100;
    }
    let correct = 0;
    for (let i = 0; i < this.currentInput.length; i++) {
      if (this.currentInput[i] === exercise.text[i]) {
        correct++;
      }
    }
    return Math.round((correct / this.currentInput.length) * 100);
  }

  /**
   * Get current exercise
   */
  private getCurrentExercise(): Exercise | undefined {
    const exercises = this.getLessonExercises();
    return exercises[this.currentExerciseIndex];
  }

  /**
   * Get all exercises for current lesson
   */
  private getLessonExercises(): Exercise[] {
    if (this.currentMode === 'code') {
      const lessons = PROGRAMMING_LESSONS.filter(
        l => l.programmingLanguage === this.currentLanguage
      );
      return lessons.flatMap(l => l.exercises);
    } else {
      const lessons = SHORTCUT_LESSONS.filter(l => l.ide === this.currentIDE);
      return lessons.flatMap(l => l.exercises);
    }
  }

  /**
   * Select language
   */
  private selectLanguage(language: ProgrammingLanguage): void {
    this.currentLanguage = language;
    this.currentExerciseIndex = 0;
    this.resetTyping();
  }

  /**
   * Select IDE
   */
  private selectIDE(ide: IDE): void {
    this.currentIDE = ide;
    this.currentExerciseIndex = 0;
    this.resetTyping();
  }

  /**
   * Set mode
   */
  private setMode(mode: 'code' | 'shortcuts'): void {
    this.currentMode = mode;
    this.currentExerciseIndex = 0;
    this.resetTyping();
  }

  /**
   * Get file icon based on language
   */
  private getFileIcon(): string {
    const icons: Record<ProgrammingLanguage, string> = {
      typescript: 'TS',
      javascript: 'JS',
      python: 'PY',
      java: 'JV',
      angular: 'NG',
    };
    return icons[this.currentLanguage] || '{ }';
  }

  /**
   * Get file name based on language
   */
  private getFileName(): string {
    const names: Record<ProgrammingLanguage, string> = {
      typescript: 'example.ts',
      javascript: 'example.js',
      python: 'example.py',
      java: 'Example.java',
      angular: 'component.ts',
    };
    return names[this.currentLanguage] || 'example.txt';
  }

  /**
   * Start typing
   */
  private startTyping(): void {
    this.isTyping = true;
    this.startTime = Date.now();
    this.currentInput = '';
    this.errors = 0;
    this.updateDisplay();
  }

  /**
   * Reset typing
   */
  private resetTyping(): void {
    this.isTyping = false;
    this.currentInput = '';
    this.errors = 0;
    this.startTime = 0;
  }

  /**
   * Handle key press
   */
  private handleKeyPress(key: string): void {
    if (!this.isTyping) {
      return;
    }

    const exercise = this.getCurrentExercise();
    if (!exercise) {
      return;
    }

    const expectedChar = exercise.text[this.currentInput.length];

    if (key === 'Backspace') {
      if (this.currentInput.length > 0) {
        this.currentInput = this.currentInput.slice(0, -1);
      }
    } else if (key.length === 1) {
      if (key !== expectedChar) {
        this.errors++;
      }
      this.currentInput += key;

      // Check if exercise completed
      if (this.currentInput.length >= exercise.text.length) {
        this.completeExercise();
      }
    }

    this.updateDisplay();
  }

  /**
   * Complete exercise
   */
  private completeExercise(): void {
    const wpm = this.calculateWPM();
    const accuracy = this.calculateAccuracy();

    // Show completion message
    EventBus.emit('ui:toast', {
      message: `Übung abgeschlossen! ${wpm} WPM, ${accuracy}% Genauigkeit`,
      type: accuracy >= 90 ? 'success' : 'warning',
    });

    // Move to next exercise
    const exercises = this.getLessonExercises();
    if (this.currentExerciseIndex < exercises.length - 1) {
      this.currentExerciseIndex++;
      this.resetTyping();
      setTimeout(() => this.startTyping(), 500);
    } else {
      // All exercises completed
      this.currentExerciseIndex = 0;
      this.resetTyping();
      EventBus.emit('ui:toast', {
        message: 'Alle Übungen abgeschlossen!',
        type: 'success',
      });
    }

    this.updateDisplay();
  }

  /**
   * Update display
   */
  private updateDisplay(): void {
    const codeTarget = document.getElementById('code-target');
    if (codeTarget) {
      const exercise = this.getCurrentExercise();
      if (exercise) {
        const targetChars = exercise.text.split('');
        const inputChars = this.currentInput.split('');
        codeTarget.innerHTML = this.renderTargetCode(targetChars, inputChars);
      }
    }

    // Update stats
    const statsContainer = document.querySelector('.code-stats');
    if (statsContainer) {
      statsContainer.outerHTML = this.renderStats();
    }
  }

  /**
   * Escape HTML
   */
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

  /**
   * Initialize the page
   */
  init(): void {
    // Initialize keyboard - VirtualKeyboard takes containerId and auto-initializes
    const keyboardContainer = document.getElementById('code-keyboard-container');
    if (keyboardContainer) {
      this.keyboard = new VirtualKeyboard('code-keyboard-container');
    }

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Mode selector
    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode') as 'code' | 'shortcuts';
        this.setMode(mode);
        EventBus.emit('nav:change', { page: 'code' });
      });
    });

    // Language selector
    document.querySelectorAll('[data-language]').forEach(btn => {
      btn.addEventListener('click', () => {
        const language = btn.getAttribute('data-language') as ProgrammingLanguage;
        this.selectLanguage(language);
        EventBus.emit('nav:change', { page: 'code' });
      });
    });

    // IDE selector
    document.querySelectorAll('[data-ide]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ide = btn.getAttribute('data-ide') as IDE;
        this.selectIDE(ide);
        EventBus.emit('nav:change', { page: 'code' });
      });
    });

    // Start button
    const startBtn = document.getElementById('btn-start-typing');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startTyping();
        this.updateDisplay();
        // Re-render footer
        const footer = document.querySelector('.code-editor-footer');
        if (footer) {
          const exerciseControls = footer.querySelector('.exercise-controls');
          if (exerciseControls) {
            exerciseControls.innerHTML = `
              <button class="btn btn-ghost" id="btn-reset">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: var(--space-2);">
                  <polyline points="1,4 1,10 7,10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                Reset
              </button>
            `;
            // Re-attach reset listener
            const resetBtn = document.getElementById('btn-reset');
            if (resetBtn) {
              resetBtn.addEventListener('click', () => {
                this.resetTyping();
                EventBus.emit('nav:change', { page: 'code' });
              });
            }
          }
        }
      });
    }

    // Reset button
    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetTyping();
        EventBus.emit('nav:change', { page: 'code' });
      });
    }

    // Keyboard input
    document.addEventListener('keydown', this.boundKeyboardInput);
  }

  /**
   * Handle keyboard input
   */
  private handleKeyboardInput(event: KeyboardEvent): void {
    const state = Store.getState();
    if (state.currentPage !== 'code' || !this.isTyping) {
      return;
    }

    // Prevent default for typing keys
    if (event.key !== 'Escape' && event.key !== 'F5' && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
    }

    if (event.key === 'Escape') {
      this.resetTyping();
      EventBus.emit('nav:change', { page: 'code' });
      return;
    }

    this.handleKeyPress(event.key);
  }

  /**
   * Destroy the page
   */
  destroy(): void {
    if (this.keyboard) {
      this.keyboard.destroy();
      this.keyboard = null;
    }
    document.removeEventListener('keydown', this.boundKeyboardInput);
  }
}
