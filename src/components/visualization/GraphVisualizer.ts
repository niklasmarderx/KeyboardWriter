/**
 *
 * Graph & Tree Visualizer Component
 * Visualizes graph algorithms like Dijkstra, BFS, DFS and tree operations
 */

import {
  createSampleGraph as _createSampleGraph,
  createDijkstraGraph as _createDijkstraGraph,
  createDAGGraph as _createDAGGraph,
  generateDijkstraSteps as _generateDijkstraSteps,
  generateBFSSteps as _generateBFSSteps,
  generateDFSSteps as _generateDFSSteps,
  generateAStarSteps as _generateAStarSteps,
  generateTopologicalSortSteps as _generateTopologicalSortSteps,
  generateBellmanFordSteps as _generateBellmanFordSteps,
} from './algorithms/graph-generators';

import {
  createSampleBST as _createSampleBST,
  generateBSTSearchSteps as _generateBSTSearchSteps,
  generatePreorderSteps as _generatePreorderSteps,
  generateInorderSteps as _generateInorderSteps,
  generatePostorderSteps as _generatePostorderSteps,
} from './algorithms/tree-generators';

export type {
  GraphNode,
  GraphEdge,
  TreeNode,
  GraphVisualizationState,
  TreeVisualizationState,
  GraphAlgorithmStep,
  TreeAlgorithmStep,
} from './algorithms/types';

import type {
  GraphNode,
  GraphEdge,
  TreeNode,
  GraphVisualizationState,
  TreeVisualizationState,
  GraphAlgorithmStep,
  TreeAlgorithmStep,
} from './algorithms/types';

/**
 * Graph Visualizer - Creates beautiful graph and tree animations
 */
