/**
 * ExerciseModeService - Manages different exercise modes
 * Implements: Dictation, Blind Typing, Time Pressure, Error Correction, Warmup, Endurance
 */

import { EventBus } from '../core';
import { SettingsService } from '../core/SettingsService';
import {
  EXERCISE_MODE_CONFIGS,
  ExerciseMode,
  ExerciseModeConfig,
} from '../domain/enums/ExerciseMode';

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Dictation mode state
 */
export interface DictationState {
  originalText: string;
  isTextVisible: boolean;
  showDurationMs: number;
  hideTimeout: ReturnType<typeof setTimeout> | null;
  memorizedChunks: string[];
  currentChunkIndex: number;
}

/**
 * Time pressure mode state
 */
export interface TimePressureState {
  timeLimit: number; // seconds
  timeRemaining: number; // seconds
  isRunning: boolean;
  interval: ReturnType<typeof setInterval> | null;
  targetWPM: number;
  bonusTimePerWord: number; // extra seconds per correct word
}

/**
 * Error correction mode state
 */
export interface ErrorCorrectionState {
  originalText: string;
  corruptedText: string;
  errorPositions: number[];
  correctedPositions: number[];
  currentPosition: number;
  hintsUsed: number;
  maxHints: number;
}

/**
 * Warmup exercise
 */
export interface WarmupExercise {
  id: string;
  name: string;
  nameEn: string;
  text: string;
  textEn: string;
  duration: number; // seconds
  focusKeys?: string[];
}

/**
 * Session state for any mode
 */
export interface ExerciseModeSession {
  mode: ExerciseMode;
  startTime: number;
  isActive: boolean;
  isPaused: boolean;
  dictationState?: DictationState;
  timePressureState?: TimePressureState;
  errorCorrectionState?: ErrorCorrectionState;
  keyboardVisible: boolean;
}

/**
 * Error correction result
 */
export interface ErrorCorrectionResult {
  totalErrors: number;
  errorsFound: number;
  errorsMissed: number;
  falsePositives: number;
  accuracy: number;
  timeMs: number;
  hintsUsed: number;
}

// ============================================================================
// Warmup Exercises Data
// ============================================================================

const WARMUP_EXERCISES: WarmupExercise[] = [
  {
    id: 'warmup-home-row',
    name: 'Grundstellung',
    nameEn: 'Home Row',
    text: 'asdf jklö asdf jklö asdf jklö asdf jklö',
    textEn: 'asdf jkl; asdf jkl; asdf jkl; asdf jkl;',
    duration: 30,
    focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
  },
  {
    id: 'warmup-fingers-stretch',
    name: 'Finger dehnen',
    nameEn: 'Finger Stretch',
    text: 'qwertz uiop qwertz uiop qwertz uiop',
    textEn: 'qwerty uiop qwerty uiop qwerty uiop',
    duration: 30,
    focusKeys: ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
  },
  {
    id: 'warmup-alternating',
    name: 'Handwechsel',
    nameEn: 'Alternating Hands',
    text: 'aj sk dl fö aj sk dl fö aj sk dl fö',
    textEn: 'aj sk dl f; aj sk dl f; aj sk dl f;',
    duration: 30,
    focusKeys: ['a', 'j', 's', 'k', 'd', 'l', 'f'],
  },
  {
    id: 'warmup-common-words',
    name: 'Häufige Wörter',
    nameEn: 'Common Words',
    text: 'der die das und ist ein eine der die das und ist ein eine',
    textEn: 'the and is a to of in it for the and is a to of in it for',
    duration: 45,
  },
  {
    id: 'warmup-numbers',
    name: 'Zahlenreihe',
    nameEn: 'Number Row',
    text: '1234567890 1234567890 1234567890',
    textEn: '1234567890 1234567890 1234567890',
    duration: 30,
    focusKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  },
];

// ============================================================================
// Error Patterns for Error Correction Mode
// ============================================================================

interface ErrorPattern {
  original: string;
  typo: string;
  type: 'swap' | 'missing' | 'extra' | 'wrong';
}

