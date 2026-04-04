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

const ONBOARDING_KEY = 'typecraft_onboarding_complete';

export class OnboardingModal {
  private container: HTMLElement | null = null;
  private currentStep = 0;
  private isVisible = false;

  private readonly steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Willkommen bei TypeCraft!',
      description:
        'Lerne Tippen wie ein Profi. Diese kurze Tour zeigt dir die wichtigsten Funktionen.',
      icon: 'welcome',
    },
    {
      id: 'practice',
      title: 'Übungsmodus',
      description:
        'Im Übungsmodus kannst du frei tippen und deine Geschwindigkeit verbessern. Wähle aus Zitaten, Code-Snippets oder eigenen Texten.',
      icon: 'keyboard',
      action: 'practice',
    },
    {
      id: 'lessons',
      title: 'Strukturierte Lektionen',
      description:
        'Folge unserem Lehrplan mit über 50 Lektionen - von Grundlagen bis zu fortgeschrittenen Techniken.',
      icon: 'book',
      action: 'lessons',
    },
    {
      id: 'devtools',
      title: 'Entwickler-Training',
      description:
        'Trainiere spezielle Skills: Terminal-Commands, Git, Vim, Regex, SQL und IDE-Shortcuts.',
      icon: 'code',
    },
    {
      id: 'statistics',
      title: 'Fortschritt verfolgen',
      description:
        'Behalte deine Statistiken im Blick: WPM, Genauigkeit, Streak und detaillierte Analysen.',
      icon: 'chart',
      action: 'statistics',
    },
    {
      id: 'gamification',
      title: 'Achievements & Level',
      description: 'Sammle XP, steige Level auf und schalte Achievements frei. Bleib motiviert!',
      icon: 'trophy',
      action: 'achievements',
    },
    {
      id: 'ready',
      title: 'Bereit zum Tippen!',
      description:
        'Du bist startklar! Beginne mit einer Lektion oder springe direkt in den Übungsmodus.',
      icon: 'rocket',
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
   * Get SVG icon for step
   */
  private getIconSvg(iconName: string): string {
    const icons: Record<string, string> = {
      welcome:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
      keyboard:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8"></line><line x1="10" y1="8" x2="10" y2="8"></line><line x1="14" y1="8" x2="14" y2="8"></line><line x1="18" y1="8" x2="18" y2="8"></line><line x1="6" y1="12" x2="6" y2="12"></line><line x1="10" y1="12" x2="10" y2="12"></line><line x1="14" y1="12" x2="14" y2="12"></line><line x1="18" y1="12" x2="18" y2="12"></line><line x1="8" y1="16" x2="16" y2="16"></line></svg>',
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
      code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16,18 22,12 16,6"></polyline><polyline points="8,6 2,12 8,18"></polyline></svg>',
      chart:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
      trophy:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>',
      rocket:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>',
    };
    return icons[iconName] || icons.welcome;
  }

  /**
   * Get content for a step
   */
  private getStepContent(step: OnboardingStep): string {
    return `
      <div class="onboarding-icon">${this.getIconSvg(step.icon)}</div>
      <h2 class="onboarding-title">${step.title}</h2>
      <p class="onboarding-description">${step.description}</p>
      ${
        step.action
          ? `
        <button class="btn btn-outline onboarding-action" data-action="${step.action}">
          Feature anschauen
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
