/**
 * Typing Race Page
 * Race against time, ghost recordings, or AI opponents
 */

import { VirtualKeyboard } from '../components/keyboard/VirtualKeyboard';
import { EventBus } from '../core';
import { ConfettiService, SoundService } from '../services';

// Race text samples
const RACE_TEXTS = [
  {
    id: 'race-1',
    text: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.',
    difficulty: 'easy',
  },
  {
    id: 'race-2',
    text: 'Programming is the art of telling another human what one wants the computer to do.',
    difficulty: 'easy',
  },
  {
    id: 'race-3',
    text: 'In the beginning was the command line. It remains the most powerful interface for any computer.',
    difficulty: 'medium',
  },
  {
    id: 'race-4',
    text: 'function quickSort(arr) { if (arr.length <= 1) return arr; const pivot = arr[0]; return [...quickSort(arr.filter(x => x < pivot)), pivot, ...quickSort(arr.filter(x => x > pivot))]; }',
    difficulty: 'hard',
  },
  {
    id: 'race-5',
    text: 'const fibonacci = n => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);',
    difficulty: 'medium',
  },
  {
    id: 'race-6',
    text: 'Software is eating the world, but AI is eating software. Learn to type fast or be left behind.',
    difficulty: 'easy',
  },
  {
    id: 'race-7',
    text: 'interface User { id: string; name: string; email: string; createdAt: Date; settings: UserSettings; }',
    difficulty: 'hard',
  },
  {
    id: 'race-8',
    text: 'The best way to predict the future is to invent it. Start typing, start creating.',
    difficulty: 'easy',
  },
  {
    id: 'race-9',
    text: 'async function fetchUser(id: string): Promise<User> { const res = await fetch(`/api/users/${id}`); if (!res.ok) throw new Error("Not found"); return res.json(); }',
    difficulty: 'hard',
  },
  {
    id: 'race-10',
    text: 'SELECT u.name, COUNT(o.id) AS orders FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id HAVING COUNT(o.id) > 5;',
    difficulty: 'hard',
  },
  {
    id: 'race-11',
    text: 'Clean code is not written by following a set of rules. You do not become a software craftsman by learning a list of heuristics.',
    difficulty: 'medium',
  },
  {
    id: 'race-12',
    text: 'git commit -m "feat: add user authentication with JWT tokens and refresh rotation"',
    difficulty: 'medium',
  },
];

/**
 * AI bot definitions with distinct personalities
 */
interface AIBot {
  id: string;
  name: string;
  emoji: string;
  description: string;
  baseWPM: number;
  /** Variance factor: higher = more inconsistent (human-like) */
  variance: number;
  /** Ramp-up: 0 = instant, 1 = slow start */
  rampUp: number;
  color: string;
}

const AI_BOTS: AIBot[] = [
  {
    id: 'rookie',
    name: 'Rookie Rita',
    emoji: '🐢',
    description: 'Langsam aber stetig – ideal für Anfänger',
    baseWPM: 25,
    variance: 0.3,
    rampUp: 0.5,
    color: '#10B981',
  },
  {
    id: 'average',
    name: 'Average Andy',
    emoji: '🚶',
    description: 'Ein typischer Büro-Tipper',
    baseWPM: 45,
    variance: 0.2,
    rampUp: 0.3,
    color: '#3B82F6',
  },
  {
    id: 'speedster',
    name: 'Speedy Sam',
    emoji: '🚀',
    description: 'Schnell und fokussiert',
    baseWPM: 70,
    variance: 0.1,
    rampUp: 0.2,
    color: '#8B5CF6',
  },
  {
    id: 'hacker',
    name: 'Hacker Hans',
    emoji: '💻',
    description: 'Blitzschnell bei Code-Texten',
    baseWPM: 90,
    variance: 0.15,
    rampUp: 0.1,
    color: '#F59E0B',
  },
  {
    id: 'legend',
    name: 'Legend Lisa',
    emoji: '⚡',
    description: 'Die ultimative Herausforderung',
    baseWPM: 120,
    variance: 0.05,
    rampUp: 0.05,
    color: '#EF4444',
  },
];

// Ghost replay data
interface GhostFrame {
  time: number;
  position: number;
}

interface RaceRecord {
  textId: string;
  wpm: number;
  accuracy: number;
  time: number;
  date: string;
  ghostData: GhostFrame[];
}

