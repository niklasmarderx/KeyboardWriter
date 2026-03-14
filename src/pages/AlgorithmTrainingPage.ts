/**
 * Algorithm Training Page
 * Beautiful step-by-step algorithm visualizations
 * Includes sorting, searching, graph, and tree algorithms
 */

import { AlgorithmVisualizer } from '../components/visualization/AlgorithmVisualizer';
import { GraphVisualizer } from '../components/visualization/GraphVisualizer';

type AlgorithmType =
  | 'bubble-sort'
  | 'quick-sort'
  | 'insertion-sort'
  | 'selection-sort'
  | 'merge-sort'
  | 'heap-sort'
  | 'binary-search'
  | 'linear-search'
  | 'dijkstra'
  | 'a-star'
  | 'bellman-ford'
  | 'bfs'
  | 'dfs'
  | 'topological-sort'
  | 'bst-search'
  | 'tree-inorder'
  | 'tree-preorder'
  | 'tree-postorder';

type CategoryType = 'sorting' | 'search' | 'graph' | 'tree';

interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  description: string;
  complexity: string;
  category: CategoryType;
  realWorld?: string;
}

const ALGORITHMS: AlgorithmInfo[] = [
  // Sorting Algorithms
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    description: 'Vergleicht benachbarte Elemente und tauscht sie wenn nötig',
    complexity: 'O(n²)',
    category: 'sorting',
    realWorld: 'Lehrzwecke, kleine Datensätze',
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    description: 'Findet das Minimum und setzt es an die richtige Position',
    complexity: 'O(n²)',
    category: 'sorting',
    realWorld: 'Speicherplatz-kritische Anwendungen',
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    description: 'Fügt jedes Element an der richtigen Stelle ein - gut für fast sortierte Daten',
    complexity: 'O(n²)',
    category: 'sorting',
    realWorld: 'Echtzeit-Datenstromsortierung, kleine Arrays',
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    description: 'Divide & Conquer mit Pivot - Standard in vielen Sprachen',
    complexity: 'O(n log n)',
    category: 'sorting',
    realWorld: 'Arrays.sort() in Java, qsort() in C',
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    description: 'Stabiler Sortieralgorithmus - teilt und verschmilzt',
    complexity: 'O(n log n)',
    category: 'sorting',
    realWorld: 'Externe Sortierung, Linked Lists, Git Merge',
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    description: 'Nutzt Heap-Datenstruktur - garantiert O(n log n)',
    complexity: 'O(n log n)',
    category: 'sorting',
    realWorld: 'Priority Queues, Scheduling-Algorithmen',
  },
  // Search Algorithms
  {
    id: 'binary-search',
    name: 'Binary Search',
    description: 'Sucht effizient in sortierten Arrays durch Halbierung',
    complexity: 'O(log n)',
    category: 'search',
    realWorld: 'Datenbank-Indizes, Git bisect, Telefonbuch',
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    description: 'Durchsucht jedes Element sequentiell',
    complexity: 'O(n)',
    category: 'search',
    realWorld: 'Unsortierte Daten, kleine Listen',
  },
  // Graph Algorithms
  {
    id: 'dijkstra',
    name: 'Dijkstra',
    description: 'Findet kürzeste Pfade in gewichteten Graphen',
    complexity: 'O(V² / E log V)',
    category: 'graph',
    realWorld: 'Google Maps, GPS Navigation, Netzwerk-Routing',
  },
  {
    id: 'a-star',
    name: 'A* (A-Star)',
    description: 'Heuristik-basiertes Pathfinding - schneller als Dijkstra',
    complexity: 'O(E)',
    category: 'graph',
    realWorld: 'Google Maps, Videospiele (Starcraft, AoE), Robotik',
  },
  {
    id: 'bellman-ford',
    name: 'Bellman-Ford',
    description: 'Kürzeste Pfade auch mit negativen Gewichten',
    complexity: 'O(V × E)',
    category: 'graph',
    realWorld: 'RIP-Protokoll, Währungsarbitrage, Netzwerk-Routing',
  },
  {
    id: 'bfs',
    name: 'BFS (Breitensuche)',
    description: 'Durchsucht Graph ebenenweise - findet kürzesten Pfad',
    complexity: 'O(V + E)',
    category: 'graph',
    realWorld: 'Social Networks, Web Crawler, Schachcomputer',
  },
  {
    id: 'dfs',
    name: 'DFS (Tiefensuche)',
    description: 'Durchsucht Graph in die Tiefe - gut für Zykluserkennung',
    complexity: 'O(V + E)',
    category: 'graph',
    realWorld: 'Labyrinth-Lösung, Topologische Sortierung, Compiler',
  },
  {
    id: 'topological-sort',
    name: 'Topologische Sortierung',
    description: 'Ordnet DAG-Knoten nach Abhängigkeiten',
    complexity: 'O(V + E)',
    category: 'graph',
    realWorld: 'npm/yarn, Build-Systeme (Make, Gradle), Task-Scheduling',
  },
  // Tree Algorithms
  {
    id: 'bst-search',
    name: 'BST Suche',
    description: 'Suche im Binary Search Tree - links kleiner, rechts größer',
    complexity: 'O(log n)',
    category: 'tree',
    realWorld: 'Datenbanken, Dateisysteme, Auto-Complete',
  },
  {
    id: 'tree-inorder',
    name: 'Inorder Traversierung',
    description: 'Links → Wurzel → Rechts - gibt sortierte Reihenfolge',
    complexity: 'O(n)',
    category: 'tree',
    realWorld: 'Sortierte Ausgabe von BST, Expression Trees',
  },
  {
    id: 'tree-preorder',
    name: 'Preorder Traversierung',
    description: 'Wurzel → Links → Rechts - für Kopieren/Serialisierung',
    complexity: 'O(n)',
    category: 'tree',
    realWorld: 'Tree-Kopie, Prefix-Notation, JSON-Serialisierung',
  },
  {
    id: 'tree-postorder',
    name: 'Postorder Traversierung',
    description: 'Links → Rechts → Wurzel - für Löschen/Auswertung',
    complexity: 'O(n)',
    category: 'tree',
    realWorld: 'Tree löschen, Postfix-Notation, du -sh (Verzeichnisgröße)',
  },
];

