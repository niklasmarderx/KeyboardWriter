/**
 * KeyboardWriter - Main Entry Point
 * Professional Typing Trainer for Developers
 */

import { App } from './app/App';
import { SettingsModal } from './components/settings/SettingsModal';
import { EventBus, Store } from './core';
import { ConfettiService, SoundService, ThemeService } from './services';

// Global settings modal instance
const settingsModal = new SettingsModal();

// Register Service Worker for PWA
registerServiceWorker();

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize theme first (before app renders)
    ThemeService.init();

    const app = new App();
    app.init();

    // Setup navigation click handlers
    setupNavigation();

    // Initialize sound service on first user interaction
    document.addEventListener('click', () => SoundService.init(), { once: true });
    document.addEventListener('keydown', () => SoundService.init(), { once: true });

    // Listen for celebration events
    EventBus.on('celebration:levelup', () => {
      ConfettiService.levelUp();
      SoundService.playLevelUp();
    });

    EventBus.on('celebration:achievement', () => {
      ConfettiService.achievement();
      SoundService.playAchievement();
    });

    EventBus.on('celebration:perfect', () => {
      ConfettiService.perfectScore();
      SoundService.playSuccess();
    });

    // Show welcome message on first load
    const state = Store.getState();
    if (state.user.statistics.totalSessions === 0) {
      EventBus.emit('ui:toast', {
        message: 'Willkommen bei KeyboardWriter! Starte dein Training.',
        type: 'info',
      });
    }
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showErrorScreen();
  }
});

/**
 * Setup navigation click handlers
 */
function setupNavigation(): void {
  document.addEventListener('click', event => {
    // Safari fix: ensure we get an HTMLElement
    const target = event.target as Element;

    // Handle SVG elements in Safari - they don't have closest() in some versions
    // Walk up the tree manually if needed
    const findClosestWithDataPage = (el: Element | null): HTMLElement | null => {
      while (el) {
        if (el instanceof HTMLElement && el.dataset.page) {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    };

    const findClosestById = (el: Element | null, id: string): HTMLElement | null => {
      while (el) {
        if (el instanceof HTMLElement && el.id === id) {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    };

    // Navigation links
    const navItem = findClosestWithDataPage(target);
    if (navItem) {
      event.preventDefault();
      const page = navItem.dataset.page;
      if (page) {
        Store.navigateTo(page);

        // Update active state
        document.querySelectorAll('.sidebar-nav-item').forEach(item => {
          item.classList.remove('active');
        });
        navItem.classList.add('active');
      }
    }

    // Settings button
    if (
      findClosestById(target, 'btn-settings') ||
      (target as HTMLElement).closest?.('#btn-settings')
    ) {
      settingsModal.open();
    }

    // Shutdown button - stops the dev server
    if (
      findClosestById(target, 'btn-shutdown') ||
      (target as HTMLElement).closest?.('#btn-shutdown')
    ) {
      shutdownServer();
    }
  });
}

/**
 * Shutdown the development server
 */
function shutdownServer(): void {
  // Save user data before shutdown
  const state = Store.getState();
  localStorage.setItem('keyboard-writer-user', JSON.stringify(state.user));

  // Show confirmation
  const confirmed = confirm(
    'KeyboardWriter beenden?\n\nDer Server wird gestoppt und der Browser-Tab geschlossen.'
  );

  if (confirmed) {
    // Show goodbye message
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-sans);
        ">
          <h1 style="margin-bottom: 16px;">Auf Wiedersehen!</h1>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">
            KeyboardWriter wird beendet...
          </p>
          <p style="color: var(--text-muted); font-size: 14px;">
            Du kannst diesen Tab jetzt schließen.
          </p>
        </div>
      `;
    }

    // Try to close the window (works if opened by script)
    setTimeout(() => {
      window.close();
    }, 1000);
  }
}

/**
 * Show error screen if initialization fails
 */
function showErrorScreen(): void {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: var(--bg-primary);
        color: var(--text-primary);
        font-family: var(--font-sans);
      ">
        <h1 style="margin-bottom: 16px; color: var(--accent-error);">Fehler beim Laden</h1>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">
          Die Anwendung konnte nicht initialisiert werden.
        </p>
        <button 
          onclick="location.reload()" 
          style="
            background: var(--accent-primary);
            color: var(--text-inverse);
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          "
        >
          Seite neu laden
        </button>
      </div>
    `;
  }
}

/**
 * Register Service Worker for PWA functionality
 */
function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      void registerSW();
    });
  }
}

/**
 * Async Service Worker registration
 */
async function registerSW(): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Check for updates periodically
    setInterval(
      () => {
        registration.update().catch(() => {
          // Silently fail on update check
        });
      },
      60 * 60 * 1000
    ); // Check every hour

    // Handle service worker updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            showUpdateNotification();
          }
        });
      }
    });
  } catch (error) {
    console.error('ServiceWorker registration failed:', error);
  }
}

/**
 * Show notification when a new version is available
 */
function showUpdateNotification(): void {
  EventBus.emit('ui:toast', {
    message: 'Neue Version verfügbar! Seite neu laden für Updates.',
    type: 'info',
  });
}

/**
 * Check if running as installed PWA
 */
export function isPWA(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator &&
      (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

// Listen for online/offline events
window.addEventListener('online', () => {
  EventBus.emit('ui:toast', {
    message: 'Verbindung wiederhergestellt',
    type: 'success',
  });
});

window.addEventListener('offline', () => {
  EventBus.emit('ui:toast', {
    message: 'Keine Internetverbindung',
    type: 'warning',
  });
});
