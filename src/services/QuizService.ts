/**
 * Quiz Service - Phase 4
 * Verschiedene Quiz-Modi für Shortcuts und Programmierung
 */

import { StorageService } from '../core/StorageService';
import {
  ALL_COMMAND_COLLECTIONS,
  ALL_SHORTCUT_COLLECTIONS,
  Command,
  Shortcut,
} from '../data/shortcuts';
import { gamificationService } from './GamificationService';

// ============================================================================
// TYPES
// ============================================================================

export type QuizType =
  | 'shortcut-multiple-choice' // Multiple choice for shortcuts
  | 'command-type' // Tippe den Befehl
  | 'code-completion' // Code completion
  | 'timed-challenge' // Zeit-Challenge
  | 'reverse-lookup'; // Was macht dieser Shortcut?

export interface QuizQuestion {
  id: string;
  type: QuizType;
  question: string;
  correctAnswer: string;
  options?: string[]; // For multiple choice
  hint?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  points: number;
  timeLimit?: number; // Seconds for timed challenges
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  timeSpent: number; // ms
  pointsEarned: number;
}

export interface QuizSession {
  id: string;
  type: QuizType;
  startedAt: Date;
  completedAt?: Date;
  questions: QuizQuestion[];
  results: QuizResult[];
  totalPoints: number;
  accuracy: number;
  category?: string;
}

export interface QuizStats {
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalPoints: number;
  accuracy: number;
  byType: Record<QuizType, { taken: number; correct: number; total: number }>;
  byCategory: Record<string, { taken: number; correct: number; total: number }>;
  bestStreak: number;
  currentStreak: number;
}

// ============================================================================
// CODE COMPLETION QUESTIONS
// ============================================================================