const CATEGORY_INFO: Record<CategoryType, { title: string; icon: string }> = {
  sorting: { title: 'Sortierung', icon: '' },
  search: { title: 'Suche', icon: '' },
  graph: { title: 'Graphen', icon: '' },
  tree: { title: 'Bäume', icon: '' },
};

/**
 * Algorithm Training Page
 */
export class AlgorithmTrainingPage {
  private arrayVisualizer: AlgorithmVisualizer | null = null;
  private graphVisualizer: GraphVisualizer | null = null;
  private currentAlgorithm: AlgorithmType = 'bubble-sort';
  private arraySize: number = 8;
  private searchTarget: number = 0;
  private bstSearchTarget: number = 40;
  private currentArray: number[] = [];

  constructor() {
    this.generateNewArray();
  }

  /**
   * Generate random array
   */
  private generateNewArray(): void {
    this.currentArray = Array.from(
      { length: this.arraySize },
      () => Math.floor(Math.random() * 50) + 5
    );
    this.searchTarget = this.currentArray[Math.floor(Math.random() * this.currentArray.length)];
  }

  /**
   * Get current algorithm info
   */
  private getCurrentAlgorithmInfo(): AlgorithmInfo | undefined {
    return ALGORITHMS.find(a => a.id === this.currentAlgorithm);
  }

