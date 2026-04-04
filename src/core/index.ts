/**
 * Core Infrastructure - Central Export
 */

export { EventBus } from './EventBus';
export type { AppEvents } from './EventBus';

export { i18n, t } from './i18n';
export type { Language } from './i18n';

export { ErrorCodes, ErrorHandler, ErrorSeverity } from './ErrorHandler';
export type { AppError, ErrorCode, ErrorListener } from './ErrorHandler';

export { Logger, LogLevel } from './Logger';
export type { LogEntry, LogListener, ScopedLogger } from './Logger';

export { pages, Router } from './Router';
export type { PageConfig, RouteChangeListener } from './Router';

export { Selectors, Store } from './Store';
export type { AppState } from './Store';

export { StorageService } from './StorageService';

export { SettingsService } from './SettingsService';
export type { Settings } from './SettingsService';

export { escapeHtml } from './escapeHtml';
