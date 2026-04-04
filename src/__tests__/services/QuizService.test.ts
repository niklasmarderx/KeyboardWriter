/**
 * QuizService Tests
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import QuizService from '../../services/QuizService';
import type { QuizQuestion } from '../../services/QuizService';
import { StorageService } from '../../core/StorageService';
import { gamificationService } from '../../services/GamificationService';

// Mock StorageService
vi.mock('../../core/StorageService', () => ({
  StorageService: {
    load: vi.fn(() => null),
    save: vi.fn(),
  },
}));

// Mock GamificationService
vi.mock('../../services/GamificationService', () => ({
  gamificationService: {
    addXP: vi.fn(),
  },
}));

vi.mock('../../data/shortcuts', () => ({
  ALL_SHORTCUT_COLLECTIONS: [
    {
      id: 'general',
      name: 'Allgemein',
      shortcuts: [
        {
          id: 's1',
          keys: ['Cmd', 'C'],
          description: 'Kopieren',
          category: 'Allgemein',
          difficulty: 'beginner',
        },
        {
          id: 's2',
          keys: ['Cmd', 'V'],
          description: 'Einfuegen',
          category: 'Allgemein',
          difficulty: 'beginner',
        },
        {
          id: 's3',
          keys: ['Cmd', 'Z'],
          description: 'Rueckgaengig',
          category: 'Allgemein',
          difficulty: 'beginner',
        },
        {
          id: 's4',
          keys: ['Cmd', 'S'],
          description: 'Speichern',
          category: 'Allgemein',
          difficulty: 'intermediate',
        },
        {
          id: 's5',
          keys: ['Cmd', 'Shift', 'P'],
          description: 'Command Palette',
          category: 'Editor',
          difficulty: 'advanced',
        },
      ],
    },
  ],
  ALL_COMMAND_COLLECTIONS: [
    {
      id: 'terminal',
      name: 'Terminal',
      commands: [
        {
          id: 'c1',
          command: 'ls',
          description: 'Verzeichnis auflisten',
          category: 'Navigation',
          difficulty: 'beginner',
          example: 'ls -la',
        },
        {
          id: 'c2',
          command: 'cd',
          description: 'Verzeichnis wechseln',
          category: 'Navigation',
          difficulty: 'beginner',
          example: 'cd /home',
        },
        {
          id: 'c3',
          command: 'grep',
          description: 'Text suchen',
          category: 'Suche',
          difficulty: 'intermediate',
          example: 'grep -r "foo" .',
        },
        {
          id: 'c4',
          command: 'awk',
          description: 'Text verarbeiten',
          category: 'Textverarbeitung',
          difficulty: 'advanced',
          example: "awk '{print $1}'",
        },
      ],
    },
  ],
}));

const mockedStorageService = vi.mocked(StorageService);
const mockedGamificationService = vi.mocked(gamificationService);

describe('QuizService', () => {
  let quizService: QuizService;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Reset singleton between tests by clearing the private static instance
    (QuizService as unknown as { instance: QuizService | null }).instance = null;
    quizService = QuizService.getInstance();
  });

  // ==========================================================================
  // generateShortcutQuiz()
  // ==========================================================================
  describe('generateShortcutQuiz()', () => {
    it('should generate questions up to the requested count', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 3);
      expect(questions.length).toBeLessThanOrEqual(3);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('should generate questions with correct type', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 3);
      for (const q of questions) {
        expect(q.type).toBe('shortcut-multiple-choice');
      }
    });

    it('should include options for multiple choice', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 3);
      for (const q of questions) {
        expect(q.options).toBeDefined();
        expect(q.options!.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('should include the correct answer in options', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 3);
      for (const q of questions) {
        expect(q.options).toContain(q.correctAnswer);
      }
    });

    it('should set points based on difficulty', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 5);
      for (const q of questions) {
        expect(q.points).toBeGreaterThan(0);
        if (q.difficulty === 'beginner') expect(q.points).toBe(10);
        if (q.difficulty === 'intermediate') expect(q.points).toBe(15);
        if (q.difficulty === 'advanced') expect(q.points).toBe(20);
      }
    });

    it('should filter by collection ID when provided', () => {
      const questions = quizService.generateShortcutQuiz('general', 5);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('should return empty array for non-existent collection', () => {
      const questions = quizService.generateShortcutQuiz('nonexistent', 5);
      expect(questions).toHaveLength(0);
    });

    it('should filter by difficulty when provided', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 10, 'beginner');
      for (const q of questions) {
        expect(q.difficulty).toBe('beginner');
      }
    });

    it('should set a time limit on each question', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 3);
      for (const q of questions) {
        expect(q.timeLimit).toBe(15);
      }
    });

    it('should assign unique IDs to questions', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 5);
      const ids = questions.map(q => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  // ==========================================================================
  // submitAnswer()
  // ==========================================================================
  describe('submitAnswer()', () => {
    let questions: QuizQuestion[];

    beforeEach(() => {
      questions = quizService.generateShortcutQuiz(undefined, 3);
      quizService.startSession('shortcut-multiple-choice', questions, 'Allgemein');
    });

    it('should return null when no session is active', () => {
      (QuizService as unknown as { instance: QuizService | null }).instance = null;
      const freshService = QuizService.getInstance();
      const result = freshService.submitAnswer(0, 'test', 1000);
      expect(result).toBeNull();
    });

    it('should mark correct answer as correct', () => {
      const correctAnswer = questions[0].correctAnswer;
      const result = quizService.submitAnswer(0, correctAnswer, 1000);

      expect(result).not.toBeNull();
      expect(result!.correct).toBe(true);
      expect(result!.pointsEarned).toBe(questions[0].points);
    });

    it('should mark wrong answer as incorrect', () => {
      const result = quizService.submitAnswer(0, 'definitely wrong answer!!!!', 1000);

      expect(result).not.toBeNull();
      expect(result!.correct).toBe(false);
      expect(result!.pointsEarned).toBe(0);
    });

    it('should normalize answer comparison (case-insensitive, trimmed)', () => {
      const correctAnswer = questions[0].correctAnswer;
      const result = quizService.submitAnswer(0, '  ' + correctAnswer.toUpperCase() + '  ', 1000);

      expect(result!.correct).toBe(true);
    });

    it('should accumulate total points in session', () => {
      const correctAnswer0 = questions[0].correctAnswer;
      const correctAnswer1 = questions[1].correctAnswer;

      quizService.submitAnswer(0, correctAnswer0, 500);
      quizService.submitAnswer(1, correctAnswer1, 500);

      const session = quizService.getCurrentSession();
      expect(session!.totalPoints).toBe(questions[0].points + questions[1].points);
    });

    it('should update accuracy on the session', () => {
      const correctAnswer0 = questions[0].correctAnswer;

      quizService.submitAnswer(0, correctAnswer0, 500);
      quizService.submitAnswer(1, 'wrong', 500);

      const session = quizService.getCurrentSession();
      expect(session!.accuracy).toBe(50);
    });

    it('should return null for invalid question index', () => {
      const result = quizService.submitAnswer(999, 'test', 1000);
      expect(result).toBeNull();
    });

    it('should record timeSpent in the result', () => {
      const result = quizService.submitAnswer(0, questions[0].correctAnswer, 2500);
      expect(result!.timeSpent).toBe(2500);
    });
  });

  // ==========================================================================
  // completeSession()
  // ==========================================================================
  describe('completeSession()', () => {
    it('should return null when no session is active', () => {
      expect(quizService.completeSession()).toBeNull();
    });

    it('should finalize session with completedAt date', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 2);
      quizService.startSession('shortcut-multiple-choice', questions);

      quizService.submitAnswer(0, questions[0].correctAnswer, 500);
      quizService.submitAnswer(1, 'wrong', 500);

      const session = quizService.completeSession();

      expect(session).not.toBeNull();
      expect(session!.completedAt).toBeDefined();
    });

    it('should award XP through gamification when points > 0', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 2);
      quizService.startSession('shortcut-multiple-choice', questions);

      quizService.submitAnswer(0, questions[0].correctAnswer, 500);

      quizService.completeSession();

      expect(mockedGamificationService.addXP).toHaveBeenCalledWith(
        'lessonComplete',
        expect.any(Number)
      );
    });

    it('should award bonus XP for perfect session (100% accuracy)', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 2);
      quizService.startSession('shortcut-multiple-choice', questions);

      // Answer all correctly
      quizService.submitAnswer(0, questions[0].correctAnswer, 500);
      quizService.submitAnswer(1, questions[1].correctAnswer, 500);

      quizService.completeSession();

      // Should be called with lessonPerfect for 100% accuracy
      expect(mockedGamificationService.addXP).toHaveBeenCalledWith('lessonPerfect');
    });

    it('should update stats correctly', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 2);
      quizService.startSession('shortcut-multiple-choice', questions);

      quizService.submitAnswer(0, questions[0].correctAnswer, 500);
      quizService.submitAnswer(1, 'wrong', 500);

      quizService.completeSession();

      const stats = quizService.getStats();
      expect(stats.totalQuizzesTaken).toBe(1);
      expect(stats.totalQuestionsAnswered).toBe(2);
      expect(stats.totalCorrect).toBe(1);
      expect(stats.accuracy).toBe(50);
    });

    it('should clear current session after completion', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 1);
      quizService.startSession('shortcut-multiple-choice', questions);
      quizService.submitAnswer(0, questions[0].correctAnswer, 500);

      quizService.completeSession();

      expect(quizService.getCurrentSession()).toBeNull();
    });

    it('should save session to history', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 1);
      quizService.startSession('shortcut-multiple-choice', questions);
      quizService.submitAnswer(0, questions[0].correctAnswer, 500);

      quizService.completeSession();

      expect(mockedStorageService.save).toHaveBeenCalledWith('quizHistory', expect.any(Array));
    });

    it('should apply 1.5x multiplier for accuracy >= 90%', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 1);
      quizService.startSession('shortcut-multiple-choice', questions);
      quizService.submitAnswer(0, questions[0].correctAnswer, 500);

      quizService.completeSession();

      // 100% accuracy >= 90%, so multiplier should be 1.5
      expect(mockedGamificationService.addXP).toHaveBeenCalledWith('lessonComplete', 1.5);
    });
  });

  // ==========================================================================
  // getStats()
  // ==========================================================================
  describe('getStats()', () => {
    it('should return default stats initially', () => {
      const stats = quizService.getStats();

      expect(stats.totalQuizzesTaken).toBe(0);
      expect(stats.totalQuestionsAnswered).toBe(0);
      expect(stats.totalCorrect).toBe(0);
      expect(stats.totalPoints).toBe(0);
      expect(stats.accuracy).toBe(0);
      expect(stats.bestStreak).toBe(0);
      expect(stats.currentStreak).toBe(0);
    });

    it('should aggregate stats across multiple sessions', () => {
      // Session 1
      const q1 = quizService.generateShortcutQuiz(undefined, 2);
      quizService.startSession('shortcut-multiple-choice', q1);
      quizService.submitAnswer(0, q1[0].correctAnswer, 500);
      quizService.submitAnswer(1, 'wrong', 500);
      quizService.completeSession();

      // Session 2
      const q2 = quizService.generateShortcutQuiz(undefined, 1);
      quizService.startSession('shortcut-multiple-choice', q2);
      quizService.submitAnswer(0, q2[0].correctAnswer, 500);
      quizService.completeSession();

      const stats = quizService.getStats();
      expect(stats.totalQuizzesTaken).toBe(2);
      expect(stats.totalQuestionsAnswered).toBe(3);
      expect(stats.totalCorrect).toBe(2);
    });

    it('should track stats by type', () => {
      const q = quizService.generateShortcutQuiz(undefined, 1);
      quizService.startSession('shortcut-multiple-choice', q);
      quizService.submitAnswer(0, q[0].correctAnswer, 500);
      quizService.completeSession();

      const stats = quizService.getStats();
      const typeStats = stats.byType['shortcut-multiple-choice'];
      expect(typeStats).toBeDefined();
      expect(typeStats.taken).toBe(1);
      expect(typeStats.correct).toBe(1);
      expect(typeStats.total).toBe(1);
    });

    it('should track stats by category', () => {
      const q = quizService.generateShortcutQuiz(undefined, 1);
      quizService.startSession('shortcut-multiple-choice', q, 'Allgemein');
      quizService.submitAnswer(0, q[0].correctAnswer, 500);
      quizService.completeSession();

      const stats = quizService.getStats();
      const catStats = stats.byCategory['Allgemein'];
      expect(catStats).toBeDefined();
      expect(catStats.taken).toBe(1);
    });

    it('should track streak (increment on all-correct with >=5 questions)', () => {
      // Need at least 5 correct answers for streak increment
      const q = quizService.generateShortcutQuiz(undefined, 5);
      quizService.startSession('shortcut-multiple-choice', q);
      for (let i = 0; i < q.length; i++) {
        quizService.submitAnswer(i, q[i].correctAnswer, 500);
      }
      quizService.completeSession();

      const stats = quizService.getStats();
      expect(stats.currentStreak).toBe(1);
      expect(stats.bestStreak).toBe(1);
    });

    it('should reset streak on poor accuracy (<70%)', () => {
      // First a good session to build streak
      const q1 = quizService.generateShortcutQuiz(undefined, 5);
      quizService.startSession('shortcut-multiple-choice', q1);
      for (let i = 0; i < q1.length; i++) {
        quizService.submitAnswer(i, q1[i].correctAnswer, 500);
      }
      quizService.completeSession();

      // Then a poor session (all wrong, 0% < 70%)
      const q2 = quizService.generateShortcutQuiz(undefined, 5);
      quizService.startSession('shortcut-multiple-choice', q2);
      for (let i = 0; i < q2.length; i++) {
        quizService.submitAnswer(i, 'wrong', 500);
      }
      quizService.completeSession();

      const stats = quizService.getStats();
      expect(stats.currentStreak).toBe(0);
      expect(stats.bestStreak).toBe(1); // Best streak preserved
    });
  });

  // ==========================================================================
  // getSessionHistory()
  // ==========================================================================
  describe('getSessionHistory()', () => {
    it('should return empty array when no history exists', () => {
      const history = quizService.getSessionHistory();
      expect(history).toEqual([]);
    });

    it('should return limited number of recent sessions', () => {
      // Mock stored history
      const mockHistory = Array.from({ length: 15 }, (_, i) => ({
        id: `session-${i}`,
        type: 'shortcut-multiple-choice',
        startedAt: new Date(),
        questions: [],
        results: [],
        totalPoints: 0,
        accuracy: 0,
      }));

      mockedStorageService.load.mockReturnValueOnce(mockHistory);

      const history = quizService.getSessionHistory(5);
      expect(history).toHaveLength(5);
    });

    it('should default to 10 sessions limit', () => {
      const mockHistory = Array.from({ length: 20 }, (_, i) => ({
        id: `session-${i}`,
        type: 'shortcut-multiple-choice',
        startedAt: new Date(),
        questions: [],
        results: [],
        totalPoints: 0,
        accuracy: 0,
      }));

      mockedStorageService.load.mockReturnValueOnce(mockHistory);

      const history = quizService.getSessionHistory();
      expect(history).toHaveLength(10);
    });

    it('should return most recent sessions (from the end)', () => {
      const mockHistory = Array.from({ length: 5 }, (_, i) => ({
        id: `session-${i}`,
        type: 'shortcut-multiple-choice',
        startedAt: new Date(),
        questions: [],
        results: [],
        totalPoints: i * 10,
        accuracy: 0,
      }));

      mockedStorageService.load.mockReturnValueOnce(mockHistory);

      const history = quizService.getSessionHistory(2);
      // slice(-2) returns last 2 elements
      expect(history[0].totalPoints).toBe(30);
      expect(history[1].totalPoints).toBe(40);
    });
  });

  // ==========================================================================
  // startSession()
  // ==========================================================================
  describe('startSession()', () => {
    it('should create a new session with correct properties', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 2);
      const session = quizService.startSession('shortcut-multiple-choice', questions, 'Allgemein');

      expect(session.id).toContain('session-');
      expect(session.type).toBe('shortcut-multiple-choice');
      expect(session.questions).toBe(questions);
      expect(session.results).toEqual([]);
      expect(session.totalPoints).toBe(0);
      expect(session.accuracy).toBe(0);
      expect(session.category).toBe('Allgemein');
      expect(session.startedAt).toBeInstanceOf(Date);
    });

    it('should set the current session', () => {
      const questions = quizService.generateShortcutQuiz(undefined, 1);
      quizService.startSession('shortcut-multiple-choice', questions);

      expect(quizService.getCurrentSession()).not.toBeNull();
    });
  });

  // ==========================================================================
  // generateCommandQuiz()
  // ==========================================================================
  describe('generateCommandQuiz()', () => {
    it('should generate command quiz questions', () => {
      const questions = quizService.generateCommandQuiz(undefined, 3);
      expect(questions.length).toBeGreaterThan(0);
      expect(questions.length).toBeLessThanOrEqual(3);
    });

    it('should set type to command-type', () => {
      const questions = quizService.generateCommandQuiz(undefined, 2);
      for (const q of questions) {
        expect(q.type).toBe('command-type');
      }
    });

    it('should include the command as the correct answer', () => {
      const questions = quizService.generateCommandQuiz(undefined, 4);
      const allCommands = ['ls', 'cd', 'grep', 'awk'];
      for (const q of questions) {
        expect(allCommands).toContain(q.correctAnswer);
      }
    });
  });

  // ==========================================================================
  // generateCodeCompletionQuiz()
  // ==========================================================================
  describe('generateCodeCompletionQuiz()', () => {
    it('should generate code completion questions', () => {
      const questions = quizService.generateCodeCompletionQuiz(undefined, 5);
      expect(questions.length).toBeGreaterThan(0);
    });

    it('should filter by category', () => {
      const questions = quizService.generateCodeCompletionQuiz('JavaScript', 10);
      for (const q of questions) {
        expect(q.category).toBe('JavaScript');
      }
    });

    it('should filter by difficulty', () => {
      const questions = quizService.generateCodeCompletionQuiz(undefined, 10, 'beginner');
      for (const q of questions) {
        expect(q.difficulty).toBe('beginner');
      }
    });
  });
});
