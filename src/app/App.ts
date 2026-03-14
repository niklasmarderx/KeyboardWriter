import { onboardingModal } from '../components/onboarding/OnboardingModal';
import { EventBus, i18n, StorageService, Store, t } from '../core';
import { createUser } from '../domain/models';
import { AchievementsPage } from '../pages/AchievementsPage';
import { AlgorithmTrainingPage } from '../pages/AlgorithmTrainingPage';
import { CodeModePage } from '../pages/CodeModePage';
import { CodePlaygroundPage } from '../pages/CodePlaygroundPage';
import { DailyChallengePage } from '../pages/DailyChallengePage';
import { GitTrainingPage } from '../pages/GitTrainingPage';
import { LessonsPage } from '../pages/LessonsPage';
import { PracticePage } from '../pages/PracticePage';
import { QuizPage } from '../pages/QuizPage';
import { RegexTrainingPage } from '../pages/RegexTrainingPage';
import { ShortcutsPage } from '../pages/ShortcutsPage';
import { SocialPage } from '../pages/SocialPage';
import { SQLTrainingPage } from '../pages/SQLTrainingPage';
import { SRSReviewPage } from '../pages/SRSReviewPage';
import { StatisticsPage } from '../pages/StatisticsPage';
import { TerminalTrainingPage } from '../pages/TerminalTrainingPage';
import { TypingRacePage } from '../pages/TypingRacePage';
import { VimTrainingPage } from '../pages/VimTrainingPage';

/**
 * Main Application Class
 * Bootstraps and manages the application lifecycle
 */
export class App {
  private readonly appElement: HTMLElement;
  private isInitialized: boolean = false;
  private practicePage: PracticePage | null = null;
  private lessonsPage: LessonsPage | null = null;
  private statisticsPage: StatisticsPage | null = null;
  private codeModePage: CodeModePage | null = null;
  private achievementsPage: AchievementsPage | null = null;
  private shortcutsPage: ShortcutsPage | null = null;
  private terminalPage: TerminalTrainingPage | null = null;
  private srsPage: SRSReviewPage | null = null;
  private dailyChallengePage: DailyChallengePage | null = null;
  private quizPage: QuizPage | null = null;
  private playgroundPage: CodePlaygroundPage | null = null;
  private socialPage: SocialPage | null = null;
  private racePage: TypingRacePage | null = null;
  private gitPage: GitTrainingPage | null = null;
  private vimPage: VimTrainingPage | null = null;
  private regexPage: RegexTrainingPage | null = null;
  private algorithmPage: AlgorithmTrainingPage | null = null;
  private sqlPage: SQLTrainingPage | null = null;

  constructor() {
    const el = document.getElementById('app');
    if (!el) {
      throw new Error('App root element not found');
    }
    this.appElement = el;
  }

  /**
   * Initialize the application
   */
  init(): void {
    if (this.isInitialized) {
      console.warn('App already initialized');
      return;
    }

    // Load user data from storage
    this.loadUserData();

    // Setup event listeners
    this.setupEventListeners();

    // Render initial UI
    this.render();

    // Setup click handlers for the rendered DOM
    this.setupClickHandlers();

    // Mark as loaded
    Store.setLoaded(true);
    this.isInitialized = true;

    // Auto-save on state changes
    this.setupAutoSave();

    // Show onboarding for new users
    if (onboardingModal.shouldShowOnboarding()) {
      onboardingModal.show();
    }
  }

  /**
   * Load user data from storage or create new user
   */
  private loadUserData(): void {
    const savedUser = StorageService.loadUser();
    if (savedUser) {
      Store.updateUser(savedUser);
    } else {
      const newUser = createUser();
      Store.updateUser(newUser);
      StorageService.saveUser(newUser);
    }
  }