const COMMON_TYPOS: ErrorPattern[] = [
  // Character swaps
  { original: 'the', typo: 'teh', type: 'swap' },
  { original: 'and', typo: 'adn', type: 'swap' },
  { original: 'with', typo: 'wiht', type: 'swap' },
  { original: 'that', typo: 'taht', type: 'swap' },
  { original: 'have', typo: 'hvae', type: 'swap' },
  // Missing characters
  { original: 'because', typo: 'becuse', type: 'missing' },
  { original: 'different', typo: 'diferent', type: 'missing' },
  { original: 'important', typo: 'importnt', type: 'missing' },
  // Extra characters
  { original: 'which', typo: 'whiich', type: 'extra' },
  { original: 'would', typo: 'wouldd', type: 'extra' },
  // Wrong characters
  { original: 'their', typo: 'thier', type: 'wrong' },
  { original: 'receive', typo: 'recieve', type: 'wrong' },
  { original: 'believe', typo: 'beleive', type: 'wrong' },
];

// ============================================================================
// ExerciseModeService Implementation
// ============================================================================

class ExerciseModeServiceImpl {
  private currentSession: ExerciseModeSession | null = null;

  // --------------------------------------------------------------------------
  // Mode Configuration
  // --------------------------------------------------------------------------

  /**
   * Get configuration for a specific mode
   */
  getModeConfig(mode: ExerciseMode): ExerciseModeConfig {
    return EXERCISE_MODE_CONFIGS[mode];
  }

  /**
   * Get all available modes
   */
  getAllModes(): ExerciseModeConfig[] {
    return Object.values(EXERCISE_MODE_CONFIGS);
  }

  /**
   * Get modes by difficulty
   */
  getModesByDifficulty(
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  ): ExerciseModeConfig[] {
    return this.getAllModes().filter(config => config.difficulty === difficulty);
  }

  /**
   * Get localized mode name
   */
  getModeName(mode: ExerciseMode): string {
    const config = this.getModeConfig(mode);
    const lang = SettingsService.getExerciseLanguage();
    return lang === 'en' ? config.nameEn : config.name;
  }

  /**
   * Get localized mode description
   */
  getModeDescription(mode: ExerciseMode): string {
    const config = this.getModeConfig(mode);
    const lang = SettingsService.getExerciseLanguage();
    return lang === 'en' ? config.descriptionEn : config.description;
  }

  // --------------------------------------------------------------------------
  // Session Management
  // --------------------------------------------------------------------------

  /**
   * Start a new exercise mode session
   */
  startSession(mode: ExerciseMode): ExerciseModeSession {
    // End any existing session
    this.endSession();

    const config = this.getModeConfig(mode);

    this.currentSession = {
      mode,
      startTime: Date.now(),
      isActive: true,
      isPaused: false,
      keyboardVisible: config.requiresKeyboardVisible !== false,
    };

    // Initialize mode-specific state
    switch (mode) {
      case ExerciseMode.DICTATION:
        this.initDictationMode();
        break;
      case ExerciseMode.BLIND_TYPING:
        this.currentSession.keyboardVisible = false;
        break;
      case ExerciseMode.TIME_PRESSURE:
        this.initTimePressureMode(config.timeLimitSeconds ?? 30);
        break;
      case ExerciseMode.ERROR_CORRECTION:
        // Will be initialized when text is provided
        break;
      default:
        break;
    }

    EventBus.emit('exerciseMode:start', { mode });
    return this.currentSession;
  }

  /**
   * End the current session
   */
  endSession(): void {
    if (!this.currentSession) {
      return;
    }

    // Clean up mode-specific resources
    if (this.currentSession.dictationState?.hideTimeout) {
      clearTimeout(this.currentSession.dictationState.hideTimeout);
    }
    if (this.currentSession.timePressureState?.interval) {
      clearInterval(this.currentSession.timePressureState.interval);
    }

    const mode = this.currentSession.mode;
    this.currentSession = null;

    EventBus.emit('exerciseMode:end', { mode });
  }

  /**
   * Get current session
   */
  getSession(): ExerciseModeSession | null {
    return this.currentSession;
  }

  /**
   * Check if keyboard should be visible
   */
  isKeyboardVisible(): boolean {
    return this.currentSession?.keyboardVisible ?? true;
  }

  // --------------------------------------------------------------------------
  // Dictation Mode
  // --------------------------------------------------------------------------

