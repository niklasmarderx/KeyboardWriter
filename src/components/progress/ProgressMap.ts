/**
 * Progress Map Component
 * Visual learning path showing completed, available, and locked lessons
 */

import { escapeHtml } from '../../core/escapeHtml';
import { LearningPathNode, progressTrackingService } from '../../services';

interface ProgressMapOptions {
  width?: number;
  height?: number;
  onLessonClick?: (lessonId: string) => void;
}

export class ProgressMap {
  private readonly container: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private nodes: LearningPathNode[] = [];
  private readonly options: Required<ProgressMapOptions>;
  private hoveredNode: LearningPathNode | null = null;
  private readonly tooltip: HTMLElement;

  constructor(
    containerId: string,
    initialNodes?: LearningPathNode[],
    onLessonClick?: (lessonId: string) => void
  ) {
    const el = document.getElementById(containerId);
    if (!el) {
      throw new Error(`Container element with id '${containerId}' not found`);
    }
    this.container = el;
    this.options = {
      width: 900,
      height: 600,
      onLessonClick: onLessonClick ?? (() => {}),
    };

    // Store initial nodes if provided
    if (initialNodes) {
      this.nodes = initialNodes;
    }

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.canvas.className = 'progress-map-canvas';
    this.canvas.style.cursor = 'pointer';
    this.container.appendChild(this.canvas);

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;

    // Create tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'progress-map-tooltip';
    this.tooltip.style.cssText = `
      position: absolute;
      display: none;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      max-width: 250px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 1000;
      pointer-events: none;
    `;
    this.container.appendChild(this.tooltip);
    this.container.style.position = 'relative';

    // Setup event listeners
    this.setupEvents();

    // Initial render
    this.loadAndRender();
  }

