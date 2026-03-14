/**
 * Settings Service
 * Manages user preferences and settings
 */

import { Logger } from './Logger';

const logger = Logger.scope('SettingsService');

export interface Settings {
  // Display
  theme: 'dark' | 'light' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  showKeyboardHints: boolean;
  showFingerColors: boolean;

  // Sound
  soundEnabled: boolean;
  soundVolume: number; // 0-100
  keyPressSound: boolean;
  errorSound: boolean;
  successSound: boolean;

  // Typing
  highlightNextKey: boolean;
  showWPM: boolean;
  showAccuracy: boolean;
  showTimer: boolean;
  pauseOnError: boolean;

  // Keyboard
  keyboardLayout: 'qwertz' | 'qwerty';

  // Tests
  defaultTestDuration: 30 | 60 | 120;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  fontSize: 'medium',
  showKeyboardHints: true,
  showFingerColors: true,
  soundEnabled: true,
  soundVolume: 50,
  keyPressSound: false,
  errorSound: true,
  successSound: true,
  highlightNextKey: true,
  showWPM: true,
  showAccuracy: true,
  showTimer: true,
  pauseOnError: false,
  keyboardLayout: 'qwertz',
  defaultTestDuration: 60,
};

const SETTINGS_KEY = 'keyboardwriter_settings';

class SettingsServiceClass {
  private settings: Settings;
  private readonly listeners: Set<(settings: Settings) => void> = new Set();

  constructor() {
    this.settings = this.loadSettings();
    this.applyTheme();
    this.applyFontSize();
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): Settings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored !== null && stored !== '') {
        const parsed = JSON.parse(stored) as Partial<Settings>;
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      logger.error('Failed to load settings:', error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      logger.error('Failed to save settings:', error);
    }
  }

  /**
   * Get current settings
   */
  getSettings(): Settings {
    return { ...this.settings };
  }

  /**
   * Update settings
   */
  updateSettings(updates: Partial<Settings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
    this.notifyListeners();

    // Apply visual changes
    if ('theme' in updates) {
      this.applyTheme();
    }
    if ('fontSize' in updates) {
      this.applyFontSize();
    }
  }

  /**
   * Reset settings to defaults
   */
  resetSettings(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    this.notifyListeners();
    this.applyTheme();
    this.applyFontSize();
  }

  /**
   * Subscribe to settings changes
   */
  subscribe(listener: (settings: Settings) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.settings));
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    const { theme } = this.settings;
    const root = document.documentElement;

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }

  /**
   * Apply font size to document
   */
  private applyFontSize(): void {
    const { fontSize } = this.settings;
    const root = document.documentElement;

    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };

    root.style.setProperty('--base-font-size', sizes[fontSize]);
  }

  /**
   * Play sound effect
   */
  playSound(type: 'keypress' | 'error' | 'success'): void {
    if (!this.settings.soundEnabled) {
      return;
    }

    const shouldPlay = {
      keypress: this.settings.keyPressSound,
      error: this.settings.errorSound,
      success: this.settings.successSound,
    }[type];

    if (shouldPlay !== true) {
      return;
    }

    // Create audio context for sound generation
    try {
      const audioContext = new (
        window.AudioContext ||
        (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const volume = (this.settings.soundVolume / 100) * 0.3;
      gainNode.gain.value = volume;

      const frequencies = {
        keypress: 800,
        error: 200,
        success: 600,
      };

      oscillator.frequency.value = frequencies[type];
      oscillator.type = type === 'error' ? 'sawtooth' : 'sine';

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch {
      // Audio not supported
    }
  }
}

export const SettingsService = new SettingsServiceClass();
