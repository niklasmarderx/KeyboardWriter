import { VirtualKeyboard } from '../components/keyboard/VirtualKeyboard';
import { EventBus, Store, t } from '../core';
import { LESSON_CATEGORIES } from '../data/lessons';
import { Exercise, Lesson } from '../domain/models';
import { LessonService } from '../services/LessonService';
import { TypingEngineService } from '../services/TypingEngineService';

/**
 * Lessons Page Controller
 * Displays lesson categories and manages lesson flow
 */
export class LessonsPage {
  private keyboard: VirtualKeyboard | null = null;
  private currentView: 'categories' | 'lessons' | 'exercise' = 'categories';
  private selectedCategory: string | null = null;
  private timeUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private boundKeydownHandler: ((e: KeyboardEvent) => void) | null = null;

  // Event subscriptions for cleanup
  private readonly eventSubscriptions: { unsubscribe: () => void }[] = [];

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Store subscriptions for cleanup in destroy()
    this.eventSubscriptions.push(
      EventBus.on('lesson:complete', result => {
        this.handleLessonComplete(result);
      })
    );

    this.eventSubscriptions.push(
      EventBus.on('typing:complete', () => {
        this.handleExerciseComplete();
      })
    );
  }

  /**
   * Render the page based on current view
   */
  render(): string {
    switch (this.currentView) {
      case 'categories':
        return this.renderCategoriesView();
      case 'lessons':
        return this.renderLessonsView();
      case 'exercise':
        return this.renderExerciseView();
      default:
        return this.renderCategoriesView();
    }
  }

  /**
   * Render categories overview
   */
  private renderCategoriesView(): string {
    const completedCount = LessonService.getCompletedLessonsCount();
    const totalCount = LessonService.getAllLessons().length;

    return `
      <div class="typing-container">
        <div class="lessons-header" style="margin-bottom: var(--space-6);">
          <h1>${t('lessons.title')}</h1>
          <p style="color: var(--text-secondary); margin-top: var(--space-2);">
            ${t('lessons.completed', { completed: completedCount, total: totalCount })}
          </p>
          <div class="progress-bar" style="margin-top: var(--space-4); height: 8px;">
            <div class="progress-bar-fill" style="width: ${(completedCount / totalCount) * 100}%;"></div>
          </div>
        </div>

        <div class="category-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3);">
          ${LESSON_CATEGORIES.map(cat => this.renderCategoryCard(cat.id, cat.name, cat.description, cat.icon ?? 'book')).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render a category card
   */
  private renderCategoryCard(id: string, name: string, description: string, icon: string): string {
    const lessons = LessonService.getLessonsInCategory(id);
    const completedInCategory = lessons.filter(l => LessonService.isLessonCompleted(l.id)).length;

    // Get translated name and description
    const translatedName =
      t(`lessons.category.${id}`) !== `lessons.category.${id}` ? t(`lessons.category.${id}`) : name;
    const translatedDesc =
      t(`lessons.category.${id}.desc`) !== `lessons.category.${id}.desc`
        ? t(`lessons.category.${id}.desc`)
        : description;

    const icons: Record<string, string> = {
      keyboard:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8"></line><line x1="10" y1="8" x2="10" y2="8"></line><line x1="14" y1="8" x2="14" y2="8"></line><line x1="18" y1="8" x2="18" y2="8"></line><line x1="8" y1="16" x2="16" y2="16"></line></svg>',
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
      code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16,18 22,12 16,6"></polyline><polyline points="8,6 2,12 8,18"></polyline></svg>',
      command:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>',
    };

    // Compact category card layout
    return `
      <div class="card category-card" data-category="${id}" role="button" tabindex="0" style="cursor: pointer; padding: var(--space-3); transition: transform 0.2s, box-shadow 0.2s; -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none;">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
          <div style="width: 32px; height: 32px; border-radius: var(--radius-md); background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span style="width: 18px; height: 18px; color: var(--accent-primary);">${icons[icon] ?? icons.book}</span>
          </div>
          <h3 style="margin: 0; font-size: 14px; flex: 1;">${translatedName}</h3>
        </div>
        <p style="color: var(--text-secondary); font-size: 12px; margin: 0 0 var(--space-2) 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">${translatedDesc}</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 10px; color: var(--text-muted);">${t('lessons.completedCount', { count: completedInCategory })}/${lessons.length}</span>
          <div class="progress-bar" style="width: 60px; height: 4px;">
            <div class="progress-bar-fill" style="width: ${lessons.length > 0 ? (completedInCategory / lessons.length) * 100 : 0}%;"></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render lessons list for a category
   */
  private renderLessonsView(): string {
    if (!this.selectedCategory) {
      return this.renderCategoriesView();
    }

    const category = LESSON_CATEGORIES.find(c => c.id === this.selectedCategory);
    const lessons = LessonService.getLessonsInCategory(this.selectedCategory);

    // Get translated category name and description
    const categoryName = category
      ? t(`lessons.category.${category.id}`) !== `lessons.category.${category.id}`
        ? t(`lessons.category.${category.id}`)
        : category.name
      : t('lessons.title');

    const categoryDesc = category
      ? t(`lessons.category.${category.id}.desc`) !== `lessons.category.${category.id}.desc`
        ? t(`lessons.category.${category.id}.desc`)
        : category.description
      : '';

    return `
      <div class="typing-container">
        <div class="lessons-header" style="margin-bottom: var(--space-6);">
          <button class="btn btn-ghost" id="btn-back-categories" style="margin-bottom: var(--space-2);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            ${t('lessons.back')}
          </button>
          <h1>${categoryName}</h1>
          <p style="color: var(--text-secondary); margin-top: var(--space-2);">${categoryDesc}</p>
        </div>

        <div class="lessons-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3);">
          ${lessons.map((lesson, index) => this.renderLessonCard(lesson, index)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render a lesson card
   */
  private renderLessonCard(lesson: Lesson, index: number): string {
    const isCompleted = LessonService.isLessonCompleted(lesson.id);
    const difficultyLabel = this.getTranslatedDifficultyLabel(lesson.level);
    const exerciseCount = lesson.exercises.length;

    // Get translated title and description
    const titleKey = `lessons.${lesson.id}.title`;
    const descKey = `lessons.${lesson.id}.desc`;
    const translatedTitle = t(titleKey) !== titleKey ? t(titleKey) : lesson.title;
    const translatedDesc = t(descKey) !== descKey ? t(descKey) : lesson.description;

    const statusIcon = isCompleted
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="20,6 9,17 4,12"></polyline></svg>'
      : `<span style="color: var(--text-muted); font-size: 12px;">${index + 1}</span>`;

    // Compact card layout for grid display
    return `
      <div class="card lesson-card ${isCompleted ? 'completed' : ''}" data-lesson-id="${lesson.id}" role="button" tabindex="0" style="cursor: pointer; padding: var(--space-3); -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; display: flex; flex-direction: column; gap: var(--space-2);">
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <div style="width: 28px; height: 28px; border-radius: 50%; background: ${isCompleted ? 'var(--success-bg)' : 'var(--bg-tertiary)'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${statusIcon}
          </div>
          <h4 style="margin: 0; font-size: 14px; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${translatedTitle}</h4>
        </div>
        <p style="margin: 0; font-size: 12px; color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">${translatedDesc}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
          <span class="badge" style="background: var(--bg-tertiary); color: var(--text-secondary); padding: 2px 6px; border-radius: var(--radius-sm); font-size: 10px;">${difficultyLabel}</span>
          <span style="font-size: 10px; color: var(--text-muted);">${t('lessons.exercisesCount', { count: exerciseCount })}</span>
        </div>
      </div>
    `;
  }

  /**
   * Get translated difficulty label based on level
   */
  private getTranslatedDifficultyLabel(level: number): string {
    if (level <= 1) {
      return t('lessons.difficulty.beginner');
    }
    if (level <= 2) {
      return t('lessons.difficulty.easy');
    }
    if (level <= 3) {
      return t('lessons.difficulty.medium');
    }
    if (level <= 5) {
      return t('lessons.difficulty.hard');
    }
    return t('lessons.difficulty.expert');
  }

  /**
   * Render exercise view (typing practice)
   */
  private renderExerciseView(): string {
    const lesson = LessonService.getCurrentLesson();
    const exercise = LessonService.getCurrentExercise();
    const currentIndex = LessonService.getCurrentExerciseIndex();
    const totalExercises = LessonService.getTotalExercisesCount();

    if (!lesson || !exercise) {
      return this.renderCategoriesView();
    }

    // Get translated lesson title
    const titleKey = `lessons.${lesson.id}.title`;
    const translatedTitle = t(titleKey) !== titleKey ? t(titleKey) : lesson.title;

    return `
      <div class="typing-container">
        <div class="exercise-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
          <div>
            <button class="btn btn-ghost" id="btn-quit-lesson" style="margin-bottom: var(--space-2);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              ${t('lessons.quit')}
            </button>
            <h2 style="margin: 0;">${translatedTitle}</h2>
            <p style="color: var(--text-secondary); margin: var(--space-1) 0 0 0;">${t('lessons.exerciseOf', { current: currentIndex + 1, total: totalExercises })}</p>
          </div>
          <div style="display: flex; gap: var(--space-2);">
            <button id="btn-skip-exercise" class="btn btn-secondary">${t('lessons.skip')}</button>
          </div>
        </div>

        <div class="progress-bar" style="margin-bottom: var(--space-4); height: 6px;">
          <div class="progress-bar-fill" id="lesson-progress-fill" style="width: ${(currentIndex / totalExercises) * 100}%;"></div>
        </div>

        ${exercise.description ? `<p style="color: var(--text-secondary); margin-bottom: var(--space-4); font-style: italic;">${exercise.description}</p>` : ''}

        <div id="typing-display" class="typing-text-display">
          <p style="color: var(--text-muted); text-align: center; padding: var(--space-8);">
            ${t('lessons.pressToStart')}
          </p>
        </div>

        <div class="stats-panel" style="margin: var(--space-6) 0;">
          <div class="stat-card">
            <span class="stat-card-value" id="session-wpm">0</span>
            <span class="stat-card-label">${t('common.wpm')}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value" id="session-accuracy">100%</span>
            <span class="stat-card-label">${t('common.accuracy')}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value" id="session-time">0:00</span>
            <span class="stat-card-label">${t('common.time')}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value" id="session-errors">0</span>
            <span class="stat-card-label">${t('common.errors')}</span>
          </div>
        </div>

        <div class="keyboard-container" id="keyboard"></div>

        <div style="text-align: center; margin-top: var(--space-4);">
          <p style="font-size: var(--font-sm); color: var(--text-muted);">
            ${t('lessons.goal', { wpm: lesson.targetWPM ?? 20, accuracy: lesson.targetAccuracy ?? 85 })}
          </p>
        </div>
      </div>
    `;
  }

  // Bound event delegation handler
  private boundContainerClickHandler: ((e: Event) => void) | null = null;

  /**
   * Initialize the page after rendering
   */
  init(): void {
    this.setupEventDelegation();
    this.setupOtherButtonHandlers();

    if (this.currentView === 'exercise') {
      this.initExerciseView();
    }
  }

  /**
   * Setup event delegation for clicks on category and lesson cards
   * This is more robust than direct handlers as it doesn't require the elements to exist at setup time
   */
  private setupEventDelegation(): void {
    // Remove any existing handler first
    this.removeEventDelegation();

    // Find the container - it could be .typing-container or the main element
    const container =
      document.querySelector('.typing-container') || document.querySelector('.app-main');
    if (!container) {
      console.warn('[LessonsPage] Container not found for event delegation');
      return;
    }

    this.boundContainerClickHandler = (e: Event) => {
      const target = e.target as HTMLElement;

      // Find the closest category-card or lesson-card
      const categoryCard = target.closest('.category-card') as HTMLElement;
      const lessonCard = target.closest('.lesson-card') as HTMLElement;

      if (categoryCard) {
        const categoryId = categoryCard.getAttribute('data-category');
        if (categoryId) {
          e.preventDefault();
          e.stopPropagation();
          this.selectCategory(categoryId);
        }
      } else if (lessonCard) {
        const lessonId = lessonCard.getAttribute('data-lesson-id');
        if (lessonId) {
          e.preventDefault();
          e.stopPropagation();
          this.startLesson(lessonId);
        }
      }
    };

    container.addEventListener('click', this.boundContainerClickHandler);

    // Also add keyboard handler for accessibility
    container.addEventListener('keydown', (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      if (keyEvent.key !== 'Enter' && keyEvent.key !== ' ') {
        return;
      }

      const target = keyEvent.target as HTMLElement;
      const categoryCard = target.closest('.category-card') as HTMLElement;
      const lessonCard = target.closest('.lesson-card') as HTMLElement;

      if (categoryCard) {
        const categoryId = categoryCard.getAttribute('data-category');
        if (categoryId) {
          e.preventDefault();
          this.selectCategory(categoryId);
        }
      } else if (lessonCard) {
        const lessonId = lessonCard.getAttribute('data-lesson-id');
        if (lessonId) {
          e.preventDefault();
          this.startLesson(lessonId);
        }
      }
    });
  }

  /**
   * Remove event delegation handler
   */
  private removeEventDelegation(): void {
    if (this.boundContainerClickHandler) {
      const container =
        document.querySelector('.typing-container') || document.querySelector('.app-main');
      if (container) {
        container.removeEventListener('click', this.boundContainerClickHandler);
      }
      this.boundContainerClickHandler = null;
    }
  }

  /**
   * Setup other button handlers (back, quit, skip)
   */
  private setupOtherButtonHandlers(): void {
    // Back button
    const backBtn = document.getElementById('btn-back-categories');
    if (backBtn) {
      backBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.currentView = 'categories';
        this.rerender();
      });
    }

    // Quit button
    const quitBtn = document.getElementById('btn-quit-lesson');
    if (quitBtn) {
      quitBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.quitLesson();
      });
    }

    // Skip button
    const skipBtn = document.getElementById('btn-skip-exercise');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        this.skipExercise();
      });
    }
  }

  /**
   * Select a category
   */
  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentView = 'lessons';
    this.rerender();
  }

  /**
   * Start a lesson
   */
  startLesson(lessonId: string): void {
    const lesson = LessonService.startLesson(lessonId);
    if (lesson) {
      this.currentView = 'exercise';
      this.rerender();
    }
  }

  /**
   * Initialize exercise view
   */
  private initExerciseView(): void {
    const exercise = LessonService.getCurrentExercise();
    if (!exercise) {
      return;
    }

    // Initialize keyboard
    try {
      this.keyboard = new VirtualKeyboard('keyboard');
    } catch (e) {
      console.error('Failed to initialize keyboard:', e);
    }

    // Render text display
    this.renderTextDisplay(exercise.text);

    // Highlight first key
    if (exercise.text.length > 0) {
      this.keyboard?.highlightNextKey(exercise.text[0]);
    }

    // Setup keyboard input
    this.setupKeyboardInput(exercise);
  }

  /**
   * Render text display
   */
  private renderTextDisplay(text: string): void {
    const display = document.getElementById('typing-display');
    if (!display) {
      return;
    }

    display.innerHTML = text
      .split('')
      .map((char, index) => {
        const displayChar = char === ' ' ? '&nbsp;' : this.escapeHtml(char);
        const className = index === 0 ? 'typing-char current' : 'typing-char upcoming';
        return `<span class="${className}" data-index="${index}">${displayChar}</span>`;
      })
      .join('');
  }

  /**
   * Setup keyboard input
   */
  private setupKeyboardInput(exercise: Exercise): void {
    // Remove any existing handler first to prevent duplicates
    this.removeKeyboardInput();

    let sessionStarted = false;
    let currentPosition = 0;

    this.boundKeydownHandler = (event: KeyboardEvent): void => {
      if (Store.getState().isModalOpen) {
        return;
      }

      // Ignore modifier keys
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(event.key)) {
        return;
      }

      // Handle Backspace key - allow correction
      if (event.key === 'Backspace') {
        event.preventDefault();
        if (sessionStarted) {
          const result = TypingEngineService.handleBackspace();
          if (result) {
            currentPosition = result.newPosition;
            this.handleBackspaceDisplay(currentPosition, exercise.text.length);
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
        return;
      }

      // Only process single character keys (letters, numbers, symbols) and space
      // Ignore keys like Tab, Enter, Escape, Arrow keys, etc.
      if (event.key.length !== 1 && event.key !== ' ') {
        return;
      }

      // Prevent default for typing keys
      event.preventDefault();

      // Start session on first keystroke
      if (!sessionStarted && event.key.length === 1) {
        sessionStarted = true;
        TypingEngineService.startSession(
          LessonService.getCurrentLesson()?.id ?? 'lesson',
          exercise.id,
          exercise.text
        );
        this.startTimeUpdate();
      }

      // Process keystroke
      if (sessionStarted) {
        const result = TypingEngineService.processKeystroke(event.key, event.code);

        if (result) {
          this.updateTypingDisplay(currentPosition, result.isCorrect);
          currentPosition++;

          if (result.isCorrect) {
            this.keyboard?.showCorrect(event.code);
          } else {
            this.keyboard?.showIncorrect(event.code);
          }

          this.updateStatsDisplay();

          // Highlight next key
          const nextChar = TypingEngineService.getCurrentExpectedChar();
          if (nextChar) {
            this.keyboard?.highlightNextKey(nextChar);
          }
        }
      }
    };

    document.addEventListener('keydown', this.boundKeydownHandler);
  }

  /**
   * Handle backspace display update
   */
  private handleBackspaceDisplay(newPosition: number, textLength: number): void {
    const display = document.getElementById('typing-display');
    if (!display) {
      return;
    }

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

    // Update progress bar
    const progressBar = document.getElementById('lesson-progress-fill');
    if (progressBar) {
      const baseProgress =
        (LessonService.getCurrentExerciseIndex() / LessonService.getTotalExercisesCount()) * 100;
      const exerciseProgress =
        ((newPosition / textLength) * 100) / LessonService.getTotalExercisesCount();
      progressBar.style.width = `${baseProgress + exerciseProgress}%`;
    }
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
   * Update typing display
   */
  private updateTypingDisplay(position: number, isCorrect: boolean): void {
    const display = document.getElementById('typing-display');
    if (!display) {
      return;
    }

    const charElements = display.querySelectorAll('.typing-char');
    const currentCharEl = charElements[position];

    if (currentCharEl) {
      currentCharEl.classList.remove('current');
      currentCharEl.classList.add(isCorrect ? 'correct' : 'incorrect');
    }

    // Highlight next character
    if (position + 1 < charElements.length) {
      const nextCharEl = charElements[position + 1];
      nextCharEl.classList.remove('upcoming');
      nextCharEl.classList.add('current');
    }

    // Update progress bar
    const exercise = LessonService.getCurrentExercise();
    if (exercise) {
      const progress = ((position + 1) / exercise.text.length) * 100;
      const progressBar = document.getElementById('lesson-progress-fill');
      if (progressBar) {
        const baseProgress =
          (LessonService.getCurrentExerciseIndex() / LessonService.getTotalExercisesCount()) * 100;
        const exerciseProgress = (progress / 100) * (100 / LessonService.getTotalExercisesCount());
        progressBar.style.width = `${baseProgress + exerciseProgress}%`;
      }
    }
  }

  /**
   * Update stats display
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
   * Handle exercise complete
   */
  private handleExerciseComplete(): void {
    this.stopTimeUpdate();

    const state = Store.getState();
    const time = TypingEngineService.getElapsedTime();

    // Record exercise result
    const exercise = LessonService.getCurrentExercise();
    if (exercise) {
      const isLessonComplete = LessonService.completeExercise({
        exerciseId: exercise.id,
        wpm: state.liveWPM,
        accuracy: state.liveAccuracy,
        time,
        errors: TypingEngineService.getErrorCount(),
      });

      if (!isLessonComplete) {
        // Move to next exercise
        setTimeout(() => {
          this.loadNextExercise();
        }, 1000);
      }
    }
  }

  /**
   * Load next exercise
   */
  private loadNextExercise(): void {
    const exercise = LessonService.getCurrentExercise();
    if (!exercise) {
      return;
    }

    TypingEngineService.endSession();
    this.renderTextDisplay(exercise.text);

    // Reset stats display
    const wpmEl = document.getElementById('session-wpm');
    const accuracyEl = document.getElementById('session-accuracy');
    const timeEl = document.getElementById('session-time');
    const errorsEl = document.getElementById('session-errors');

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

    // Update progress
    const progressBar = document.getElementById('lesson-progress-fill');
    if (progressBar) {
      const progress =
        (LessonService.getCurrentExerciseIndex() / LessonService.getTotalExercisesCount()) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Highlight first key
    if (exercise.text.length > 0) {
      this.keyboard?.highlightNextKey(exercise.text[0]);
    }

    // Setup keyboard handler for the new exercise
    this.setupKeyboardInput(exercise);

    // Update exercise counter
    const currentIndex = LessonService.getCurrentExerciseIndex();
    const totalExercises = LessonService.getTotalExercisesCount();
    const exerciseInfo = document.querySelector('.exercise-header p');
    if (exerciseInfo) {
      exerciseInfo.textContent = t('lessons.exerciseOf', {
        current: currentIndex + 1,
        total: totalExercises,
      });
    }
  }

  /**
   * Handle lesson complete
   */
  private handleLessonComplete(result: {
    passed: boolean;
    wpm: number;
    accuracy: number;
    xpEarned: number;
  }): void {
    this.stopTimeUpdate();

    EventBus.emit('ui:toast', {
      message: result.passed
        ? t('lessons.passed', { wpm: result.wpm, accuracy: result.accuracy, xp: result.xpEarned })
        : t('lessons.ended', { wpm: result.wpm, accuracy: result.accuracy }),
      type: result.passed ? 'success' : 'info',
    });

    // Go back to lessons view
    setTimeout(() => {
      this.currentView = 'lessons';
      this.rerender();
    }, 2000);
  }

  /**
   * Skip current exercise
   */
  private skipExercise(): void {
    this.stopTimeUpdate();
    TypingEngineService.endSession();

    const exercise = LessonService.skipExercise();
    if (exercise) {
      this.loadNextExercise();
    }
  }

  /**
   * Quit current lesson
   */
  private quitLesson(): void {
    this.stopTimeUpdate();
    TypingEngineService.endSession();
    LessonService.quitLesson();

    this.currentView = 'lessons';
    this.rerender();
  }

  /**
   * Re-render the page
   */
  private rerender(): void {
    EventBus.emit('nav:change', { page: 'lessons' });
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
    this.removeKeyboardInput();
    this.removeEventDelegation();
    this.keyboard?.destroy();
    TypingEngineService.endSession();

    // Unsubscribe from all EventBus events to prevent duplicate handlers
    this.eventSubscriptions.forEach(sub => sub.unsubscribe());
    this.eventSubscriptions.length = 0;
  }
}
