/**
 * Logger Service
 * Provides structured logging with log levels and environment-based filtering
 */

/// <reference types="vite/client" />

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  category: string;
  message: string;
  data?: unknown;
}

type LogListener = (entry: LogEntry) => void;

class LoggerImpl {
  private level: LogLevel;
  private readonly listeners: Set<LogListener> = new Set();
  private history: LogEntry[] = [];
  private readonly maxHistorySize = 1000;

  constructor() {
    // Set log level based on environment
    this.level = this.getDefaultLevel();
  }

  private getDefaultLevel(): LogLevel {
    // In production, only show warnings and errors
    // Use try-catch to handle environments where import.meta.env might not exist
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
        return LogLevel.WARN;
      }
    } catch {
      // Fallback to DEBUG if we can't determine environment
    }
    // In development, show everything
    return LogLevel.DEBUG;
  }

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.level;
  }

  /**
   * Subscribe to log events
   */
  subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get log history
   */
  getHistory(): readonly LogEntry[] {
    return [...this.history];
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Create a scoped logger for a specific category
   */
  scope(category: string): ScopedLogger {
    return new ScopedLogger(this, category);
  }

  /**
   * Internal log method
   */
  log(level: LogLevel, category: string, message: string, data?: unknown): void {
    if (level < this.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category,
      message,
      data,
    };

    // Add to history
    this.history.push(entry);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(entry);
      } catch {
        // Ignore listener errors
      }
    });

    // Console output
    this.consoleOutput(entry);
  }

  private consoleOutput(entry: LogEntry): void {
    const prefix = `[${entry.category}]`;
    const args: unknown[] = [prefix, entry.message];

    if (entry.data !== undefined) {
      args.push(entry.data);
    }

    /* eslint-disable no-console */
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(...args);
        break;
      case LogLevel.INFO:
        console.info(...args);
        break;
      case LogLevel.WARN:
        console.warn(...args);
        break;
      case LogLevel.ERROR:
        console.error(...args);
        break;
    }
    /* eslint-enable no-console */
  }

  // Convenience methods
  debug(category: string, message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  info(category: string, message: string, data?: unknown): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  warn(category: string, message: string, data?: unknown): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  error(category: string, message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, category, message, data);
  }
}

/**
 * Scoped logger for a specific category
 */
class ScopedLogger {
  constructor(
    private readonly logger: LoggerImpl,
    private readonly category: string
  ) {}

  debug(message: string, data?: unknown): void {
    this.logger.debug(this.category, message, data);
  }

  info(message: string, data?: unknown): void {
    this.logger.info(this.category, message, data);
  }

  warn(message: string, data?: unknown): void {
    this.logger.warn(this.category, message, data);
  }

  error(message: string, data?: unknown): void {
    this.logger.error(this.category, message, data);
  }
}

// Singleton instance
export const Logger = new LoggerImpl();

// Export types
export type { LogEntry, LogListener, ScopedLogger };