  /**
   * Render the page
   */
  render(): string {
    const currentAlgo = this.getCurrentAlgorithmInfo();

    return `
      <div class="algo-page">
        <div class="algo-header">
          <h1>Algorithmus Visualisierung</h1>
          <p class="algo-subtitle">Verstehe Algorithmen Schritt für Schritt - von Sortierung bis Graphen</p>
        </div>

        <div class="algo-layout">
          <!-- Algorithm Selection -->
          <div class="algo-sidebar">
            ${(['sorting', 'search', 'graph', 'tree'] as CategoryType[])
              .map(
                category => `
              <div class="algo-section-title">
                ${CATEGORY_INFO[category].title}
              </div>
              <div class="algo-list">
                ${ALGORITHMS.filter(a => a.category === category)
                  .map(
                    algo => `
                  <button class="algo-item ${this.currentAlgorithm === algo.id ? 'active' : ''}" 
                          data-algorithm="${algo.id}">
                    <div class="algo-item-info">
                      <span class="algo-item-name">${algo.name}</span>
                      <span class="algo-item-complexity">${algo.complexity}</span>
                    </div>
                  </button>
                `
                  )
                  .join('')}
              </div>
            `
              )
              .join('')}
          </div>

          <!-- Main Visualization Area -->
          <div class="algo-main">
            <div class="algo-info-card">
              <div class="algo-info-header">
                <div>
                  <h2>${currentAlgo?.name}</h2>
                  <p>${currentAlgo?.description}</p>
                  ${currentAlgo?.realWorld ? `<p class="algo-realworld">Praxis: ${currentAlgo.realWorld}</p>` : ''}
                </div>
                <span class="algo-complexity-badge">${currentAlgo?.complexity}</span>
              </div>
            </div>

            ${this.renderControls()}

            <div class="algo-visualization" id="algo-visualizer"></div>
          </div>
        </div>
      </div>

      <style>
        .algo-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: var(--space-4);
        }

        .algo-header {
          text-align: center;
          margin-bottom: var(--space-6);
        }

        .algo-header h1 {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--space-2);
        }

        .algo-subtitle {
          color: var(--text-secondary);
          font-size: var(--font-size-lg);
        }

        .algo-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--space-6);
        }

        .algo-sidebar {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
          height: fit-content;
          position: sticky;
          top: var(--space-4);
          max-height: calc(100vh - 2rem);
          overflow-y: auto;
        }

        .algo-section-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: var(--font-weight-semibold);
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-3);
          padding-left: var(--space-2);
        }

        .algo-section-title:not(:first-child) {
          margin-top: var(--space-4);
          padding-top: var(--space-4);
          border-top: 1px solid var(--border-primary);
        }

        .algo-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .algo-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          background: var(--bg-primary);
          border: 2px solid transparent;
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .algo-item:hover {
          border-color: var(--accent-primary);
          transform: translateX(4px);
        }

        .algo-item.active {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          color: white;
          border-color: transparent;
        }

        .algo-item-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .algo-item-name {
          font-weight: var(--font-weight-medium);
          font-size: var(--font-size-sm);
        }

        .algo-item-complexity {
          font-size: var(--font-size-xs);
          opacity: 0.7;
          font-family: var(--font-mono);
        }

        .algo-main {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .algo-info-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: var(--space-5);
        }

        .algo-info-header {
          display: flex;
          align-items: flex-start;
          gap: var(--space-4);
        }

        .algo-info-header h2 {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--space-1);
        }

        .algo-info-header p {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .algo-realworld {
          margin-top: var(--space-2);
          color: var(--accent-primary) !important;
          font-style: italic;
        }

        .algo-complexity-badge {
          margin-left: auto;
          padding: var(--space-2) var(--space-3);
          background: var(--accent-primary);
          color: white;
          border-radius: var(--radius-full);
          font-family: var(--font-mono);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-bold);
          white-space: nowrap;
        }

        .algo-controls-card {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .algo-control-group {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .algo-control-group label {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .algo-control-group input[type="range"] {
          width: 120px;
          cursor: pointer;
        }

        .algo-control-group input[type="number"] {
          width: 80px;
          padding: var(--space-2);
          background: var(--bg-primary);
          border: 1px solid var(--border-primary);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          text-align: center;
          color: var(--text-primary);
        }

        .algo-control-value {
          font-family: var(--font-mono);
          font-weight: var(--font-weight-bold);
          min-width: 30px;
          text-align: center;
        }

        .algo-generate-btn {
          padding: var(--space-2) var(--space-4);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .algo-generate-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(var(--accent-primary-rgb), 0.4);
        }

        .algo-current-array {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-left: auto;
          font-size: var(--font-size-sm);
        }

        .algo-current-array code {
          background: var(--bg-tertiary);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: var(--font-size-xs);
        }

        .algo-visualization {
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          min-height: 500px;
        }

        /* Visualizer Styles */
        .algo-vis {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .algo-vis-bars {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 4px;
          height: 220px;
          padding: var(--space-4);
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
        }

        .algo-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          background: linear-gradient(to top, var(--accent-primary), var(--accent-secondary));
          border-radius: var(--radius-sm) var(--radius-sm) 0 0;
          transition: all 0.3s ease;
          position: relative;
        }

        .algo-bar-value {
          position: absolute;
          top: -25px;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-bold);
          font-family: var(--font-mono);
        }

        .algo-bar.comparing {
          background: linear-gradient(to top, #f59e0b, #fbbf24);
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
        }

        .algo-bar.swapping {
          background: linear-gradient(to top, #ef4444, #f87171);
          animation: shake 0.3s ease;
        }

        .algo-bar.sorted {
          background: linear-gradient(to top, #10b981, #34d399);
        }

        .algo-bar.pivot {
          background: linear-gradient(to top, #8b5cf6, #a78bfa);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        }

        .algo-bar.current {
          background: linear-gradient(to top, #06b6d4, #22d3ee);
        }

        .algo-bar.found {
          background: linear-gradient(to top, #10b981, #34d399);
          animation: pulse 0.5s ease infinite;
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
        }

        .algo-bar.left-bound {
          border-left: 3px solid #f59e0b;
        }

        .algo-bar.right-bound {
          border-right: 3px solid #f59e0b;
        }

        .algo-bar.mid {
          background: linear-gradient(to top, #8b5cf6, #a78bfa);
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .algo-vis-message {
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

        .algo-vis-code {
          background: #1e1e2e;
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          overflow-x: auto;
        }

        .algo-vis-code pre {
          margin: 0;
          font-family: var(--font-mono);
          font-size: var(--font-size-sm);
          line-height: 1.6;
        }

        .algo-vis-code code {
          display: block;
        }

        .code-line {
          display: block;
          padding: 2px var(--space-2);
          border-radius: 2px;
          color: #cdd6f4;
        }

        .code-line.highlighted {
          background: rgba(137, 180, 250, 0.2);
          border-left: 3px solid #89b4fa;
          color: #89b4fa;
        }

        .algo-vis-controls {
          display: flex;
          justify-content: center;
          gap: var(--space-2);
        }

        .algo-btn {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          background: var(--bg-tertiary);
          border: 2px solid var(--border-primary);
          cursor: pointer;
          font-size: var(--font-size-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: var(--text-primary);
        }

        .algo-btn:hover:not(:disabled) {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
          transform: scale(1.1);
        }

        .algo-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .algo-btn-play {
          width: 64px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border-color: transparent;
          color: white;
        }

        .algo-btn-play:hover:not(:disabled) {
          transform: scale(1.15);
          box-shadow: 0 4px 20px rgba(var(--accent-primary-rgb), 0.4);
        }

        .algo-vis-progress {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .algo-vis-progress input[type="range"] {
          flex: 1;
          cursor: pointer;
        }

        .algo-step-info {
          font-size: var(--font-size-sm);
          font-family: var(--font-mono);
          color: var(--text-secondary);
          min-width: 100px;
          text-align: right;
        }

        .algo-vis-speed {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          justify-content: center;
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .algo-vis-speed input[type="range"] {
          width: 150px;
          cursor: pointer;
        }

        .algo-vis-speed span {
          font-family: var(--font-mono);
          min-width: 60px;
        }

        @media (max-width: 900px) {
          .algo-layout {
            grid-template-columns: 1fr;
          }

          .algo-sidebar {
            position: static;
            max-height: none;
          }

          .algo-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          }

          .algo-controls-card {
            flex-direction: column;
            align-items: stretch;
          }

          .algo-current-array {
            margin-left: 0;
            justify-content: center;
          }
        }
      </style>
    `;
  }

