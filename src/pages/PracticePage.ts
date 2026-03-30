import { VirtualKeyboard } from '../components/keyboard/VirtualKeyboard';
import { EventBus, Store, t } from '../core';
import { SettingsService } from '../core/SettingsService';
import {
  COMPLEX_TEXTS,
  EXPERT_TEXTS,
  MEDIUM_TEXTS,
  PracticeText,
  SIMPLE_TEXTS,
} from '../data/practiceTexts';
import { TypingEngineService } from '../services/TypingEngineService';

/**
 * Practice preset definition
 */
interface PracticePreset {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  mode: 'text' | 'timed';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'programming';
  duration?: number; // seconds, for timed mode
  icon: string;
}

const PRACTICE_PRESETS: PracticePreset[] = [
  {
    id: 'warmup',
    label: '5min Aufwärmen',
    labelEn: '5min Warmup',
    description: 'Lockeres Aufwärmen für die Finger',
    descriptionEn: 'Easy warmup for your fingers',
    mode: 'timed',
    difficulty: 'beginner',
    duration: 300,
    icon: '🔥',
  },
  {
    id: 'endurance',
    label: '10min Ausdauer',
    labelEn: '10min Endurance',
    description: 'Kontinuierliches Tippen über 10 Minuten',
    descriptionEn: 'Continuous typing for 10 minutes',
    mode: 'timed',
    difficulty: 'intermediate',
    duration: 600,
    icon: '⏱️',
  },
  {
    id: 'sprint',
    label: '60s Sprint',
    labelEn: '60s Sprint',
    description: 'Maximale Geschwindigkeit über 1 Minute',
    descriptionEn: 'Maximum speed for 1 minute',
    mode: 'timed',
    difficulty: 'advanced',
    duration: 60,
    icon: '⚡',
  },
  {
    id: 'code',
    label: 'Code-Session',
    labelEn: 'Code Session',
    description: 'Programmierspezifische Texte üben',
    descriptionEn: 'Practice programming-specific texts',
    mode: 'text',
    difficulty: 'programming',
    icon: '💻',
  },
];

/**
 * Get sample texts based on difficulty and language setting
 */
function getSampleTexts(
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'programming',
  language: 'de' | 'en'
): string[] {
  const getText = (t: PracticeText) => (language === 'de' ? t.textDe : t.textEn);

  switch (difficulty) {
    case 'beginner':
      return SIMPLE_TEXTS.slice(0, 5).map(getText);
    case 'intermediate':
      return MEDIUM_TEXTS.slice(0, 5).map(getText);
    case 'advanced':
      return COMPLEX_TEXTS.slice(0, 5).map(getText);
    case 'programming':
      // Programming texts stay the same (code is universal)
      return [
        'const value = 42;',
        'function hello() { return "world"; }',
        'if (x > 0) { console.log(x); }',
        'for (let i = 0; i < 10; i++) {}',
        'const arr = [1, 2, 3].map(x => x * 2);',
      ];
    default:
      return SIMPLE_TEXTS.slice(0, 5).map(getText);
  }
}

/**
 * Get timed test texts based on language setting
 */
function getTimedTestTexts(language: 'de' | 'en'): string[] {
  const getText = (t: PracticeText) => (language === 'de' ? t.textDe : t.textEn);
  // Combine medium, complex and expert texts for longer tests
  return [
    ...MEDIUM_TEXTS.slice(0, 3),
    ...COMPLEX_TEXTS.slice(0, 2),
    ...EXPERT_TEXTS.slice(0, 2),
  ].map(getText);
}

/**
 * Test modes
 */
type TestMode = 'text' | 'timed';

/**
 * Practice Page Controller
 * Manages the typing practice interface
 */
export class PracticePage {
  private keyboard: VirtualKeyboard | null = null;
  private currentText: string = '';
  private currentPosition: number = 0;
  private sessionActive: boolean = false;
  private timeUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private boundKeydownHandler: ((e: KeyboardEvent) => void) | null = null;

