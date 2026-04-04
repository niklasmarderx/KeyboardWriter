/**
 * ExerciseModeService Tests
 */
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { ExerciseMode, EXERCISE_MODE_CONFIGS } from '../../domain/enums/ExerciseMode';

// Mock EventBus
vi.mock('../../core', () => ({
  EventBus: {
    emit: vi.fn(),
    on: vi.fn(() => ({ unsubscribe: vi.fn() })),
  },
}));

// Mock SettingsService
vi.mock('../../core/SettingsService', () => ({
  SettingsService: {
    getExerciseLanguage: vi.fn(() => 'en'),
    getSettings: vi.fn(() => ({
      exerciseLanguage: 'en',
    })),
  },
}));

// Import after mocks
import { ExerciseModeService } from '../../services/ExerciseModeService';
import { EventBus } from '../../core';
import { SettingsService } from '../../core/SettingsService';

describe('ExerciseModeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure no session is active
    ExerciseModeService.endSession();
  });

  afterEach(() => {
    vi.useRealTimers();
    ExerciseModeService.endSession();
  });

  // ==========================================================================
  // getModeConfig
  // ==========================================================================

  describe('getModeConfig', () => {
    it('returns correct config for LESSON mode', () => {
      const config = ExerciseModeService.getModeConfig(ExerciseMode.LESSON);
      expect(config.mode).toBe(ExerciseMode.LESSON);
      expect(config.name).toBe('Lektion');
      expect(config.nameEn).toBe('Lesson');
      expect(config.difficulty).toBe('beginner');
    });

    it('returns correct config for TIME_PRESSURE mode', () => {
      const config = ExerciseModeService.getModeConfig(ExerciseMode.TIME_PRESSURE);
      expect(config.mode).toBe(ExerciseMode.TIME_PRESSURE);
      expect(config.hasTimeLimit).toBe(true);
      expect(config.timeLimitSeconds).toBe(30);
      expect(config.difficulty).toBe('advanced');
    });

    it('returns correct config for BLIND_TYPING mode', () => {
      const config = ExerciseModeService.getModeConfig(ExerciseMode.BLIND_TYPING);
      expect(config.requiresKeyboardVisible).toBe(false);
    });

    it('returns correct config for ERROR_CORRECTION mode', () => {
      const config = ExerciseModeService.getModeConfig(ExerciseMode.ERROR_CORRECTION);
      expect(config.mode).toBe(ExerciseMode.ERROR_CORRECTION);
      expect(config.difficulty).toBe('intermediate');
    });

    it('returns correct config for WARMUP mode', () => {
      const config = ExerciseModeService.getModeConfig(ExerciseMode.WARMUP);
      expect(config.mode).toBe(ExerciseMode.WARMUP);
      expect(config.difficulty).toBe('beginner');
      expect(config.estimatedMinutes).toBe(2);
    });

    it('returns correct config for every ExerciseMode', () => {
      for (const mode of Object.values(ExerciseMode)) {
        const config = ExerciseModeService.getModeConfig(mode);
        expect(config).toBeDefined();
        expect(config.mode).toBe(mode);
        expect(config.name).toBeTruthy();
        expect(config.nameEn).toBeTruthy();
      }
    });
  });

  // ==========================================================================
  // getAllModes / getModesByDifficulty
  // ==========================================================================

  describe('getAllModes', () => {
    it('returns all mode configs', () => {
      const modes = ExerciseModeService.getAllModes();
      expect(modes.length).toBe(Object.keys(EXERCISE_MODE_CONFIGS).length);
    });
  });

  describe('getModesByDifficulty', () => {
    it('filters modes by beginner difficulty', () => {
      const beginnerModes = ExerciseModeService.getModesByDifficulty('beginner');
      expect(beginnerModes.length).toBeGreaterThan(0);
      expect(beginnerModes.every(m => m.difficulty === 'beginner')).toBe(true);
    });

    it('filters modes by advanced difficulty', () => {
      const advancedModes = ExerciseModeService.getModesByDifficulty('advanced');
      expect(advancedModes.length).toBeGreaterThan(0);
      expect(advancedModes.every(m => m.difficulty === 'advanced')).toBe(true);
    });
  });

  // ==========================================================================
  // startSession / endSession
  // ==========================================================================

  describe('startSession', () => {
    it('creates an active session for LESSON mode', () => {
      const session = ExerciseModeService.startSession(ExerciseMode.LESSON);

      expect(session.mode).toBe(ExerciseMode.LESSON);
      expect(session.isActive).toBe(true);
      expect(session.isPaused).toBe(false);
      expect(session.startTime).toBeLessThanOrEqual(Date.now());
      expect(session.keyboardVisible).toBe(true);
    });

    it('hides keyboard for BLIND_TYPING mode', () => {
      const session = ExerciseModeService.startSession(ExerciseMode.BLIND_TYPING);

      expect(session.keyboardVisible).toBe(false);
    });

    it('initializes dictation state for DICTATION mode', () => {
      const session = ExerciseModeService.startSession(ExerciseMode.DICTATION);

      expect(session.dictationState).toBeDefined();
      expect(session.dictationState!.isTextVisible).toBe(false);
      expect(session.dictationState!.showDurationMs).toBe(5000);
    });

    it('initializes time pressure state for TIME_PRESSURE mode', () => {
      const session = ExerciseModeService.startSession(ExerciseMode.TIME_PRESSURE);

      expect(session.timePressureState).toBeDefined();
      expect(session.timePressureState!.timeLimit).toBe(30);
      expect(session.timePressureState!.timeRemaining).toBe(30);
      expect(session.timePressureState!.isRunning).toBe(false);
      expect(session.timePressureState!.bonusTimePerWord).toBe(0.5);
    });

    it('emits exerciseMode:start event', () => {
      ExerciseModeService.startSession(ExerciseMode.LESSON);

      expect(EventBus.emit).toHaveBeenCalledWith('exerciseMode:start', {
        mode: ExerciseMode.LESSON,
      });
    });

    it('ends any existing session before starting a new one', () => {
      ExerciseModeService.startSession(ExerciseMode.LESSON);
      ExerciseModeService.startSession(ExerciseMode.WARMUP);

      const session = ExerciseModeService.getSession();
      expect(session!.mode).toBe(ExerciseMode.WARMUP);

      // exerciseMode:end should have been emitted for the first session
      expect(EventBus.emit).toHaveBeenCalledWith('exerciseMode:end', {
        mode: ExerciseMode.LESSON,
      });
    });
  });

  describe('endSession', () => {
    it('clears the current session', () => {
      ExerciseModeService.startSession(ExerciseMode.LESSON);
      ExerciseModeService.endSession();

      expect(ExerciseModeService.getSession()).toBeNull();
    });

    it('emits exerciseMode:end event', () => {
      ExerciseModeService.startSession(ExerciseMode.LESSON);
      vi.mocked(EventBus.emit).mockClear();

      ExerciseModeService.endSession();

      expect(EventBus.emit).toHaveBeenCalledWith('exerciseMode:end', {
        mode: ExerciseMode.LESSON,
      });
    });

    it('does nothing when no session is active', () => {
      vi.mocked(EventBus.emit).mockClear();
      ExerciseModeService.endSession();

      expect(EventBus.emit).not.toHaveBeenCalled();
    });

    it('clears time pressure interval on end', () => {
      vi.useFakeTimers();
      ExerciseModeService.startSession(ExerciseMode.TIME_PRESSURE);
      ExerciseModeService.startTimePressureTimer();

      ExerciseModeService.endSession();

      // Advance time — no errors should occur since interval was cleared
      vi.advanceTimersByTime(1000);
      expect(ExerciseModeService.getSession()).toBeNull();
    });
  });

  // ==========================================================================
  // getSession / isKeyboardVisible
  // ==========================================================================

  describe('getSession', () => {
    it('returns null when no session is active', () => {
      expect(ExerciseModeService.getSession()).toBeNull();
    });

    it('returns the current session', () => {
      ExerciseModeService.startSession(ExerciseMode.WARMUP);
      const session = ExerciseModeService.getSession();
      expect(session).not.toBeNull();
      expect(session!.mode).toBe(ExerciseMode.WARMUP);
    });
  });

  describe('isKeyboardVisible', () => {
    it('returns true when no session is active', () => {
      expect(ExerciseModeService.isKeyboardVisible()).toBe(true);
    });

    it('returns false for BLIND_TYPING mode', () => {
      ExerciseModeService.startSession(ExerciseMode.BLIND_TYPING);
      expect(ExerciseModeService.isKeyboardVisible()).toBe(false);
    });

    it('returns true for LESSON mode', () => {
      ExerciseModeService.startSession(ExerciseMode.LESSON);
      expect(ExerciseModeService.isKeyboardVisible()).toBe(true);
    });
  });

  // ==========================================================================
  // Time Pressure Mode
  // ==========================================================================

  describe('Time Pressure mode', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      ExerciseModeService.startSession(ExerciseMode.TIME_PRESSURE);
    });

    afterEach(() => {
      ExerciseModeService.endSession();
      vi.useRealTimers();
    });

    it('starts a countdown timer', () => {
      ExerciseModeService.startTimePressureTimer();

      const state = ExerciseModeService.getTimePressureState();
      expect(state!.isRunning).toBe(true);

      expect(EventBus.emit).toHaveBeenCalledWith('timePressure:start', {
        timeLimit: 30,
      });
    });

    it('decrements timeRemaining on each tick (100ms)', () => {
      ExerciseModeService.startTimePressureTimer();

      vi.advanceTimersByTime(100);
      const state = ExerciseModeService.getTimePressureState();
      expect(state!.timeRemaining).toBeCloseTo(29.9, 1);
    });

    it('emits timePressure:tick events during countdown', () => {
      ExerciseModeService.startTimePressureTimer();
      vi.mocked(EventBus.emit).mockClear();

      vi.advanceTimersByTime(200);

      const tickCalls = vi
        .mocked(EventBus.emit)
        .mock.calls.filter(([event]) => event === 'timePressure:tick');
      expect(tickCalls.length).toBe(2);
    });

    it('emits timePressure:timeout when time runs out', () => {
      ExerciseModeService.startTimePressureTimer();

      // Advance past 30 seconds
      vi.advanceTimersByTime(30100);

      expect(EventBus.emit).toHaveBeenCalledWith('timePressure:timeout', undefined);
    });

    it('stops the timer when stopTimePressureTimer is called', () => {
      ExerciseModeService.startTimePressureTimer();
      vi.advanceTimersByTime(5000); // 5 seconds

      ExerciseModeService.stopTimePressureTimer();

      const state = ExerciseModeService.getTimePressureState();
      expect(state!.isRunning).toBe(false);

      expect(EventBus.emit).toHaveBeenCalledWith('timePressure:stop', {
        timeRemaining: expect.any(Number),
      });
    });

    it('does not start a duplicate timer if already running', () => {
      ExerciseModeService.startTimePressureTimer();
      ExerciseModeService.startTimePressureTimer(); // should be a no-op

      vi.advanceTimersByTime(100);
      const state = ExerciseModeService.getTimePressureState();
      // Only decremented once per 100ms, not twice
      expect(state!.timeRemaining).toBeCloseTo(29.9, 1);
    });

    it('addBonusTime increases timeRemaining', () => {
      ExerciseModeService.startTimePressureTimer();
      vi.advanceTimersByTime(5000); // 5 seconds elapsed

      ExerciseModeService.addBonusTime(2);

      const state = ExerciseModeService.getTimePressureState();
      // timeRemaining ~ 25 + 2 * 0.5 = 26
      expect(state!.timeRemaining).toBeCloseTo(26, 0);

      expect(EventBus.emit).toHaveBeenCalledWith('timePressure:bonus', {
        bonus: 1, // 2 words * 0.5
        newTime: expect.any(Number),
      });
    });

    it('addBonusTime defaults to 1 word', () => {
      ExerciseModeService.startTimePressureTimer();

      ExerciseModeService.addBonusTime();

      const state = ExerciseModeService.getTimePressureState();
      expect(state!.timeRemaining).toBeCloseTo(30.5, 1); // 30 + 1 * 0.5
    });

    it('getTimePressureState returns null when not in time pressure mode', () => {
      ExerciseModeService.endSession();
      ExerciseModeService.startSession(ExerciseMode.LESSON);

      expect(ExerciseModeService.getTimePressureState()).toBeNull();
    });
  });

  // ==========================================================================
  // Error Correction Mode
  // ==========================================================================

  describe('Error Correction mode', () => {
    const sampleText = 'The quick brown fox jumps over the lazy dog near the river';

    beforeEach(() => {
      ExerciseModeService.startSession(ExerciseMode.ERROR_CORRECTION);
    });

    afterEach(() => {
      ExerciseModeService.endSession();
    });

    it('initializes error correction with corrupted text', () => {
      const state = ExerciseModeService.initErrorCorrectionMode(sampleText, 3);

      expect(state.originalText).toBe(sampleText);
      expect(state.corruptedText).toBeTruthy();
      expect(state.errorPositions.length).toBeLessThanOrEqual(3);
      expect(state.correctedPositions).toEqual([]);
      expect(state.currentPosition).toBe(0);
      expect(state.hintsUsed).toBe(0);
      // maxHints = ceil(errorCount / 2) = ceil(3 / 2) = 2
      expect(state.maxHints).toBe(2);
    });

    it('throws when no active session', () => {
      ExerciseModeService.endSession();

      expect(() => {
        ExerciseModeService.initErrorCorrectionMode(sampleText, 3);
      }).toThrow('No active session');
    });

    it('introduces errors that differ from the original', () => {
      const state = ExerciseModeService.initErrorCorrectionMode(sampleText, 5);

      if (state.errorPositions.length > 0) {
        // At least some errors were introduced
        expect(state.corruptedText).not.toBe(sampleText);
      }
    });

    it('markCorrected returns true for actual error positions', () => {
      const state = ExerciseModeService.initErrorCorrectionMode(sampleText, 5);

      if (state.errorPositions.length > 0) {
        const errorPos = state.errorPositions[0];
        const result = ExerciseModeService.markCorrected(errorPos);
        expect(result).toBe(true);

        expect(EventBus.emit).toHaveBeenCalledWith('errorCorrection:correct', {
          position: errorPos,
        });
      }
    });

    it('markCorrected returns false for non-error positions (false positive)', () => {
      const state = ExerciseModeService.initErrorCorrectionMode(sampleText, 3);

      // Find a position that is NOT an error
      let nonErrorPos = 0;
      while (state.errorPositions.includes(nonErrorPos)) {
        nonErrorPos++;
      }

      const result = ExerciseModeService.markCorrected(nonErrorPos);
      expect(result).toBe(false);

      expect(EventBus.emit).toHaveBeenCalledWith('errorCorrection:falsePositive', {
        position: nonErrorPos,
      });
    });

    it('markCorrected does not double-count the same position', () => {
      const state = ExerciseModeService.initErrorCorrectionMode(sampleText, 5);

      if (state.errorPositions.length > 0) {
        const errorPos = state.errorPositions[0];
        ExerciseModeService.markCorrected(errorPos);
        const secondResult = ExerciseModeService.markCorrected(errorPos);
        expect(secondResult).toBe(false);
      }
    });

    it('getHint returns the first uncorrected error position', () => {
      const state = ExerciseModeService.initErrorCorrectionMode(sampleText, 5);

      if (state.errorPositions.length > 0) {
        const hint = ExerciseModeService.getHint();
        expect(hint).toBe(state.errorPositions[0]);
        expect(state.hintsUsed).toBe(1);
      }
    });

    it('getHint returns null when all hints are used', () => {
      const state = ExerciseModeService.initErrorCorrectionMode(sampleText, 2);
      // maxHints = ceil(2/2) = 1

      if (state.errorPositions.length > 0) {
        ExerciseModeService.getHint(); // use the one hint
        const secondHint = ExerciseModeService.getHint();
        expect(secondHint).toBeNull();
      }
    });

    it('getErrorCorrectionResult calculates accuracy', () => {
      const state = ExerciseModeService.initErrorCorrectionMode(sampleText, 5);

      // Mark some errors as corrected
      const correctedCount = Math.min(2, state.errorPositions.length);
      for (let i = 0; i < correctedCount; i++) {
        ExerciseModeService.markCorrected(state.errorPositions[i]);
      }

      const result = ExerciseModeService.getErrorCorrectionResult();
      expect(result).not.toBeNull();
      expect(result!.totalErrors).toBe(state.errorPositions.length);
      expect(result!.errorsFound).toBe(correctedCount);
      expect(result!.errorsMissed).toBe(state.errorPositions.length - correctedCount);
      expect(result!.falsePositives).toBe(0);

      if (state.errorPositions.length > 0) {
        expect(result!.accuracy).toBeCloseTo(
          (correctedCount / state.errorPositions.length) * 100,
          1
        );
      }
    });

    it('getErrorCorrectionResult returns null when no error correction state', () => {
      ExerciseModeService.endSession();
      ExerciseModeService.startSession(ExerciseMode.LESSON);

      expect(ExerciseModeService.getErrorCorrectionResult()).toBeNull();
    });

    it('getErrorCorrectionState returns null when not in error correction mode', () => {
      ExerciseModeService.endSession();
      expect(ExerciseModeService.getErrorCorrectionState()).toBeNull();
    });
  });

  // ==========================================================================
  // Warmup Mode
  // ==========================================================================

  describe('Warmup mode', () => {
    it('getWarmupExercises returns a non-empty array', () => {
      const exercises = ExerciseModeService.getWarmupExercises();
      expect(exercises.length).toBeGreaterThan(0);
    });

    it('each warmup exercise has required fields', () => {
      const exercises = ExerciseModeService.getWarmupExercises();

      for (const exercise of exercises) {
        expect(exercise.id).toBeTruthy();
        expect(exercise.name).toBeTruthy();
        expect(exercise.nameEn).toBeTruthy();
        expect(exercise.text).toBeTruthy();
        expect(exercise.textEn).toBeTruthy();
        expect(exercise.duration).toBeGreaterThan(0);
      }
    });

    it('getLocalizedWarmup returns English text when language is en', () => {
      vi.mocked(SettingsService.getExerciseLanguage).mockReturnValue('en');

      const exercises = ExerciseModeService.getWarmupExercises();
      const localized = ExerciseModeService.getLocalizedWarmup(exercises[0]);

      expect(localized.name).toBe(exercises[0].nameEn);
      expect(localized.text).toBe(exercises[0].textEn);
    });

    it('getLocalizedWarmup returns German text when language is de', () => {
      vi.mocked(SettingsService.getExerciseLanguage).mockReturnValue('de');

      const exercises = ExerciseModeService.getWarmupExercises();
      const localized = ExerciseModeService.getLocalizedWarmup(exercises[0]);

      expect(localized.name).toBe(exercises[0].name);
      expect(localized.text).toBe(exercises[0].text);
    });

    it('generateWarmupRoutine returns exercises that fit within the time limit', () => {
      const routine = ExerciseModeService.generateWarmupRoutine(2);
      const totalDuration = routine.reduce((sum, ex) => sum + ex.duration, 0);

      expect(totalDuration).toBeLessThanOrEqual(120); // 2 minutes = 120 seconds
      expect(routine.length).toBeGreaterThan(0);
    });

    it('generateWarmupRoutine prioritizes home row exercises', () => {
      const routine = ExerciseModeService.generateWarmupRoutine(5);

      if (routine.length > 0) {
        expect(routine[0].id).toBe('warmup-home-row');
      }
    });
  });

  // ==========================================================================
  // Dictation Mode
  // ==========================================================================

  describe('Dictation mode', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      ExerciseModeService.startSession(ExerciseMode.DICTATION);
    });

    afterEach(() => {
      ExerciseModeService.endSession();
      vi.useRealTimers();
    });

    it('setDictationText stores the text and splits into chunks', () => {
      ExerciseModeService.setDictationText('Hello world. This is a test.');

      const state = ExerciseModeService.getDictationState();
      expect(state).not.toBeNull();
      expect(state!.originalText).toBe('Hello world. This is a test.');
      expect(state!.memorizedChunks.length).toBeGreaterThan(0);
    });

    it('showDictationChunk returns the current chunk text', () => {
      ExerciseModeService.setDictationText('Short text.');

      const chunk = ExerciseModeService.showDictationChunk();
      expect(chunk).toBeTruthy();

      const state = ExerciseModeService.getDictationState();
      expect(state!.isTextVisible).toBe(true);
    });

    it('showDictationChunk auto-hides after showDurationMs', () => {
      ExerciseModeService.setDictationText('Test text.', 3000);

      ExerciseModeService.showDictationChunk();

      vi.advanceTimersByTime(3000);

      const state = ExerciseModeService.getDictationState();
      expect(state!.isTextVisible).toBe(false);
    });

    it('nextDictationChunk advances to the next chunk', () => {
      ExerciseModeService.setDictationText('First sentence. Second sentence. Third sentence.');

      const advanced = ExerciseModeService.nextDictationChunk();
      expect(advanced).toBe(true);

      const state = ExerciseModeService.getDictationState();
      expect(state!.currentChunkIndex).toBe(1);
    });

    it('nextDictationChunk returns false at the last chunk', () => {
      ExerciseModeService.setDictationText('Only one chunk.');

      const advanced = ExerciseModeService.nextDictationChunk();
      expect(advanced).toBe(false);
    });

    it('showDictationChunk returns null when past all chunks', () => {
      ExerciseModeService.setDictationText('One chunk.');

      // Show the only chunk, then try to advance past it
      ExerciseModeService.showDictationChunk();
      ExerciseModeService.nextDictationChunk(); // false, can't advance

      // currentChunkIndex is still 0 but there's only 1 chunk
      // Let's manually set it past the end to test the boundary
      const state = ExerciseModeService.getDictationState()!;
      state.currentChunkIndex = state.memorizedChunks.length;

      const result = ExerciseModeService.showDictationChunk();
      expect(result).toBeNull();
    });

    it('getDictationState returns null when not in dictation mode', () => {
      ExerciseModeService.endSession();
      ExerciseModeService.startSession(ExerciseMode.LESSON);
      expect(ExerciseModeService.getDictationState()).toBeNull();
    });
  });

  // ==========================================================================
  // Localized names
  // ==========================================================================

  describe('localized mode names', () => {
    it('getModeName returns English name when language is en', () => {
      vi.mocked(SettingsService.getExerciseLanguage).mockReturnValue('en');

      const name = ExerciseModeService.getModeName(ExerciseMode.WARMUP);
      expect(name).toBe('Warmup');
    });

    it('getModeName returns German name when language is de', () => {
      vi.mocked(SettingsService.getExerciseLanguage).mockReturnValue('de');

      const name = ExerciseModeService.getModeName(ExerciseMode.WARMUP);
      expect(name).toBe('Aufwaermen');
    });

    it('getModeDescription returns English description when language is en', () => {
      vi.mocked(SettingsService.getExerciseLanguage).mockReturnValue('en');

      const desc = ExerciseModeService.getModeDescription(ExerciseMode.WARMUP);
      expect(desc).toBe('Quick warmup exercises before main practice');
    });
  });
});
