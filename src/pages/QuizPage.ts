/**
 * Quiz Page - Phase 4
 * UI für alle Quiz-Modi: Multiple Choice, Command Type, Code Completion, etc.
 */

import { escapeHtml } from '../core/escapeHtml';
import {
  QuizQuestion,
  QuizResult,
  QuizService,
  QuizSession,
  QuizType,
} from '../services/QuizService';

export class QuizPage {
  private readonly container: HTMLElement;
  private readonly quizService: QuizService;
  private currentQuestionIndex: number = 0;
  private questionStartTime: number = 0;
  private timerInterval: number | null = null;
  private timeRemaining: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.quizService = QuizService.getInstance();
  }

  render(): void {
    this.container.innerHTML = `
      <div class="quiz-page">
        <header class="quiz-header">
          <h1> Quiz Modi</h1>
          <p>Teste dein Wissen über Shortcuts, Befehle und Code</p>
        </header>

        <div id="quiz-content" class="quiz-content">
          ${this.renderQuizSelection()}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private renderQuizSelection(): string {
    const stats = this.quizService.getStats();
    const categories = this.quizService.getAvailableCategories();

    return `
      <div class="quiz-stats-overview">
        <div class="stat-card">
          <span class="stat-value">${stats.totalQuizzesTaken}</span>
          <span class="stat-label">Quiz absolviert</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${stats.accuracy.toFixed(1)}%</span>
          <span class="stat-label">Genauigkeit</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${stats.totalPoints}</span>
          <span class="stat-label">Punkte</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${stats.bestStreak}</span>
          <span class="stat-label">Beste Serie</span>
        </div>
      </div>

      <div class="quiz-modes">
        <h2> Quiz-Modus wählen</h2>
        
        <div class="quiz-mode-grid">
          <div class="quiz-mode-card" data-mode="shortcut-multiple-choice">
            <div class="mode-icon"></div>
            <h3>Shortcut Quiz</h3>
            <p>Multiple Choice: Welcher Shortcut macht was?</p>
            <div class="mode-difficulty">
              <button class="diff-btn" data-difficulty="beginner">Anfänger</button>
              <button class="diff-btn" data-difficulty="intermediate">Mittel</button>
              <button class="diff-btn" data-difficulty="advanced">Fortgeschritten</button>
            </div>
          </div>

          <div class="quiz-mode-card" data-mode="command-type">
            <div class="mode-icon"></div>
            <h3>Command Typing</h3>
            <p>Tippe den richtigen Befehl ein</p>
            <div class="mode-difficulty">
              <button class="diff-btn" data-difficulty="beginner">Anfänger</button>
              <button class="diff-btn" data-difficulty="intermediate">Mittel</button>
              <button class="diff-btn" data-difficulty="advanced">Fortgeschritten</button>
            </div>
          </div>

          <div class="quiz-mode-card" data-mode="code-completion">
            <div class="mode-icon"></div>
            <h3>Code Completion</h3>
            <p>Vervollständige den Code</p>
            <div class="mode-categories">
              ${categories.code
                .map(
                  cat => `
                <button class="cat-btn" data-category="${cat}">${cat}</button>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="quiz-mode-card" data-mode="reverse-lookup">
            <div class="mode-icon"></div>
            <h3>Reverse Lookup</h3>
            <p>Was macht dieser Shortcut?</p>
            <div class="mode-difficulty">
              <button class="diff-btn" data-difficulty="beginner">Anfänger</button>
              <button class="diff-btn" data-difficulty="intermediate">Mittel</button>
              <button class="diff-btn" data-difficulty="advanced">Fortgeschritten</button>
            </div>
          </div>

          <div class="quiz-mode-card featured" data-mode="timed-challenge">
            <div class="mode-icon"></div>
            <h3>Timed Challenge</h3>
            <p>60 Sekunden - So viele Fragen wie möglich!</p>
            <div class="mode-difficulty">
              <button class="diff-btn" data-difficulty="beginner">Anfänger</button>
              <button class="diff-btn" data-difficulty="intermediate">Mittel</button>
              <button class="diff-btn" data-difficulty="advanced">Fortgeschritten</button>
            </div>
          </div>
        </div>
      </div>

      <div class="quiz-history">
        <h2> Letzte Quiz-Sessions</h2>
        ${this.renderSessionHistory()}
      </div>
    `;
  }

  private renderSessionHistory(): string {
    const history = this.quizService.getSessionHistory(5);

    if (history.length === 0) {
      return '<p class="no-history">Noch keine Quiz-Sessions absolviert.</p>';
    }

    return `
      <div class="history-list">
        ${history
          .map(
            session => `
          <div class="history-item ${session.accuracy >= 80 ? 'success' : session.accuracy >= 50 ? 'warning' : 'error'}">
            <div class="history-type">${this.getQuizTypeName(session.type)}</div>
            <div class="history-stats">
              <span>${session.results.length} Fragen</span>
              <span>${session.accuracy.toFixed(0)}% richtig</span>
              <span>${session.totalPoints} Punkte</span>
            </div>
            <div class="history-date">${this.formatDate(session.startedAt)}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  private renderQuizQuestion(question: QuizQuestion, index: number, total: number): string {
    const session = this.quizService.getCurrentSession();
    const isTimedChallenge = session?.type === 'timed-challenge';

    return `
      <div class="quiz-question-container">
        <div class="quiz-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(index / total) * 100}%"></div>
          </div>
          <span class="progress-text">${index + 1} / ${total}</span>
          ${isTimedChallenge ? `<span class="timer" id="quiz-timer"> ${this.timeRemaining}s</span>` : ''}
        </div>

        <div class="question-card ${question.difficulty}">
          <div class="question-header">
            <span class="question-category">${question.category}</span>
            <span class="question-points">${question.points} Punkte</span>
            <span class="question-difficulty difficulty-${question.difficulty}">${question.difficulty}</span>
          </div>
          
          <div class="question-text">
            <pre>${escapeHtml(question.question)}</pre>
          </div>

          ${this.renderAnswerInput(question)}
          
          ${question.hint ? `<div class="question-hint"> Tipp: ${question.hint}</div>` : ''}
        </div>

        <div id="result-feedback" class="result-feedback hidden"></div>
      </div>
    `;
  }

  private renderAnswerInput(question: QuizQuestion): string {
    if (question.options && question.options.length > 0) {
      return `
        <div class="answer-options">
          ${question.options
            .map(
              (option, i) => `
            <button class="answer-option" data-option="${i}" data-value="${escapeHtml(option)}">
              <span class="option-letter">${String.fromCharCode(65 + i)}</span>
              <span class="option-text">${escapeHtml(option)}</span>
            </button>
          `
            )
            .join('')}
        </div>
      `;
    }

    return `
      <div class="answer-input">
        <input type="text" id="answer-input" placeholder="Deine Antwort eingeben..." autocomplete="off" autofocus>
        <button id="submit-answer" class="submit-btn">Antworten</button>
      </div>
    `;
  }

  private renderQuizResults(session: QuizSession): string {
    const correctCount = session.results.filter(r => r.correct).length;
    const totalQuestions = session.questions.length;
    const grade = this.getGrade(session.accuracy);

    return `
      <div class="quiz-results">
        <div class="results-header">
          <div class="grade-display ${grade.class}">${grade.emoji} ${grade.text}</div>
          <h2>Quiz abgeschlossen!</h2>
        </div>

        <div class="results-stats">
          <div class="result-stat">
            <span class="stat-value">${correctCount}/${totalQuestions}</span>
            <span class="stat-label">Richtig</span>
          </div>
          <div class="result-stat">
            <span class="stat-value">${session.accuracy.toFixed(1)}%</span>
            <span class="stat-label">Genauigkeit</span>
          </div>
          <div class="result-stat">
            <span class="stat-value">${session.totalPoints}</span>
            <span class="stat-label">Punkte</span>
          </div>
        </div>

        <div class="results-details">
          <h3> Übersicht</h3>
          <div class="question-results">
            ${session.questions
              .map((q, i) => {
                const result = session.results[i];
                return `
                <div class="question-result ${result?.correct ? 'correct' : 'incorrect'}">
                  <span class="result-icon">${result?.correct ? '' : ''}</span>
                  <span class="result-question">${escapeHtml(q.question.substring(0, 50))}...</span>
                  <span class="result-answer">
                    ${
                      result?.correct
                        ? escapeHtml(q.correctAnswer)
                        : `${escapeHtml(result?.userAnswer || '-')} → ${escapeHtml(q.correctAnswer)}`
                    }
                  </span>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>

        <div class="results-actions">
          <button id="retry-quiz" class="action-btn primary"> Nochmal</button>
          <button id="back-to-selection" class="action-btn secondary"> Andere Quiz-Modi</button>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const content = document.getElementById('quiz-content');
    if (!content) {
      return;
    }

    // Quiz mode selection
    content.addEventListener('click', e => {
      const target = e.target as HTMLElement;

      // Difficulty button clicked
      const diffBtn = target.closest<HTMLElement>('.diff-btn');
      if (diffBtn) {
        const modeCard = diffBtn.closest<HTMLElement>('.quiz-mode-card');
        const mode = modeCard?.dataset.mode as QuizType;
        const difficulty = diffBtn.dataset.difficulty as 'beginner' | 'intermediate' | 'advanced';
        if (mode && difficulty) {
          this.startQuiz(mode, undefined, difficulty);
        }
        return;
      }

      // Category button clicked (for code completion)
      const catBtn = target.closest<HTMLElement>('.cat-btn');
      if (catBtn) {
        const modeCard = catBtn.closest<HTMLElement>('.quiz-mode-card');
        const mode = modeCard?.dataset.mode as QuizType;
        const category = catBtn.dataset.category;
        if (mode && category) {
          this.startQuiz(mode, category);
        }
        return;
      }

      // Answer option clicked
      const optionBtn = target.closest<HTMLElement>('.answer-option');
      if (optionBtn && !optionBtn.classList.contains('disabled')) {
        const value = optionBtn.dataset.value || '';
        this.submitAnswer(value);
        return;
      }

      // Submit button clicked
      if (target.id === 'submit-answer') {
        const input = document.querySelector<HTMLInputElement>('#answer-input');
        if (input && input.value.trim()) {
          this.submitAnswer(input.value.trim());
        }
        return;
      }

      // Retry quiz
      if (target.id === 'retry-quiz') {
        const session = this.quizService.getCurrentSession();
        if (session) {
          this.startQuiz(session.type, session.category);
        }
        return;
      }

      // Back to selection
      if (target.id === 'back-to-selection') {
        this.showQuizSelection();
        return;
      }

      // Continue to next question
      if (target.id === 'next-question') {
        this.showNextQuestion();
        return;
      }
    });

    // Enter key for text input
    content.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        const input = document.querySelector<HTMLInputElement>('#answer-input');
        if (input && input.value.trim()) {
          this.submitAnswer(input.value.trim());
        }
      }
    });

    // Keyboard shortcuts for options (A, B, C, D)
    document.addEventListener('keydown', e => {
      const session = this.quizService.getCurrentSession();
      if (!session) {
        return;
      }

      const question = session.questions[this.currentQuestionIndex];
      if (!question?.options) {
        return;
      }

      const keyIndex = e.key.toUpperCase().charCodeAt(0) - 65;
      if (keyIndex >= 0 && keyIndex < question.options.length) {
        const options = document.querySelectorAll<HTMLElement>('.answer-option:not(.disabled)');
        if (options[keyIndex]) {
          const option = options[keyIndex];
          const value = option.dataset.value || '';
          this.submitAnswer(value);
        }
      }
    });
  }

  private startQuiz(
    mode: QuizType,
    category?: string,
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  ): void {
    let questions: QuizQuestion[] = [];

    switch (mode) {
      case 'shortcut-multiple-choice': {
        questions = this.quizService.generateShortcutQuiz(undefined, 10, difficulty);
        break;
      }
      case 'command-type': {
        questions = this.quizService.generateCommandQuiz(undefined, 10, difficulty);
        break;
      }
      case 'code-completion': {
        questions = this.quizService.generateCodeCompletionQuiz(category, 10, difficulty);
        break;
      }
      case 'reverse-lookup': {
        questions = this.quizService.generateReverseLookupQuiz(undefined, 10);
        break;
      }
      case 'timed-challenge': {
        questions = this.quizService.generateTimedChallenge(60, difficulty);
        this.timeRemaining = 60;
        break;
      }
    }

    if (questions.length === 0) {
      this.showError('Keine Fragen verfügbar für diesen Modus.');
      return;
    }

    this.quizService.startSession(mode, questions, category);
    this.currentQuestionIndex = 0;
    this.showQuestion();

    if (mode === 'timed-challenge') {
      this.startTimer();
    }
  }

  private showQuestion(): void {
    const session = this.quizService.getCurrentSession();
    if (!session) {
      return;
    }

    const question = session.questions[this.currentQuestionIndex];
    if (!question) {
      this.completeQuiz();
      return;
    }

    const content = document.getElementById('quiz-content');
    if (content) {
      content.innerHTML = this.renderQuizQuestion(
        question,
        this.currentQuestionIndex,
        session.questions.length
      );
    }

    this.questionStartTime = Date.now();

    // Focus input if exists
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('#answer-input');
      if (input) {
        input.focus();
      }
    }, 100);
  }

  private submitAnswer(answer: string): void {
    const timeSpent = Date.now() - this.questionStartTime;
    const result = this.quizService.submitAnswer(this.currentQuestionIndex, answer, timeSpent);

    if (!result) {
      return;
    }

    this.showFeedback(result);
  }

  private showFeedback(result: QuizResult): void {
    const session = this.quizService.getCurrentSession();
    if (!session) {
      return;
    }

    const question = session.questions[this.currentQuestionIndex];
    const feedback = document.getElementById('result-feedback');

    if (feedback) {
      feedback.innerHTML = `
        <div class="feedback-content ${result.correct ? 'correct' : 'incorrect'}">
          <span class="feedback-icon">${result.correct ? '' : ''}</span>
          <span class="feedback-text">
            ${
              result.correct
                ? `Richtig! +${result.pointsEarned} Punkte`
                : `Falsch! Die richtige Antwort war: ${escapeHtml(question.correctAnswer)}`
            }
          </span>
        </div>
        <button id="next-question" class="next-btn">
          ${this.currentQuestionIndex < session.questions.length - 1 ? 'Nächste Frage →' : 'Ergebnis anzeigen'}
        </button>
      `;
      feedback.classList.remove('hidden');
    }

    // Disable answer options
    document.querySelectorAll<HTMLElement>('.answer-option').forEach(btn => {
      btn.classList.add('disabled');
      const value = btn.dataset.value;
      if (value === question.correctAnswer) {
        btn.classList.add('correct-answer');
      } else if (value === result.userAnswer && !result.correct) {
        btn.classList.add('wrong-answer');
      }
    });

    // Disable text input
    const input = document.querySelector<HTMLInputElement>('#answer-input');
    if (input) {
      input.disabled = true;
    }
    const submitBtn = document.getElementById('submit-answer');
    if (submitBtn) {
      submitBtn.classList.add('disabled');
    }

    // For timed challenge, auto-advance after 1 second
    if (session.type === 'timed-challenge') {
      setTimeout(() => this.showNextQuestion(), 1000);
    }
  }

  private showNextQuestion(): void {
    this.currentQuestionIndex++;

    const session = this.quizService.getCurrentSession();
    if (!session || this.currentQuestionIndex >= session.questions.length) {
      this.completeQuiz();
    } else {
      this.showQuestion();
    }
  }

  private completeQuiz(): void {
    this.stopTimer();
    const session = this.quizService.completeSession();

    if (!session) {
      this.showQuizSelection();
      return;
    }

    const content = document.getElementById('quiz-content');
    if (content) {
      content.innerHTML = this.renderQuizResults(session);
    }
  }

  private showQuizSelection(): void {
    this.stopTimer();
    const content = document.getElementById('quiz-content');
    if (content) {
      content.innerHTML = this.renderQuizSelection();
    }
  }

  private startTimer(): void {
    this.timerInterval = window.setInterval(() => {
      this.timeRemaining--;

      const timerEl = document.getElementById('quiz-timer');
      if (timerEl) {
        timerEl.textContent = ` ${this.timeRemaining}s`;
        if (this.timeRemaining <= 10) {
          timerEl.classList.add('warning');
        }
      }

      if (this.timeRemaining <= 0) {
        this.completeQuiz();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private showError(message: string): void {
    const content = document.getElementById('quiz-content');
    if (content) {
      content.innerHTML = `
        <div class="quiz-error">
          <p> ${message}</p>
          <button id="back-to-selection" class="action-btn">Zurück</button>
        </div>
      `;
    }
  }

  private getQuizTypeName(type: QuizType): string {
    const names: Record<QuizType, string> = {
      'shortcut-multiple-choice': ' Shortcut Quiz',
      'command-type': ' Command Typing',
      'code-completion': ' Code Completion',
      'timed-challenge': ' Timed Challenge',
      'reverse-lookup': ' Reverse Lookup',
    };
    return names[type] || type;
  }

  private getGrade(accuracy: number): { emoji: string; text: string; class: string } {
    if (accuracy >= 90) {
      return { emoji: '', text: 'Exzellent!', class: 'grade-a' };
    }
    if (accuracy >= 80) {
      return { emoji: '', text: 'Sehr gut!', class: 'grade-b' };
    }
    if (accuracy >= 70) {
      return { emoji: '', text: 'Gut!', class: 'grade-c' };
    }
    if (accuracy >= 50) {
      return { emoji: '', text: 'Weiter üben!', class: 'grade-d' };
    }
    return { emoji: '', text: 'Nicht aufgeben!', class: 'grade-f' };
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  destroy(): void {
    this.stopTimer();
  }
}