  /**
   * Render algorithm-specific controls
   */
  private renderControls(): string {
    const algo = this.getCurrentAlgorithmInfo();

    if (algo?.category === 'sorting') {
      return `
        <div class="algo-controls-card">
          <div class="algo-control-group">
            <label>Array-Größe:</label>
            <input type="range" min="4" max="15" value="${this.arraySize}" id="array-size-slider" />
            <span class="algo-control-value">${this.arraySize}</span>
          </div>
          <button class="algo-generate-btn" id="generate-array">Neues Array</button>
          <div class="algo-current-array">
            <span>Array:</span>
            <code>[${this.currentArray.join(', ')}]</code>
          </div>
        </div>
      `;
    }

    if (algo?.category === 'search') {
      return `
        <div class="algo-controls-card">
          <div class="algo-control-group">
            <label>Array-Größe:</label>
            <input type="range" min="4" max="15" value="${this.arraySize}" id="array-size-slider" />
            <span class="algo-control-value">${this.arraySize}</span>
          </div>
          <div class="algo-control-group">
            <label>Suchwert:</label>
            <input type="number" value="${this.searchTarget}" id="search-target" min="1" max="99" />
          </div>
          <button class="algo-generate-btn" id="generate-array">Neues Array</button>
          <div class="algo-current-array">
            <span>Array:</span>
            <code>[${this.currentArray.join(', ')}]</code>
          </div>
        </div>
      `;
    }

    if (algo?.category === 'graph') {
      return `
        <div class="algo-controls-card">
          <div class="algo-info-text">
            Graph mit ${algo.id === 'dijkstra' ? 'gewichteten Kanten (GPS-Navigation)' : '6 Knoten und 8 Kanten'}
          </div>
          ${
            algo.id === 'dijkstra'
              ? `
            <div class="algo-control-group">
              <label>Pfad:</label>
              <span>Start → Ziel</span>
            </div>
          `
              : ''
          }
          <button class="algo-generate-btn" id="restart-algo">Neustart</button>
        </div>
      `;
    }

    if (algo?.category === 'tree') {
      return `
        <div class="algo-controls-card">
          <div class="algo-info-text">
            Binary Search Tree mit Werten: 20, 30, 40, 50, 60, 70, 80
          </div>
          ${
            algo.id === 'bst-search'
              ? `
            <div class="algo-control-group">
              <label>Suchwert:</label>
              <input type="number" value="${this.bstSearchTarget}" id="bst-search-target" min="1" max="99" />
            </div>
          `
              : ''
          }
          <button class="algo-generate-btn" id="restart-algo">Neustart</button>
        </div>
      `;
    }

    return '';
  }

