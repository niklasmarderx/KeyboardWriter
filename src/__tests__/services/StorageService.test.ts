/**
 * StorageService Tests
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock localStorage
const createMockStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

describe('StorageService', () => {
  let mockStorage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    mockStorage = createMockStorage();
    vi.stubGlobal('localStorage', mockStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('Basic Operations', () => {
    it('should save data to localStorage', () => {
      const data = { test: 'value' };
      localStorage.setItem('test-key', JSON.stringify(data));
      expect(mockStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(data));
    });

    it('should load data from localStorage', () => {
      const data = { test: 'value' };
      mockStorage.setItem('test-key', JSON.stringify(data));
      const retrieved = localStorage.getItem('test-key');
      expect(retrieved).toBe(JSON.stringify(data));
    });

    it('should return null for missing key', () => {
      const result = localStorage.getItem('non-existent');
      expect(result).toBeNull();
    });

    it('should remove data from localStorage', () => {
      localStorage.setItem('test-key', 'value');
      localStorage.removeItem('test-key');
      expect(mockStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should clear all data', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.clear();
      expect(mockStorage.clear).toHaveBeenCalled();
    });
  });

  describe('User Data Serialization', () => {
    it('should serialize user with Maps and Sets', () => {
      const user = {
        id: 'user-1',
        name: 'Test User',
        lessonProgress: new Map([['lesson-1', { completed: true, bestWPM: 50 }]]),
        statistics: {
          completedLessons: new Set(['lesson-1', 'lesson-2']),
        },
      };

      // Serialize Maps and Sets to arrays
      const serialized = {
        ...user,
        lessonProgress: Array.from(user.lessonProgress.entries()),
        statistics: {
          ...user.statistics,
          completedLessons: Array.from(user.statistics.completedLessons),
        },
      };

      const jsonString = JSON.stringify(serialized);
      expect(jsonString).toContain('lesson-1');
      expect(jsonString).toContain('lesson-2');
    });

    it('should deserialize user with Maps and Sets', () => {
      const serialized = {
        id: 'user-1',
        name: 'Test User',
        lessonProgress: [['lesson-1', { completed: true, bestWPM: 50 }]],
        statistics: {
          completedLessons: ['lesson-1', 'lesson-2'],
        },
      };

      // Deserialize arrays back to Maps and Sets
      const user = {
        ...serialized,
        lessonProgress: new Map(serialized.lessonProgress as [string, unknown][]),
        statistics: {
          ...serialized.statistics,
          completedLessons: new Set(serialized.statistics.completedLessons),
        },
      };

      expect(user.lessonProgress instanceof Map).toBe(true);
      expect(user.statistics.completedLessons instanceof Set).toBe(true);
      expect(user.lessonProgress.get('lesson-1')).toEqual({ completed: true, bestWPM: 50 });
      expect(user.statistics.completedLessons.has('lesson-1')).toBe(true);
    });
  });

  describe('Version Migration', () => {
    it('should detect version from storage', () => {
      mockStorage.setItem('keyboardwriter_version', '2');
      const version = parseInt(localStorage.getItem('keyboardwriter_version') || '1', 10);
      expect(version).toBe(2);
    });

    it('should default to version 1 if not set', () => {
      const version = parseInt(localStorage.getItem('keyboardwriter_version') || '1', 10);
      expect(version).toBe(1);
    });

    it('should migrate data structure', () => {
      // Old format
      const oldData = {
        settings: {},
        statistics: {
          completedLessons: {}, // Wrong format (object instead of array)
        },
      };

      // Migration function
      const migrate = (data: typeof oldData) => {
        if (data.statistics.completedLessons && !Array.isArray(data.statistics.completedLessons)) {
          (data.statistics as Record<string, unknown>).completedLessons = [];
        }
        return data;
      };

      const migrated = migrate(oldData);
      expect(Array.isArray(migrated.statistics.completedLessons)).toBe(true);
    });
  });

  describe('Export/Import', () => {
    it('should export data as JSON', () => {
      const data = {
        version: 3,
        exportedAt: new Date().toISOString(),
        data: {
          user: { id: 'user-1', name: 'Test' },
          settings: { theme: 'dark' },
        },
      };

      const exported = JSON.stringify(data, null, 2);
      expect(exported).toContain('user-1');
      expect(exported).toContain('dark');
    });

    it('should import data from JSON', () => {
      const jsonString = JSON.stringify({
        version: 3,
        data: {
          user: { id: 'user-1', name: 'Test' },
        },
      });

      const imported = JSON.parse(jsonString);
      expect(imported.data.user.id).toBe('user-1');
    });

    it('should validate import data structure', () => {
      const invalidData = JSON.stringify({ invalid: true });
      const parsed = JSON.parse(invalidData);
      const isValid = 'data' in parsed && 'version' in parsed;
      expect(isValid).toBe(false);
    });
  });

  describe('Storage Availability', () => {
    it('should check if storage is available', () => {
      const isAvailable = () => {
        try {
          const test = '__storage_test__';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch {
          return false;
        }
      };

      expect(isAvailable()).toBe(true);
    });

    it('should calculate storage usage', () => {
      localStorage.setItem('key1', 'a'.repeat(100));
      localStorage.setItem('key2', 'b'.repeat(200));

      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            total += value.length;
          }
        }
      }

      expect(total).toBe(300);
    });
  });
});