export class GraphVisualizer {
  private readonly containerId: string;
  private steps: (GraphAlgorithmStep | TreeAlgorithmStep)[] = [];
  private currentStep: number = 0;
  private isPlaying: boolean = false;
  private speed: number = 800;
  private animationFrame: number | null = null;
  private mode: 'graph' | 'tree' = 'graph';

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  /**
   * Create a sample graph for demonstrations
   */
  static createSampleGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    return _createSampleGraph();
  }

  /**
   * Create a sample weighted graph for Dijkstra
   */
  static createDijkstraGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    return _createDijkstraGraph();
  }

  /**
   * Generate Dijkstra's Algorithm steps
   */
  static generateDijkstraSteps(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startId: string,
    endId: string
  ): GraphAlgorithmStep[] {
    return _generateDijkstraSteps(nodes, edges, startId, endId);
  }

  /**
   * Generate BFS (Breadth-First Search) steps
   */
  static generateBFSSteps(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startId: string
  ): GraphAlgorithmStep[] {
    return _generateBFSSteps(nodes, edges, startId);
  }

  /**
   * Generate DFS (Depth-First Search) steps
   */
  static generateDFSSteps(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startId: string
  ): GraphAlgorithmStep[] {
    return _generateDFSSteps(nodes, edges, startId);
  }

  /**
   * Create a sample Binary Search Tree
   */
  static createSampleBST(): TreeNode {
    return _createSampleBST();
  }

  /**
   * Generate BST Search steps
   */
  static generateBSTSearchSteps(root: TreeNode, target: number): TreeAlgorithmStep[] {
    return _generateBSTSearchSteps(root, target);
  }

  /**
   * Generate A* (A-Star) Algorithm steps - The industry standard for pathfinding
   * Used by: Google Maps, Video Games (Starcraft, Age of Empires), Robotics
   */
  static generateAStarSteps(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startId: string,
    endId: string
  ): GraphAlgorithmStep[] {
    return _generateAStarSteps(nodes, edges, startId, endId);
  }

  /**
   * Generate Topological Sort steps (Kahn's Algorithm)
   * Used by: npm/yarn dependency resolution, Build systems (Make, Gradle), Task scheduling
   */
  static generateTopologicalSortSteps(
    nodes: GraphNode[],
    edges: GraphEdge[]
  ): GraphAlgorithmStep[] {
    return _generateTopologicalSortSteps(nodes, edges);
  }

  /**
   * Create a DAG (Directed Acyclic Graph) for topological sort
   */
  static createDAGGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    return _createDAGGraph();
  }

  /**
   * Generate Tree Preorder Traversal steps
   * Used by: Creating a copy of tree, Prefix expression, Serialization
   */
  static generatePreorderSteps(root: TreeNode): TreeAlgorithmStep[] {
    return _generatePreorderSteps(root);
  }

  /**
   * Generate Tree Postorder Traversal steps
   * Used by: Deleting tree, Postfix expression, Directory size calculation
   */
  static generatePostorderSteps(root: TreeNode): TreeAlgorithmStep[] {
    return _generatePostorderSteps(root);
  }

  /**
   * Generate Bellman-Ford Algorithm steps
   * Used by: Network routing (RIP protocol), Currency arbitrage detection, Negative weight handling
   */
  static generateBellmanFordSteps(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startId: string
  ): GraphAlgorithmStep[] {
    return _generateBellmanFordSteps(nodes, edges, startId);
  }

  /**
   * Generate Tree Inorder Traversal steps
   */
  static generateInorderSteps(root: TreeNode): TreeAlgorithmStep[] {
    return _generateInorderSteps(root);
  }

  /**
   * Set steps
   */
  setGraphSteps(steps: GraphAlgorithmStep[]): void {
    this.steps = steps;
    this.currentStep = 0;
    this.mode = 'graph';
    this.render();
  }

  setTreeSteps(steps: TreeAlgorithmStep[]): void {
    this.steps = steps;
    this.currentStep = 0;
    this.mode = 'tree';
    this.render();
  }

  /**
   * Render graph visualization
   */
  private renderGraph(state: GraphVisualizationState): string {
    const width = 500;
    const height = 400;

    return `
      <svg class="graph-svg" viewBox="0 0 ${width} ${height}">
        <!-- Edges -->
        ${state.edges
          .map(edge => {
            const fromNode = state.nodes.find(n => n.id === edge.from);
            const toNode = state.nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) {
              return '';
            }
            const isInPath =
              state.path.includes(edge.from) &&
              state.path.includes(edge.to) &&
              Math.abs(state.path.indexOf(edge.from) - state.path.indexOf(edge.to)) === 1;
            return `
            <g class="graph-edge ${isInPath ? 'active' : ''}">
              <line x1="${fromNode.x}" y1="${fromNode.y}" x2="${toNode.x}" y2="${toNode.y}" />
              ${
                edge.weight !== undefined
                  ? `
                <text x="${(fromNode.x + toNode.x) / 2}" y="${(fromNode.y + toNode.y) / 2 - 10}"
                      class="edge-weight">${edge.weight}</text>
              `
                  : ''
              }
            </g>
          `;
          })
          .join('')}

        <!-- Nodes -->
        ${state.nodes
          .map(node => {
            let nodeClass = 'graph-node';
            if (state.current === node.id) {
              nodeClass += ' current';
            }
            if (state.visited.includes(node.id)) {
              nodeClass += ' visited';
            }
            if (state.path.includes(node.id)) {
              nodeClass += ' in-path';
            }
            const dist = state.distances.get(node.id);
            return `
            <g class="${nodeClass}" transform="translate(${node.x}, ${node.y})">
              <circle r="25" />
              <text class="node-label">${node.label || node.id}</text>
              ${dist !== undefined && dist !== Infinity ? `<text class="node-dist" dy="35">${dist}</text>` : ''}
            </g>
          `;
          })
          .join('')}
      </svg>

      <div class="graph-info">
        ${state.queue.length > 0 ? `<div class="info-item"><span>Queue:</span> [${state.queue.join(', ')}]</div>` : ''}
        ${state.stack.length > 0 ? `<div class="info-item"><span>Stack:</span> [${state.stack.join(', ')}]</div>` : ''}
        ${
          state.distances.size > 0
            ? `
          <div class="info-item">
            <span>Distanzen:</span>
            ${Array.from(state.distances.entries())
              .map(([k, v]) => `${k}:${v === Infinity ? '\u221e' : v}`)
              .join(' | ')}
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  /**
   * Calculate tree node positions
   */
  private calculateTreePositions(
    node: TreeNode | undefined,
    x: number,
    y: number,
    level: number,
    positions: Map<string, { x: number; y: number }>
  ): void {
    if (!node) {
      return;
    }
    // Reduced spread for better visualization
    const spread = 120 / Math.pow(2, level);
    positions.set(node.id, { x, y });

    this.calculateTreePositions(node.left, x - spread, y + 60, level + 1, positions);
    this.calculateTreePositions(node.right, x + spread, y + 60, level + 1, positions);
  }

  /**
   * Render tree visualization
   */
  private renderTree(state: TreeVisualizationState): string {
    if (!state.root) {
      return '<div class="tree-empty">Kein Baum vorhanden</div>';
    }

    const positions = new Map<string, { x: number; y: number }>();
    // Start in center with more space for nodes
    this.calculateTreePositions(state.root, 220, 35, 0, positions);

    const renderNode = (node: TreeNode | undefined): string => {
      if (!node) {
        return '';
      }
      const pos = positions.get(node.id);
      if (!pos) {
        return '';
      }

      let nodeClass = 'tree-node';
      if (state.current === node.id) {
        nodeClass += ' current';
      }
      if (state.comparing === node.id) {
        nodeClass += ' comparing';
      }
      if (state.path.includes(node.id)) {
        nodeClass += ' in-path';
      }

      let edges = '';
      if (node.left) {
        const leftPos = positions.get(node.left.id);
        if (leftPos) {
          edges += `<line class="tree-edge" x1="${pos.x}" y1="${pos.y}" x2="${leftPos.x}" y2="${leftPos.y}" />`;
        }
      }
      if (node.right) {
        const rightPos = positions.get(node.right.id);
        if (rightPos) {
          edges += `<line class="tree-edge" x1="${pos.x}" y1="${pos.y}" x2="${rightPos.x}" y2="${rightPos.y}" />`;
        }
      }

      return `
        ${edges}
        <g class="${nodeClass}" transform="translate(${pos.x}, ${pos.y})">
          <circle r="22" />
          <text>${node.value}</text>
        </g>
        ${renderNode(node.left)}
        ${renderNode(node.right)}
      `;
    };

    return `
      <svg class="tree-svg" viewBox="0 0 440 250" preserveAspectRatio="xMidYMid meet">
        ${renderNode(state.root)}
      </svg>
    `;
  }

  /**
   * Render visualization
   */
  render(): void {
    const container = document.getElementById(this.containerId);
    if (!container) {
      return;
    }

    const step = this.steps[this.currentStep];
    if (!step) {
      return;
    }

    const visualization =
      this.mode === 'graph'
        ? this.renderGraph(step.state as GraphVisualizationState)
        : this.renderTree(step.state as TreeVisualizationState);

    container.innerHTML = `
      <div class="graph-vis graph-vis-sidebyside">
        <div class="graph-vis-left">
          <div class="graph-vis-area">
            ${visualization}
          </div>

          <div class="graph-vis-message">${step.state.message}</div>

          <div class="graph-vis-controls">
            <button class="algo-btn" id="graph-first" ${this.currentStep === 0 ? 'disabled' : ''}>⏮</button>
            <button class="algo-btn" id="graph-prev" ${this.currentStep === 0 ? 'disabled' : ''}>◀</button>
            <button class="algo-btn algo-btn-play" id="graph-play">${this.isPlaying ? '⏸' : '▶'}</button>
            <button class="algo-btn" id="graph-next" ${this.currentStep >= this.steps.length - 1 ? 'disabled' : ''}>▶</button>
            <button class="algo-btn" id="graph-last" ${this.currentStep >= this.steps.length - 1 ? 'disabled' : ''}>⏭</button>
          </div>

          <div class="graph-vis-progress">
            <input type="range" min="0" max="${this.steps.length - 1}" value="${this.currentStep}" id="graph-slider" />
            <span class="graph-step-info">${this.currentStep + 1} / ${this.steps.length}</span>
          </div>

          <div class="graph-vis-speed">
            <label>Speed:</label>
            <input type="range" min="200" max="2000" value="${2200 - this.speed}" id="graph-speed" />
            <span>${this.speed}ms</span>
          </div>
        </div>

        <div class="graph-vis-right">
          <div class="graph-vis-code">
            <div class="graph-code-header">Code</div>
            <pre><code>${this.highlightCode(step.code, step.lineHighlight)}</code></pre>
          </div>
        </div>
      </div>

      <style>
        .graph-vis.graph-vis-sidebyside {
          display: grid !important;
          grid-template-columns: minmax(280px, 1fr) minmax(280px, 1fr) !important;
          gap: 1rem !important;
          align-items: start !important;
        }

        .graph-vis-sidebyside .graph-vis-left {
          display: flex !important;
          flex-direction: column !important;
          gap: 0.75rem !important;
          min-width: 280px !important;
        }

        .graph-vis-sidebyside .graph-vis-right {
          display: flex !important;
          flex-direction: column !important;
          min-width: 280px !important;
          height: 100% !important;
        }

        .graph-vis-sidebyside .graph-vis-right .graph-vis-code {
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
        }

        .graph-code-header {
          padding: 0.5rem 0.75rem !important;
          background: #313244 !important;
          border-radius: 0.5rem 0.5rem 0 0 !important;
          font-size: 0.875rem !important;
          font-weight: 600 !important;
          color: #cdd6f4 !important;
        }

        .graph-vis-sidebyside .graph-vis-right .graph-vis-code pre {
          flex: 1 !important;
          margin: 0 !important;
          border-radius: 0 0 0.5rem 0.5rem !important;
          background: #1e1e2e !important;
          padding: 1rem !important;
          overflow-x: auto !important;
          font-size: 0.75rem !important;
          line-height: 1.4 !important;
        }

        @media (max-width: 650px) {
          .graph-vis.graph-vis-sidebyside {
            grid-template-columns: 1fr !important;
          }
        }

        .graph-vis {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .graph-vis-area {
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          min-height: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .graph-svg, .tree-svg {
          width: 100%;
          max-width: 500px;
        }

        .graph-edge line {
          stroke: var(--text-secondary);
          stroke-width: 2;
        }

        .graph-edge.active line {
          stroke: var(--accent-primary);
          stroke-width: 4;
        }

        .edge-weight {
          fill: var(--text-primary);
          font-size: 12px;
          font-family: var(--font-mono);
          text-anchor: middle;
        }

        .graph-node circle {
          fill: var(--bg-secondary);
          stroke: var(--border-primary);
          stroke-width: 3;
        }

        .graph-node.visited circle {
          fill: #10b981;
          stroke: #059669;
        }

        .graph-node.current circle {
          fill: #f59e0b;
          stroke: #d97706;
          animation: pulse 0.5s ease infinite;
        }

        .graph-node.in-path circle {
          stroke: var(--accent-primary);
          stroke-width: 4;
        }

        .node-label {
          text-anchor: middle;
          dominant-baseline: middle;
          font-weight: bold;
          fill: var(--text-primary);
        }

        .node-dist {
          text-anchor: middle;
          font-size: 10px;
          fill: var(--accent-primary);
          font-family: var(--font-mono);
        }

        .graph-info {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
          margin-top: var(--space-3);
          font-size: var(--font-size-sm);
        }

        .info-item {
          padding: var(--space-2) var(--space-3);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }

        .info-item span {
          font-weight: var(--font-weight-semibold);
          margin-right: var(--space-2);
        }

        /* Tree styles */
        .tree-edge {
          stroke: var(--text-secondary);
          stroke-width: 2;
        }

        .tree-node circle {
          fill: var(--bg-secondary);
          stroke: var(--border-primary);
          stroke-width: 3;
        }

        .tree-node.current circle {
          fill: #f59e0b;
          stroke: #d97706;
        }

        .tree-node.comparing circle {
          fill: #8b5cf6;
          stroke: #7c3aed;
          animation: pulse 0.5s ease infinite;
        }

        .tree-node.in-path circle {
          fill: #10b981;
          stroke: #059669;
        }

        .tree-node text {
          text-anchor: middle;
          dominant-baseline: middle;
          font-weight: bold;
          fill: var(--text-primary);
        }

        .graph-vis-message {
          text-align: center;
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-medium);
          padding: var(--space-3);
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .graph-vis-code {
          background: #1e1e2e;
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          overflow-x: auto;
        }

        .graph-vis-code pre {
          margin: 0;
          font-family: var(--font-mono);
          font-size: var(--font-size-sm);
          line-height: 1.6;
        }

        .graph-vis-controls {
          display: flex;
          justify-content: center;
          gap: var(--space-2);
        }

        .graph-vis-progress {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .graph-vis-progress input[type="range"] {
          flex: 1;
        }

        .graph-step-info {
          font-size: var(--font-size-sm);
          font-family: var(--font-mono);
          color: var(--text-secondary);
          min-width: 100px;
          text-align: right;
        }

        .graph-vis-speed {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          justify-content: center;
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .graph-vis-speed input[type="range"] {
          width: 150px;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      </style>
    `;

    this.attachEventListeners();
  }

  /**
   * Highlight code line
   */
  private highlightCode(code: string, line: number): string {
    const lines = code.split('\n');
    return lines
      .map((l, i) => {
        const lineNum = i + 1;
        const isHighlighted = lineNum === line;
        const escapedLine = l.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<span class="code-line ${isHighlighted ? 'highlighted' : ''}">${escapedLine}</span>`;
      })
      .join('\n');
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    document.getElementById('graph-first')?.addEventListener('click', () => this.goToStep(0));
    document.getElementById('graph-prev')?.addEventListener('click', () => this.prevStep());
    document.getElementById('graph-play')?.addEventListener('click', () => this.togglePlay());
    document.getElementById('graph-next')?.addEventListener('click', () => this.nextStep());
    document
      .getElementById('graph-last')
      ?.addEventListener('click', () => this.goToStep(this.steps.length - 1));

    document.getElementById('graph-slider')?.addEventListener('input', e => {
      const value = parseInt((e.target as HTMLInputElement).value);
      this.goToStep(value);
    });

    document.getElementById('graph-speed')?.addEventListener('input', e => {
      const value = parseInt((e.target as HTMLInputElement).value);
      this.speed = 2200 - value;
      this.render();
    });
  }

  goToStep(step: number): void {
    this.currentStep = Math.max(0, Math.min(step, this.steps.length - 1));
    this.render();
  }

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render();
    } else {
      this.stop();
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  play(): void {
    this.isPlaying = true;
    this.render();
    this.animate();
  }

  stop(): void {
    this.isPlaying = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.render();
  }

  private animate(): void {
    if (!this.isPlaying) {
      return;
    }

    const now = performance.now();
    const step = () => {
      if (!this.isPlaying) {
        return;
      }
      if (performance.now() - now >= this.speed) {
        this.nextStep();
        if (this.isPlaying && this.currentStep < this.steps.length - 1) {
          this.animate();
        }
      } else {
        this.animationFrame = requestAnimationFrame(step);
      }
    };
    this.animationFrame = requestAnimationFrame(step);
  }

  reset(): void {
    this.stop();
    this.currentStep = 0;
    this.render();
  }

  destroy(): void {
    this.stop();
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = '';
    }
  }
}