const CODE_COMPLETION_QUESTIONS: Omit<QuizQuestion, 'id'>[] = [
  // JavaScript
  {
    type: 'code-completion',
    question: 'const sum = (a, b) => ___',
    correctAnswer: 'a + b',
    category: 'JavaScript',
    difficulty: 'beginner',
    points: 10,
  },
  {
    type: 'code-completion',
    question: 'const doubled = arr.___(x => x * 2)',
    correctAnswer: 'map',
    category: 'JavaScript',
    difficulty: 'beginner',
    points: 10,
  },
  {
    type: 'code-completion',
    question: 'const filtered = arr.___(x => x > 5)',
    correctAnswer: 'filter',
    category: 'JavaScript',
    difficulty: 'beginner',
    points: 10,
  },
  {
    type: 'code-completion',
    question: 'async function fetch() { ___ api.get(); }',
    correctAnswer: 'await',
    category: 'JavaScript',
    difficulty: 'intermediate',
    points: 15,
  },
  {
    type: 'code-completion',
    question: 'const { name, age } = ___',
    correctAnswer: 'user',
    category: 'JavaScript',
    difficulty: 'intermediate',
    points: 15,
  },
  {
    type: 'code-completion',
    question: 'arr.reduce((acc, val) => acc + val, ___)',
    correctAnswer: '0',
    category: 'JavaScript',
    difficulty: 'intermediate',
    points: 15,
  },
  {
    type: 'code-completion',
    question: 'Promise.___([p1, p2]).then(results => {})',
    correctAnswer: 'all',
    category: 'JavaScript',
    difficulty: 'advanced',
    points: 20,
  },

  // TypeScript
  {
    type: 'code-completion',
    question: 'const count: ___ = 42;',
    correctAnswer: 'number',
    category: 'TypeScript',
    difficulty: 'beginner',
    points: 10,
  },
  {
    type: 'code-completion',
    question: 'interface User { name: string; age: ___; }',
    correctAnswer: 'number',
    category: 'TypeScript',
    difficulty: 'beginner',
    points: 10,
  },
  {
    type: 'code-completion',
    question: 'type Status = "active" ___ "inactive"',
    correctAnswer: '|',
    category: 'TypeScript',
    difficulty: 'intermediate',
    points: 15,
  },
  {
    type: 'code-completion',
    question: 'function identity<___>(arg: T): T { return arg; }',
    correctAnswer: 'T',
    category: 'TypeScript',
    difficulty: 'advanced',
    points: 20,
  },

  // Python
  {
    type: 'code-completion',
    question: 'numbers = [x**2 ___ x in range(10)]',
    correctAnswer: 'for',
    category: 'Python',
    difficulty: 'intermediate',
    points: 15,
  },
  {
    type: 'code-completion',
    question: 'with ___("file.txt") as f:',
    correctAnswer: 'open',
    category: 'Python',
    difficulty: 'intermediate',
    points: 15,
  },
  {
    type: 'code-completion',
    question: 'def __init__(___): self.name = name',
    correctAnswer: 'self, name',
    category: 'Python',
    difficulty: 'intermediate',
    points: 15,
  },
  {
    type: 'code-completion',
    question: 'async ___ fetch(): return await api.get()',
    correctAnswer: 'def',
    category: 'Python',
    difficulty: 'advanced',
    points: 20,
  },

  // SQL
  {
    type: 'code-completion',
    question: 'SELECT * ___ users WHERE age > 18',
    correctAnswer: 'FROM',
    category: 'SQL',
    difficulty: 'beginner',
    points: 10,
  },
  {
    type: 'code-completion',
    question: 'SELECT COUNT(*) FROM orders ___ BY status',
    correctAnswer: 'GROUP',
    category: 'SQL',
    difficulty: 'intermediate',
    points: 15,
  },
  {
    type: 'code-completion',
    question: 'SELECT * FROM users u ___ orders o ON u.id = o.user_id',
    correctAnswer: 'JOIN',
    category: 'SQL',
    difficulty: 'intermediate',
    points: 15,
  },

  // Git
  {
    type: 'code-completion',
    question: 'git ___ -b feature/new',
    correctAnswer: 'checkout',
    category: 'Git',
    difficulty: 'beginner',
    points: 10,
  },
  {
    type: 'code-completion',
    question: 'git ___ origin main',
    correctAnswer: 'push',
    category: 'Git',
    difficulty: 'beginner',
    points: 10,
  },
  {
    type: 'code-completion',
    question: 'git ___ --rebase',
    correctAnswer: 'pull',
    category: 'Git',
    difficulty: 'intermediate',
    points: 15,
  },

  // HTML/CSS
  {
    type: 'code-completion',
    question: '<a ___="https://example.com">Link</a>',
    correctAnswer: 'href',
    category: 'HTML',
    difficulty: 'beginner',
    points: 10,
  },
  {
    type: 'code-completion',
    question: 'display: ___; justify-content: center;',
    correctAnswer: 'flex',
    category: 'CSS',
    difficulty: 'beginner',
    points: 10,
  },
  {
    type: 'code-completion',
    question: '.container { ___: 100%; }',
    correctAnswer: 'width',
    category: 'CSS',
    difficulty: 'beginner',
    points: 10,
  },

  // React
  {
    type: 'code-completion',
    question: 'const [count, setCount] = ___(0);',
    correctAnswer: 'useState',
    category: 'React',
    difficulty: 'beginner',
    points: 10,
  },
  {
    type: 'code-completion',
    question: '___(() => { fetchData(); }, []);',
    correctAnswer: 'useEffect',
    category: 'React',
    difficulty: 'intermediate',
    points: 15,
  },

  // Angular
  {
    type: 'code-completion',
    question: '@___({ selector: "app-root" })',
    correctAnswer: 'Component',
    category: 'Angular',
    difficulty: 'beginner',
    points: 10,
  },
  {
    type: 'code-completion',
    question: '<div *___="isVisible">Content</div>',
    correctAnswer: 'ngIf',
    category: 'Angular',
    difficulty: 'intermediate',
    points: 15,
  },
];

// ============================================================================
// QUIZ SERVICE
// ============================================================================

export class QuizService {
  private static instance: QuizService;
  private currentSession: QuizSession | null = null;
  private readonly stats: QuizStats;