  // Timed test properties
  private currentTestMode: TestMode = 'text';
  private timedTestDuration: number = 60;
  private timedTestRemaining: number = 0;
  private timedTestStartTime: number = 0;
  private timedCountdownInterval: ReturnType<typeof setInterval> | null = null;

  // Event subscriptions for cleanup
  private readonly eventSubscriptions: { unsubscribe: () => void }[] = [];

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Listen for keystroke events - store subscription for cleanup
    this.eventSubscriptions.push(
      EventBus.on('typing:keystroke', ({ isCorrect, position }) => {
        this.handleKeystrokeFeedback(isCorrect, position);
      })
    );

    // Listen for completion - store subscription for cleanup
    this.eventSubscriptions.push(
      EventBus.on('typing:complete', ({ wpm, accuracy }) => {
        this.handleCompletion(wpm, accuracy);
      })
    );
  }

  /**
   * Render the practice page
   */
  render(): string {
    const settings = SettingsService.getSettings();
    this.timedTestDuration = settings.defaultTestDuration;

    return `
      <div class="typing-container">
        <div class="practice-header" style="display: flex; justify-content: space-between; align-items: center;">
          <h1>${t('practice.title')}</h1>
          <div class="practice-controls" style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
            <!-- Test Mode Toggle -->
            <div class="test-mode-toggle" style="display: flex; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-primary);">
              <button id="mode-text" class="mode-btn active" style="padding: var(--space-2) var(--space-3); background: var(--accent-primary); color: var(--text-inverse); border: none; cursor: pointer; font-size: 13px;">
                ${t('practice.text')}
              </button>
              <button id="mode-timed" class="mode-btn" style="padding: var(--space-2) var(--space-3); background: var(--bg-tertiary); color: var(--text-secondary); border: none; cursor: pointer; font-size: 13px;">
                ${t('practice.timedTest')}
              </button>
            </div>
            
            <!-- Text mode controls -->
            <div id="text-mode-controls" style="display: flex; gap: var(--space-2);">
              <select id="difficulty-select" class="btn btn-secondary" style="padding: var(--space-2) var(--space-4);">
                <option value="beginner">${t('practice.beginner')}</option>
                <option value="intermediate">${t('practice.intermediate')}</option>
                <option value="advanced">${t('practice.advanced')}</option>
                <option value="programming">${t('practice.programming')}</option>
              </select>
              <button id="btn-new-text" class="btn btn-secondary">${t('practice.newText')}</button>
            </div>
            
            <!-- Timed mode controls -->
            <div id="timed-mode-controls" style="display: none; gap: var(--space-2);">
              <select id="time-duration-select" class="btn btn-secondary" style="padding: var(--space-2) var(--space-4);">
                <option value="30" ${settings.defaultTestDuration === 30 ? 'selected' : ''}>30 ${t('practice.seconds')}</option>
                <option value="60" ${settings.defaultTestDuration === 60 ? 'selected' : ''}>60 ${t('practice.seconds')}</option>
                <option value="120" ${settings.defaultTestDuration === 120 ? 'selected' : ''}>120 ${t('practice.seconds')}</option>
              </select>
              <button id="btn-start-timed" class="btn btn-primary">${t('practice.start')}</button>
            </div>
            
            <button id="btn-restart" class="btn btn-secondary">${t('practice.restart')}</button>
          </div>
        </div>

        <div id="typing-display" class="typing-text-display">
          <p style="color: var(--text-muted); text-align: center; padding: var(--space-4);">
            ${t('practice.clickToStart')}
          </p>
        </div>

        <div class="practice-presets" role="group" aria-label="Practice presets">
          ${PRACTICE_PRESETS.map(
            p => `
            <button
              class="preset-btn"
              data-preset-id="${p.id}"
              aria-label="${p.labelEn}: ${p.descriptionEn}"
              title="${p.description}"
            >
              <span class="preset-icon" aria-hidden="true">${p.icon}</span>
              <span class="preset-label">${p.label}</span>
            </button>
          `
          ).join('')}
        </div>
        <div class="stats-panel">
          <div class="stat-card">
            <span class="stat-card-value" id="session-wpm">0</span>
            <span class="stat-card-label">WPM</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value" id="session-accuracy">100%</span>
            <span class="stat-card-label">${t('common.accuracy')}</span>
          </div>
          <div class="stat-card" id="time-stat-card">
            <span class="stat-card-value" id="session-time">0:00</span>
            <span class="stat-card-label" id="time-label">${t('practice.time')}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value" id="session-errors">0</span>
            <span class="stat-card-label">${t('practice.errors')}</span>
          </div>
          <div class="stat-card" id="chars-stat-card" style="display: none;">
            <span class="stat-card-value" id="session-chars">0</span>
            <span class="stat-card-label">${t('practice.characters')}</span>
          </div>
        </div>

        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-bar-fill" id="progress-fill" style="width: 0%;"></div>
          </div>
        </div>

        <div class="keyboard-container" id="keyboard"></div>
      </div>
    `;
  }

  /**
   * Initialize the page after rendering
   */
  init(): void {
    // Initialize keyboard
    try {
      this.keyboard = new VirtualKeyboard('keyboard');
    } catch (e) {
      console.error('Failed to initialize keyboard:', e);
    }

    // Setup button handlers
    this.setupButtonHandlers();

    // Setup keyboard input
    this.setupKeyboardInput();

    // Load initial text
    this.loadNewText('beginner');

    // Setup preset buttons
    this.setupPresetButtons();
  }

  /**
   * Setup preset button click handlers
   */
  private setupPresetButtons(): void {
    document.querySelectorAll<HTMLButtonElement>('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetId = btn.dataset.presetId;
        const preset = PRACTICE_PRESETS.find(p => p.id === presetId);
        if (!preset) {
          return;
        }

        if (preset.mode === 'timed' && preset.duration !== undefined) {
          this.setTestMode('timed');
          this.timedTestDuration = preset.duration;
          this.loadNewText(preset.difficulty);
          this.startTimedTest();

          // Sync the selects
          const select = document.getElementById(
            'time-duration-select'
          ) as HTMLSelectElement | null;
          if (select) {
            select.value = String(preset.duration);
          }
        } else {
          this.setTestMode('text');
          this.loadNewText(preset.difficulty);
        }

        // Visual feedback
        document
          .querySelectorAll<HTMLButtonElement>('.preset-btn')
          .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  /**
   * Setup button click handlers
   */
  private setupButtonHandlers(): void {
    const newTextBtn = document.getElementById('btn-new-text');
    const restartBtn = document.getElementById('btn-restart');
    const difficultySelect = document.getElementById('difficulty-select') as HTMLSelectElement;

    // Mode toggle buttons
    const modeTextBtn = document.getElementById('mode-text');
    const modeTimedBtn = document.getElementById('mode-timed');
    const textControls = document.getElementById('text-mode-controls');
    const timedControls = document.getElementById('timed-mode-controls');
    const startTimedBtn = document.getElementById('btn-start-timed');
    const timeDurationSelect = document.getElementById('time-duration-select') as HTMLSelectElement;

    newTextBtn?.addEventListener('click', () => {
      const difficulty = difficultySelect?.value ?? 'beginner';
      this.loadNewText(difficulty as 'beginner' | 'intermediate' | 'advanced' | 'programming');
    });

    restartBtn?.addEventListener('click', () => {
      this.restart();
    });

    difficultySelect?.addEventListener('change', () => {
      this.loadNewText(
        difficultySelect.value as 'beginner' | 'intermediate' | 'advanced' | 'programming'
      );
    });

    // Mode toggle
    modeTextBtn?.addEventListener('click', () => {
      this.setTestMode('text');
      modeTextBtn.style.background = 'var(--accent-primary)';
      modeTextBtn.style.color = 'var(--text-inverse)';
      if (modeTimedBtn) {
        modeTimedBtn.style.background = 'var(--bg-tertiary)';
        modeTimedBtn.style.color = 'var(--text-secondary)';
      }
      if (textControls) {
        textControls.style.display = 'flex';
      }
      if (timedControls) {
        timedControls.style.display = 'none';
      }
    });

    modeTimedBtn?.addEventListener('click', () => {
      this.setTestMode('timed');
      modeTimedBtn.style.background = 'var(--accent-primary)';
      modeTimedBtn.style.color = 'var(--text-inverse)';
      if (modeTextBtn) {
        modeTextBtn.style.background = 'var(--bg-tertiary)';
        modeTextBtn.style.color = 'var(--text-secondary)';
      }
      if (textControls) {
        textControls.style.display = 'none';
      }
      if (timedControls) {
        timedControls.style.display = 'flex';
      }
    });

    // Timed test controls
    timeDurationSelect?.addEventListener('change', () => {
      this.timedTestDuration = parseInt(timeDurationSelect.value, 10);
    });

    startTimedBtn?.addEventListener('click', () => {
      this.startTimedTest();
    });
  }

  /**
   * Set test mode
   */
  private setTestMode(mode: TestMode): void {
    this.currentTestMode = mode;
    this.restart();

    const charsCard = document.getElementById('chars-stat-card');
    const timeLabel = document.getElementById('time-label');

    if (this.currentTestMode === 'timed') {
      if (charsCard) {
        charsCard.style.display = 'block';
      }
      if (timeLabel) {
        timeLabel.textContent = t('practice.remaining');
      }
      this.loadTimedTestText();
    } else {
      if (charsCard) {
        charsCard.style.display = 'none';
      }
      if (timeLabel) {
        timeLabel.textContent = t('practice.time');
      }
      this.loadNewText('beginner');
    }
  }

  /**
   * Load text for timed test
   */
  private loadTimedTestText(): void {
    // Get language setting - use the helper method that handles 'both' correctly
    const language = SettingsService.getExerciseLanguage();

    // Get texts in the correct language and shuffle
    const texts = getTimedTestTexts(language);
    const shuffled = [...texts].sort(() => Math.random() - 0.5);
    this.currentText = shuffled.join(' ');
    this.currentPosition = 0;
    this.sessionActive = false;

    TypingEngineService.endSession();
    this.stopTimeUpdate();
    this.stopTimedCountdown();

    this.renderTextDisplay();
    this.resetStatsDisplay();

    // Update time display
    const timeEl = document.getElementById('session-time');
    if (timeEl) {
      timeEl.textContent = this.formatTime(this.timedTestDuration);
    }

    // Show start prompt
    const display = document.getElementById('typing-display');
    if (display) {
      display.innerHTML = `
        <div style="text-align: center; padding: var(--space-8);">
          <p style="color: var(--text-muted); margin-bottom: var(--space-4);">
            ${t('practice.timedTestPrompt', { duration: String(this.timedTestDuration) })}
          </p>
          <p style="color: var(--text-secondary); font-size: 14px;">
            ${t('practice.clickStartPrompt')}
          </p>
        </div>
      `;
    }
  }

  /**
   * Start timed test
   */
  private startTimedTest(): void {
    this.timedTestRemaining = this.timedTestDuration;
    this.timedTestStartTime = Date.now();

    // Render the text
    this.renderTextDisplay();

    // Highlight first key
    if (this.currentText.length > 0) {
      this.keyboard?.highlightNextKey(this.currentText[0]);
    }

    // Start session
    this.sessionActive = true;
    TypingEngineService.startSession('practice', 'timed', this.currentText);

    // Start countdown
    this.startTimedCountdown();
  }

  /**
   * Start timed countdown
   */
  private startTimedCountdown(): void {
    this.stopTimedCountdown();

    this.timedCountdownInterval = setInterval(() => {
      const elapsed = (Date.now() - this.timedTestStartTime) / 1000;
      this.timedTestRemaining = Math.max(0, this.timedTestDuration - elapsed);

      const timeEl = document.getElementById('session-time');
      if (timeEl) {
        timeEl.textContent = this.formatTime(Math.ceil(this.timedTestRemaining));

        // Add warning color when low on time
        if (this.timedTestRemaining <= 10) {
          timeEl.style.color = 'var(--accent-error)';
        } else if (this.timedTestRemaining <= 30) {
          timeEl.style.color = 'var(--accent-warning)';
        }
      }

      // Update chars count
      const charsEl = document.getElementById('session-chars');
      if (charsEl) {
        charsEl.textContent = String(this.currentPosition);
      }

      // Time's up
      if (this.timedTestRemaining <= 0) {
        this.endTimedTest();
      }
    }, 100);
  }

  /**
   * Stop timed countdown
   */
  private stopTimedCountdown(): void {
    if (this.timedCountdownInterval) {
      clearInterval(this.timedCountdownInterval);
      this.timedCountdownInterval = null;
    }
  }

  /**
   * End timed test
   */
  private endTimedTest(): void {
    this.stopTimedCountdown();
    this.sessionActive = false;

    // Calculate final stats
    const stats = TypingEngineService.getSessionStats();
    const wpm = stats?.wpm ?? 0;
    const accuracy = stats?.accuracy ?? 100;
    const charsTyped = this.currentPosition;

    TypingEngineService.endSession();

    // Show results
    const display = document.getElementById('typing-display');
    if (display) {
      display.innerHTML = `
        <div class="timed-test-results" style="text-align: center; padding: var(--space-8);">
          <h2 style="color: var(--accent-success); margin-bottom: var(--space-6);">${t('practice.timesUp')}</h2>
          <div class="results-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); max-width: 400px; margin: 0 auto;">
            <div class="result-item">
              <div style="font-size: 32px; font-weight: bold; color: var(--accent-primary);">${wpm}</div>
              <div style="color: var(--text-muted); font-size: 12px;">WPM</div>
            </div>
            <div class="result-item">
              <div style="font-size: 32px; font-weight: bold; color: var(--accent-primary);">${accuracy}%</div>
              <div style="color: var(--text-muted); font-size: 12px;">${t('common.accuracy')}</div>
            </div>
            <div class="result-item">
              <div style="font-size: 32px; font-weight: bold; color: var(--accent-primary);">${charsTyped}</div>
              <div style="color: var(--text-muted); font-size: 12px;">${t('practice.characters')}</div>
            </div>
          </div>
          <button id="btn-retry-timed" class="btn btn-primary" style="margin-top: var(--space-6);">
            ${t('practice.tryAgain')}
          </button>
        </div>
      `;

      // Add retry button handler
      document.getElementById('btn-retry-timed')?.addEventListener('click', () => {
        this.loadTimedTestText();
      });
    }

    // Show toast
    EventBus.emit('ui:toast', {
      message: t('practice.timedComplete', { wpm: String(wpm), accuracy: String(accuracy) }),
      type: 'success',
    });

    // Clear keyboard
    this.keyboard?.clearAllStates();
  }

  /**
   * Format time in MM:SS
   */
  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Setup keyboard input handling
   */
  private setupKeyboardInput(): void {
    // Remove any existing handler first to prevent duplicates
    this.removeKeyboardInput();

    // Create bound handler
    this.boundKeydownHandler = (event: KeyboardEvent) => {
      // Ignore if modal is open
      if (Store.getState().isModalOpen) {
        return;
      }

      // Start session on first keystroke
      if (!this.sessionActive && this.currentText && event.key.length === 1) {
        this.startSession();
      }

      // Process keystroke if session is active
      if (this.sessionActive) {
        this.handleKeyDown(event);
      }
    };

    document.addEventListener('keydown', this.boundKeydownHandler);
  }

  /**
   * Remove keyboard input handler
   */
  private removeKeyboardInput(): void {
    if (this.boundKeydownHandler) {
      document.removeEventListener('keydown', this.boundKeydownHandler);
      this.boundKeydownHandler = null;
    }
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    // Ignore modifier keys alone
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(event.key)) {
      return;
    }

    // Handle Backspace key - allow correction
    if (event.key === 'Backspace') {
      event.preventDefault();
      this.handleBackspace();
      return;
    }

    // Only process single character keys (letters, numbers, symbols) and space
    // Ignore keys like Tab, Enter, Escape, Arrow keys, etc.
    if (event.key.length !== 1 && event.key !== ' ') {
      return;
    }

    // Prevent default for typing keys
    event.preventDefault();

    // Process the keystroke
    const result = TypingEngineService.processKeystroke(event.key, event.code);

    if (result) {
      // Update UI
      this.updateTypingDisplay(result.isCorrect);

      // Update keyboard visual
      if (result.isCorrect) {
        this.keyboard?.showCorrect(event.code);
      } else {
        this.keyboard?.showIncorrect(event.code);
      }

      // Update stats display
      this.updateStatsDisplay();

      // Highlight next key
      const nextChar = TypingEngineService.getCurrentExpectedChar();
      if (nextChar) {
        this.keyboard?.highlightNextKey(nextChar);
      }
    }
  }

  /**
   * Handle backspace - allow correction of mistakes
   */
  private handleBackspace(): void {
    const result = TypingEngineService.handleBackspace();

    if (result) {
      const { newPosition } = result;
      this.currentPosition = newPosition;

      // Update typing display - restore previous character state
      const display = document.getElementById('typing-display');
      if (display) {
        const charElements = display.querySelectorAll('.typing-char');

        // Remove current class from current position + 1 (if exists)
        if (newPosition + 1 < charElements.length) {
          charElements[newPosition + 1].classList.remove('current');
          charElements[newPosition + 1].classList.add('upcoming');
        }

        // Reset the character at newPosition
        const charEl = charElements[newPosition];
        if (charEl) {
          charEl.classList.remove('correct', 'incorrect', 'upcoming');
          charEl.classList.add('current');
        }
      }

      // Update progress bar
      const progress = (this.currentPosition / this.currentText.length) * 100;
      const progressBar = document.getElementById('progress-fill');
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      // Update stats display
      this.updateStatsDisplay();

      // Highlight the current expected key
      const nextChar = TypingEngineService.getCurrentExpectedChar();
      if (nextChar) {
        this.keyboard?.highlightNextKey(nextChar);
      }

      // Clear keyboard states
      this.keyboard?.clearAllStates();
    }
  }

  /**
   * Load new text
   */
  loadNewText(difficulty: 'beginner' | 'intermediate' | 'advanced' | 'programming'): void {
    // Get language setting - use the helper method that handles 'both' correctly
    const language = SettingsService.getExerciseLanguage();
    const settings = SettingsService.getSettings();
    console.log(
      '[PracticePage] Loading text - exerciseLanguage setting:',
      settings.exerciseLanguage,
      '-> resolved language:',
      language
    );

    const texts = getSampleTexts(difficulty, language);
    const randomIndex = Math.floor(Math.random() * texts.length);
    this.currentText = texts[randomIndex];
    this.currentPosition = 0;
    this.sessionActive = false;

    // End any existing session
    TypingEngineService.endSession();
    this.stopTimeUpdate();

    // Render text display
    this.renderTextDisplay();

    // Reset stats
    this.resetStatsDisplay();

    // Highlight first key
    if (this.currentText.length > 0) {
      this.keyboard?.highlightNextKey(this.currentText[0]);
    }
  }

  /**
   * Render the text display
   */
  private renderTextDisplay(): void {
    const display = document.getElementById('typing-display');
    if (!display) {
      return;
    }

    display.innerHTML = this.currentText
      .split('')
      .map((char, index) => {
        const displayChar = char === ' ' ? '&nbsp;' : this.escapeHtml(char);
        const className = index === 0 ? 'typing-char current' : 'typing-char upcoming';
        return `<span class="${className}" data-index="${index}">${displayChar}</span>`;
      })
      .join('');
  }

  /**
   * Start typing session
   */
  private startSession(): void {
    this.sessionActive = true;
    TypingEngineService.startSession('practice', 'free', this.currentText);
    this.startTimeUpdate();
  }

  /**
   * Restart current text
   */
  restart(): void {
    this.currentPosition = 0;
    this.sessionActive = false;
    TypingEngineService.endSession();
    this.stopTimeUpdate();
    this.renderTextDisplay();
    this.resetStatsDisplay();

    if (this.currentText.length > 0) {
      this.keyboard?.highlightNextKey(this.currentText[0]);
    }
  }

  /**
   * Update typing display after keystroke
   */
  private updateTypingDisplay(isCorrect: boolean): void {
    const display = document.getElementById('typing-display');
    if (!display) {
      return;
    }

    const charElements = display.querySelectorAll('.typing-char');
    const currentCharEl = charElements[this.currentPosition];

    if (currentCharEl) {
      currentCharEl.classList.remove('current');
      currentCharEl.classList.add(isCorrect ? 'correct' : 'incorrect');
    }

    this.currentPosition++;

    // Highlight next character
    if (this.currentPosition < charElements.length) {
      const nextCharEl = charElements[this.currentPosition];
      nextCharEl.classList.remove('upcoming');
      nextCharEl.classList.add('current');
    }

    // Update progress bar
    const progress = (this.currentPosition / this.currentText.length) * 100;
    const progressBar = document.getElementById('progress-fill');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }

  /**
   * Handle keystroke feedback
   */
  private handleKeystrokeFeedback(isCorrect: boolean, _position: number): void {
    // Additional feedback can be added here
    if (!isCorrect) {
      // Could play error sound, etc.
    }
  }

  /**
   * Handle session completion
   */
  private handleCompletion(wpm: number, accuracy: number): void {
    this.sessionActive = false;
    this.stopTimeUpdate();

    // Show completion message
    EventBus.emit('ui:toast', {
      message: t('practice.complete', { wpm: String(wpm), accuracy: String(accuracy) }),
      type: 'success',
    });

    // Update progress bar to success color
    const progressBar = document.getElementById('progress-fill');
    if (progressBar) {
      progressBar.classList.add('success');
    }

    // Clear keyboard highlight
    this.keyboard?.clearAllStates();
  }

  /**
   * Update statistics display
   */
  private updateStatsDisplay(): void {
    const state = Store.getState();

    const wpmEl = document.getElementById('session-wpm');
    const accuracyEl = document.getElementById('session-accuracy');
    const errorsEl = document.getElementById('session-errors');

    if (wpmEl) {
      wpmEl.textContent = String(state.liveWPM);
    }
    if (accuracyEl) {
      accuracyEl.textContent = `${state.liveAccuracy}%`;
    }
    if (errorsEl) {
      errorsEl.textContent = String(TypingEngineService.getErrorCount());
    }
  }

  /**
   * Start time update interval
   */
  private startTimeUpdate(): void {
    this.stopTimeUpdate();
    this.timeUpdateInterval = setInterval(() => {
      const timeEl = document.getElementById('session-time');
      if (timeEl) {
        timeEl.textContent = TypingEngineService.getFormattedTime();
      }
    }, 100);
  }

  /**
   * Stop time update interval
   */
  private stopTimeUpdate(): void {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  }

  /**
   * Reset statistics display
   */
  private resetStatsDisplay(): void {
    const wpmEl = document.getElementById('session-wpm');
    const accuracyEl = document.getElementById('session-accuracy');
    const timeEl = document.getElementById('session-time');
    const errorsEl = document.getElementById('session-errors');
    const progressBar = document.getElementById('progress-fill');

    if (wpmEl) {
      wpmEl.textContent = '0';
    }
    if (accuracyEl) {
      accuracyEl.textContent = '100%';
    }
    if (timeEl) {
      timeEl.textContent = '0:00';
    }
    if (errorsEl) {
      errorsEl.textContent = '0';
    }
    if (progressBar) {
      progressBar.style.width = '0%';
      progressBar.classList.remove('success');
    }

    Store.updateLiveStats(0, 100);
  }

  /**
   * Escape HTML characters
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
    this.stopTimeUpdate();
    this.stopTimedCountdown();
    this.removeKeyboardInput();
    this.keyboard?.destroy();
    TypingEngineService.endSession();

    // Unsubscribe from all EventBus events to prevent duplicate handlers
    this.eventSubscriptions.forEach(sub => sub.unsubscribe());
    this.eventSubscriptions.length = 0;
  }
}