  private setupEvents(): void {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredNode = null;
      this.tooltip.style.display = 'none';
      this.render();
    });
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const node = this.getNodeAtPosition(x, y);

    if (node !== this.hoveredNode) {
      this.hoveredNode = node;

      if (node) {
        this.showTooltip(node, e.clientX, e.clientY);
      } else {
        this.tooltip.style.display = 'none';
      }

      this.render();
    }

    // Update tooltip position if still hovering
    if (node && this.tooltip.style.display === 'block') {
      const containerRect = this.container.getBoundingClientRect();
      this.tooltip.style.left = `${e.clientX - containerRect.left + 15}px`;
      this.tooltip.style.top = `${e.clientY - containerRect.top + 15}px`;
    }
  }

  private handleClick(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const node = this.getNodeAtPosition(x, y);

    if (node && (node.status === 'available' || node.status === 'completed')) {
      this.options.onLessonClick(node.lesson.id);
    }
  }

  private getNodeAtPosition(x: number, y: number): LearningPathNode | null {
    const nodeRadius = 35;

    for (const node of this.nodes) {
      const dx = x - node.position.x;
      const dy = y - node.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= nodeRadius) {
        return node;
      }
    }

    return null;
  }

  private showTooltip(node: LearningPathNode, _clientX: number, _clientY: number): void {
    const starsHtml = this.getStarsHtml(node.stars);
    const statusText = this.getStatusText(node.status);
    const statusClass = `status-${node.status}`;

    this.tooltip.innerHTML = `
      <div class="tooltip-header">
        <strong>${escapeHtml(node.lesson.title)}</strong>
      </div>
      <div class="tooltip-level">Level ${node.lesson.level}</div>
      <div class="tooltip-status ${statusClass}">${statusText}</div>
      ${node.stars > 0 ? `<div class="tooltip-stars">${starsHtml}</div>` : ''}
      <div class="tooltip-description">${escapeHtml(node.lesson.description || '')}</div>
      ${node.status === 'available' ? '<div class="tooltip-hint">Klicken zum Starten</div>' : ''}
      ${node.status === 'locked' ? '<div class="tooltip-hint">Schliesse vorherige Lektionen ab</div>' : ''}
    `;

    this.tooltip.style.display = 'block';
  }

  private getStarsHtml(stars: number): string {
    let html = '';
    for (let i = 0; i < 3; i++) {
      if (i < stars) {
        html += '<span class="star filled">&#9733;</span>';
      } else {
        html += '<span class="star empty">&#9734;</span>';
      }
    }
    return html;
  }

  private getStatusText(status: LearningPathNode['status']): string {
    switch (status) {
      case 'completed':
        return 'Abgeschlossen';
      case 'available':
        return 'Verfügbar';
      case 'in-progress':
        return 'In Bearbeitung';
      case 'locked':
        return 'Gesperrt';
    }
  }

  loadAndRender(): void {
    this.nodes = progressTrackingService.getLearningPath();
    this.render();
  }

  render(): void {
    const { width, height } = this.options;

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Draw connections first (so they appear behind nodes)
    this.drawConnections();

    // Draw nodes
    for (const node of this.nodes) {
      this.drawNode(node);
    }

    // Draw level labels
    this.drawLevelLabels();
  }

  private drawConnections(): void {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    this.ctx.lineWidth = 2;

    for (const node of this.nodes) {
      for (const connectionId of node.connections) {
        const targetNode = this.nodes.find(n => n.lesson.id === connectionId);
        if (targetNode) {
          this.ctx.beginPath();
          this.ctx.moveTo(node.position.x, node.position.y);

          // Draw curved connection
          const midY = (node.position.y + targetNode.position.y) / 2;
          this.ctx.bezierCurveTo(
            node.position.x,
            midY,
            targetNode.position.x,
            midY,
            targetNode.position.x,
            targetNode.position.y
          );

          this.ctx.stroke();
        }
      }
    }
  }

  private drawNode(node: LearningPathNode): void {
    const { x, y } = node.position;
    const radius = 35;
    const isHovered = this.hoveredNode === node;

    // Draw outer glow for current focus
    if (node.isCurrentFocus) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius + 10, 0, Math.PI * 2);
      const glowGradient = this.ctx.createRadialGradient(x, y, radius, x, y, radius + 15);
      glowGradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
      glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      this.ctx.fillStyle = glowGradient;
      this.ctx.fill();
    }

    // Draw node background
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);

    const colors = this.getNodeColors(node.status);
    const nodeGradient = this.ctx.createRadialGradient(x - 10, y - 10, 0, x, y, radius);
    nodeGradient.addColorStop(0, colors.light);
    nodeGradient.addColorStop(1, colors.dark);
    this.ctx.fillStyle = nodeGradient;
    this.ctx.fill();

    // Draw border
    this.ctx.strokeStyle = isHovered ? colors.hover : colors.border;
    this.ctx.lineWidth = isHovered ? 3 : 2;
    this.ctx.stroke();

    // Draw icon or level number
    this.ctx.fillStyle = colors.text;
    this.ctx.font = 'bold 16px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    if (node.status === 'completed') {
      // Draw checkmark
      this.ctx.font = 'bold 24px sans-serif';
      this.ctx.fillText('✓', x, y);
    } else if (node.status === 'locked') {
      // Draw lock
      this.ctx.font = '20px sans-serif';
      this.ctx.fillText('🔒', x, y);
    } else {
      // Draw lesson number/level
      this.ctx.fillText(`${node.lesson.level}`, x, y);
    }

    // Draw stars for completed lessons
    if (node.stars > 0) {
      this.drawStars(x, y + radius + 15, node.stars);
    }

    // Draw title below
    this.ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
    this.ctx.font = '11px Inter, sans-serif';
    this.ctx.textAlign = 'center';

    const title = this.truncateText(node.lesson.title, 80);
    this.ctx.fillText(title, x, y + radius + (node.stars > 0 ? 35 : 20));
  }

  private getNodeColors(status: LearningPathNode['status']): {
    light: string;
    dark: string;
    border: string;
    hover: string;
    text: string;
  } {
    switch (status) {
      case 'completed':
        return {
          light: '#22c55e',
          dark: '#15803d',
          border: '#4ade80',
          hover: '#86efac',
          text: '#ffffff',
        };
      case 'available':
        return {
          light: '#3b82f6',
          dark: '#1d4ed8',
          border: '#60a5fa',
          hover: '#93c5fd',
          text: '#ffffff',
        };
      case 'in-progress':
        return {
          light: '#f59e0b',
          dark: '#b45309',
          border: '#fbbf24',
          hover: '#fcd34d',
          text: '#ffffff',
        };
      case 'locked':
        return {
          light: '#4b5563',
          dark: '#374151',
          border: '#6b7280',
          hover: '#9ca3af',
          text: 'rgba(255, 255, 255, 0.5)',
        };
    }
  }

  private drawStars(x: number, y: number, stars: number): void {
    const starSize = 12;
    const spacing = 14;
    const startX = x - spacing;

    for (let i = 0; i < 3; i++) {
      const starX = startX + i * spacing;
      const filled = i < stars;

      this.ctx.fillStyle = filled ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)';
      this.ctx.font = `${starSize}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(filled ? '★' : '☆', starX, y);
    }
  }

  private drawLevelLabels(): void {
    // Group nodes by level
    const levels = new Map<number, number[]>();
    for (const node of this.nodes) {
      if (!levels.has(node.lesson.level)) {
        levels.set(node.lesson.level, []);
      }
      levels.get(node.lesson.level)!.push(node.position.y);
    }

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';

    for (const [level, yPositions] of levels) {
      const avgY = yPositions.reduce((a, b) => a + b, 0) / yPositions.length;
      this.ctx.fillText(`Level ${level}`, 10, avgY);
    }
  }

  private truncateText(text: string, maxWidth: number): string {
    const metrics = this.ctx.measureText(text);
    if (metrics.width <= maxWidth) {
      return text;
    }

    let truncated = text;
    while (this.ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + '...';
  }

  resize(width: number, height: number): void {
    this.options.width = width;
    this.options.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.render();
  }

  destroy(): void {
    this.canvas.remove();
    this.tooltip.remove();
  }
}

// CSS styles for the component
export const progressMapStyles = `
  .progress-map-container {
    position: relative;
    background: var(--bg-primary);
    border-radius: 12px;
    overflow: hidden;
  }

  .progress-map-canvas {
    display: block;
  }

  .progress-map-tooltip {
    font-size: 13px;
  }

  .progress-map-tooltip .tooltip-header {
    margin-bottom: 4px;
    color: var(--text-primary);
  }

  .progress-map-tooltip .tooltip-level {
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .progress-map-tooltip .tooltip-status {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    margin-bottom: 8px;
  }

  .progress-map-tooltip .tooltip-status.status-completed {
    background: rgba(34, 197, 94, 0.2);
    color: #4ade80;
  }

  .progress-map-tooltip .tooltip-status.status-available {
    background: rgba(59, 130, 246, 0.2);
    color: #60a5fa;
  }

  .progress-map-tooltip .tooltip-status.status-locked {
    background: rgba(107, 114, 128, 0.2);
    color: #9ca3af;
  }

  .progress-map-tooltip .tooltip-stars {
    margin-bottom: 8px;
  }

  .progress-map-tooltip .tooltip-stars .star {
    font-size: 16px;
    margin-right: 2px;
  }

  .progress-map-tooltip .tooltip-stars .star.filled {
    color: #fbbf24;
  }

  .progress-map-tooltip .tooltip-stars .star.empty {
    color: rgba(255, 255, 255, 0.3);
  }

  .progress-map-tooltip .tooltip-description {
    color: var(--text-secondary);
    font-size: 12px;
    line-height: 1.4;
    margin-bottom: 8px;
  }

  .progress-map-tooltip .tooltip-hint {
    font-size: 11px;
    color: var(--primary);
    font-style: italic;
  }
`;
