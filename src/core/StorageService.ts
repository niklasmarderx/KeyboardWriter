import type { User } from '../domain/models';
import { Logger } from './Logger';

const logger = Logger.scope('StorageService');

/**
 * Current storage schema version
 * Increment this when making breaking changes to data structure
 */
const STORAGE_VERSION = 3;

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  USER: 'keyboardwriter_user',
  SETTINGS: 'keyboardwriter_settings',
  LESSONS_PROGRESS: 'keyboardwriter_lessons',
  STATISTICS: 'keyboardwriter_statistics',
  VERSION: 'keyboardwriter_version',
} as const;

/**
 * Migration functions for upgrading data between versions
 */
type MigrationFn = (data: Record<string, unknown>) => Record<string, unknown>;

const migrations: Record<number, MigrationFn> = {
  // Migration from v1 to v2: Add settings.hapticFeedback field
  2: (data: Record<string, unknown>) => {
    if (
      data.settings !== null &&
      data.settings !== undefined &&
      typeof data.settings === 'object'
    ) {
      const settings = data.settings as Record<string, unknown>;
      if (!('hapticFeedback' in settings)) {
        settings.hapticFeedback = false;
      }
    }
    return data;
  },
  // Migration from v2 to v3: Fix completedLessons and completedExercises serialization
  // These were stored as empty objects {} instead of arrays [] due to Set serialization bug
  3: (data: Record<string, unknown>) => {
    if (
      data.statistics !== null &&
      data.statistics !== undefined &&
      typeof data.statistics === 'object'
    ) {
      const stats = data.statistics as Record<string, unknown>;

      // Fix completedLessons - convert from object to array if needed
      if (
        stats.completedLessons !== null &&
        stats.completedLessons !== undefined &&
        !Array.isArray(stats.completedLessons)
      ) {
        // If it's an object (from failed Set serialization), convert to empty array
        stats.completedLessons = [];
      }

      // Fix completedExercises - convert from object to array if needed
      if (
        stats.completedExercises !== null &&
        stats.completedExercises !== undefined &&
        !Array.isArray(stats.completedExercises)
      ) {
        // If it's an object (from failed Set serialization), convert to empty array
        stats.completedExercises = [];
      }
    }
    return data;
  },
};

/**
 * Storage Service for persisting user data
 * Uses localStorage with JSON serialization
 * Includes Map serialization support and data migration
 */
class StorageServiceImpl {
  private initialized = false;

  /**
   * Initialize storage service and run migrations if needed
   */
  init(): void {
    if (this.initialized) {
      return;
    }

    this.runMigrations();
    this.initialized = true;
  }

  /**
   * Get current storage version
   */
  getVersion(): number {
    const version = localStorage.getItem(STORAGE_KEYS.VERSION);
    return version ? parseInt(version, 10) : 1;
  }

  /**
   * Set storage version
   */
  private setVersion(version: number): void {
    localStorage.setItem(STORAGE_KEYS.VERSION, version.toString());
  }

  /**
   * Run necessary migrations to upgrade data to current version
   */
  private runMigrations(): void {
    const currentVersion = this.getVersion();

    if (currentVersion >= STORAGE_VERSION) {
      logger.debug(`Storage is up to date (v${currentVersion})`);
      return;
    }

    logger.info(`Migrating storage from v${currentVersion} to v${STORAGE_VERSION}`);

    // Load existing user data
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userData) {
      // No data to migrate, just set version
      this.setVersion(STORAGE_VERSION);
      return;
    }

