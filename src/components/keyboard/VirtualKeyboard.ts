import { EventBus } from '../../core';
import { KeyDefinition, QWERTZ_LAYOUT, findKeyByChar, requiresShift } from '../../domain/models';

/**
 * Virtual Keyboard Component
 * Renders and manages the on-screen keyboard visualization
 */
export class VirtualKeyboard {
  private readonly container: HTMLElement;
  private readonly keyElements: Map<string, HTMLElement> = new Map();
  private currentHighlight: string | null = null;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) {
      throw new Error(`Keyboard container "${containerId}" not found`);
    }
    this.container = el;
    this.init();
  }

  /**
   * Initialize the keyboard
   */
  private init(): void {
    this.render();
    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    EventBus.on('ui:keyboard:highlight', ({ keyId }) => {
      this.highlightKey(keyId);
    });

    EventBus.on('ui:keyboard:clear', () => {
      this.clearHighlight();
    });
  }

  /**
   * Render the keyboard
   */
  render(): void {
    const layout = QWERTZ_LAYOUT;

    this.container.innerHTML = `
      <div class="keyboard" role="img" aria-label="Virtual keyboard">
        ${layout.rows.map((row, rowIndex) => this.renderRow(row, rowIndex)).join('')}
      </div>
    `;

    // Cache key elements
    this.cacheKeyElements();
  }

  /**
   * Render a single row
   */
  private renderRow(keys: KeyDefinition[], rowIndex: number): string {
    return `
      <div class="keyboard-row" data-row="${rowIndex}">
        ${keys.map(key => this.renderKey(key)).join('')}
      </div>
    `;
  }

  /**
   * Render a single key
   */
  private renderKey(key: KeyDefinition): string {
    const widthClass = this.getWidthClass(key);
    const displayText = this.getKeyDisplayText(key);

    // Only show secondary text if shiftKey is NOT just the uppercase version of key
    // This prevents duplicate display for letters (e.g., showing both 'Q' and 'Q')
    // but keeps it for numbers/symbols (e.g., showing '!' above '1')
    const isUppercaseVariant = key.shiftKey && key.shiftKey.toLowerCase() === key.key.toLowerCase();
    const secondaryText =
      key.shiftKey && !isUppercaseVariant
        ? `<span class="key-secondary">${key.shiftKey}</span>`
        : '';

    return `
      <div 
        class="key ${widthClass}"
        data-key-id="${key.id}"
        data-code="${key.code}"
        data-finger="${key.finger}"
        data-hand="${key.hand}"
      >
        ${secondaryText}
        <span class="key-primary">${displayText}</span>
      </div>
    `;
  }

  /**
   * Get width class for special keys
   */
  private getWidthClass(key: KeyDefinition): string {
    if (!key.width || key.width === 1) {
      return '';
    }

    const widthClasses: Record<string, string> = {
      Backspace: 'key-backspace',
      Tab: 'key-tab',
      CapsLock: 'key-caps',
      Enter: 'key-enter',
    };

    if (widthClasses[key.key]) {
      return widthClasses[key.key];
    }

    if (key.code === 'ShiftLeft') {
      return 'key-shift-left';
    }
    if (key.code === 'ShiftRight') {
      return 'key-shift-right';
    }
    if (key.code === 'Space') {
      return 'key-space';
    }
    if (key.code.includes('Control')) {
      return 'key-ctrl';
    }
    if (key.code.includes('Alt')) {
      return 'key-alt';
    }
    if (key.code.includes('Meta')) {
      return 'key-cmd';
    }

    return '';
  }

  /**
   * Get display text for key
   */
  private getKeyDisplayText(key: KeyDefinition): string {
    const specialKeys: Record<string, string> = {
      Backspace: '←',
      Tab: '⇥',
      CapsLock: 'Caps',
      Enter: '↵',
      Shift: '⇧',
      Ctrl: 'Ctrl',
      Alt: 'Alt',
      AltGr: 'AltGr',
      Cmd: '⌘',
      Menu: '≡',
      ' ': '',
    };

    return specialKeys[key.key] ?? key.key.toUpperCase();
  }

  /**
   * Cache key elements for quick access
   */
  private cacheKeyElements(): void {
    this.keyElements.clear();
    const keys = this.container.querySelectorAll('.key');
    keys.forEach(keyEl => {
      const keyId = keyEl.getAttribute('data-key-id');
      const code = keyEl.getAttribute('data-code');
      if (keyId) {
        this.keyElements.set(keyId, keyEl as HTMLElement);
      }
      if (code) {
        this.keyElements.set(code, keyEl as HTMLElement);
      }
    });
  }

  /**
   * Highlight a key by code
   */
  highlightKey(code: string): void {
    this.clearHighlight();
    const keyEl = this.keyElements.get(code);
    if (keyEl) {
      keyEl.classList.add('active');
      this.currentHighlight = code;
    }
  }

  /**
   * Highlight the next expected key
   */
  highlightNextKey(char: string): void {
    this.clearAllStates();

    const keyDef = findKeyByChar(QWERTZ_LAYOUT, char);
    if (keyDef) {
      const keyEl = this.keyElements.get(keyDef.id);
      if (keyEl) {
        keyEl.classList.add('highlight');
      }

      // Also highlight shift if needed
      if (requiresShift(QWERTZ_LAYOUT, char)) {
        const shiftEl = this.keyElements.get('ShiftLeft') || this.keyElements.get('ShiftRight');
        if (shiftEl) {
          shiftEl.classList.add('highlight');
        }
      }
    }
  }

  /**
   * Show correct feedback on key
   */
  showCorrect(code: string): void {
    const keyEl = this.keyElements.get(code);
    if (keyEl) {
      keyEl.classList.remove('active', 'highlight');
      keyEl.classList.add('correct');
      setTimeout(() => {
        keyEl.classList.remove('correct');
      }, 200);
    }
  }

  /**
   * Show incorrect feedback on key
   */
  showIncorrect(code: string): void {
    const keyEl = this.keyElements.get(code);
    if (keyEl) {
      keyEl.classList.remove('active', 'highlight');
      keyEl.classList.add('incorrect');
      setTimeout(() => {
        keyEl.classList.remove('incorrect');
      }, 300);
    }
  }

  /**
   * Clear current highlight
   */
  clearHighlight(): void {
    if (this.currentHighlight) {
      const keyEl = this.keyElements.get(this.currentHighlight);
      if (keyEl) {
        keyEl.classList.remove('active');
      }
      this.currentHighlight = null;
    }
  }

  /**
   * Clear all key states
   */
  clearAllStates(): void {
    this.keyElements.forEach(keyEl => {
      keyEl.classList.remove('active', 'highlight', 'correct', 'incorrect');
    });
    this.currentHighlight = null;
  }

  /**
   * Get key element by character
   */
  getKeyByChar(char: string): HTMLElement | undefined {
    const keyDef = findKeyByChar(QWERTZ_LAYOUT, char);
    if (keyDef) {
      return this.keyElements.get(keyDef.id);
    }
    return undefined;
  }

  /**
   * Destroy the keyboard
   */
  destroy(): void {
    this.container.innerHTML = '';
    this.keyElements.clear();
  }
}