  private constructor() {
    this.stats = this.loadStats();
  }

  static getInstance(): QuizService {
    if (!QuizService.instance) {
      QuizService.instance = new QuizService();
    }
    return QuizService.instance;
  }

  // ============================================================================
  // QUIZ GENERATION
  // ============================================================================

  /**
   * Generate a Multiple Choice quiz for shortcuts
   */
  generateShortcutQuiz(
    collectionId?: string,
    count: number = 10,
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  ): QuizQuestion[] {
    let shortcuts: Shortcut[] = [];

    if (collectionId) {
      const collection = ALL_SHORTCUT_COLLECTIONS.find(c => c.id === collectionId);
      if (collection) {
        shortcuts = collection.shortcuts;
      }
    } else {
      shortcuts = ALL_SHORTCUT_COLLECTIONS.flatMap(c => c.shortcuts);
    }

    // Filter by difficulty if specified
    if (difficulty) {
      shortcuts = shortcuts.filter(s => s.difficulty === difficulty);
    }

    // Shuffle and take requested count
    const shuffled = this.shuffle(shortcuts).slice(0, count);

    return shuffled.map((shortcut, index) => {
      const otherShortcuts = shortcuts.filter(s => s.id !== shortcut.id);
      const wrongOptions = this.shuffle(otherShortcuts)
        .slice(0, 3)
        .map(s => s.keys.join(' + '));

      const correctAnswer = shortcut.keys.join(' + ');
      const options = this.shuffle([correctAnswer, ...wrongOptions]);

      return {
        id: `sq-${Date.now()}-${index}`,
        type: 'shortcut-multiple-choice' as QuizType,
        question: `Welcher Shortcut führt diese Aktion aus?\n\n"${shortcut.description}"`,
        correctAnswer,
        options,
        hint: shortcut.category,
        difficulty: shortcut.difficulty || 'intermediate',
        category: shortcut.category,
        points: this.getPointsForDifficulty(shortcut.difficulty || 'intermediate'),
        timeLimit: 15,
      };
    });
  }

  /**
   * Generate a "Type the Command" quiz
   */
  generateCommandQuiz(
    collectionId?: string,
    count: number = 10,
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  ): QuizQuestion[] {
    let commands: Command[] = [];

    if (collectionId) {
      const collection = ALL_COMMAND_COLLECTIONS.find(c => c.id === collectionId);
      if (collection) {
        commands = collection.commands;
      }
    } else {
      commands = ALL_COMMAND_COLLECTIONS.flatMap(c => c.commands);
    }

    if (difficulty) {
      commands = commands.filter(c => c.difficulty === difficulty);
    }

    const shuffled = this.shuffle(commands).slice(0, count);

    return shuffled.map((command, index) => ({
      id: `cq-${Date.now()}-${index}`,
      type: 'command-type' as QuizType,
      question: `Tippe den Befehl für:\n\n"${command.description}"`,
      correctAnswer: command.command,
      hint: command.example,
      difficulty: command.difficulty || 'intermediate',
      category: command.category,
      points: this.getPointsForDifficulty(command.difficulty || 'intermediate'),
      timeLimit: 30,
    }));
  }

  /**
   * Generate a Code Completion quiz
   */
  generateCodeCompletionQuiz(
    category?: string,
    count: number = 10,
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  ): QuizQuestion[] {
    let questions = [...CODE_COMPLETION_QUESTIONS];

    if (category) {
      questions = questions.filter(q => q.category === category);
    }

    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }

    const shuffled = this.shuffle(questions).slice(0, count);

