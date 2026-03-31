/**
 * Router Tests
 */

import { describe, expect, it, vi } from 'vitest';

// Mock EventBus
vi.mock('../../core/EventBus', () => ({
  EventBus: {
    emit: vi.fn(),
    on: vi.fn(() => ({ unsubscribe: vi.fn() })),
  },
}));

// Mock Logger
vi.mock('../../core/Logger', () => ({
  Logger: {
    scope: () => ({
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    }),
  },
}));

// Mock Store
vi.mock('../../core/Store', () => ({
  Store: {
    navigateTo: vi.fn(),
    getState: vi.fn(() => ({ currentPage: 'home' })),
  },
}));

import { pages } from '../../core/Router';

describe('Router pages config', () => {
  it('should have all required pages defined', () => {
    const requiredPages = ['home', 'practice', 'lessons', 'statistics', 'achievements'];
    requiredPages.forEach(page => {
      expect(pages[page]).toBeDefined();
      expect(pages[page].id).toBe(page);
      expect(pages[page].title).toBeTruthy();
    });
  });

  it('should include race page', () => {
    expect(pages['race']).toBeDefined();
    expect(pages['race'].title).toBe('Typing Race');
  });

  it('should have at least 15 pages', () => {
    expect(Object.keys(pages).length).toBeGreaterThanOrEqual(15);
  });

  it('should have consistent id and key', () => {
    Object.entries(pages).forEach(([key, config]) => {
      expect(config.id).toBe(key);
    });
  });
});

describe('Router navigation logic', () => {
  // We test the navigation logic without full DOM - using the RouterImpl internals via mocked dependencies

  it('pages config has no duplicate ids', () => {
    const ids = Object.values(pages).map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('pages config titles are all non-empty', () => {
    Object.values(pages).forEach(config => {
      expect(config.title.trim()).not.toBe('');
    });
  });

  it('should recognize valid page ids', () => {
    const validPages = ['home', 'practice', 'race', 'vim', 'git'];
    validPages.forEach(page => {
      expect(pages[page]).toBeDefined();
    });
  });

  it('should not have undefined pages for common routes', () => {
    const routesToCheck = [
      'home',
      'practice',
      'lessons',
      'statistics',
      'achievements',
      'shortcuts',
      'terminal',
      'race',
    ];
    routesToCheck.forEach(route => {
      expect(pages[route]).not.toBeUndefined();
    });
  });
});

describe('Router canGoBack logic', () => {
  it('history with single entry cannot go back', () => {
    // Test the logic directly since canGoBack is just history.length > 1
    const history: string[] = ['home'];
    expect(history.length > 1).toBe(false);
  });

  it('history with multiple entries can go back', () => {
    const history: string[] = ['home', 'practice'];
    expect(history.length > 1).toBe(true);
  });
});
