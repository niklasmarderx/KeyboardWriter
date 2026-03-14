import { EventBus, Store } from '../core';
import {
  calculateAccuracy,
  calculateWPM,
  createTypingSession,
  findKeyByChar,
  Keystroke,
  QWERTZ_LAYOUT,
  TypingError,
  TypingSession,
} from '../domain/models';

/**
 * Typing Engine Service
 * Core logic for typing sessions, statistics tracking, and feedback
 */
class TypingEngineServiceImpl {
  private session: TypingSession | null = null;
  private lastKeystrokeTime: number = 0;
  private updateInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Start a new typing session
   */
  startSession(lessonId: string, exerciseId: string, text: string): TypingSession {
    // Clear any existing session
    this.endSession();

    // Create new session
    this.session = createTypingSession(lessonId, exerciseId, text);
    this.lastKeystrokeTime = this.session.startTime;

    // Update store
    Store.setCurrentSession(this.session);

    // Emit event
    EventBus.emit('typing:start', { lessonId, exerciseId });

    // Start live stats update
    this.startLiveStatsUpdate();

    return this.session;
  }

  /**
   * Handle backspace - remove last character and allow correction
   * Returns the new position or null if at start
   */
  handleBackspace(): { newPosition: number; removedKeystroke: Keystroke | null } | null {
    if (!this.session || this.session.isComplete || this.session.isPaused) {
      return null;
    }

    // Can't go back if at the start
    if (this.session.currentPosition === 0) {
      return null;
    }

    // Move position back
    this.session.currentPosition--;
    const newPosition = this.session.currentPosition;

    // Remove the last keystroke
    const removedKeystroke = this.session.keystrokes.pop() ?? null;

    // Remove corresponding error if it exists at this position
    const errorIndex = this.session.errors.findIndex(e => e.position === newPosition);
    if (errorIndex !== -1) {
      this.session.errors.splice(errorIndex, 1);
    }

    // Update store
    Store.setCurrentSession({ ...this.session });

    // Update live stats
    this.updateLiveStats();

    // Emit event
    EventBus.emit('typing:backspace', { position: newPosition });

    return { newPosition, removedKeystroke };
  }

  /**
   * Process a keystroke
   */
  processKeystroke(
    key: string,
    code: string
  ): {
    isCorrect: boolean;
    isComplete: boolean;
    keystroke: Keystroke;
  } | null {
    if (!this.session || this.session.isComplete || this.session.isPaused) {
      return null;
    }

    const now = Date.now();
    const expectedChar = this.session.targetText[this.session.currentPosition];

    // Check if the key matches expected
    const isCorrect = key === expectedChar;

    // Get finger info
    const keyDef = findKeyByChar(QWERTZ_LAYOUT, expectedChar);

    // Create keystroke record
    const keystroke: Keystroke = {
      key,
      code,
      timestamp: now,
      isCorrect,
      expectedKey: expectedChar,
      timeSinceLastKey: now - this.lastKeystrokeTime,
      finger: keyDef?.finger,
    };

    // Add to session
    this.session.keystrokes.push(keystroke);

    // Track error if incorrect
    if (!isCorrect) {
      const error: TypingError = {
        position: this.session.currentPosition,
        expectedChar,
        actualChar: key,
        timestamp: now,
      };
      this.session.errors.push(error);
    }

    // Update position
    this.session.currentPosition++;
    this.lastKeystrokeTime = now;

    // Check if complete
    const isComplete = this.session.currentPosition >= this.session.targetText.length;
    if (isComplete) {
      this.completeSession();
    }

    // Update store
    Store.setCurrentSession({ ...this.session });

    // Update live stats
    this.updateLiveStats();

    return { isCorrect, isComplete, keystroke };
  }

  /**
   * Pause the current session
   */
  pauseSession(): void {
    if (this.session && !this.session.isPaused) {
      this.session.isPaused = true;
      Store.setCurrentSession({ ...this.session });
      this.stopLiveStatsUpdate();
      EventBus.emit('typing:pause', undefined);
    }
  }

  /**
   * Resume the current session
   */
  resumeSession(): void {
    if (this.session && this.session.isPaused) {
      this.session.isPaused = false;
      this.lastKeystrokeTime = Date.now();
      Store.setCurrentSession({ ...this.session });
      this.startLiveStatsUpdate();
      EventBus.emit('typing:resume', undefined);
    }
  }