  /**
   * Initialize dictation mode
   */
  private initDictationMode(): void {
    if (!this.currentSession) {
      return;
    }

    this.currentSession.dictationState = {
      originalText: '',
      isTextVisible: false,
      showDurationMs: 5000, // 5 seconds default
      hideTimeout: null,
      memorizedChunks: [],
      currentChunkIndex: 0,
    };
  }

  /**
   * Set text for dictation mode
   */
  setDictationText(text: string, showDurationMs: number = 5000): void {
    if (!this.currentSession?.dictationState) {
      return;
    }

    // Split into chunks (sentences or phrases)
    const chunks = this.splitIntoChunks(text);

    this.currentSession.dictationState = {
      ...this.currentSession.dictationState,
      originalText: text,
      showDurationMs,
      memorizedChunks: chunks,
      currentChunkIndex: 0,
      isTextVisible: false,
    };
  }

  /**
   * Split text into memorizable chunks
   */
  private splitIntoChunks(text: string): string[] {
    // Split by sentences or by ~50 character chunks
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];

    for (const sentence of sentences) {
      if (sentence.length <= 50) {
        chunks.push(sentence.trim());
      } else {
        // Split long sentences into smaller chunks
        const words = sentence.split(' ');
        let chunk = '';
        for (const word of words) {
          if ((chunk + ' ' + word).length > 50) {
            if (chunk) {
              chunks.push(chunk.trim());
            }
            chunk = word;
          } else {
            chunk += (chunk ? ' ' : '') + word;
          }
        }
        if (chunk) {
          chunks.push(chunk.trim());
        }
      }
    }