    return shuffled.map((q, index) => ({
      ...q,
      id: `ccq-${Date.now()}-${index}`,
      timeLimit: 20,
    }));
  }

  /**
   * Generate a Reverse Lookup quiz (What does this shortcut do?)
   */
  generateReverseLookupQuiz(collectionId?: string, count: number = 10): QuizQuestion[] {
    let shortcuts: Shortcut[] = [];

    if (collectionId) {
      const collection = ALL_SHORTCUT_COLLECTIONS.find(c => c.id === collectionId);
      if (collection) {
        shortcuts = collection.shortcuts;
      }
    } else {
      shortcuts = ALL_SHORTCUT_COLLECTIONS.flatMap(c => c.shortcuts);
    }

    const shuffled = this.shuffle(shortcuts).slice(0, count);

    return shuffled.map((shortcut, index) => {
      const otherShortcuts = shortcuts.filter(s => s.id !== shortcut.id);
      const wrongOptions = this.shuffle(otherShortcuts)
        .slice(0, 3)
        .map(s => s.description);

      const options = this.shuffle([shortcut.description, ...wrongOptions]);

      return {
        id: `rlq-${Date.now()}-${index}`,
        type: 'reverse-lookup' as QuizType,
        question: `Was macht dieser Shortcut?\n\n${shortcut.keys.join(' + ')}`,
        correctAnswer: shortcut.description,
        options,
        difficulty: shortcut.difficulty || 'intermediate',
        category: shortcut.category,
        points: this.getPointsForDifficulty(shortcut.difficulty || 'intermediate'),
        timeLimit: 15,
      };
    });
  }

  /**
   * Generate a Timed Challenge (mixed questions)
   */
  generateTimedChallenge(
    duration: number = 60, // seconds
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  ): QuizQuestion[] {
    const shortcutQuestions = this.generateShortcutQuiz(undefined, 5, difficulty);
    const commandQuestions = this.generateCommandQuiz(undefined, 5, difficulty);
    const codeQuestions = this.generateCodeCompletionQuiz(undefined, 5, difficulty);

    const allQuestions = this.shuffle([
      ...shortcutQuestions,
      ...commandQuestions,
      ...codeQuestions,
    ]);

    // Mark all as timed challenge
    return allQuestions.map(q => ({
      ...q,
      type: 'timed-challenge' as QuizType,
      timeLimit: Math.floor(duration / allQuestions.length),
    }));
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  /**
   * Start a new quiz session
   */
  startSession(type: QuizType, questions: QuizQuestion[], category?: string): QuizSession {
    this.currentSession = {
      id: `session-${Date.now()}`,
      type,
      startedAt: new Date(),
      questions,
      results: [],
      totalPoints: 0,
      accuracy: 0,
      category,
    };
    return this.currentSession;
  }

  /**
   * Submit an answer for the current question
   */
  submitAnswer(questionIndex: number, userAnswer: string, timeSpent: number): QuizResult | null {
    if (!this.currentSession) {
      return null;
    }

    const question = this.currentSession.questions[questionIndex];
    if (!question) {
      return null;
    }

    // Normalize answers for comparison
    const normalizedUser = this.normalizeAnswer(userAnswer);
    const normalizedCorrect = this.normalizeAnswer(question.correctAnswer);

    const correct = normalizedUser === normalizedCorrect;
    const pointsEarned = correct ? question.points : 0;

    const result: QuizResult = {
      questionId: question.id,
      correct,
      userAnswer,
      timeSpent,
      pointsEarned,
    };

    this.currentSession.results.push(result);
    this.currentSession.totalPoints += pointsEarned;

    // Update accuracy
    const totalAnswered = this.currentSession.results.length;
    const totalCorrect = this.currentSession.results.filter(r => r.correct).length;
    this.currentSession.accuracy = (totalCorrect / totalAnswered) * 100;

    return result;
  }

  /**
   * Complete the current session
   */
  completeSession(): QuizSession | null {
    if (!this.currentSession) {
      return null;
    }

    this.currentSession.completedAt = new Date();

    // Update stats
    this.updateStats(this.currentSession);

    // Award XP through gamification based on performance
    if (this.currentSession.totalPoints > 0) {
      const multiplier = this.currentSession.accuracy >= 90 ? 1.5 : 1.0;
      gamificationService.addXP('lessonComplete', multiplier);

      if (this.currentSession.accuracy === 100) {
        gamificationService.addXP('lessonPerfect');
      }
    }

    // Save session history
    this.saveSessionHistory(this.currentSession);

    const session = this.currentSession;
    this.currentSession = null;
    return session;
  }

  /**
   * Get current session
   */
  getCurrentSession(): QuizSession | null {
    return this.currentSession;
  }

  // ============================================================================
  // STATS
  // ============================================================================

  /**
   * Get quiz statistics
   */
  getStats(): QuizStats {
    return this.stats;
  }

  /**
   * Get available quiz categories
   */
  getAvailableCategories(): { shortcuts: string[]; commands: string[]; code: string[] } {
    const shortcutCategories = ALL_SHORTCUT_COLLECTIONS.map(c => c.name);
    const commandCategories = ALL_COMMAND_COLLECTIONS.map(c => c.name);
    const codeCategories = [...new Set(CODE_COMPLETION_QUESTIONS.map(q => q.category))];

    return {
      shortcuts: shortcutCategories,
      commands: commandCategories,
      code: codeCategories,
    };
  }

  /**
   * Get session history
   */
  getSessionHistory(limit: number = 10): QuizSession[] {
    const history = StorageService.load<QuizSession[]>('quizHistory') || [];
    return history.slice(-limit);
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private loadStats(): QuizStats {
    const stored = StorageService.load<QuizStats>('quizStats');
    if (stored) {
      return stored;
    }

    return {
      totalQuizzesTaken: 0,
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
      totalPoints: 0,
      accuracy: 0,
      byType: {} as Record<QuizType, { taken: number; correct: number; total: number }>,
      byCategory: {},
      bestStreak: 0,
      currentStreak: 0,
    };
  }

  private saveStats(): void {
    StorageService.save('quizStats', this.stats);
  }

  private updateStats(session: QuizSession): void {
    this.stats.totalQuizzesTaken++;
    this.stats.totalQuestionsAnswered += session.results.length;
    this.stats.totalCorrect += session.results.filter(r => r.correct).length;
    this.stats.totalPoints += session.totalPoints;

    if (this.stats.totalQuestionsAnswered > 0) {
      this.stats.accuracy = (this.stats.totalCorrect / this.stats.totalQuestionsAnswered) * 100;
    }

    // Update by type
    if (!this.stats.byType[session.type]) {
      this.stats.byType[session.type] = { taken: 0, correct: 0, total: 0 };
    }
    this.stats.byType[session.type].taken++;
    this.stats.byType[session.type].correct += session.results.filter(r => r.correct).length;
    this.stats.byType[session.type].total += session.results.length;

    // Update by category
    if (session.category) {
      if (!this.stats.byCategory[session.category]) {
        this.stats.byCategory[session.category] = { taken: 0, correct: 0, total: 0 };
      }
      this.stats.byCategory[session.category].taken++;
      this.stats.byCategory[session.category].correct += session.results.filter(
        r => r.correct
      ).length;
      this.stats.byCategory[session.category].total += session.results.length;
    }

    // Update streak
    const allCorrect = session.results.every(r => r.correct);
    if (allCorrect && session.results.length >= 5) {
      this.stats.currentStreak++;
      if (this.stats.currentStreak > this.stats.bestStreak) {
        this.stats.bestStreak = this.stats.currentStreak;
      }
    } else if (session.accuracy < 70) {
      this.stats.currentStreak = 0;
    }

    this.saveStats();
  }

  private saveSessionHistory(session: QuizSession): void {
    const history = StorageService.load<QuizSession[]>('quizHistory') || [];
    history.push(session);

    // Keep only last 50 sessions
    if (history.length > 50) {
      history.shift();
    }

    StorageService.save('quizHistory', history);
  }

  private normalizeAnswer(answer: string): string {
    return answer.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  private getPointsForDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): number {
    switch (difficulty) {
      case 'beginner': {
        return 10;
      }
      case 'intermediate': {
        return 15;
      }
      case 'advanced': {
        return 20;
      }
      default: {
        return 10;
      }
    }
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export default QuizService;