    try {
      let data = JSON.parse(userData) as Record<string, unknown>;

      // Run each migration in sequence
      for (let v = currentVersion + 1; v <= STORAGE_VERSION; v++) {
        const migration = migrations[v];
        if (migration) {
          logger.debug(`Running migration to v${v}`);
          data = migration(data);
        }
      }

      // Save migrated data
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
      this.setVersion(STORAGE_VERSION);

      logger.info(`Storage migration complete (now v${STORAGE_VERSION})`);
    } catch (error) {
      logger.error('Failed to run storage migrations', error);
      // Don't update version if migration failed
    }
  }

  /**
   * Save user data to storage
   */
  saveUser(user: User): void {
    try {
      const serializable = this.serializeUser(user);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(serializable));
    } catch (error) {
      logger.error('Failed to save user data', error);
    }
  }

  /**
   * Load user data from storage
   */
  loadUser(): User | null {
    // Ensure migrations have run
    this.init();

    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) {
        return null;
      }

      const parsed = JSON.parse(data) as Record<string, unknown>;
      return this.deserializeUser(parsed);
    } catch (error) {
      logger.error('Failed to load user data', error);
      return null;
    }
  }

  /**
   * Clear all stored data
   */
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    logger.info('All storage data cleared');
  }

  /**
   * Export all data for backup
   */
  exportData(): string {
    const exportData: Record<string, unknown> = {
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      data: {},
    };

    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          (exportData.data as Record<string, unknown>)[name] = JSON.parse(value);
        } catch {
          (exportData.data as Record<string, unknown>)[name] = value;
        }
      }
    });

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import data from backup
   */
  importData(jsonString: string): boolean {
    try {
      const importData = JSON.parse(jsonString) as {
        version?: number;
        data?: Record<string, unknown>;
      };

      if (!importData.data) {
        logger.error('Invalid import data: missing data field');
        return false;
      }

      // Clear existing data
      this.clearAll();

      // Import each key
      Object.entries(importData.data).forEach(([name, value]) => {
        const key = STORAGE_KEYS[name as keyof typeof STORAGE_KEYS];
        if (key) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });

      // Run migrations if imported from older version
      if (importData.version && importData.version < STORAGE_VERSION) {
        this.initialized = false;
        this.runMigrations();
      } else {
        this.setVersion(STORAGE_VERSION);
      }

      logger.info('Data import successful');
      return true;
    } catch (error) {
      logger.error('Failed to import data', error);
      return false;
    }
  }

  /**
   * Check if storage is available
   */
  isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage usage in bytes
   */
  getStorageUsage(): number {
    let total = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += localStorage.getItem(key)?.length ?? 0;
      }
    }
    return total * 2; // UTF-16 uses 2 bytes per character
  }

  // ============================================
  // Serialization Helpers
  // ============================================

  /**
   * Serialize user for storage (convert Maps and Sets to arrays)
   */
  private serializeUser(user: User): Record<string, unknown> {
    return {
      ...user,
      lessonProgress: Array.from(user.lessonProgress.entries()).map(([key, value]) => [
        key,
        {
          ...value,
          exerciseProgress: Array.from(value.exerciseProgress.entries()),
        },
      ]),
      statistics: {
        ...user.statistics,
        keyStats: Array.from(user.statistics.keyStats.entries()),
        completedLessons: Array.from(user.statistics.completedLessons),
        completedExercises: Array.from(user.statistics.completedExercises),
      },
    };
  }

  /**
   * Deserialize user from storage (convert arrays back to Maps and Sets)
   */
  private deserializeUser(data: Record<string, unknown>): User {
    const lessonProgressArray = data.lessonProgress as Array<[string, Record<string, unknown>]>;
    const lessonProgress = new Map(
      lessonProgressArray.map(([key, value]) => [
        key,
        {
          ...value,
          exerciseProgress: new Map(value.exerciseProgress as Array<[string, unknown]>),
        },
      ])
    ) as User['lessonProgress'];

    const statsData = data.statistics as Record<string, unknown>;
    const keyStatsArray = statsData.keyStats as Array<[string, unknown]>;

    // Handle completedLessons - could be array, Set (won't happen from JSON), or undefined
    const completedLessonsData = statsData.completedLessons;
    const completedLessons = new Set<string>(
      Array.isArray(completedLessonsData) ? completedLessonsData : []
    );

    // Handle completedExercises - could be array, Set (won't happen from JSON), or undefined
    const completedExercisesData = statsData.completedExercises;
    const completedExercises = new Set<string>(
      Array.isArray(completedExercisesData) ? completedExercisesData : []
    );

    return {
      ...data,
      lessonProgress,
      statistics: {
        ...statsData,
        keyStats: new Map(keyStatsArray),
        completedLessons,
        completedExercises,
      },
    } as User;
  }

  // ============================================
  // Generic Storage Methods
  // ============================================

  /**
   * Save generic data
   */
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      logger.error(`Failed to save ${key}`, error);
    }
  }

  /**
   * Load generic data
   */
  load<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        return null;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error(`Failed to load ${key}`, error);
      return null;
    }
  }

  /**
   * Remove specific key
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

// Singleton instance
export const StorageService = new StorageServiceImpl();