    return chunks;
  }

  /**
   * Show current dictation chunk
   */
  showDictationChunk(): string | null {
    if (!this.currentSession?.dictationState) {
      return null;
    }

    const state = this.currentSession.dictationState;
    if (state.currentChunkIndex >= state.memorizedChunks.length) {
      return null;
    }

    const chunk = state.memorizedChunks[state.currentChunkIndex];
    state.isTextVisible = true;

    // Auto-hide after duration
    if (state.hideTimeout) {
      clearTimeout(state.hideTimeout);
    }
    state.hideTimeout = setTimeout(() => {
      this.hideDictationChunk();
    }, state.showDurationMs);

    EventBus.emit('dictation:show', { chunk, index: state.currentChunkIndex });
    return chunk;
  }

  /**
   * Hide current dictation chunk
   */
  hideDictationChunk(): void {
    if (!this.currentSession?.dictationState) {
      return;
    }

    this.currentSession.dictationState.isTextVisible = false;
    EventBus.emit('dictation:hide', {
      index: this.currentSession.dictationState.currentChunkIndex,
    });
  }

  /**
   * Move to next dictation chunk
   */
  nextDictationChunk(): boolean {
    if (!this.currentSession?.dictationState) {
      return false;
    }

    const state = this.currentSession.dictationState;
    if (state.currentChunkIndex >= state.memorizedChunks.length - 1) {
      return false;
    }

    state.currentChunkIndex++;
    return true;
  }

  /**
   * Get dictation state
   */
  getDictationState(): DictationState | null {
    return this.currentSession?.dictationState ?? null;
  }

  // --------------------------------------------------------------------------
  // Time Pressure Mode
  // --------------------------------------------------------------------------

  /**
   * Initialize time pressure mode
   */
  private initTimePressureMode(timeLimit: number): void {
    if (!this.currentSession) {
      return;
    }

    this.currentSession.timePressureState = {
      timeLimit,
      timeRemaining: timeLimit,
      isRunning: false,
      interval: null,
      targetWPM: 40,
      bonusTimePerWord: 0.5,
    };
  }

  /**
   * Start the countdown timer
   */
  startTimePressureTimer(): void {
    if (!this.currentSession?.timePressureState) {
      return;
    }

    const state = this.currentSession.timePressureState;
    if (state.isRunning) {
      return;
    }

    state.isRunning = true;
    state.interval = setInterval(() => {
      this.updateTimePressure();
    }, 100); // Update every 100ms for smooth countdown

    EventBus.emit('timePressure:start', { timeLimit: state.timeLimit });
  }

  /**
   * Update time pressure countdown
   */
  private updateTimePressure(): void {
    if (!this.currentSession?.timePressureState) {
      return;
    }

    const state = this.currentSession.timePressureState;
    state.timeRemaining -= 0.1;

    // Emit event for UI updates
    EventBus.emit('timePressure:tick', { timeRemaining: state.timeRemaining });

    if (state.timeRemaining <= 0) {
      this.stopTimePressureTimer();
      EventBus.emit('timePressure:timeout', undefined);
    }
  }

  /**
   * Stop the countdown timer
   */
  stopTimePressureTimer(): void {
    if (!this.currentSession?.timePressureState) {
      return;
    }

    const state = this.currentSession.timePressureState;
    state.isRunning = false;

    if (state.interval) {
      clearInterval(state.interval);
      state.interval = null;
    }

    EventBus.emit('timePressure:stop', { timeRemaining: state.timeRemaining });
  }

  /**
   * Add bonus time for completing a word
   */
  addBonusTime(words: number = 1): void {
    if (!this.currentSession?.timePressureState) {
      return;
    }

    const state = this.currentSession.timePressureState;
    const bonus = words * state.bonusTimePerWord;
    state.timeRemaining += bonus;

    EventBus.emit('timePressure:bonus', { bonus, newTime: state.timeRemaining });
  }

  /**
   * Get time pressure state
   */
  getTimePressureState(): TimePressureState | null {
    return this.currentSession?.timePressureState ?? null;
  }

  // --------------------------------------------------------------------------
  // Error Correction Mode
  // --------------------------------------------------------------------------

  /**
   * Initialize error correction with text
   */
  initErrorCorrectionMode(text: string, errorCount: number = 5): ErrorCorrectionState {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const { corruptedText, errorPositions } = this.introduceErrors(text, errorCount);

    this.currentSession.errorCorrectionState = {
      originalText: text,
      corruptedText,
      errorPositions,
      correctedPositions: [],
      currentPosition: 0,
      hintsUsed: 0,
      maxHints: Math.ceil(errorCount / 2),
    };

    return this.currentSession.errorCorrectionState;
  }

  /**
   * Introduce errors into text
   */
  private introduceErrors(
    text: string,
    count: number
  ): { corruptedText: string; errorPositions: number[] } {
    const words = text.split(' ');
    const errorPositions: number[] = [];
    const errors: Map<number, string> = new Map();

    // Select random word positions for errors
    const availablePositions = words
      .map((word, index) => ({ word, index }))
      .filter(w => w.word.length >= 3); // Only corrupt words with 3+ characters

    const shuffled = availablePositions.sort(() => Math.random() - 0.5);
    const selectedPositions = shuffled.slice(0, Math.min(count, shuffled.length));

    for (const { word, index } of selectedPositions) {
      const corrupted = this.corruptWord(word);
      if (corrupted !== word) {
        errors.set(index, corrupted);
        errorPositions.push(index);
      }
    }

    // Build corrupted text
    const corruptedWords = words.map((word, index) =>
      errors.has(index) ? errors.get(index)! : word
    );

    return {
      corruptedText: corruptedWords.join(' '),
      errorPositions: errorPositions.sort((a, b) => a - b),
    };
  }

  /**
   * Corrupt a single word
   */
  private corruptWord(word: string): string {
    // Check if we have a known typo pattern
    const knownTypo = COMMON_TYPOS.find(t => t.original.toLowerCase() === word.toLowerCase());
    if (knownTypo && Math.random() > 0.3) {
      return word[0] === word[0].toUpperCase()
        ? knownTypo.typo.charAt(0).toUpperCase() + knownTypo.typo.slice(1)
        : knownTypo.typo;
    }

    // Apply random corruption
    const corruptionType = Math.random();

    if (corruptionType < 0.3 && word.length > 2) {
      // Swap adjacent characters
      const pos = Math.floor(Math.random() * (word.length - 1));
      return word.slice(0, pos) + word[pos + 1] + word[pos] + word.slice(pos + 2);
    } else if (corruptionType < 0.5 && word.length > 3) {
      // Remove a character
      const pos = Math.floor(Math.random() * (word.length - 1)) + 1;
      return word.slice(0, pos) + word.slice(pos + 1);
    } else if (corruptionType < 0.7) {
      // Double a character
      const pos = Math.floor(Math.random() * word.length);
      return word.slice(0, pos) + word[pos] + word.slice(pos);
    } else {
      // Replace with adjacent key
      const adjacentKeys: Record<string, string[]> = {
        a: ['s', 'q', 'w'],
        s: ['a', 'd', 'w', 'e'],
        d: ['s', 'f', 'e', 'r'],
        f: ['d', 'g', 'r', 't'],
        g: ['f', 'h', 't', 'z'],
        h: ['g', 'j', 'z', 'u'],
        j: ['h', 'k', 'u', 'i'],
        k: ['j', 'l', 'i', 'o'],
        l: ['k', 'o', 'p'],
        e: ['w', 'r', 's', 'd'],
        i: ['u', 'o', 'j', 'k'],
        o: ['i', 'p', 'k', 'l'],
        n: ['b', 'm', 'h', 'j'],
        t: ['r', 'z', 'f', 'g'],
      };

      const pos = Math.floor(Math.random() * word.length);
      const char = word[pos].toLowerCase();
      const adjacent = adjacentKeys[char];

      if (adjacent) {
        const replacement = adjacent[Math.floor(Math.random() * adjacent.length)];
        return (
          word.slice(0, pos) +
          (word[pos] === word[pos].toUpperCase() ? replacement.toUpperCase() : replacement) +
          word.slice(pos + 1)
        );
      }
    }

    return word;
  }

  /**
   * Mark a position as corrected
   */
  markCorrected(wordIndex: number): boolean {
    if (!this.currentSession?.errorCorrectionState) {
      return false;
    }

    const state = this.currentSession.errorCorrectionState;

    if (state.errorPositions.includes(wordIndex)) {
      if (!state.correctedPositions.includes(wordIndex)) {
        state.correctedPositions.push(wordIndex);
        EventBus.emit('errorCorrection:correct', { position: wordIndex });
        return true;
      }
    } else {
      // False positive - marked correct word as error
      EventBus.emit('errorCorrection:falsePositive', { position: wordIndex });
    }

    return false;
  }

  /**
   * Get a hint (reveal next error position)
   */
  getHint(): number | null {
    if (!this.currentSession?.errorCorrectionState) {
      return null;
    }

    const state = this.currentSession.errorCorrectionState;

    if (state.hintsUsed >= state.maxHints) {
      return null;
    }

    // Find first uncorrected error
    const uncorrected = state.errorPositions.find(pos => !state.correctedPositions.includes(pos));

    if (uncorrected !== undefined) {
      state.hintsUsed++;
      EventBus.emit('errorCorrection:hint', {
        position: uncorrected,
        hintsRemaining: state.maxHints - state.hintsUsed,
      });
      return uncorrected;
    }

    return null;
  }

  /**
   * Get error correction result
   */
  getErrorCorrectionResult(): ErrorCorrectionResult | null {
    if (!this.currentSession?.errorCorrectionState) {
      return null;
    }

    const state = this.currentSession.errorCorrectionState;
    const totalErrors = state.errorPositions.length;
    const errorsFound = state.correctedPositions.filter(pos =>
      state.errorPositions.includes(pos)
    ).length;
    const errorsMissed = totalErrors - errorsFound;
    const falsePositives = state.correctedPositions.filter(
      pos => !state.errorPositions.includes(pos)
    ).length;

    const accuracy = totalErrors > 0 ? (errorsFound / totalErrors) * 100 : 100;

    return {
      totalErrors,
      errorsFound,
      errorsMissed,
      falsePositives,
      accuracy,
      timeMs: Date.now() - this.currentSession.startTime,
      hintsUsed: state.hintsUsed,
    };
  }

  /**
   * Get error correction state
   */
  getErrorCorrectionState(): ErrorCorrectionState | null {
    return this.currentSession?.errorCorrectionState ?? null;
  }

  // --------------------------------------------------------------------------
  // Warmup Mode
  // --------------------------------------------------------------------------

  /**
   * Get all warmup exercises
   */
  getWarmupExercises(): WarmupExercise[] {
    return WARMUP_EXERCISES;
  }

  /**
   * Get localized warmup exercise
   */
  getLocalizedWarmup(exercise: WarmupExercise): { name: string; text: string } {
    const lang = SettingsService.getExerciseLanguage();
    return {
      name: lang === 'en' ? exercise.nameEn : exercise.name,
      text: lang === 'en' ? exercise.textEn : exercise.text,
    };
  }

  /**
   * Generate a quick warmup routine
   */
  generateWarmupRoutine(durationMinutes: number = 2): WarmupExercise[] {
    const targetSeconds = durationMinutes * 60;
    let totalSeconds = 0;
    const routine: WarmupExercise[] = [];

    // Prioritize exercises
    const prioritized = [...WARMUP_EXERCISES].sort((a, b) => {
      // Home row first, then alternating, then others
      const priority: Record<string, number> = {
        'warmup-home-row': 0,
        'warmup-alternating': 1,
        'warmup-fingers-stretch': 2,
        'warmup-common-words': 3,
        'warmup-numbers': 4,
      };
      return (priority[a.id] ?? 99) - (priority[b.id] ?? 99);
    });

    for (const exercise of prioritized) {
      if (totalSeconds + exercise.duration <= targetSeconds) {
        routine.push(exercise);
        totalSeconds += exercise.duration;
      }
    }

    return routine;
  }

  // --------------------------------------------------------------------------
  // Endurance Mode
  // --------------------------------------------------------------------------

  /**
   * Generate endurance text (long text for stamina training)
   */
  generateEnduranceText(paragraphs: number = 5): string {
    const lang = SettingsService.getExerciseLanguage();

    const deParagraphs = [
      'Das Zehnfingersystem ist eine Methode, bei der alle zehn Finger zum Tippen verwendet werden. Die Finger sind dabei bestimmten Tasten zugeordnet, sodass man ohne Hinschauen tippen kann.',
      'Durch regelmäßiges Üben verbessert sich die Tippgeschwindigkeit kontinuierlich. Wichtig ist dabei, die Genauigkeit nicht zu vernachlässigen, denn Fehler korrigieren kostet Zeit.',
      'Die Grundstellung der Finger liegt auf der mittleren Buchstabenreihe. Von dort aus werden alle anderen Tasten erreicht, wobei die Finger immer zur Grundstellung zurückkehren.',
      'Professionelle Schreibkräfte erreichen Geschwindigkeiten von über 400 Anschlägen pro Minute. Mit ausreichend Übung kann jeder diese Fähigkeit erlernen.',
      'Ergonomie spielt beim Tippen eine wichtige Rolle. Eine gute Sitzposition und die richtige Tastaturhöhe beugen Ermüdung und Verletzungen vor.',
      'Tastaturkürzel erhöhen die Produktivität erheblich. Mit Kombinationen wie Strg+C und Strg+V spart man viel Zeit bei der täglichen Arbeit.',
      'Die Geschichte der Tastatur reicht bis ins 19. Jahrhundert zurück. Das QWERTZ-Layout wurde entwickelt, um mechanische Probleme bei frühen Schreibmaschinen zu vermeiden.',
      'Moderne Tastaturen bieten viele Features wie Hintergrundbeleuchtung und mechanische Schalter. Manche Nutzer bevorzugen jedoch klassische Membrantastaturen.',
    ];

    const enParagraphs = [
      'Touch typing is a method where all ten fingers are used for typing. Each finger is assigned to specific keys, allowing you to type without looking at the keyboard.',
      'Regular practice continuously improves typing speed. It is important not to neglect accuracy, as correcting mistakes takes time and reduces overall efficiency.',
      'The home position of the fingers is on the middle row of letters. From there, all other keys are reached, with the fingers always returning to the home position.',
      'Professional typists achieve speeds of over 80 words per minute. With sufficient practice, anyone can learn this valuable skill for modern work.',
      'Ergonomics plays an important role in typing. Good posture and proper keyboard height prevent fatigue and repetitive strain injuries during extended sessions.',
      'Keyboard shortcuts significantly increase productivity. Combinations like Ctrl+C and Ctrl+V save a lot of time in daily work and document editing.',
      'The history of the keyboard dates back to the 19th century. The QWERTY layout was developed to prevent mechanical jamming issues with early typewriters.',
      'Modern keyboards offer many features like backlighting and mechanical switches. Some users prefer classic membrane keyboards for their quiet operation.',
    ];

    const sourceParagraphs = lang === 'en' ? enParagraphs : deParagraphs;

    // Select random paragraphs
    const selected: string[] = [];
    const shuffled = [...sourceParagraphs].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(paragraphs, shuffled.length); i++) {
      selected.push(shuffled[i]);
    }

    return selected.join('\n\n');
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const ExerciseModeService = new ExerciseModeServiceImpl();
