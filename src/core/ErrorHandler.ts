/**
 *
 * Global Error Handler Service
 * Provides centralized error handling and user-friendly error messages
 */

import { EventBus } from './EventBus';
import { Logger } from './Logger';

const logger = Logger.scope('ErrorHandler');

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low', // User can continue, just log
  MEDIUM = 'medium', // Show toast, recoverable
  HIGH = 'high', // Show modal, needs user action
  CRITICAL = 'critical', // App may be unstable
}

/**
 * Application error interface
 */
export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  context?: Record<string, unknown>;
  originalError?: Error;
  timestamp: Date;
}

/**
 * Error codes for the application
 */
export const ErrorCodes = {
  // Storage errors
  STORAGE_READ_FAILED: 'STORAGE_READ_FAILED',
  STORAGE_WRITE_FAILED: 'STORAGE_WRITE_FAILED',
  STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',

  // Session errors
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  SESSION_INVALID: 'SESSION_INVALID',

  // Lesson errors
  LESSON_NOT_FOUND: 'LESSON_NOT_FOUND',
  LESSON_LOAD_FAILED: 'LESSON_LOAD_FAILED',

  // Network errors
  NETWORK_OFFLINE: 'NETWORK_OFFLINE',
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  API_ERROR: 'API_ERROR',

  // UI errors
  RENDER_FAILED: 'RENDER_FAILED',
  COMPONENT_NOT_FOUND: 'COMPONENT_NOT_FOUND',

  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * User-friendly error messages (German)
 */
const userMessages: Record<ErrorCode, string> = {
  [ErrorCodes.STORAGE_READ_FAILED]: 'Daten konnten nicht geladen werden. Bitte Seite neu laden.',
  [ErrorCodes.STORAGE_WRITE_FAILED]: 'Daten konnten nicht gespeichert werden.',
  [ErrorCodes.STORAGE_QUOTA_EXCEEDED]: 'Speicherplatz voll. Bitte alte Daten löschen.',
  [ErrorCodes.SESSION_NOT_FOUND]: 'Sitzung nicht gefunden.',
  [ErrorCodes.SESSION_INVALID]: 'Ungültige Sitzung. Bitte neu starten.',
  [ErrorCodes.LESSON_NOT_FOUND]: 'Lektion nicht gefunden.',
  [ErrorCodes.LESSON_LOAD_FAILED]: 'Lektion konnte nicht geladen werden.',
  [ErrorCodes.NETWORK_OFFLINE]: 'Keine Internetverbindung.',
  [ErrorCodes.NETWORK_TIMEOUT]: 'Zeitüberschreitung bei der Verbindung.',
  [ErrorCodes.API_ERROR]: 'Serverfehler. Bitte später erneut versuchen.',
  [ErrorCodes.RENDER_FAILED]: 'Anzeigefehler. Bitte Seite neu laden.',
  [ErrorCodes.COMPONENT_NOT_FOUND]: 'Komponente nicht gefunden.',
  [ErrorCodes.UNKNOWN_ERROR]: 'Ein unerwarteter Fehler ist aufgetreten.',
  [ErrorCodes.VALIDATION_ERROR]: 'Ungültige Eingabe.',
};

type ErrorListener = (error: AppError) => void;

/**
 * Error Handler singleton
 */
class ErrorHandlerImpl {
  private readonly errors: AppError[] = [];
  private readonly listeners: Set<ErrorListener> = new Set();
  private readonly maxErrors = 100;

  constructor() {
    this.setupGlobalHandlers();
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalHandlers(): void {
    // Handle uncaught errors
    window.addEventListener('error', event => {
      const originalError = event.error instanceof Error ? event.error : undefined;
      this.handle({
        code: ErrorCodes.UNKNOWN_ERROR,
        message: event.message,
        severity: ErrorSeverity.HIGH,
        originalError,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      const reason: unknown = event.reason;
      const errorObj = reason instanceof Error ? reason : new Error(String(reason));
      this.handle({
        code: ErrorCodes.UNKNOWN_ERROR,
        message: errorObj.message,
        severity: ErrorSeverity.HIGH,
        originalError: errorObj,
      });
    });
  }

  /**
   * Handle an error
   */
  handle(options: {
    code: ErrorCode;
    message: string;
    severity?: ErrorSeverity;
    context?: Record<string, unknown>;
    originalError?: Error;
  }): AppError {
    const error: AppError = {
      code: options.code,
      message: options.message,
      userMessage: userMessages[options.code] || userMessages[ErrorCodes.UNKNOWN_ERROR],
      severity: options.severity !== undefined ? options.severity : ErrorSeverity.MEDIUM,
      context: options.context,
      originalError: options.originalError,
      timestamp: new Date(),
    };

    // Log the error
    logger.error(`${error.code}: ${error.message}`, {
      severity: error.severity,
      context: error.context,
      stack: error.originalError?.stack,
    });

    // Store error
    this.errors.push(error);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch {
        // Ignore listener errors
      }
    });

    // Show user notification based on severity
    this.notifyUser(error);

    return error;
  }

  /**
   * Show appropriate notification to user
   */
  private notifyUser(error: AppError): void {
    switch (error.severity) {
      case ErrorSeverity.LOW:
        // Just log, no notification
        break;
      case ErrorSeverity.MEDIUM:
        EventBus.emit('ui:toast', {
          message: error.userMessage,
          type: 'error',
        });
        break;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        EventBus.emit('ui:toast', {
          message: error.userMessage,
          type: 'error',
        });
        // Could also show a modal for critical errors
        break;
    }
  }

  /**
   * Subscribe to error events
   */
  subscribe(listener: ErrorListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get error history
   */
  getHistory(): readonly AppError[] {
    return [...this.errors];
  }

  /**
   * Clear error history
   */
  clearHistory(): void {
    this.errors.length = 0;
  }

  /**
   * Create a wrapped function with error handling
   */
  wrap<T extends (...args: unknown[]) => unknown>(
    fn: T,
    code: ErrorCode = ErrorCodes.UNKNOWN_ERROR,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): T {
    return ((...args: unknown[]) => {
      try {
        const result = fn(...args);
        // Handle promises
        if (result instanceof Promise) {
          return result.catch((error: Error) => {
            this.handle({
              code,
              message: error.message,
              severity,
              originalError: error,
            });
            throw error;
          });
        }
        return result;
      } catch (error) {
        this.handle({
          code,
          message: error instanceof Error ? error.message : String(error),
          severity,
          originalError: error instanceof Error ? error : undefined,
        });
        throw error;
      }
    }) as T;
  }

  /**
   * Async error handling helper
   */
  async tryAsync<T>(
    fn: () => Promise<T>,
    code: ErrorCode = ErrorCodes.UNKNOWN_ERROR,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      this.handle({
        code,
        message: error instanceof Error ? error.message : String(error),
        severity,
        originalError: error instanceof Error ? error : undefined,
      });
      return null;
    }
  }

  /**
   * Sync error handling helper
   */
  trySync<T>(
    fn: () => T,
    code: ErrorCode = ErrorCodes.UNKNOWN_ERROR,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): T | null {
    try {
      return fn();
    } catch (error) {
      this.handle({
        code,
        message: error instanceof Error ? error.message : String(error),
        severity,
        originalError: error instanceof Error ? error : undefined,
      });
      return null;
    }
  }
}

// Singleton instance
export const ErrorHandler = new ErrorHandlerImpl();

// Export types and codes
export type { ErrorCode, ErrorListener };