  /**
   * Initialize the page
   */
  init(): void {
    this.runAlgorithm();
    this.setupEventListeners();
  }

  /**
   * Run current algorithm
   */
  private runAlgorithm(): void {
    const algo = this.getCurrentAlgorithmInfo();

    // Destroy existing visualizers
    if (this.arrayVisualizer) {
      this.arrayVisualizer.destroy();
      this.arrayVisualizer = null;
    }
    if (this.graphVisualizer) {
      this.graphVisualizer.destroy();
      this.graphVisualizer = null;
    }

    if (algo?.category === 'sorting' || algo?.category === 'search') {
      this.arrayVisualizer = new AlgorithmVisualizer('algo-visualizer');
      let steps;

      switch (this.currentAlgorithm) {
        case 'bubble-sort':
          steps = AlgorithmVisualizer.generateBubbleSortSteps(this.currentArray);
          break;
        case 'quick-sort':
          steps = AlgorithmVisualizer.generateQuickSortSteps(this.currentArray);
          break;
        case 'insertion-sort':
          steps = AlgorithmVisualizer.generateInsertionSortSteps(this.currentArray);
          break;
        case 'selection-sort':
          steps = AlgorithmVisualizer.generateSelectionSortSteps(this.currentArray);
          break;
        case 'merge-sort':
          steps = AlgorithmVisualizer.generateMergeSortSteps(this.currentArray);
          break;
        case 'heap-sort':
          steps = AlgorithmVisualizer.generateHeapSortSteps(this.currentArray);
          break;
        case 'binary-search':
          steps = AlgorithmVisualizer.generateBinarySearchSteps(
            this.currentArray,
            this.searchTarget
          );
          break;
        case 'linear-search':
          steps = AlgorithmVisualizer.generateLinearSearchSteps(
            this.currentArray,
            this.searchTarget
          );
          break;
        default:
          steps = AlgorithmVisualizer.generateBubbleSortSteps(this.currentArray);
      }

      this.arrayVisualizer.setSteps(steps);
    } else if (algo?.category === 'graph') {
      this.graphVisualizer = new GraphVisualizer('algo-visualizer');

      // Select the appropriate graph for the algorithm
      let graphData: {
        nodes: ReturnType<typeof GraphVisualizer.createSampleGraph>['nodes'];
        edges: ReturnType<typeof GraphVisualizer.createSampleGraph>['edges'];
      };

      if (
        this.currentAlgorithm === 'dijkstra' ||
        this.currentAlgorithm === 'a-star' ||
        this.currentAlgorithm === 'bellman-ford'
      ) {
        graphData = GraphVisualizer.createDijkstraGraph();
      } else if (this.currentAlgorithm === 'topological-sort') {
        graphData = GraphVisualizer.createDAGGraph();
      } else {
        graphData = GraphVisualizer.createSampleGraph();
      }

      const { nodes, edges } = graphData;

      let steps;
      switch (this.currentAlgorithm) {
        case 'dijkstra':
          steps = GraphVisualizer.generateDijkstraSteps(nodes, edges, '0', '5');
          break;
        case 'a-star':
          steps = GraphVisualizer.generateAStarSteps(nodes, edges, '0', '5');
          break;
        case 'bellman-ford':
          steps = GraphVisualizer.generateBellmanFordSteps(nodes, edges, '0');
          break;
        case 'bfs':
          steps = GraphVisualizer.generateBFSSteps(nodes, edges, 'A');
          break;
        case 'dfs':
          steps = GraphVisualizer.generateDFSSteps(nodes, edges, 'A');
          break;
        case 'topological-sort':
          steps = GraphVisualizer.generateTopologicalSortSteps(nodes, edges);
          break;
        default:
          steps = GraphVisualizer.generateBFSSteps(nodes, edges, 'A');
      }

      this.graphVisualizer.setGraphSteps(steps);
    } else if (algo?.category === 'tree') {
      this.graphVisualizer = new GraphVisualizer('algo-visualizer');
      const tree = GraphVisualizer.createSampleBST();

      let steps;
      switch (this.currentAlgorithm) {
        case 'bst-search':
          steps = GraphVisualizer.generateBSTSearchSteps(tree, this.bstSearchTarget);
          break;
        case 'tree-inorder':
          steps = GraphVisualizer.generateInorderSteps(tree);
          break;
        case 'tree-preorder':
          steps = GraphVisualizer.generatePreorderSteps(tree);
          break;
        case 'tree-postorder':
          steps = GraphVisualizer.generatePostorderSteps(tree);
          break;
        default:
          steps = GraphVisualizer.generateInorderSteps(tree);
      }

      this.graphVisualizer.setTreeSteps(steps);
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Algorithm selection
    document.querySelectorAll('[data-algorithm]').forEach(btn => {
      btn.addEventListener('click', () => {
        const algo = btn.getAttribute('data-algorithm') as AlgorithmType;
        if (algo !== this.currentAlgorithm) {
          this.currentAlgorithm = algo;
          this.generateNewArray();
          this.rerender();
        }
      });
    });

    // Array size slider
    const sizeSlider = document.getElementById('array-size-slider') as HTMLInputElement;
    sizeSlider?.addEventListener('input', () => {
      this.arraySize = parseInt(sizeSlider.value);
      this.generateNewArray();
      this.rerender();
    });

    // Search target input
    const targetInput = document.getElementById('search-target') as HTMLInputElement;
    targetInput?.addEventListener('change', () => {
      this.searchTarget = parseInt(targetInput.value);
      this.runAlgorithm();
    });

    // BST search target
    const bstTargetInput = document.getElementById('bst-search-target') as HTMLInputElement;
    bstTargetInput?.addEventListener('change', () => {
      this.bstSearchTarget = parseInt(bstTargetInput.value);
      this.runAlgorithm();
    });

    // Generate new array button
    const generateBtn = document.getElementById('generate-array');
    generateBtn?.addEventListener('click', () => {
      this.generateNewArray();
      this.rerender();
    });

    // Restart algorithm button
    const restartBtn = document.getElementById('restart-algo');
    restartBtn?.addEventListener('click', () => {
      this.runAlgorithm();
    });
  }

  /**
   * Re-render and reinitialize
   */
  private rerender(): void {
    const container = document.querySelector('.algo-page')?.parentElement;
    if (container) {
      container.innerHTML = this.render();
      this.init();
    }
  }

  /**
   * Destroy the page
   */
  destroy(): void {
    if (this.arrayVisualizer) {
      this.arrayVisualizer.destroy();
      this.arrayVisualizer = null;
    }
    if (this.graphVisualizer) {
      this.graphVisualizer.destroy();
      this.graphVisualizer = null;
    }
  }
}
