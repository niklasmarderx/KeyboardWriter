/**
 * Type-safe EventBus implementation using Observer Pattern
 */

type EventCallback<T = unknown> = (data: T) => void;

interface EventSubscription {
  unsubscribe: () => void;
}

/**
 * Global event types for the application
 */
export interface AppEvents {
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
    const subscription = this.on(event, data => {
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
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
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