type RaceMode = 'solo' | 'ghost' | 'ai';
type RaceState = 'idle' | 'countdown' | 'racing' | 'finished';

export class TypingRacePage {
  private keyboard: VirtualKeyboard | null = null;
  private currentText: (typeof RACE_TEXTS)[0] | null = null;
  private raceMode: RaceMode = 'solo';
  private raceState: RaceState = 'idle';
  private typedText: string = '';
  private startTime: number = 0;
  private currentTime: number = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private countdownValue: number = 3;
  private errors: number = 0;
  private ghostData: GhostFrame[] = [];
  private ghostPosition: number = 0;
  private ghostInterval: ReturnType<typeof setInterval> | null = null;
  private aiPosition: number = 0;
  private selectedBot: AIBot = AI_BOTS[1]; // default: Average Andy
  private aiInterval: ReturnType<typeof setInterval> | null = null;
  private records: RaceRecord[] = [];
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private raceWins: number = 0;

  constructor() {
    this.loadRecords();
    this.raceWins = parseInt(localStorage.getItem('typecraft_race_wins') ?? '0', 10);
  }

  /**
   * Load race records from localStorage
   */
  private loadRecords(): void {
    try {
      const stored = localStorage.getItem('typecraft_race_records');
      if (stored) {
        this.records = JSON.parse(stored) as RaceRecord[];
      }
    } catch {
      // Ignore errors
    }
  }

  /**
   * Save race records
   */
  private saveRecords(): void {
    try {
      localStorage.setItem('typecraft_race_records', JSON.stringify(this.records));
    } catch {
      // Ignore errors
    }
  }

  /**
   * Get best record for a text
   */
  private getBestRecord(textId: string): RaceRecord | null {
    const textRecords = this.records.filter(r => r.textId === textId);
    if (textRecords.length === 0) {
      return null;
    }
    return textRecords.reduce((best, r) => (r.time < best.time ? r : best));
  }

  /**
   * Render the page
   */
  render(): string {
    return `
      <div class="race-page">
        ${this.renderHeader()}
        <div class="race-content">
          ${this.raceState === 'idle' ? this.renderTextSelection() : ''}
          ${this.raceState !== 'idle' ? this.renderRaceTrack() : ''}
        </div>
        ${this.renderKeyboard()}
      </div>
      ${this.renderStyles()}
    `;
  }