  /**
   * Complete the current session
   */
  private completeSession(): void {
    if (!this.session) {
      return;
    }

    this.session.isComplete = true;
    this.session.endTime = Date.now();

    this.stopLiveStatsUpdate();

    // Calculate final stats
    const correctCount = this.session.keystrokes.filter(k => k.isCorrect).length;
    const totalTime = this.session.endTime - this.session.startTime;
    const wpm = calculateWPM(correctCount, totalTime);
    const accuracy = calculateAccuracy(correctCount, this.session.keystrokes.length);

    // Emit completion event
    EventBus.emit('typing:complete', {
      wpm,
      accuracy,
      time: totalTime,
    });

    // Update store
    Store.setCurrentSession({ ...this.session });
    Store.updateLiveStats(wpm, accuracy);
  }

  /**
   * End the current session
   */
  endSession(): void {
    this.stopLiveStatsUpdate();
    this.session = null;
    Store.setCurrentSession(null);
    Store.updateLiveStats(0, 100);
  }

  /**
   * Reset the current session (restart)
   */
  resetSession(): void {
    if (this.session) {
      const { lessonId, exerciseId, targetText } = this.session;
      this.endSession();
      this.startSession(lessonId, exerciseId, targetText);
      EventBus.emit('typing:reset', undefined);
    }
  }

  /**
   * Get current session
   */
  getSession(): TypingSession | null {
    return this.session;
  }

  /**
   * Get current expected character
   */
  getCurrentExpectedChar(): string | null {
    if (!this.session || this.session.isComplete) {
      return null;
    }
    return this.session.targetText[this.session.currentPosition];
  }

  /**
   * Get session progress (0-100)
   */
  getProgress(): number {
    if (!this.session || this.session.targetText.length === 0) {
      return 0;
    }
    return Math.round((this.session.currentPosition / this.session.targetText.length) * 100);
  }

  /**
   * Start live statistics update interval
   */
  private startLiveStatsUpdate(): void {
    this.stopLiveStatsUpdate();
    this.updateInterval = setInterval(() => {
      this.updateLiveStats();
    }, 500);
  }

  /**
   * Stop live statistics update
   */
  private stopLiveStatsUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Update live statistics
   */
  private updateLiveStats(): void {
    if (!this.session || this.session.isPaused) {
      return;
    }

    const correctCount = this.session.keystrokes.filter(k => k.isCorrect).length;
    const totalCount = this.session.keystrokes.length;
    const elapsedTime = Date.now() - this.session.startTime;

    const wpm = calculateWPM(correctCount, elapsedTime);
    const accuracy = calculateAccuracy(correctCount, totalCount);

    Store.updateLiveStats(wpm, accuracy);
  }

  /**
   * Get elapsed time in milliseconds
   */
  getElapsedTime(): number {
    if (!this.session) {
      return 0;
    }
    if (this.session.endTime) {
      return this.session.endTime - this.session.startTime;
    }
    return Date.now() - this.session.startTime;
  }

  /**
   * Format elapsed time as string (MM:SS)
   */
  getFormattedTime(): string {
    const ms = this.getElapsedTime();
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get error count
   */
  getErrorCount(): number {
    return this.session?.errors.length ?? 0;
  }

  /**
   * Check if session is active
   */
  isActive(): boolean {
    return this.session !== null && !this.session.isComplete && !this.session.isPaused;
  }

  /**
   * Get current session statistics
   */
  getSessionStats(): {
    wpm: number;
    accuracy: number;
    errorCount: number;
    elapsedTime: number;
  } | null {
    if (!this.session) {
      return null;
    }

    const correctCount = this.session.keystrokes.filter(k => k.isCorrect).length;
    const totalCount = this.session.keystrokes.length;
    const elapsedTime = this.getElapsedTime();

    const wpm = calculateWPM(correctCount, elapsedTime);
    const accuracy = calculateAccuracy(correctCount, totalCount);

    return {
      wpm,
      accuracy,
      errorCount: this.session.errors.length,
      elapsedTime,
    };
  }
}

// Singleton instance
export const TypingEngineService = new TypingEngineServiceImpl();
