import { EventBus, Store } from '../../core';

/**
 * Typing Area Component
 * Handles the text display and user input for typing practice
 */
export class TypingArea {
  private readonly container: HTMLElement;
  private targetText: string = '';
  private currentPosition: number = 0;
  private charElements: HTMLElement[] = [];

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) {
      throw new Error(`TypingArea container "${containerId}" not found`);
    }
    this.container = el;
  }

  /**
   * Set the text to type
   */
  setText(text: string): void {
    this.targetText = text;
    this.currentPosition = 0;
    this.render();
    this.highlightCurrentChar();
  }

  /**
   * Render the typing area
   */
  render(): void {
    this.container.innerHTML = '';
    this.charElements = [];

    for (let i = 0; i < this.targetText.length; i++) {
      const char = this.targetText[i];
      const span = document.createElement('span');
      span.className = 'typing-char upcoming';
      span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for visibility
      span.dataset.index = String(i);
      this.container.appendChild(span);
      this.charElements.push(span);
    }
  }

  /**
   * Handle backspace - allow correction of mistakes
   * Returns true if backspace was processed, false if at start
   */
  handleBackspace(): boolean {
    if (this.currentPosition === 0) {
      return false;
    }

    // Move position back
    this.currentPosition--;

    // Reset the character at the current position
    const charEl = this.charElements[this.currentPosition];
    if (charEl) {
      charEl.classList.remove('correct', 'incorrect', 'upcoming');
      charEl.classList.add('current');
    }

    // Reset the next character to upcoming (if exists)
    if (this.currentPosition + 1 < this.charElements.length) {
      const nextCharEl = this.charElements[this.currentPosition + 1];
      if (nextCharEl) {
        nextCharEl.classList.remove('current');
        nextCharEl.classList.add('upcoming');
      }
    }

    // Emit backspace event
    EventBus.emit('typing:backspace', { position: this.currentPosition });

    return true;
  }

  /**
   * Process a keystroke
   */
  processKeystroke(key: string, _code: string): { isCorrect: boolean; isComplete: boolean } {
    if (this.currentPosition >= this.targetText.length) {
      return { isCorrect: false, isComplete: true };
    }

    const expectedChar = this.targetText[this.currentPosition];
    const isCorrect = key === expectedChar;
    const charEl = this.charElements[this.currentPosition];

    if (charEl) {
      charEl.classList.remove('upcoming', 'current');
      charEl.classList.add(isCorrect ? 'correct' : 'incorrect');
    }

    // Emit keystroke event
    EventBus.emit('typing:keystroke', {
      key,
      isCorrect,
      position: this.currentPosition,
    });

    this.currentPosition++;

    // Check if complete
    const isComplete = this.currentPosition >= this.targetText.length;

    if (isComplete) {
      // Session complete
      const state = Store.getState();
      EventBus.emit('typing:complete', {
        wpm: state.liveWPM,
        accuracy: state.liveAccuracy,
        time: 0, // Will be calculated by engine
      });
    } else {
      // Highlight next character
      this.highlightCurrentChar();
    }

    return { isCorrect, isComplete };
  }

  /**
   * Highlight the current character
   */
  private highlightCurrentChar(): void {
    if (this.currentPosition < this.charElements.length) {
      const charEl = this.charElements[this.currentPosition];
      if (charEl) {
        charEl.classList.remove('upcoming');
        charEl.classList.add('current');
      }
    }
  }

  /**
   * Get the current expected character
   */
  getCurrentChar(): string | null {
    if (this.currentPosition >= this.targetText.length) {
      return null;
    }
    return this.targetText[this.currentPosition];
  }

  /**
   * Get current position
   */
  getPosition(): number {
    return this.currentPosition;
  }

  /**
   * Get total length
   */
  getTotalLength(): number {
    return this.targetText.length;
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    if (this.targetText.length === 0) {
      return 0;
    }
    return Math.round((this.currentPosition / this.targetText.length) * 100);
  }

  /**
   * Reset the typing area
   */
  reset(): void {
    this.currentPosition = 0;
    this.charElements.forEach(el => {
      el.classList.remove('correct', 'incorrect', 'current');
      el.classList.add('upcoming');
    });
    this.highlightCurrentChar();
  }

  /**
   * Clear the typing area
   */
  clear(): void {
    this.container.innerHTML = '';
    this.targetText = '';
    this.currentPosition = 0;
    this.charElements = [];
  }

  /**
   * Check if typing is complete
   */
  isComplete(): boolean {
    return this.currentPosition >= this.targetText.length;
  }
}
