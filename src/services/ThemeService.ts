/**
 * Theme Service
 * Manages dark/light mode and theme customization with Violet Aurora design
 */

export type ThemeMode = 'dark' | 'light' | 'system';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeSettings {
  mode: ThemeMode;
  customColors: Partial<ThemeColors>;
  reducedMotion: boolean;
  highContrast: boolean;
}

const DEFAULT_COLORS: ThemeColors = {
  primary: '#a855f7',
  secondary: '#818cf8',
  accent: '#c084fc',
  success: '#4ade80',
  warning: '#fbbf24',
  error: '#f87171',
};

class ThemeServiceClass {
  private settings: ThemeSettings = {
    mode: 'dark',
    customColors: {},
    reducedMotion: false,
    highContrast: false,
  };

  private mediaQuery: MediaQueryList | null = null;

  constructor() {
    this.loadSettings();
    this.setupSystemThemeListener();
  }

  /**
   * Initialize theme on app load
   */
  init(): void {
    this.applyTheme();
    this.applyAccessibilitySettings();
  }

  /**
   * Setup listener for system theme changes
   */
  private setupSystemThemeListener(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener('change', () => {
      if (this.settings.mode === 'system') {
        this.applyTheme();
      }
    });

    // Also listen for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', e => {
      if (e.matches && !this.settings.reducedMotion) {
        this.settings.reducedMotion = true;
        this.applyAccessibilitySettings();
      }
    });
  }

  /**
   * Get the effective theme (resolving 'system' to actual theme)
   */
  getEffectiveTheme(): 'dark' | 'light' {
    if (this.settings.mode === 'system') {
      return this.mediaQuery?.matches ? 'dark' : 'light';
    }
    return this.settings.mode;
  }

  /**
   * Apply the current theme to the document
   */
  applyTheme(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const effectiveTheme = this.getEffectiveTheme();
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('theme-dark', 'theme-light');
    root.classList.add(`theme-${effectiveTheme}`);

    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', effectiveTheme);

    // Apply CSS variables based on theme
    if (effectiveTheme === 'light') {
      this.applyLightTheme(root);
    } else {
      this.applyDarkTheme(root);
    }

    // Apply custom colors
    this.applyCustomColors(root);
  }

  /**
   * Apply dark theme CSS variables - Violet Aurora Dark
   */
  private applyDarkTheme(root: HTMLElement): void {
    const darkVars: Record<string, string> = {
      // Backgrounds
      '--bg-primary': '#0f0a1a',
      '--bg-secondary': '#1a1225',
      '--bg-tertiary': '#241830',
      '--bg-elevated': '#2d2040',
      '--bg-overlay': 'rgba(15, 10, 26, 0.85)',
      '--bg-glass': 'rgba(26, 18, 37, 0.7)',
      '--bg-glass-hover': 'rgba(36, 24, 48, 0.8)',

      // Text
      '--text-primary': '#f5f3f8',
      '--text-secondary': '#a8a0b5',
      '--text-muted': '#6d6580',
      '--text-inverse': '#0f0a1a',
      '--text-accent': '#c084fc',

      // Borders
      '--border-primary': '#3d2d55',
      '--border-secondary': '#2d2040',
      '--border-focus': '#a855f7',
      '--border-glass': 'rgba(168, 85, 247, 0.2)',
      '--border-hover': '#4d3d65',

      // Keys
      '--key-default': '#241830',
      '--key-hover': '#3d2d55',
      '--key-border': '#3d2d55',
      '--key-shadow': '0 4px 0 #0f0a1a',
    };

    Object.entries(darkVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  /**
   * Apply light theme CSS variables - Violet Aurora Light
   */
  private applyLightTheme(root: HTMLElement): void {
    const lightVars: Record<string, string> = {
      // Backgrounds
      '--bg-primary': '#faf8fc',
      '--bg-secondary': '#f3f0f7',
      '--bg-tertiary': '#ebe6f2',
      '--bg-elevated': '#ffffff',
      '--bg-overlay': 'rgba(250, 248, 252, 0.9)',
      '--bg-glass': 'rgba(255, 255, 255, 0.7)',
      '--bg-glass-hover': 'rgba(255, 255, 255, 0.85)',

      // Text
      '--text-primary': '#1a1225',
      '--text-secondary': '#5c5470',
      '--text-muted': '#8b8299',
      '--text-inverse': '#faf8fc',
      '--text-accent': '#9333ea',

      // Borders
      '--border-primary': '#e0dae8',
      '--border-secondary': '#ebe6f2',
      '--border-focus': '#9333ea',
      '--border-glass': 'rgba(147, 51, 234, 0.2)',
      '--border-hover': '#d0cae0',

      // Keys
      '--key-default': '#ffffff',
      '--key-hover': '#f3f0f7',
      '--key-border': '#e0dae8',
      '--key-shadow': '0 3px 0 #d4cce0',
    };

    Object.entries(lightVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  /**
   * Apply custom accent colors
   */
  private applyCustomColors(root: HTMLElement): void {
    const colors = { ...DEFAULT_COLORS, ...this.settings.customColors };
    const effectiveTheme = this.getEffectiveTheme();

    // Primary accent
    root.style.setProperty('--accent-primary', colors.primary);
    root.style.setProperty(
      '--accent-primary-hover',
      effectiveTheme === 'dark'
        ? this.lightenColor(colors.primary, 15)
        : this.darkenColor(colors.primary, 10)
    );
    root.style.setProperty('--accent-primary-glow', this.addAlpha(colors.primary, 0.4));
    root.style.setProperty('--accent-primary-subtle', this.addAlpha(colors.primary, 0.1));

    // Secondary accent
    root.style.setProperty('--accent-secondary', colors.secondary);
    root.style.setProperty(
      '--accent-secondary-hover',
      effectiveTheme === 'dark'
        ? this.lightenColor(colors.secondary, 15)
        : this.darkenColor(colors.secondary, 10)
    );

    // Tertiary accent
    root.style.setProperty('--accent-tertiary', colors.accent);

    // Status colors
    root.style.setProperty('--accent-success', colors.success);
    root.style.setProperty('--accent-warning', colors.warning);
    root.style.setProperty('--accent-error', colors.error);

    // Gradients
    root.style.setProperty(
      '--gradient-primary',
      `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
    );
    root.style.setProperty('--shadow-glow', `0 0 20px ${this.addAlpha(colors.primary, 0.3)}`);
    root.style.setProperty('--shadow-glow-lg', `0 0 40px ${this.addAlpha(colors.primary, 0.4)}`);
    root.style.setProperty(
      '--shadow-colored',
      `0 10px 30px -5px ${this.addAlpha(colors.primary, 0.3)}`
    );

    // Key highlight
    root.style.setProperty('--key-active', colors.primary);
    root.style.setProperty('--key-highlight', colors.primary);
  }

  /**
   * Helper: Lighten a color
   */
  private lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
  }

  /**
   * Helper: Darken a color
   */
  private darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
    const B = Math.max(0, (num & 0x0000ff) - amt);
    return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
  }

  /**
   * Helper: Add alpha to hex color
   */
  private addAlpha(hex: string, alpha: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const R = num >> 16;
    const G = (num >> 8) & 0x00ff;
    const B = num & 0x0000ff;
    return `rgba(${R}, ${G}, ${B}, ${alpha})`;
  }

  /**
   * Apply accessibility settings
   */
  private applyAccessibilitySettings(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;

    // Reduced motion
    if (this.settings.reducedMotion) {
      root.classList.add('reduced-motion');
      root.style.setProperty('--transition-fast', '0ms');
      root.style.setProperty('--transition-normal', '0ms');
      root.style.setProperty('--transition-slow', '0ms');
    } else {
      root.classList.remove('reduced-motion');
      root.style.setProperty('--transition-fast', '100ms');
      root.style.setProperty('--transition-normal', '200ms');
      root.style.setProperty('--transition-slow', '300ms');
    }

    // High contrast
    if (this.settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }

  /**
   * Set theme mode
   */
  setMode(mode: ThemeMode): void {
    this.settings.mode = mode;
    this.applyTheme();
    this.saveSettings();
  }

  /**
   * Toggle between dark and light mode
   */
  toggle(): void {
    const current = this.getEffectiveTheme();
    this.setMode(current === 'dark' ? 'light' : 'dark');
  }

  /**
   * Set custom colors
   */
  setCustomColors(colors: Partial<ThemeColors>): void {
    this.settings.customColors = { ...this.settings.customColors, ...colors };
    this.applyTheme();
    this.saveSettings();
  }

  /**
   * Reset colors to defaults
   */
  resetColors(): void {
    this.settings.customColors = {};
    this.applyTheme();
    this.saveSettings();
  }

  /**
   * Set reduced motion preference
   */
  setReducedMotion(enabled: boolean): void {
    this.settings.reducedMotion = enabled;
    this.applyAccessibilitySettings();
    this.saveSettings();
  }

  /**
   * Set high contrast mode
   */
  setHighContrast(enabled: boolean): void {
    this.settings.highContrast = enabled;
    this.applyAccessibilitySettings();
    this.saveSettings();
  }

  /**
   * Get current settings
   */
  getSettings(): ThemeSettings {
    return { ...this.settings };
  }

  /**
   * Get current mode
   */
  getMode(): ThemeMode {
    return this.settings.mode;
  }

  /**
   * Check if dark mode
   */
  isDark(): boolean {
    return this.getEffectiveTheme() === 'dark';
  }

  /**
   * Check if light mode
   */
  isLight(): boolean {
    return this.getEffectiveTheme() === 'light';
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('typecraft_theme_settings');
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ThemeSettings>;
        this.settings = { ...this.settings, ...parsed };
      }
    } catch (error) {
      console.warn('Error loading theme settings:', error);
    }
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('typecraft_theme_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Error saving theme settings:', error);
    }
  }

  /**
   * Get available preset themes - Violet Aurora Collection
   */
  getPresets(): {
    id: string;
    name: string;
    colors: ThemeColors;
    category: 'default' | 'vibrant' | 'editor';
  }[] {
    return [
      // Default Themes
      {
        id: 'violet-aurora',
        name: 'Violet Aurora',
        colors: DEFAULT_COLORS,
        category: 'default',
      },
      {
        id: 'deep-purple',
        name: 'Deep Purple',
        colors: {
          primary: '#9333ea',
          secondary: '#7c3aed',
          accent: '#a855f7',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        category: 'default',
      },
      {
        id: 'electric-violet',
        name: 'Electric Violet',
        colors: {
          primary: '#d946ef',
          secondary: '#a855f7',
          accent: '#f0abfc',
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#f87171',
        },
        category: 'vibrant',
      },
      // Vibrant Themes
      {
        id: 'cyber-pink',
        name: 'Cyber Pink',
        colors: {
          primary: '#ec4899',
          secondary: '#f472b6',
          accent: '#f9a8d4',
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#f87171',
        },
        category: 'vibrant',
      },
      {
        id: 'ocean-blue',
        name: 'Ocean Blue',
        colors: {
          primary: '#3b82f6',
          secondary: '#6366f1',
          accent: '#60a5fa',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        category: 'vibrant',
      },
      {
        id: 'emerald-glow',
        name: 'Emerald Glow',
        colors: {
          primary: '#10b981',
          secondary: '#14b8a6',
          accent: '#34d399',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        category: 'vibrant',
      },
      // Editor-Inspired Themes
      {
        id: 'dracula',
        name: 'Dracula',
        colors: {
          primary: '#BD93F9',
          secondary: '#FF79C6',
          accent: '#8BE9FD',
          success: '#50FA7B',
          warning: '#F1FA8C',
          error: '#FF5555',
        },
        category: 'editor',
      },
      {
        id: 'nord',
        name: 'Nord',
        colors: {
          primary: '#88C0D0',
          secondary: '#81A1C1',
          accent: '#5E81AC',
          success: '#A3BE8C',
          warning: '#EBCB8B',
          error: '#BF616A',
        },
        category: 'editor',
      },
      {
        id: 'monokai',
        name: 'Monokai',
        colors: {
          primary: '#F92672',
          secondary: '#A6E22E',
          accent: '#66D9EF',
          success: '#A6E22E',
          warning: '#FD971F',
          error: '#F92672',
        },
        category: 'editor',
      },
      {
        id: 'one-dark',
        name: 'One Dark',
        colors: {
          primary: '#61AFEF',
          secondary: '#C678DD',
          accent: '#56B6C2',
          success: '#98C379',
          warning: '#E5C07B',
          error: '#E06C75',
        },
        category: 'editor',
      },
      {
        id: 'github-dark',
        name: 'GitHub Dark',
        colors: {
          primary: '#58a6ff',
          secondary: '#8b949e',
          accent: '#79c0ff',
          success: '#3fb950',
          warning: '#d29922',
          error: '#f85149',
        },
        category: 'editor',
      },
    ];
  }

  /**
   * Apply a preset theme
   */
  applyPreset(presetId: string): void {
    const preset = this.getPresets().find(p => p.id === presetId);
    if (preset) {
      this.setCustomColors(preset.colors);
    }
  }
}

// Export singleton instance
export const ThemeService = new ThemeServiceClass();