  /**
   * Render header
   */
  private renderHeader(): string {
    return `
      <div class="race-header">
        <div class="header-left">
          <h1>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            Typing Race
          </h1>
          <p>Wettrennen gegen die Zeit, deinen Geist oder KI-Gegner</p>
        </div>
        <div class="header-stats">
          <div class="stat">
            <span class="stat-value">${this.records.length}</span>
            <span class="stat-label">Rennen</span>
          </div>
          <div class="stat">
            <span class="stat-value">${this.getBestOverallWPM()}</span>
            <span class="stat-label">Best WPM</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get best overall WPM
   */
  private getBestOverallWPM(): number {
    if (this.records.length === 0) {
      return 0;
    }
    return Math.max(...this.records.map(r => r.wpm));
  }

  /**
   * Render text selection
   */
  private renderTextSelection(): string {
    return `
      <div class="text-selection">
        <div class="mode-selector">
          <h3>Rennmodus</h3>
          <div class="mode-buttons">
            <button class="mode-btn ${this.raceMode === 'solo' ? 'active' : ''}" data-mode="solo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M5.5 21a8.5 8.5 0 0 1 13 0"></path>
              </svg>
              Solo
            </button>
            <button class="mode-btn ${this.raceMode === 'ghost' ? 'active' : ''}" data-mode="ghost">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2 3 3-3 3 3 2-3 3 3V10a8 8 0 0 0-8-8z"></path>
                <circle cx="9" cy="10" r="1"></circle>
                <circle cx="15" cy="10" r="1"></circle>
              </svg>
              Gegen Geist
            </button>
            <button class="mode-btn ${this.raceMode === 'ai' ? 'active' : ''}" data-mode="ai">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="9" y2="9"></line>
                <line x1="15" y1="9" x2="15" y2="9"></line>
                <path d="M9 15h6"></path>
              </svg>
              Gegen KI
            </button>
          </div>
          ${this.raceMode === 'ai' ? this.renderAISpeedSelector() : ''}
        </div>

        <h3>Wähle einen Text</h3>
        <div class="text-grid">
          ${RACE_TEXTS.map(text => this.renderTextCard(text)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render AI speed selector
   */
  private renderAISpeedSelector(): string {
    return `
      <div class="ai-bot-selector">
        <label>KI-Gegner wählen:</label>
        <div class="bot-grid">
          ${AI_BOTS.map(
            bot => `
            <button
              class="bot-card ${this.selectedBot.id === bot.id ? 'selected' : ''}"
              data-bot-id="${bot.id}"
              aria-label="${bot.name}: ${bot.description}"
              aria-pressed="${this.selectedBot.id === bot.id}"
            >
              <span class="bot-emoji" aria-hidden="true">${bot.emoji}</span>
              <span class="bot-name">${bot.name}</span>
              <span class="bot-wpm">${bot.baseWPM} WPM</span>
              <span class="bot-desc">${bot.description}</span>
            </button>
          `
          ).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render text card
   */
  private renderTextCard(text: (typeof RACE_TEXTS)[0]): string {
    const bestRecord = this.getBestRecord(text.id);
    const difficultyColors: Record<string, string> = {
      easy: 'var(--accent-success)',
      medium: 'var(--accent-warning)',
      hard: 'var(--accent-error)',
    };
    const difficultyLabels: Record<string, string> = {
      easy: 'Einfach',
      medium: 'Mittel',
      hard: 'Schwer',
    };

    return `
      <div class="text-card" data-text-id="${text.id}">
        <div class="text-card-header">
          <span class="difficulty-badge" style="background: ${difficultyColors[text.difficulty]}20; color: ${difficultyColors[text.difficulty]}">
            ${difficultyLabels[text.difficulty]}
          </span>
          ${bestRecord ? `<span class="best-time"> ${bestRecord.wpm} WPM</span>` : ''}
        </div>
        <p class="text-preview">${text.text.substring(0, 80)}${text.text.length > 80 ? '...' : ''}</p>
        <div class="text-card-footer">
          <span class="char-count">${text.text.length} Zeichen</span>
          <button class="btn btn-primary btn-sm start-race-btn" data-text-id="${text.id}">
            Start
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render race track
   */
  private renderRaceTrack(): string {
    if (!this.currentText) {
      return '';
    }

    const progress = (this.typedText.length / this.currentText.text.length) * 100;
    const ghostProgress = (this.ghostPosition / this.currentText.text.length) * 100;
    const aiProgress = (this.aiPosition / this.currentText.text.length) * 100;

    return `
      <div class="race-track-container">
        ${this.raceState === 'countdown' ? this.renderCountdown() : ''}
        ${
          this.raceState === 'racing' || this.raceState === 'finished'
            ? `
          <div class="race-info">
            <div class="race-timer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
              <span>${this.formatTime(this.currentTime)}</span>
            </div>
            <div class="race-wpm">
              <span class="value">${this.calculateWPM()}</span>
              <span class="label">WPM</span>
            </div>
            <div class="race-accuracy">
              <span class="value">${this.calculateAccuracy()}%</span>
              <span class="label">Genauigkeit</span>
            </div>
          </div>

          <div class="race-tracks">
            <div class="track player-track">
              <span class="track-label">Du</span>
              <div class="track-bar">
                <div class="track-progress" style="width: ${progress}%">
                  <span class="racer"></span>
                </div>
              </div>
              <span class="track-percent">${Math.round(progress)}%</span>
            </div>
            
            ${
              this.raceMode === 'ghost' && this.ghostData.length > 0
                ? `
              <div class="track ghost-track">
                <span class="track-label"> Geist</span>
                <div class="track-bar ghost">
                  <div class="track-progress" style="width: ${ghostProgress}%">
                    <span class="racer"></span>
                  </div>
                </div>
                <span class="track-percent">${Math.round(ghostProgress)}%</span>
              </div>
            `
                : ''
            }
            
            ${
              this.raceMode === 'ai'
                ? `
              <div class="track ai-track">
                <span class="track-label">${this.selectedBot.emoji} ${this.selectedBot.name}</span>
                <div class="track-bar ai">
                  <div class="track-progress" style="width: ${aiProgress}%">
                    <span class="racer"></span>
                  </div>
                </div>
                <span class="track-percent">${Math.round(aiProgress)}%</span>
              </div>
            `
                : ''
            }
          </div>

          <div class="typing-area">
            <div class="text-display">
              ${this.renderTextWithHighlight()}
            </div>
            ${this.raceState === 'finished' ? this.renderResults() : ''}
          </div>
        `
            : ''
        }
        
        ${
          this.raceState !== 'finished'
            ? ''
            : `
          <div class="race-actions">
            <button class="btn btn-secondary" id="btn-race-again">
               Nochmal
            </button>
            <button class="btn btn-primary" id="btn-new-text">
               Neuer Text
            </button>
          </div>
        `
        }
      </div>
    `;
  }

  /**
   * Render countdown
   */
  private renderCountdown(): string {
    return `
      <div class="countdown-overlay">
        <div class="countdown-value ${this.countdownValue === 0 ? 'go' : ''}">${this.countdownValue === 0 ? 'LOS!' : this.countdownValue}</div>
      </div>
    `;
  }

  /**
   * Render text with highlight
   */
  private renderTextWithHighlight(): string {
    if (!this.currentText) {
      return '';
    }

    const text = this.currentText.text;
    let html = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const typedChar = this.typedText[i];

      let className = '';
      if (i < this.typedText.length) {
        className = typedChar === char ? 'correct' : 'incorrect';
      } else if (i === this.typedText.length) {
        className = 'current';
      }

      // Handle spaces
      const displayChar = char === ' ' ? '␣' : this.escapeHtml(char);
      html += `<span class="char ${className}">${displayChar}</span>`;
    }

    return html;
  }

  /**
   * Render results
   */
  private renderResults(): string {
    const wpm = this.calculateWPM();
    const accuracy = this.calculateAccuracy();
    const bestRecord = this.currentText ? this.getBestRecord(this.currentText.id) : null;
    const isNewRecord = !bestRecord || this.currentTime < bestRecord.time;

    return `
      <div class="race-results ${isNewRecord ? 'new-record' : ''}">
        ${isNewRecord ? '<div class="new-record-badge"> Neuer Rekord!</div>' : ''}
        <div class="result-stats">
          <div class="result-stat">
            <span class="value">${wpm}</span>
            <span class="label">WPM</span>
          </div>
          <div class="result-stat">
            <span class="value">${accuracy}%</span>
            <span class="label">Genauigkeit</span>
          </div>
          <div class="result-stat">
            <span class="value">${this.formatTime(this.currentTime)}</span>
            <span class="label">Zeit</span>
          </div>
        </div>
        ${
          this.raceMode === 'ghost' && this.ghostData.length > 0
            ? `
          <div class="ghost-comparison">
            ${
              this.typedText.length >= (this.currentText?.text.length ?? 0) &&
              this.ghostPosition < (this.currentText?.text.length ?? 0)
                ? ' Du hast deinen Geist geschlagen!'
                : ' Der Geist war schneller!'
            }
          </div>
        `
            : ''
        }
        ${
          this.raceMode === 'ai'
            ? `
          <div class="ai-comparison">
            ${
              this.typedText.length >= (this.currentText?.text.length ?? 0) &&
              this.aiPosition < (this.currentText?.text.length ?? 0)
                ? ` Du hast ${this.selectedBot.name} geschlagen!`
                : ` ${this.selectedBot.name} war schneller!`
            }
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  /**
   * Render keyboard
   */
  private renderKeyboard(): string {
    return `
      <div class="keyboard-section" style="margin-top: var(--space-4);">
        <div id="race-keyboard"></div>
      </div>
    `;
  }

  /**
   * Calculate WPM
   */
  private calculateWPM(): number {
    if (this.currentTime === 0) {
      return 0;
    }
    const words = this.typedText.length / 5; // Standard: 5 chars = 1 word
    const minutes = this.currentTime / 60000;
    return Math.round(words / minutes);
  }

  /**
   * Calculate accuracy
   */
  private calculateAccuracy(): number {
    if (this.typedText.length === 0) {
      return 100;
    }
    const correct = this.typedText.length - this.errors;
    return Math.round((correct / this.typedText.length) * 100);
  }

  /**
   * Format time
   */
  private formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const millis = Math.floor((ms % 1000) / 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  }

  /**
   * Escape HTML
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Render styles
   */
  private renderStyles(): string {
    return `
      <style>
        .race-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: var(--space-4);
        }

        .race-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-6);
        }

        .race-header h1 {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-2xl);
        }

        .race-header p {
          color: var(--text-secondary);
          margin-top: var(--space-1);
        }

        .header-stats {
          display: flex;
          gap: var(--space-4);
        }

        .header-stats .stat {
          text-align: center;
        }

        .header-stats .stat-value {
          font-size: var(--font-size-xl);
          font-weight: bold;
          color: var(--accent-primary);
        }

        .header-stats .stat-label {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        /* Mode Selector */
        .mode-selector {
          margin-bottom: var(--space-6);
        }

        .mode-selector h3 {
          margin-bottom: var(--space-3);
        }

        .mode-buttons {
          display: flex;
          gap: var(--space-2);
        }

        .mode-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: var(--bg-secondary);
          border: 2px solid var(--border-primary);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode-btn:hover {
          border-color: var(--accent-primary);
        }

        .mode-btn.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }

        .ai-speed-selector {
          margin-top: var(--space-4);
          padding: var(--space-3);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }

        .ai-speed-selector label {
          display: block;
          margin-bottom: var(--space-2);
        }

        .ai-speed-selector input[type="range"] {
          width: 100%;
        }

        .speed-labels {
          display: flex;
          justify-content: space-between;
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        /* Bot Selector */
        .ai-bot-selector {
          margin-top: var(--space-4);
        }

        .ai-bot-selector > label {
          display: block;
          margin-bottom: var(--space-3);
          font-weight: 600;
        }

        .bot-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: var(--space-2);
        }

        .bot-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-3);
          background: var(--bg-secondary);
          border: 2px solid var(--border-primary);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .bot-card:hover {
          border-color: var(--accent-primary);
        }

        .bot-card.selected {
          border-color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.1);
        }

        .bot-emoji {
          font-size: 1.8rem;
        }

        .bot-name {
          font-weight: 600;
          font-size: var(--font-size-sm);
        }

        .bot-wpm {
          font-size: var(--font-size-xs);
          color: var(--accent-primary);
          font-weight: 600;
        }

        .bot-desc {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
          line-height: 1.3;
        }

        /* Text Grid */
        .text-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--space-4);
        }

        .text-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }

        .text-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-2px);
        }

        .text-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-2);
        }

        .difficulty-badge {
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 600;
        }

        .best-time {
          font-size: var(--font-size-sm);
          color: var(--accent-warning);
        }

        .text-preview {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          line-height: 1.5;
          margin-bottom: var(--space-3);
          font-family: var(--font-mono);
        }

        .text-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .char-count {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        /* Race Track */
        .race-track-container {
          position: relative;
        }

        .countdown-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border-radius: var(--radius-lg);
        }

        .countdown-value {
          font-size: 120px;
          font-weight: bold;
          color: var(--accent-primary);
          animation: countdown-pulse 1s ease;
        }

        .countdown-value.go {
          color: var(--accent-success);
        }

        @keyframes countdown-pulse {
          0% { transform: scale(1.5); opacity: 0; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }

        .race-info {
          display: flex;
          justify-content: center;
          gap: var(--space-6);
          padding: var(--space-4);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-4);
        }

        .race-timer {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-xl);
          font-family: var(--font-mono);
        }

        .race-wpm, .race-accuracy {
          text-align: center;
        }

        .race-wpm .value, .race-accuracy .value {
          font-size: var(--font-size-xl);
          font-weight: bold;
        }

        .race-wpm .value { color: var(--accent-primary); }
        .race-accuracy .value { color: var(--accent-success); }

        .race-wpm .label, .race-accuracy .label {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        /* Tracks */
        .race-tracks {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .track {
          display: grid;
          grid-template-columns: 120px 1fr 50px;
          align-items: center;
          gap: var(--space-2);
        }

        .track-label {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .track-bar {
          height: 32px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
          position: relative;
        }

        .track-bar.ghost { background: rgba(139, 92, 246, 0.2); }
        .track-bar.ai { background: rgba(59, 130, 246, 0.2); }

        .track-progress {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-success));
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: var(--space-1);
          transition: width 0.1s linear;
          min-width: 40px;
        }

        .ghost-track .track-progress {
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
        }

        .ai-track .track-progress {
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        }

        .racer {
          font-size: 20px;
        }

        .track-percent {
          font-size: var(--font-size-sm);
          color: var(--text-muted);
          text-align: right;
        }

        /* Typing Area */
        .typing-area {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
        }

        .text-display {
          font-family: var(--font-mono);
          font-size: var(--font-size-lg);
          line-height: 2;
          word-wrap: break-word;
          user-select: none;
        }

        .text-display .char {
          padding: 2px 1px;
          border-radius: 2px;
        }

        .text-display .char.correct {
          color: var(--accent-success);
          background: rgba(34, 197, 94, 0.1);
        }

        .text-display .char.incorrect {
          color: var(--accent-error);
          background: rgba(239, 68, 68, 0.2);
          text-decoration: underline;
        }

        .text-display .char.current {
          background: var(--accent-primary);
          color: white;
          animation: cursor-blink 1s step-end infinite;
        }

        @keyframes cursor-blink {
          50% { opacity: 0.5; }
        }

        /* Results */
        .race-results {
          margin-top: var(--space-4);
          padding: var(--space-4);
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          text-align: center;
        }

        .race-results.new-record {
          border: 2px solid var(--accent-warning);
          animation: glow 1s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from { box-shadow: 0 0 10px rgba(245, 158, 11, 0.3); }
          to { box-shadow: 0 0 20px rgba(245, 158, 11, 0.6); }
        }

        .new-record-badge {
          font-size: var(--font-size-lg);
          font-weight: bold;
          color: var(--accent-warning);
          margin-bottom: var(--space-3);
        }

        .result-stats {
          display: flex;
          justify-content: center;
          gap: var(--space-6);
        }

        .result-stat .value {
          font-size: var(--font-size-2xl);
          font-weight: bold;
          color: var(--accent-primary);
        }

        .result-stat .label {
          font-size: var(--font-size-sm);
          color: var(--text-muted);
        }

        .ghost-comparison, .ai-comparison {
          margin-top: var(--space-3);
          font-size: var(--font-size-lg);
        }

        /* Actions */
        .race-actions {
          display: flex;
          justify-content: center;
          gap: var(--space-3);
          margin-top: var(--space-4);
        }

        @media (max-width: 600px) {
          .mode-buttons {
            flex-direction: column;
          }

          .track {
            grid-template-columns: 80px 1fr 40px;
          }
        }
      </style>
    `;
  }

  /**
   * Initialize the page
   */
  init(): void {
    // Initialize keyboard
    const keyboardContainer = document.getElementById('race-keyboard');
    if (keyboardContainer) {
      this.keyboard = new VirtualKeyboard('race-keyboard');
    }

    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.raceMode = (btn as HTMLElement).dataset.mode as RaceMode;
        this.updatePage();
      });
    });

    // Bot selector
    document.querySelectorAll<HTMLButtonElement>('.bot-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const botId = btn.dataset.botId;
        const bot = AI_BOTS.find(b => b.id === botId);
        if (bot) {
          this.selectedBot = bot;
          document.querySelectorAll<HTMLButtonElement>('.bot-card').forEach(b => {
            b.classList.toggle('selected', b.dataset.botId === botId);
            b.setAttribute('aria-pressed', String(b.dataset.botId === botId));
          });
        }
      });
    });

    // Start race buttons
    document.querySelectorAll('.start-race-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const textId = (btn as HTMLElement).dataset.textId;
        if (textId) {
          this.startRace(textId);
        }
      });
    });

    // Race again button
    document.getElementById('btn-race-again')?.addEventListener('click', () => {
      if (this.currentText) {
        this.startRace(this.currentText.id);
      }
    });

    // New text button
    document.getElementById('btn-new-text')?.addEventListener('click', () => {
      this.resetRace();
      this.updatePage();
    });
  }

  /**
   * Start a race
   */
  private startRace(textId: string): void {
    this.currentText = RACE_TEXTS.find(t => t.id === textId) ?? null;
    if (!this.currentText) {
      return;
    }

    // Load ghost data if racing against ghost
    if (this.raceMode === 'ghost') {
      const bestRecord = this.getBestRecord(textId);
      this.ghostData = bestRecord?.ghostData ?? [];
      this.ghostPosition = 0;
    }

    // Reset state
    this.typedText = '';
    this.errors = 0;
    this.startTime = 0;
    this.currentTime = 0;
    this.aiPosition = 0;
    this.countdownValue = 3;
    this.raceState = 'countdown';
    this.ghostData = [];

    // Store ghost frames during race
    if (this.raceMode === 'ghost' || this.raceMode === 'solo') {
      this.ghostData = [];
    }

    this.updatePage();

    // Start countdown
    const countdownInterval = setInterval(() => {
      this.countdownValue--;
      this.updateCountdown();

      if (this.countdownValue === 0) {
        clearInterval(countdownInterval);
        setTimeout(() => {
          this.beginRacing();
        }, 500);
      }
    }, 1000);
  }

  /**
   * Update countdown display
   */
  private updateCountdown(): void {
    const countdownEl = document.querySelector('.countdown-value');
    if (countdownEl) {
      countdownEl.textContent = this.countdownValue === 0 ? 'LOS!' : this.countdownValue.toString();
      countdownEl.className = `countdown-value ${this.countdownValue === 0 ? 'go' : ''}`;
    }
  }

  /**
   * Begin racing
   */
  private beginRacing(): void {
    this.raceState = 'racing';
    this.startTime = Date.now();
    this.updatePage();

    // Start timer
    this.timerInterval = setInterval(() => {
      this.currentTime = Date.now() - this.startTime;
      this.updateRaceInfo();
    }, 50);

    // Start ghost if applicable
    if (this.raceMode === 'ghost' && this.ghostData.length > 0) {
      this.startGhost();
    }

    // Start AI if applicable
    if (this.raceMode === 'ai') {
      this.startAI();
    }

    // Setup keyboard listener
    this.keydownHandler = (e: KeyboardEvent) => this.handleKeypress(e);
    document.addEventListener('keydown', this.keydownHandler);
  }

  /**
   * Handle keypress
   */
  private handleKeypress(e: KeyboardEvent): void {
    if (this.raceState !== 'racing' || !this.currentText) {
      return;
    }

    // Ignore modifier keys
    if (e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    e.preventDefault();

    const expectedChar = this.currentText.text[this.typedText.length];

    if (e.key === 'Backspace') {
      if (this.typedText.length > 0) {
        this.typedText = this.typedText.slice(0, -1);
      }
    } else if (e.key.length === 1) {
      this.typedText += e.key;

      // Check for error
      if (e.key !== expectedChar) {
        this.errors++;
        SoundService.playIncorrect();
      } else {
        SoundService.playCorrect();
      }

      // Record ghost frame
      this.ghostData.push({
        time: this.currentTime,
        position: this.typedText.length,
      });
    }

    this.updateTypingDisplay();

    // Check if finished
    if (this.typedText.length >= this.currentText.text.length) {
      this.finishRace();
    }
  }

  /**
   * Start ghost replay
   */
  private startGhost(): void {
    if (this.ghostData.length === 0) {
      return;
    }

    let frameIndex = 0;
    this.ghostInterval = setInterval(() => {
      while (
        frameIndex < this.ghostData.length &&
        this.ghostData[frameIndex].time <= this.currentTime
      ) {
        this.ghostPosition = this.ghostData[frameIndex].position;
        frameIndex++;
      }
      this.updateGhostPosition();

      if (frameIndex >= this.ghostData.length) {
        if (this.ghostInterval) {
          clearInterval(this.ghostInterval);
        }
      }
    }, 50);
  }

  /**
   * Start AI opponent with personality-based behavior
   */
  private startAI(): void {
    const bot = this.selectedBot;
    const charsPerMs = (bot.baseWPM * 5) / 60000;

    this.aiInterval = setInterval(() => {
      if (!this.currentText) {
        return;
      }

      // Ramp-up: bot starts slower and accelerates
      const elapsed = this.currentTime;
      const rampFactor = bot.rampUp > 0 ? Math.min(1, elapsed / (3000 * bot.rampUp + 500)) : 1;

      // Variance: simulate human inconsistency
      const noise = 1 + (Math.random() - 0.5) * bot.variance;
      const effectiveRate = charsPerMs * rampFactor * noise;

      this.aiPosition = Math.min(
        Math.floor(this.currentTime * effectiveRate),
        this.currentText.text.length
      );
      this.updateAIPosition();
    }, 50);
  }

  /**
   * Finish the race
   */
  private finishRace(): void {
    this.raceState = 'finished';

    // Stop timers
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.ghostInterval) {
      clearInterval(this.ghostInterval);
    }
    if (this.aiInterval) {
      clearInterval(this.aiInterval);
    }

    // Remove keyboard listener
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }

    // Calculate final stats
    const wpm = this.calculateWPM();
    const accuracy = this.calculateAccuracy();

    // Save record
    if (this.currentText) {
      const newRecord: RaceRecord = {
        textId: this.currentText.id,
        wpm,
        accuracy,
        time: this.currentTime,
        date: new Date().toISOString(),
        ghostData: this.ghostData,
      };

      const bestRecord = this.getBestRecord(this.currentText.id);
      const isNewRecord = !bestRecord || this.currentTime < bestRecord.time;

      // Track race win vs AI
      const playerWon = this.raceMode === 'ai' && this.aiPosition < this.currentText.text.length;
      if (playerWon) {
        this.raceWins++;
        localStorage.setItem('typecraft_race_wins', String(this.raceWins));
        EventBus.emit('race:win', { botName: this.selectedBot.name, wpm });
      }

      this.records.push(newRecord);
      this.saveRecords();

      // Celebrate
      if (isNewRecord) {
        ConfettiService.bigCelebrate();
        SoundService.playLevelUp();
        EventBus.emit('ui:toast', { message: ' Neuer Rekord!', type: 'success' });
      } else {
        ConfettiService.celebrate('small');
        SoundService.playSuccess();
      }
    }

    this.updatePage();
  }

  /**
   * Reset race
   */
  private resetRace(): void {
    this.raceState = 'idle';
    this.currentText = null;
    this.typedText = '';
    this.errors = 0;
    this.startTime = 0;
    this.currentTime = 0;
    this.ghostData = [];
    this.ghostPosition = 0;
    this.aiPosition = 0;

    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
  }

  /**
   * Update page
   */
  private updatePage(): void {
    const container = document.querySelector('.race-content');
    if (container) {
      container.innerHTML =
        this.raceState === 'idle' ? this.renderTextSelection() : this.renderRaceTrack();
      this.setupEventListeners();
    }
  }

  /**
   * Update race info display
   */
  private updateRaceInfo(): void {
    const timerEl = document.querySelector('.race-timer span');
    const wpmEl = document.querySelector('.race-wpm .value');
    const accuracyEl = document.querySelector('.race-accuracy .value');
    const progressEl = document.querySelector('.player-track .track-progress') as HTMLElement;
    const percentEl = document.querySelector('.player-track .track-percent');

    if (timerEl) {
      timerEl.textContent = this.formatTime(this.currentTime);
    }
    if (wpmEl) {
      wpmEl.textContent = this.calculateWPM().toString();
    }
    if (accuracyEl) {
      accuracyEl.textContent = `${this.calculateAccuracy()}%`;
    }
    if (progressEl && this.currentText) {
      const progress = (this.typedText.length / this.currentText.text.length) * 100;
      progressEl.style.width = `${progress}%`;
    }
    if (percentEl && this.currentText) {
      const progress = (this.typedText.length / this.currentText.text.length) * 100;
      percentEl.textContent = `${Math.round(progress)}%`;
    }
  }

  /**
   * Update typing display
   */
  private updateTypingDisplay(): void {
    const textDisplay = document.querySelector('.text-display');
    if (textDisplay) {
      textDisplay.innerHTML = this.renderTextWithHighlight();
    }
    this.updateRaceInfo();
  }

  /**
   * Update ghost position
   */
  private updateGhostPosition(): void {
    const progressEl = document.querySelector('.ghost-track .track-progress') as HTMLElement;
    const percentEl = document.querySelector('.ghost-track .track-percent');

    if (progressEl && this.currentText) {
      const progress = (this.ghostPosition / this.currentText.text.length) * 100;
      progressEl.style.width = `${progress}%`;
    }
    if (percentEl && this.currentText) {
      const progress = (this.ghostPosition / this.currentText.text.length) * 100;
      percentEl.textContent = `${Math.round(progress)}%`;
    }
  }

  /**
   * Update AI position
   */
  private updateAIPosition(): void {
    const progressEl = document.querySelector('.ai-track .track-progress') as HTMLElement;
    const percentEl = document.querySelector('.ai-track .track-percent');

    if (progressEl && this.currentText) {
      const progress = (this.aiPosition / this.currentText.text.length) * 100;
      progressEl.style.width = `${progress}%`;
    }
    if (percentEl && this.currentText) {
      const progress = (this.aiPosition / this.currentText.text.length) * 100;
      percentEl.textContent = `${Math.round(progress)}%`;
    }
  }

  /**
   * Destroy the page
   */
  destroy(): void {
    if (this.keyboard) {
      this.keyboard.destroy();
      this.keyboard = null;
    }

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.ghostInterval) {
      clearInterval(this.ghostInterval);
    }
    if (this.aiInterval) {
      clearInterval(this.aiInterval);
    }
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
  }
}
