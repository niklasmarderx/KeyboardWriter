/**
 * Type-safe EventBus implementation using Observer Pattern
 */

import type { BossBattle, Quest, QuestReward } from '../domain/models/Quest';
import { Logger } from './Logger';

const logger = Logger.scope('EventBus');

type EventCallback<T = unknown> = (data: T) => void;

interface EventSubscription {
  unsubscribe: () => void;
}

/**
 * Global event types for the application
 */
export interface AppEvents {
  // Story Mode / Quest events
  'quest:started': { quest: Quest };
  'quest:progress': { quest: Quest };
  'quest:completed': { quest: Quest; rewards: QuestReward };
  'chapter:completed': { chapterId: string };
  'player:levelup': { level: number; skillPoints: number };

  // Boss Battle events
  'boss:battle:start': { boss: BossBattle };
  'boss:battle:victory': { boss: BossBattle; wpm: number; accuracy: number };
  'boss:battle:defeat': { boss: BossBattle; wpm: number; accuracy: number };

  // Skill Tree events
  'skill:unlocked': { skillId: string; category: string };
  'skill:effect:applied': { skillId: string; effectType: string };

  // Typing events
  'typing:start': { lessonId: string; exerciseId: string };
  'typing:keystroke': { key: string; isCorrect: boolean; position: number };
  'typing:complete': { wpm: number; accuracy: number; time: number };
  'typing:backspace': { position: number };
  'typing:pause': void;
  'typing:resume': void;
  'typing:reset': void;

  // Lesson events
  'lesson:select': { lessonId: string };
  'lesson:start': { lessonId: string };
  'lesson:complete': {
    lessonId: string;
    exerciseId: string;
    wpm: number;
    accuracy: number;
    time: number;
    passed: boolean;
    xpEarned: number;
  };
  'lesson:exerciseComplete': {
    lessonId: string;
    exerciseIndex: number;
    result: { exerciseId: string; wpm: number; accuracy: number; time: number; errors: number };
  };
  'lesson:progress': { lessonId: string; progress: number };
  'lesson:quit': { lessonId: string };

  // Navigation events
  'nav:change': { page: string };
  'nav:modal:open': { modalId: string };
  'nav:modal:close': { modalId: string };

  // Settings events
  'settings:change': { key: string; value: unknown };
  'settings:theme:change': { theme: 'dark' | 'light' };
  'settings:sound:toggle': { enabled: boolean };

  // Statistics events
  'stats:update': { wpm: number; accuracy: number };
  'stats:session:end': { sessionId: string };

  // Achievement events
  'achievement:unlock': { achievementId: string };
  'achievement:progress': { achievementId: string; progress: number };

  // User events
  'user:levelup': { level: number; xp: number };
  'user:xp:gain': { amount: number; reason: string };

  // UI events
  'ui:toast': { message: string; type: 'success' | 'error' | 'warning' | 'info' };
  'ui:keyboard:highlight': { keyId: string };
  'ui:keyboard:clear': void;

  // Celebration events
  'celebration:levelup': void;
  'celebration:achievement': void;
  'celebration:perfect': void;
  'celebration:success': void;

  // Exercise Mode events
  'exerciseMode:start': { mode: string };
  'exerciseMode:end': { mode: string };

  // Dictation mode events
  'dictation:show': { chunk: string; index: number };
  'dictation:hide': { index: number };

  // Time pressure events
  'timePressure:start': { timeLimit: number };
  'timePressure:tick': { timeRemaining: number };
  'timePressure:timeout': void;
  'timePressure:stop': { timeRemaining: number };
  'timePressure:bonus': { bonus: number; newTime: number };

  // Error correction events
  'errorCorrection:correct': { position: number };
  'errorCorrection:falsePositive': { position: number };
  'errorCorrection:hint': { position: number; hintsRemaining: number };

  // Race events
  'race:win': { botName: string; wpm: number };
  'race:complete': { wpm: number; accuracy: number; time: number };
}

/**
 * EventBus singleton for application-wide event handling
 */
class EventBusImpl {
  private readonly listeners: Map<string, Set<EventCallback>> = new Map();

  /**
   * Subscribe to an event
   */
  on<K extends keyof AppEvents>(
    event: K,
    callback: EventCallback<AppEvents[K]>
  ): EventSubscription {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const callbacks = this.listeners.get(event)!;
    callbacks.add(callback as EventCallback);

    return {
      unsubscribe: () => {
        callbacks.delete(callback as EventCallback);
        if (callbacks.size === 0) {
          this.listeners.delete(event);
        }
      },
    };
  }

  /**
   * Subscribe to an event only once
   */
  once<K extends keyof AppEvents>(
    event: K,
    callback: EventCallback<AppEvents[K]>
  ): EventSubscription {
    const subscription = this.on(event, (data): void => {
      subscription.unsubscribe();
      callback(data);
    });
    return subscription;
  }

  /**
   * Emit an event
   */
  emit<K extends keyof AppEvents>(event: K, data: AppEvents[K]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks !== undefined) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          logger.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event
   */
  off<K extends keyof AppEvents>(event: K): void {
    this.listeners.delete(event);
  }

  /**
   * Remove all listeners
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * Get listener count for debugging
   */
  getListenerCount(event?: keyof AppEvents): number {
    if (event) {
      return this.listeners.get(event)?.size ?? 0;
    }
    let count = 0;
    this.listeners.forEach(set => {
      count += set.size;
    });
    return count;
  }
}

// Singleton instance
export const EventBus = new EventBusImpl();
