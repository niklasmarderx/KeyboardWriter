/**
 * Router Service
 * Handles client-side navigation and page management
 */

import { EventBus } from './EventBus';
import { Logger } from './Logger';
import { Store } from './Store';

const logger = Logger.scope('Router');

/**
 * Page configuration
 */
export interface PageConfig {
  id: string;
  title: string;
  requiresAuth?: boolean;
}

/**
 * Available pages in the application
 */
export const pages: Record<string, PageConfig> = {
  home: { id: 'home', title: 'Dashboard' },
  practice: { id: 'practice', title: 'Übungen' },
  lessons: { id: 'lessons', title: 'Lektionen' },
  statistics: { id: 'statistics', title: 'Statistiken' },
  achievements: { id: 'achievements', title: 'Erfolge' },
  shortcuts: { id: 'shortcuts', title: 'Shortcuts' },
  terminal: { id: 'terminal', title: 'Terminal Training' },
  srs: { id: 'srs', title: 'SRS Lernen' },
  challenge: { id: 'challenge', title: 'Daily Challenge' },
  quiz: { id: 'quiz', title: 'Quiz Modi' },
  code: { id: 'code', title: 'Code Modus' },
  playground: { id: 'playground', title: 'Code Playground' },
  social: { id: 'social', title: 'Community' },
  race: { id: 'race', title: 'Typing Race' },
  git: { id: 'git', title: 'Git Training' },
  vim: { id: 'vim', title: 'Vim Training' },
  regex: { id: 'regex', title: 'Regex Training' },
};

type RouteChangeListener = (page: string, previousPage: string) => void;

/**
 * Router singleton for navigation management
 */
interface PopStateEventState {
  page?: string;
}

class RouterImpl {
  private readonly listeners: Set<RouteChangeListener> = new Set();
  private currentPage: string = 'home';
  private readonly history: string[] = [];
  private readonly maxHistory = 50;

  constructor() {
    this.setupEventListeners();
    this.setupPopStateHandler();
  }

  /**
   * Setup event listeners for navigation
   */
  private setupEventListeners(): void {
    // Listen for navigation clicks
    document.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      const navItem = target.closest('[data-page]');

      if (navItem !== null) {
        event.preventDefault();
        const page = navItem.getAttribute('data-page');
        if (page !== null && page !== '') {
          this.navigate(page);
        }
      }
    });
  }

  /**
   * Setup browser back/forward handling
   */
  private setupPopStateHandler(): void {
    window.addEventListener('popstate', (event: PopStateEvent) => {
      const state = event.state as PopStateEventState | null;
      if (state !== null && state.page !== undefined && state.page !== '') {
        this.navigateInternal(state.page, false);
      }
    });
  }

  /**
   * Navigate to a page
   */
  navigate(page: string): void {
    if (pages[page] === undefined) {
      logger.warn(`Page "${page}" not found, redirecting to home`);
      page = 'home';
    }

    this.navigateInternal(page, true);
  }

  /**
   * Internal navigation handler
   */
  private navigateInternal(page: string, pushState: boolean): void {
    const previousPage = this.currentPage;

    if (page === previousPage) {
      return;
    }

    logger.debug(`Navigating from "${previousPage}" to "${page}"`);

    // Update state
    this.currentPage = page;

    // Add to history
    this.history.push(page);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Update browser history
    if (pushState) {
      const config = pages[page];
      window.history.pushState({ page }, config?.title ?? page, `#${page}`);
    }

    // Update document title
    const pageConfig = pages[page];
    if (pageConfig !== undefined) {
      document.title = `${pageConfig.title} - KeyboardWriter`;
    }

    // Update store
    Store.navigateTo(page);

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(page, previousPage);
      } catch (error) {
        logger.error('Error in route change listener', error);
      }
    });

    // Emit event
    EventBus.emit('nav:change', { page });
  }

  /**
   * Go back in history
   */
  back(): void {
    if (this.canGoBack()) {
      window.history.back();
    }
  }

  /**
   * Go forward in history
   */
  forward(): void {
    window.history.forward();
  }

  /**
   * Check if can go back
   */
  canGoBack(): boolean {
    return this.history.length > 1;
  }

  /**
   * Get current page
   */
  getCurrentPage(): string {
    return this.currentPage;
  }

  /**
   * Get page config
   */
  getPageConfig(page: string): PageConfig | undefined {
    return pages[page];
  }

  /**
   * Subscribe to route changes
   */
  subscribe(listener: RouteChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Initialize router from URL hash
   */
  init(): void {
    const hash = window.location.hash.slice(1);
    if (hash && pages[hash]) {
      this.navigateInternal(hash, false);
    } else {
      // Set initial state
      window.history.replaceState({ page: 'home' }, 'Dashboard', '#home');
    }
  }

  /**
   * Get navigation history
   */
  getHistory(): readonly string[] {
    return [...this.history];
  }
}

// Singleton instance
export const Router = new RouterImpl();

// Export types
export type { RouteChangeListener };
