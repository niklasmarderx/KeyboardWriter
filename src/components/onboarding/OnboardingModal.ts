/**
 * Onboarding Modal Component
 * Guides new users through the app's main features
 */

import { EventBus } from '../../core/EventBus';
import { StorageService } from '../../core/StorageService';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: string;
}

const ONBOARDING_KEY = 'keyboardwriter_onboarding_complete';

export class OnboardingModal {
  private container: HTMLElement | null = null;
  private currentStep = 0;
  private isVisible = false;

  private readonly steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Willkommen bei KeyboardWriter!',
      description:
        'Lerne Tippen wie ein Profi. Diese kurze Tour zeigt dir die wichtigsten Funktionen.',
      icon: '👋',
    },
    {
      id: 'practice',
      title: 'Übungsmodus',
      description:
        'Im Übungsmodus kannst du frei tippen und deine Geschwindigkeit verbessern. Wähle aus Zitaten, Code-Snippets oder eigenen Texten.',
      icon: '⌨️',
      action: 'practice',
    },
    {
      id: 'lessons',
      title: 'Strukturierte Lektionen',
      description:
        'Folge unserem Lehrplan mit über 50 Lektionen - von Grundlagen bis zu fortgeschrittenen Techniken.',
      icon: '📚',
      action: 'lessons',
    },
    {
      id: 'devtools',
      title: 'Entwickler-Training',
      description:
        'Trainiere spezielle Skills: Terminal-Commands, Git, Vim, Regex, SQL und IDE-Shortcuts.',
      icon: '🛠️',
    },
    {
      id: 'statistics',
      title: 'Fortschritt verfolgen',
      description:
        'Behalte deine Statistiken im Blick: WPM, Genauigkeit, Streak und detaillierte Analysen.',
      icon: '📊',
      action: 'statistics',
    },
    {
      id: 'gamification',
      title: 'Achievements & Level',
      description: 'Sammle XP, steige Level auf und schalte Achievements frei. Bleib motiviert!',
      icon: '🏆',
      action: 'achievements',
    },
    {
      id: 'ready',
      title: 'Bereit zum Tippen!',
      description:
        'Du bist startklar! Beginne mit einer Lektion oder springe direkt in den Übungsmodus.',
      icon: '🚀',
    },
  ];

  constructor() {
    this.setupKeyboardNavigation();
  }

  /**
   * Check if onboarding should be shown
   */
  shouldShowOnboarding(): boolean {
    const completed = StorageService.load<boolean>(ONBOARDING_KEY);
    return completed !== true;
  }

  /**
   * Show the onboarding modal
   */
  show(): void {
    if (this.isVisible) {
      return;
    }

    this.isVisible = true;
    this.currentStep = 0;
    this.render();
    this.attachEventListeners();
  }

  /**
   * Hide the onboarding modal
   */
  hide(): void {
    if (!this.isVisible) {
      return;
    }

    this.isVisible = false;
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }

  /**
   * Mark onboarding as complete
   */
  complete(): void {
    StorageService.save(ONBOARDING_KEY, true);
    this.hide();
    EventBus.emit('ui:toast', {
      message: 'Onboarding abgeschlossen! Viel Spaß beim Tippen!',
      type: 'success',
    });
  }

  /**
   * Skip onboarding
   */
  skip(): void {
    StorageService.save(ONBOARDING_KEY, true);
    this.hide();
  }

  /**
   * Go to next step
   */
  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.updateContent();
    } else {
      this.complete();
    }
  }

  /**
   * Go to previous step
   */
  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateContent();
    }
  }

  /**
   * Go to specific step
   */
  goToStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.currentStep = index;
      this.updateContent();
    }
  }

  /**
   * Setup keyboard navigation
   */
  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', e => {
      if (!this.isVisible) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
          this.nextStep();
          break;
        case 'ArrowLeft':
          this.prevStep();
          break;
        case 'Escape':
          this.skip();
          break;
      }
    });
  }

  /**
   * Render the modal
   */
  private render(): void {
    this.container = document.createElement('div');
    this.container.className = 'onboarding-overlay';
    this.container.innerHTML = this.getTemplate();
    document.body.appendChild(this.container);
  }

  /**
   * Update modal content for current step
   */
  private updateContent(): void {
    if (!this.container) {
      return;
    }

    const step = this.steps[this.currentStep];
    const content = this.container.querySelector('.onboarding-content');
    if (content) {
      content.innerHTML = this.getStepContent(step);
    }

    // Update progress dots
    const dots = this.container.querySelectorAll('.onboarding-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentStep);
    });

    // Update buttons
    const prevBtn = this.container.querySelector('.onboarding-prev') as HTMLButtonElement;
    const nextBtn = this.container.querySelector('.onboarding-next') as HTMLButtonElement;

    if (prevBtn) {
      prevBtn.disabled = this.currentStep === 0;
    }
    if (nextBtn) {
      nextBtn.textContent = this.currentStep === this.steps.length - 1 ? 'Fertig!' : 'Weiter';
    }
  }

  /**
   * Get template for modal
   */
  private getTemplate(): string {
    const step = this.steps[this.currentStep];

    return `
      <div class="onboarding-modal">
        <button class="onboarding-skip" title="Überspringen">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="onboarding-content">
          ${this.getStepContent(step)}
        </div>

        <div class="onboarding-progress">
          ${this.steps
            .map(
              (_, i) => `
            <button class="onboarding-dot ${i === this.currentStep ? 'active' : ''}" data-step="${i}"></button>
          `
            )
            .join('')}
        </div>

        <div class="onboarding-actions">
          <button class="btn btn-ghost onboarding-prev" ${this.currentStep === 0 ? 'disabled' : ''}>
            Zurück
          </button>
          <button class="btn btn-primary onboarding-next">
            ${this.currentStep === this.steps.length - 1 ? 'Fertig!' : 'Weiter'}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Get content for a step
   */
  private getStepContent(step: OnboardingStep): string {
    return `
      <div class="onboarding-icon">${step.icon}</div>
      <h2 class="onboarding-title">${step.title}</h2>
      <p class="onboarding-description">${step.description}</p>
      ${
        step.action
          ? `
        <button class="btn btn-outline onboarding-action" data-action="${step.action}">
          Feature anschauen →
        </button>
      `
          : ''
      }
    `;
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    if (!this.container) {
      return;
    }

    // Skip button
    this.container.querySelector('.onboarding-skip')?.addEventListener('click', () => {
      this.skip();
    });

    // Navigation buttons
    this.container.querySelector('.onboarding-prev')?.addEventListener('click', () => {
      this.prevStep();
    });

    this.container.querySelector('.onboarding-next')?.addEventListener('click', () => {
      this.nextStep();
    });

    // Progress dots
    this.container.querySelectorAll('.onboarding-dot').forEach(dot => {
      dot.addEventListener('click', e => {
        const step = parseInt((e.target as HTMLElement).dataset.step || '0', 10);
        this.goToStep(step);
      });
    });

    // Action buttons
    this.container.addEventListener('click', e => {
      const actionBtn = (e.target as HTMLElement).closest('.onboarding-action');
      if (actionBtn) {
        const action = (actionBtn as HTMLElement).dataset.action;
        if (action) {
          this.hide();
          EventBus.emit('nav:change', { page: action });
        }
      }
    });

    // Click outside to close
    this.container.addEventListener('click', e => {
      if (e.target === this.container) {
        this.skip();
      }
    });
  }
}

// Singleton instance
export const onboardingModal = new OnboardingModal();