  /**
   * Setup global event listeners
   */
  private setupEventListeners(): void {
    // Navigation
    EventBus.on('nav:change', ({ page }) => {
      this.renderPage(page);
    });

    // Toast notifications
    EventBus.on('ui:toast', ({ message, type }) => {
      this.showToast(message, type);
    });

    // Keyboard events for typing
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    // Visibility change (pause when tab hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && Store.getState().currentSession) {
        EventBus.emit('typing:pause', undefined);
      }
    });

    // Before unload - save data
    window.addEventListener('beforeunload', () => {
      const user = Store.getState().user;
      StorageService.saveUser(user);
    });
  }

  /**
   * Setup auto-save on state changes
   */
  private setupAutoSave(): void {
    let saveTimeout: ReturnType<typeof setTimeout>;

    Store.subscribe(state => {
      // Debounce saves
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        StorageService.saveUser(state.user);
      }, 1000);
    });
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const state = Store.getState();

    // Don't capture if modal is open or not in typing mode
    if (state.isModalOpen || !state.currentSession) {
      return;
    }

    // Prevent default for most keys during typing
    if (event.key !== 'Escape' && event.key !== 'F5' && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
    }

    // Emit keystroke event
    EventBus.emit('ui:keyboard:highlight', { keyId: event.code });
  }

  /**
   * Handle keyup events
   */
  private handleKeyUp(event: KeyboardEvent): void {
    EventBus.emit('ui:keyboard:clear', undefined);

    // Escape to pause
    if (event.key === 'Escape' && Store.getState().currentSession) {
      EventBus.emit('typing:pause', undefined);
    }
  }

  /**
   * Main render method
   */
  render(): void {
    const state = Store.getState();
    this.appElement.innerHTML = this.getAppTemplate(state.currentPage);
  }

  /**
   * Render specific page
   */
  private renderPage(page: string): void {
    const mainContent = this.appElement.querySelector('.app-main');
    if (mainContent) {
      mainContent.innerHTML = this.getPageContent(page);

      // Re-setup click handlers after navigation
      this.setupClickHandlers();

      // Initialize page-specific handlers after DOM is updated
      // Use requestAnimationFrame to ensure DOM is fully painted
      requestAnimationFrame(() => {
        this.initCurrentPage(page);
      });
    }
  }

  /**
   * Initialize the current page after DOM update
   */
  private initCurrentPage(page: string): void {
    switch (page) {
      case 'lessons':
        this.lessonsPage?.init();
        break;
      case 'practice':
        this.practicePage?.init();
        break;
      case 'statistics':
        this.statisticsPage?.init();
        break;
      case 'code':
        this.codeModePage?.init();
        break;
      case 'achievements':
        this.achievementsPage?.init();
        break;
      case 'shortcuts':
        this.shortcutsPage?.init();
        break;
      case 'terminal':
        this.terminalPage?.init();
        break;
      case 'srs':
        this.srsPage?.init();
        break;
      case 'challenge':
        this.dailyChallengePage?.init();
        break;
      case 'playground':
        this.playgroundPage?.init();
        break;
      case 'social':
        this.socialPage?.init();
        break;
      case 'race':
        this.racePage?.init();
        break;
      case 'algorithm-training':
        this.algorithmPage?.init();
        break;
      case 'sql':
        this.sqlPage?.init();
        break;
      // Quiz, Git, Vim, Regex pages use container-based init
    }
  }

  /**
   * Get main app template
   */
  private getAppTemplate(currentPage: string): string {
    return `
      <div class="app-container">
        ${this.getHeaderTemplate()}
        ${this.getSidebarTemplate(currentPage)}
        <main class="app-main">
          ${this.getPageContent(currentPage)}
        </main>
      </div>
      <div class="toast-container" id="toast-container"></div>
    `;
  }

  /**
   * Get header template
   */
  private getHeaderTemplate(): string {
    const state = Store.getState();
    return `
      <header class="app-header">
        <div class="header-logo">
          <span class="header-logo-text">KeyboardWriter</span>
        </div>
        <div class="header-stats">
          <div class="header-stat">
            <span class="header-stat-value" id="live-wpm">${state.liveWPM}</span>
            <span class="header-stat-label">WPM</span>
          </div>
          <div class="header-stat">
            <span class="header-stat-value" id="live-accuracy">${state.liveAccuracy}%</span>
            <span class="header-stat-label">Accuracy</span>
          </div>
          <div class="header-stat">
            <span class="header-stat-value" id="user-level">Lvl ${state.user.level}</span>
            <span class="header-stat-label">Level</span>
          </div>
        </div>
        <div class="header-actions">
          <div class="language-toggle" id="btn-language" title="Switch language / Sprache wechseln" style="display: flex; align-items: center; gap: 4px; background: var(--bg-tertiary); border-radius: 20px; padding: 4px; margin-right: 12px; cursor: pointer; border: 1px solid var(--border-primary);">
            <span class="lang-option ${i18n.getLanguage() === 'en' ? 'active' : ''}" style="padding: 4px 10px; border-radius: 16px; font-size: 12px; font-weight: 600; transition: all 0.2s ease; ${i18n.getLanguage() === 'en' ? 'background: var(--accent-primary); color: white;' : 'color: var(--text-secondary);'}">EN</span>
            <span class="lang-option ${i18n.getLanguage() === 'de' ? 'active' : ''}" style="padding: 4px 10px; border-radius: 16px; font-size: 12px; font-weight: 600; transition: all 0.2s ease; ${i18n.getLanguage() === 'de' ? 'background: var(--accent-primary); color: white;' : 'color: var(--text-secondary);'}">DE</span>
          </div>
          <button class="btn btn-ghost btn-icon" id="btn-settings" title="${t('header.settings')}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          <button class="btn btn-danger btn-sm" id="btn-shutdown" title="Shutdown server" style="margin-left: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
              <line x1="12" y1="2" x2="12" y2="12"></line>
            </svg>
            ${t('header.quit')}
          </button>
        </div>
      </header>
    `;
  }

  /**
   * Setup language toggle handler
   */
  private setupLanguageToggle(): void {
    const langBtn = document.getElementById('btn-language');
    langBtn?.addEventListener('click', () => {
      i18n.toggleLanguage();
      // Re-render the entire app to update all translations
      this.render();
      // Re-setup event handlers for the new DOM
      this.setupClickHandlers();
    });
  }

  /**
   * Setup click handlers after render
   */
  private setupClickHandlers(): void {
    // Settings button - emit event for settings modal
    const settingsBtn = document.getElementById('btn-settings');
    settingsBtn?.addEventListener('click', () => {
      EventBus.emit('nav:modal:open', { modalId: 'settings' });
    });

    // Shutdown button
    const shutdownBtn = document.getElementById('btn-shutdown');
    shutdownBtn?.addEventListener('click', () => {
      fetch('/api/shutdown', { method: 'POST' }).catch(() => {
        // Server may already be closed
      });
      window.close();
    });

    // Navigation links
    const navLinks = document.querySelectorAll('[data-page]');
    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const page = (e.currentTarget as HTMLElement).dataset.page;
        if (page) {
          EventBus.emit('nav:change', { page });
        }
      });
    });

    // Language toggle
    this.setupLanguageToggle();

    // Sidebar group toggle
    this.setupSidebarGroupToggle();
  }

  /**
   * Setup sidebar group toggle handlers
   */
  private setupSidebarGroupToggle(): void {
    const groupHeaders = document.querySelectorAll('[data-toggle-group]');
    groupHeaders.forEach(header => {
      header.addEventListener('click', e => {
        const groupId = (e.currentTarget as HTMLElement).dataset.toggleGroup;
        if (!groupId) {
          return;
        }

        const group = document.querySelector(`[data-group="${groupId}"]`);
        if (!group) {
          return;
        }

        const items = group.querySelector('.sidebar-group-items');
        const chevron = group.querySelector('.sidebar-group-chevron');

        if (items && chevron) {
          items.classList.toggle('visible');
          chevron.classList.toggle('rotated');
        }
      });
    });
  }

  /**
   * Get sidebar template
   */
  private getSidebarTemplate(currentPage: string): string {
    // Grouped navigation for better overview
    const navGroups = [
      {
        id: 'core',
        label: t('nav.group.core'),
        icon: 'home',
        items: [
          { id: 'home', label: t('nav.dashboard'), icon: 'home' },
          { id: 'practice', label: t('nav.practice'), icon: 'keyboard' },
          { id: 'lessons', label: t('nav.lessons'), icon: 'book' },
          { id: 'challenge', label: t('nav.challenge'), icon: 'flame' },
        ],
      },
      {
        id: 'devtools',
        label: t('nav.group.devtools'),
        icon: 'terminal',
        items: [
          { id: 'terminal', label: t('nav.terminal'), icon: 'terminal' },
          { id: 'git', label: t('nav.git'), icon: 'git' },
          { id: 'vim', label: t('nav.vim'), icon: 'vim' },
          { id: 'regex', label: t('nav.regex'), icon: 'regex' },
          { id: 'sql', label: t('nav.sql'), icon: 'database' },
          { id: 'shortcuts', label: t('nav.shortcuts'), icon: 'command' },
        ],
      },
      {
        id: 'coding',
        label: t('nav.group.coding'),
        icon: 'code',
        items: [
          { id: 'code', label: t('nav.code'), icon: 'code' },
          { id: 'playground', label: t('nav.playground'), icon: 'play' },
          { id: 'algorithm-training', label: t('nav.algorithms'), icon: 'algorithm' },
        ],
      },
      {
        id: 'progress',
        label: t('nav.group.progress'),
        icon: 'chart',
        items: [
          { id: 'statistics', label: t('nav.statistics'), icon: 'chart' },
          { id: 'achievements', label: t('nav.achievements'), icon: 'trophy' },
          { id: 'srs', label: t('nav.srs'), icon: 'brain' },
        ],
      },
      {
        id: 'compete',
        label: t('nav.group.compete'),
        icon: 'race',
        items: [
          { id: 'quiz', label: t('nav.quiz'), icon: 'quiz' },
          { id: 'race', label: t('nav.race'), icon: 'race' },
          { id: 'social', label: t('nav.community'), icon: 'users' },
        ],
      },
    ];

    const iconSvgs: Record<string, string> = {
      home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9,22 9,12 15,12 15,22"></polyline></svg>',
      keyboard:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8"></line><line x1="10" y1="8" x2="10" y2="8"></line><line x1="14" y1="8" x2="14" y2="8"></line><line x1="18" y1="8" x2="18" y2="8"></line><line x1="6" y1="12" x2="6" y2="12"></line><line x1="10" y1="12" x2="10" y2="12"></line><line x1="14" y1="12" x2="14" y2="12"></line><line x1="18" y1="12" x2="18" y2="12"></line><line x1="8" y1="16" x2="16" y2="16"></line></svg>',
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
      chart:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>',
      trophy:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>',
      command:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>',
      terminal:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4,17 10,11 4,5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>',
      brain:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.54"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.54"></path></svg>',
      flame:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
      code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16,18 22,12 16,6"></polyline><polyline points="8,6 2,12 8,18"></polyline></svg>',
      quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5,3 19,12 5,21"></polygon></svg>',
      users:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
      race: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
      git: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line></svg>',
      vim: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17l6-6-6-6"/><path d="M12 19h8"/></svg>',
      regex:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3v18"/><path d="M10 8l7 8"/><path d="M10 16l7-8"/></svg>',
      algorithm:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>',
      database:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>',
      chevron:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg>',
    };

    // Finde heraus, welche Gruppe aktiv ist
    const getActiveGroup = (page: string): string => {
      for (const group of navGroups) {
        if (group.items.some(item => item.id === page)) {
          return group.id;
        }
      }
      return 'core';
    };

    const activeGroupId = getActiveGroup(currentPage);

    return `
      <aside class="app-sidebar">
        <nav class="sidebar-nav">
          ${navGroups
            .map(group => {
              const isGroupActive = group.id === activeGroupId;
              const hasActiveItem = group.items.some(item => item.id === currentPage);

              return `
              <div class="sidebar-group ${isGroupActive ? 'expanded' : ''}" data-group="${group.id}">
                <div class="sidebar-group-header ${hasActiveItem ? 'has-active' : ''}" data-toggle-group="${group.id}">
                  <span class="sidebar-group-icon">${iconSvgs[group.icon]}</span>
                  <span class="sidebar-group-label">${group.label}</span>
                  <span class="sidebar-group-chevron ${isGroupActive ? 'rotated' : ''}">${iconSvgs.chevron}</span>
                </div>
                <div class="sidebar-group-items ${isGroupActive ? 'visible' : ''}">
                  ${group.items
                    .map(
                      item => `
                    <a href="#" class="sidebar-nav-item ${currentPage === item.id ? 'active' : ''}" data-page="${item.id}">
                      <span class="sidebar-nav-item-icon">${iconSvgs[item.icon]}</span>
                      ${item.label}
                    </a>
                  `
                    )
                    .join('')}
                </div>
              </div>
            `;
            })
            .join('')}
        </nav>
      </aside>
    `;
  }

  /**
   * Get page content based on current page
   */
  private getPageContent(page: string): string {
    // Destroy existing pages when switching
    this.destroyPages(page);

    switch (page) {
      case 'home':
        return this.getHomePageContent();
      case 'practice':
        return this.renderPracticePage();
      case 'lessons':
        return this.renderLessonsPage();
      case 'statistics':
        return this.renderStatisticsPage();
      case 'achievements':
        return this.renderAchievementsPage();
      case 'shortcuts':
        return this.renderShortcutsPage();
      case 'terminal':
        return this.renderTerminalPage();
      case 'srs':
        return this.renderSRSPage();
      case 'challenge':
        return this.renderDailyChallengePage();
      case 'quiz':
        return this.renderQuizPage();
      case 'code':
        return this.renderCodeModePage();
      case 'playground':
        return this.renderPlaygroundPage();
      case 'social':
        return this.renderSocialPage();
      case 'race':
        return this.renderRacePage();
      case 'git':
        return this.renderGitPage();
      case 'vim':
        return this.renderVimPage();
      case 'regex':
        return this.renderRegexPage();
      case 'algorithm-training':
        return this.renderAlgorithmPage();
      case 'sql':
        return this.renderSQLPage();
      default:
        return this.getHomePageContent();
    }
  }

  /**
   * Destroy pages when navigating away
   */
  private destroyPages(currentPage: string): void {
    if (currentPage !== 'practice' && this.practicePage) {
      this.practicePage.destroy();
      this.practicePage = null;
    }
    if (currentPage !== 'lessons' && this.lessonsPage) {
      this.lessonsPage.destroy();
      this.lessonsPage = null;
    }
    if (currentPage !== 'statistics' && this.statisticsPage) {
      this.statisticsPage.destroy();
      this.statisticsPage = null;
    }
    if (currentPage !== 'code' && this.codeModePage) {
      this.codeModePage.destroy();
      this.codeModePage = null;
    }
    if (currentPage !== 'achievements' && this.achievementsPage) {
      this.achievementsPage.destroy();
      this.achievementsPage = null;
    }
    if (currentPage !== 'shortcuts' && this.shortcutsPage) {
      this.shortcutsPage.destroy();
      this.shortcutsPage = null;
    }
    if (currentPage !== 'terminal' && this.terminalPage) {
      this.terminalPage.destroy();
      this.terminalPage = null;
    }
    if (currentPage !== 'srs' && this.srsPage) {
      this.srsPage.destroy();
      this.srsPage = null;
    }
    if (currentPage !== 'challenge' && this.dailyChallengePage) {
      this.dailyChallengePage.destroy();
      this.dailyChallengePage = null;
    }
    if (currentPage !== 'quiz' && this.quizPage) {
      this.quizPage.destroy();
      this.quizPage = null;
    }
    if (currentPage !== 'playground' && this.playgroundPage) {
      this.playgroundPage.destroy();
      this.playgroundPage = null;
    }
    if (currentPage !== 'social' && this.socialPage) {
      this.socialPage.destroy();
      this.socialPage = null;
    }
    if (currentPage !== 'race' && this.racePage) {
      this.racePage.destroy();
      this.racePage = null;
    }
    if (currentPage !== 'git' && this.gitPage) {
      this.gitPage.destroy();
      this.gitPage = null;
    }
    if (currentPage !== 'vim' && this.vimPage) {
      this.vimPage.destroy();
      this.vimPage = null;
    }
    if (currentPage !== 'regex' && this.regexPage) {
      this.regexPage.destroy();
      this.regexPage = null;
    }
    if (currentPage !== 'algorithm-training' && this.algorithmPage) {
      this.algorithmPage.destroy();
      this.algorithmPage = null;
    }
    if (currentPage !== 'sql' && this.sqlPage) {
      this.sqlPage.destroy();
      this.sqlPage = null;
    }
  }

  /**
   * Home page content
   */
  private getHomePageContent(): string {
    const state = Store.getState();
    const stats = state.user.statistics;

    return `
      <div class="typing-container">
        <h1 style="margin-bottom: var(--space-6); text-align: center;">${t('home.welcome')}</h1>
        
        <div class="stats-panel">
          <div class="stat-card">
            <span class="stat-card-value">${stats.averageWPM}</span>
            <span class="stat-card-label">${t('home.wpmAverage')}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value">${stats.averageAccuracy}%</span>
            <span class="stat-card-label">${t('home.accuracy')}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value">${stats.currentStreak}</span>
            <span class="stat-card-label">${t('home.dayStreak')}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-value">${stats.totalLessonsCompleted}</span>
            <span class="stat-card-label">${t('home.lessons')}</span>
          </div>
        </div>

        <div class="card" style="margin-top: var(--space-6); text-align: center;">
          <h2>${t('home.getStarted')}</h2>
          <p style="color: var(--text-secondary); margin: var(--space-4) 0;">
            ${t('home.chooseLesson')}
          </p>
          <button class="btn btn-primary" data-page="practice" style="margin-top: var(--space-4);">
            ${t('home.startPractice')}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render and initialize practice page
   */
  private renderPracticePage(): string {
    if (!this.practicePage) {
      this.practicePage = new PracticePage();
    }
    const content = this.practicePage.render();
    setTimeout(() => {
      this.practicePage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize lessons page
   */
  private renderLessonsPage(): string {
    // Reuse existing instance to preserve state (currentView, selectedCategory)
    if (!this.lessonsPage) {
      this.lessonsPage = new LessonsPage();
    }
    const content = this.lessonsPage.render();
    // Schedule init after DOM is updated
    setTimeout(() => {
      this.lessonsPage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize statistics page
   */
  private renderStatisticsPage(): string {
    if (!this.statisticsPage) {
      this.statisticsPage = new StatisticsPage();
    }
    const content = this.statisticsPage.render();
    setTimeout(() => {
      this.statisticsPage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize code mode page
   */
  private renderCodeModePage(): string {
    if (!this.codeModePage) {
      this.codeModePage = new CodeModePage();
    }
    const content = this.codeModePage.render();
    setTimeout(() => {
      this.codeModePage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize achievements page
   */
  private renderAchievementsPage(): string {
    if (!this.achievementsPage) {
      this.achievementsPage = new AchievementsPage();
    }
    const content = this.achievementsPage.render();
    setTimeout(() => {
      this.achievementsPage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize shortcuts page
   */
  private renderShortcutsPage(): string {
    if (!this.shortcutsPage) {
      this.shortcutsPage = new ShortcutsPage();
    }
    const content = this.shortcutsPage.render();
    setTimeout(() => {
      this.shortcutsPage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize terminal training page
   */
  private renderTerminalPage(): string {
    if (!this.terminalPage) {
      this.terminalPage = new TerminalTrainingPage();
    }
    const content = this.terminalPage.render();
    setTimeout(() => {
      this.terminalPage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize SRS review page
   */
  private renderSRSPage(): string {
    if (!this.srsPage) {
      this.srsPage = new SRSReviewPage();
    }
    const content = this.srsPage.render();
    setTimeout(() => {
      this.srsPage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize daily challenge page
   */
  private renderDailyChallengePage(): string {
    if (!this.dailyChallengePage) {
      this.dailyChallengePage = new DailyChallengePage();
    }
    const content = this.dailyChallengePage.render();
    setTimeout(() => {
      this.dailyChallengePage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize quiz page
   */
  private renderQuizPage(): string {
    setTimeout(() => {
      const pageContainer = document.getElementById('quiz-page-container');
      if (pageContainer) {
        if (!this.quizPage) {
          this.quizPage = new QuizPage(pageContainer);
        }
        this.quizPage.render();
      }
    }, 0);

    return '<div id="quiz-page-container" class="quiz-page-wrapper"></div>';
  }

  /**
   * Render and initialize social page
   */
  private renderSocialPage(): string {
    if (!this.socialPage) {
      this.socialPage = new SocialPage();
    }
    const content = this.socialPage.render();
    setTimeout(() => {
      this.socialPage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize playground page
   */
  private renderPlaygroundPage(): string {
    if (!this.playgroundPage) {
      this.playgroundPage = new CodePlaygroundPage();
    }
    const content = this.playgroundPage.render();
    setTimeout(() => {
      this.playgroundPage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize race page
   */
  private renderRacePage(): string {
    if (!this.racePage) {
      this.racePage = new TypingRacePage();
    }
    const content = this.racePage.render();
    setTimeout(() => {
      this.racePage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize git training page
   */
  private renderGitPage(): string {
    setTimeout(() => {
      const pageContainer = document.getElementById('git-page-container');
      if (pageContainer) {
        if (!this.gitPage) {
          this.gitPage = new GitTrainingPage(pageContainer);
        }
        this.gitPage.render();
      }
    }, 0);

    return '<div id="git-page-container" class="git-page-wrapper"></div>';
  }

  /**
   * Render and initialize vim training page
   */
  private renderVimPage(): string {
    setTimeout(() => {
      const pageContainer = document.getElementById('vim-page-container');
      if (pageContainer) {
        if (!this.vimPage) {
          this.vimPage = new VimTrainingPage(pageContainer);
        }
        this.vimPage.render();
      }
    }, 0);

    return '<div id="vim-page-container" class="vim-page-wrapper"></div>';
  }

  /**
   * Render and initialize regex training page
   */
  private renderRegexPage(): string {
    setTimeout(() => {
      const pageContainer = document.getElementById('regex-page-container');
      if (pageContainer) {
        if (!this.regexPage) {
          this.regexPage = new RegexTrainingPage(pageContainer);
        }
        this.regexPage.render();
      }
    }, 0);

    return '<div id="regex-page-container" class="regex-page-wrapper"></div>';
  }

  /**
   * Render and initialize algorithm training page
   */
  private renderAlgorithmPage(): string {
    if (!this.algorithmPage) {
      this.algorithmPage = new AlgorithmTrainingPage();
    }
    const content = this.algorithmPage.render();
    setTimeout(() => {
      this.algorithmPage?.init();
    }, 0);
    return content;
  }

  /**
   * Render and initialize SQL training page
   */
  private renderSQLPage(): string {
    if (!this.sqlPage) {
      this.sqlPage = new SQLTrainingPage();
    }
    const content = this.sqlPage.render();
    setTimeout(() => {
      this.sqlPage?.init();
    }, 0);
    return content;
  }

  /**
   * Show toast notification
   */
  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    const container = document.getElementById('toast-container');
    if (!container) {
      return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons: Record<string, string> = {
      success:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"></polyline></svg>',
      error:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      warning:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Remove after 4 seconds
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}
