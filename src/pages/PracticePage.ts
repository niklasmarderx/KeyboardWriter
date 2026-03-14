import { VirtualKeyboard } from '../components/keyboard/VirtualKeyboard';
import { EventBus, Store, t } from '../core';
import { SettingsService } from '../core/SettingsService';
import { TypingEngineService } from '../services/TypingEngineService';

/**
 * Sample texts for practice
 */
const SAMPLE_TEXTS = {
  beginner: [
    'asdf jkl; asdf jkl; asdf jkl;',
    'fjdk sl;a fjdk sl;a fjdk sl;a',
    'the last the last the last the',
    'fall hall fall hall fall hall',
  ],
  intermediate: [
    'The quick brown fox jumps over.',
    'A dog runs through the park.',
    'The weather is very nice today.',
    'I am learning touch typing skills.',
  ],
  advanced: [
    'The quick brown fox jumps over the lazy dog near the riverbank.',
    'Pack my box with five dozen liquor jugs for the upcoming party.',
    'How vexingly quick daft zebras jump!',
  ],
  programming: [
    'const value = 42;',
    'function hello() { return "world"; }',
    'if (x > 0) { console.log(x); }',
    'for (let i = 0; i < 10; i++) {}',
    'const arr = [1, 2, 3].map(x => x * 2);',
  ],
};

/**
 * Test modes
 */
type TestMode = 'text' | 'timed';

/**
 * Long texts for timed tests
 */
const TIMED_TEST_TEXTS = [
  'The art of typing is a valuable skill in the modern world. With regular practice, anyone can learn to type quickly and accurately. The key to success lies in proper finger positioning and steady repetition. Start with simple exercises and gradually increase the difficulty. Always pay attention to ergonomic posture and take regular breaks to avoid fatigue.',
  'Programming is like writing stories for computers. Each line of code tells the computer what to do. Variables store information, functions perform actions, and loops repeat tasks. Over time, you develop a sense for elegant code that not only works but is also easy to understand and maintain.',
  'The internet has fundamentally changed our world. Today we can communicate with people around the world in seconds. Knowledge is freely accessible, and new technologies emerge at a rapid pace. But with these opportunities come challenges. Privacy and security are more important than ever, and we must learn to use digital media responsibly.',
  'Software development is a creative process. You start with an idea and transform it step by step into a working program. Planning and structure are just as important as the actual programming. A good developer thinks not only about the current solution but also about future extensions and potential problems.',
  'Keyboard training improves not only typing speed but also productivity at the computer. Those who can touch type save time with every email, document, and message. The brain can fully focus on content instead of searching for the right keys. With just a few minutes of daily practice, progress is quickly visible.',
];

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
        <div class="practice-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
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
          <p style="color: var(--text-muted); text-align: center; padding: var(--space-8);">
            ${t('practice.clickToStart')}
          </p>
        </div>

        <div class="stats-panel" style="margin: var(--space-6) 0;">
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

        <div class="progress-container" style="margin-bottom: var(--space-6);">
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
      this.loadNewText(difficulty as keyof typeof SAMPLE_TEXTS);
    });

    restartBtn?.addEventListener('click', () => {
      this.restart();
    });

    difficultySelect?.addEventListener('change', () => {
      this.loadNewText(difficultySelect.value as keyof typeof SAMPLE_TEXTS);
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
    // Combine multiple texts for longer tests
    const shuffled = [...TIMED_TEST_TEXTS].sort(() => Math.random() - 0.5);
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
  loadNewText(difficulty: keyof typeof SAMPLE_TEXTS): void {
    const texts = SAMPLE_TEXTS[difficulty];
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
