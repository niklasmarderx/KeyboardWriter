/**
 * Keyboard Heatmap Component
 * Visualizes error rates across keyboard keys
 */

export interface KeyStats {
  key: string;
  errorRate: number;
  totalAttempts: number;
}

// QWERTZ keyboard layout for heatmap
const KEYBOARD_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'ß'],
  ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
  ['Y', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '-'],
];

export class KeyboardHeatmap {
  private readonly container: HTMLElement;
  private keyStats: Map<string, KeyStats> = new Map();

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container ${containerId} not found`);
    }
    this.container = container;
  }

  /**
   * Set key statistics
   */
  setData(stats: Map<string, KeyStats>): void {
    this.keyStats = stats;
    this.render();
  }

  /**
   * Render the heatmap
   */
  render(): void {
    const maxErrorRate = Math.max(
      ...Array.from(this.keyStats.values()).map(s => s.errorRate),
      0.01
    );

    this.container.innerHTML = `
      <div class="keyboard-heatmap">
        ${KEYBOARD_ROWS.map(
          (row, rowIndex) => `
          <div class="heatmap-row" style="
            display: flex;
            gap: 4px;
            justify-content: center;
            margin-bottom: 4px;
            margin-left: ${rowIndex * 15}px;
          ">
            ${row
              .map(key => {
                const stats = this.keyStats.get(key.toLowerCase());
                const errorRate = stats?.errorRate ?? 0;
                const attempts = stats?.totalAttempts ?? 0;
                const intensity = attempts >= 5 ? errorRate / maxErrorRate : 0;
                const color = this.getHeatColor(intensity);

                return `
                <div class="heatmap-key" style="
                  width: 40px;
                  height: 40px;
                  background: ${color};
                  border: 1px solid ${intensity > 0.5 ? 'rgba(255, 100, 100, 0.5)' : 'var(--border-primary)'};
                  border-radius: 6px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-family: var(--font-mono);
                  font-size: 14px;
                  font-weight: 500;
                  color: ${intensity > 0.6 ? 'white' : 'var(--text-primary)'};
                  cursor: default;
                  transition: transform 0.1s;
                  position: relative;
                " title="${key}: ${attempts >= 5 ? `${Math.round(errorRate * 100)}% Fehlerrate (${attempts} Versuche)` : 'Zu wenig Daten'}"
                   onmouseover="this.style.transform='scale(1.1)'"
                   onmouseout="this.style.transform='scale(1)'">
                  ${key}
                  ${
                    intensity > 0
                      ? `
                    <span style="
                      position: absolute;
                      bottom: -2px;
                      right: -2px;
                      width: 8px;
                      height: 8px;
                      background: ${this.getIndicatorColor(errorRate)};
                      border-radius: 50%;
                      border: 1px solid var(--bg-primary);
                    "></span>
                  `
                      : ''
                  }
                </div>
              `;
              })
              .join('')}
          </div>
        `
        ).join('')}
        
        <!-- Space bar -->
        <div class="heatmap-row" style="display: flex; justify-content: center; margin-top: 4px;">
          <div class="heatmap-key" style="
            width: 200px;
            height: 40px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-primary);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-mono);
            font-size: 12px;
            color: var(--text-muted);
          ">SPACE</div>
        </div>
        
        <!-- Legend -->
        <div class="heatmap-legend" style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-primary);
        ">
          <span style="font-size: 12px; color: var(--text-muted);">Fehlerrate:</span>
          <span style="font-size: 11px; color: var(--text-muted);">Niedrig</span>
          ${[0, 0.25, 0.5, 0.75, 1]
            .map(
              v => `
            <div style="
              width: 20px;
              height: 20px;
              background: ${this.getHeatColor(v)};
              border-radius: 4px;
              border: 1px solid var(--border-primary);
            "></div>
          `
            )
            .join('')}
          <span style="font-size: 11px; color: var(--text-muted);">Hoch</span>
        </div>
        
        <!-- Stats summary -->
        ${this.renderStatsSummary()}
      </div>
    `;
  }

  /**
   * Get heat color based on intensity (0-1)
   */
  private getHeatColor(intensity: number): string {
    if (intensity === 0) {
      return 'var(--bg-tertiary)';
    }

    // Gradient from green (good) through yellow to red (bad)
    if (intensity < 0.33) {
      // Green to yellow
      const r = Math.round(40 + intensity * 3 * 175);
      const g = Math.round(167 - intensity * 3 * 50);
      const b = Math.round(69 - intensity * 3 * 69);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (intensity < 0.66) {
      // Yellow to orange
      const factor = (intensity - 0.33) * 3;
      const r = Math.round(215 + factor * 40);
      const g = Math.round(117 - factor * 50);
      const b = Math.round(0);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Orange to red
      const factor = (intensity - 0.66) * 3;
      const r = Math.round(255);
      const g = Math.round(67 - factor * 67);
      const b = Math.round(0 + factor * 30);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  /**
   * Get indicator color based on error rate
   */
  private getIndicatorColor(errorRate: number): string {
    if (errorRate < 0.05) {
      return 'var(--accent-success)';
    }
    if (errorRate < 0.15) {
      return 'var(--accent-warning)';
    }
    return 'var(--accent-error)';
  }

  /**
   * Render stats summary
   */
  private renderStatsSummary(): string {
    const stats = Array.from(this.keyStats.values()).filter(s => s.totalAttempts >= 5);

    if (stats.length === 0) {
      return `
        <div style="text-align: center; margin-top: 16px; color: var(--text-muted); font-size: 13px;">
          Noch nicht genug Daten. Übe weiter, um deine Schwachstellen zu identifizieren!
        </div>
      `;
    }

    const sortedByError = [...stats].sort((a, b) => b.errorRate - a.errorRate);
    const worstKeys = sortedByError.slice(0, 3);
    const bestKeys = sortedByError.slice(-3).reverse();

    return `
      <div class="heatmap-stats" style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--border-primary);
      ">
        <div>
          <h4 style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
            Verbesserungsbedarf
          </h4>
          ${worstKeys
            .map(
              k => `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="
                width: 28px;
                height: 28px;
                background: ${this.getHeatColor(k.errorRate / Math.max(...stats.map(s => s.errorRate)))};
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-mono);
                font-size: 12px;
                font-weight: bold;
              ">${k.key.toUpperCase()}</span>
              <span style="font-size: 12px; color: var(--text-muted);">
                ${Math.round(k.errorRate * 100)}% Fehler
              </span>
            </div>
          `
            )
            .join('')}
        </div>
        <div>
          <h4 style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
            Starke Tasten
          </h4>
          ${bestKeys
            .map(
              k => `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="
                width: 28px;
                height: 28px;
                background: var(--accent-success);
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-mono);
                font-size: 12px;
                font-weight: bold;
                color: white;
              ">${k.key.toUpperCase()}</span>
              <span style="font-size: 12px; color: var(--text-muted);">
                ${Math.round((1 - k.errorRate) * 100)}% richtig
              </span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  /**
   * Destroy the heatmap
   */
  destroy(): void {
    this.container.innerHTML = '';
  }
}
