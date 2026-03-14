/**
 *
 * Graph & Tree Visualizer Component
 * Visualizes graph algorithms like Dijkstra, BFS, DFS and tree operations
 */

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  value?: number;
  label?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
}

export interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
}

export type GraphVisualizationState = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visited: string[];
  current: string | null;
  path: string[];
  queue: string[];
  stack: string[];
  distances: Map<string, number>;
  message: string;
};

export type TreeVisualizationState = {
  root: TreeNode | null;
  visited: string[];
  current: string | null;
  path: string[];
  comparing: string | null;
  message: string;
};

export type GraphAlgorithmStep = {
  state: GraphVisualizationState;
  code: string;
  lineHighlight: number;
};

export type TreeAlgorithmStep = {
  state: TreeVisualizationState;
  code: string;
  lineHighlight: number;
};

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
    const nodes: GraphNode[] = [
      { id: 'A', x: 150, y: 50, label: 'A' },
      { id: 'B', x: 50, y: 150, label: 'B' },
      { id: 'C', x: 250, y: 150, label: 'C' },
      { id: 'D', x: 100, y: 250, label: 'D' },
      { id: 'E', x: 200, y: 250, label: 'E' },
      { id: 'F', x: 150, y: 350, label: 'F' },
    ];

    const edges: GraphEdge[] = [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'D', weight: 8 },
      { from: 'C', to: 'E', weight: 3 },
      { from: 'D', to: 'E', weight: 2 },
      { from: 'D', to: 'F', weight: 6 },
      { from: 'E', to: 'F', weight: 1 },
    ];

    return { nodes, edges };
  }

  /**
   * Create a sample weighted graph for Dijkstra
   */
  static createDijkstraGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [
      { id: '0', x: 80, y: 100, label: 'Start' },
      { id: '1', x: 200, y: 50, label: '1' },
      { id: '2', x: 200, y: 180, label: '2' },
      { id: '3', x: 320, y: 100, label: '3' },
      { id: '4', x: 440, y: 50, label: '4' },
      { id: '5', x: 440, y: 180, label: 'Ziel' },
    ];

    const edges: GraphEdge[] = [
      { from: '0', to: '1', weight: 4 },
      { from: '0', to: '2', weight: 2 },
      { from: '1', to: '2', weight: 1 },
      { from: '1', to: '3', weight: 5 },
      { from: '2', to: '3', weight: 8 },
      { from: '2', to: '4', weight: 10 },
      { from: '3', to: '4', weight: 2 },
      { from: '3', to: '5', weight: 6 },
      { from: '4', to: '5', weight: 3 },
    ];

    return { nodes, edges };
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
    const steps: GraphAlgorithmStep[] = [];

    const code = `function dijkstra(graph, start) {
  const dist = new Map(); // Distanzen
  const prev = new Map(); // predecessor
  const pq = new PriorityQueue();
  
  // Initialisiere alle Distanzen mit ∞
  for (const node of graph.nodes) {
    dist.set(node, Infinity);
  }
  dist.set(start, 0);
  pq.add(start, 0);
  
  while (!pq.isEmpty()) {
    const u = pq.extractMin();
    for (const neighbor of getNeighbors(u)) {
      const alt = dist.get(u) + weight(u, neighbor);
      if (alt < dist.get(neighbor)) {
        dist.set(neighbor, alt);
        prev.set(neighbor, u);
        pq.decreaseKey(neighbor, alt);
      }
    }
  }
  return { dist, prev };
}`;

    // Build adjacency list
    const adj = new Map<string, { node: string; weight: number }[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
      adj.get(e.from)?.push({ node: e.to, weight: e.weight || 1 });
      adj.get(e.to)?.push({ node: e.from, weight: e.weight || 1 });
    });

    const distances = new Map<string, number>();
    const previous = new Map<string, string>();
    const visited = new Set<string>();

    nodes.forEach(n => distances.set(n.id, Infinity));
    distances.set(startId, 0);

    const pq: { node: string; dist: number }[] = [{ node: startId, dist: 0 }];

    // Initial step
    steps.push({
      state: {
        nodes: [...nodes],
        edges: [...edges],
        visited: [],
        current: null,
        path: [],
        queue: [startId],
        stack: [],
        distances: new Map(distances),
        message: `Starte Dijkstra von Knoten ${startId}. Alle Distanzen auf ∞ gesetzt, Start = 0`,
      },
      code,
      lineHighlight: 7,
    });

    while (pq.length > 0) {
      pq.sort((a, b) => a.dist - b.dist);
      const { node: current } = pq.shift()!;

      if (visited.has(current)) {
        continue;
      }
      visited.add(current);

      steps.push({
        state: {
          nodes: [...nodes],
          edges: [...edges],
          visited: Array.from(visited),
          current,
          path: [],
          queue: pq.map(p => p.node),
          stack: [],
          distances: new Map(distances),
          message: `Besuche Knoten ${current} mit Distanz ${distances.get(current)}`,
        },
        code,
        lineHighlight: 13,
      });

      if (current === endId) {
        // Reconstruct path
        const path: string[] = [];
        let curr: string | undefined = endId;
        while (curr) {
          path.unshift(curr);
          curr = previous.get(curr);
        }

        steps.push({
          state: {
            nodes: [...nodes],
            edges: [...edges],
            visited: Array.from(visited),
            current: endId,
            path,
            queue: [],
            stack: [],
            distances: new Map(distances),
            message: `Ziel erreicht! Kürzester Pfad: ${path.join(' → ')} (Distanz: ${distances.get(endId)})`,
          },
          code,
          lineHighlight: 21,
        });
        return steps;
      }

      const neighbors = adj.get(current) || [];
      for (const { node: neighbor, weight } of neighbors) {
        if (visited.has(neighbor)) {
          continue;
        }

        const alt = (distances.get(current) || 0) + weight;
        const currentDist = distances.get(neighbor) || Infinity;

        steps.push({
          state: {
            nodes: [...nodes],
            edges: [...edges],
            visited: Array.from(visited),
            current,
            path: [current, neighbor],
            queue: pq.map(p => p.node),
            stack: [],
            distances: new Map(distances),
            message: `Prüfe Kante ${current} → ${neighbor}: ${distances.get(current)} + ${weight} = ${alt} ${alt < currentDist ? '< ' + currentDist + ' → Update!' : '>= ' + currentDist}`,
          },
          code,
          lineHighlight: 15,
        });

        if (alt < currentDist) {
          distances.set(neighbor, alt);
          previous.set(neighbor, current);

          const existing = pq.findIndex(p => p.node === neighbor);
          if (existing >= 0) {
            pq[existing].dist = alt;
          } else {
            pq.push({ node: neighbor, dist: alt });
          }

          steps.push({
            state: {
              nodes: [...nodes],
              edges: [...edges],
              visited: Array.from(visited),
              current,
              path: [],
              queue: pq.map(p => p.node),
              stack: [],
              distances: new Map(distances),
              message: `Distanz zu ${neighbor} aktualisiert: ${alt}`,
            },
            code,
            lineHighlight: 17,
          });
        }
      }
    }

    return steps;
  }

  /**
   * Generate BFS (Breadth-First Search) steps
   */
  static generateBFSSteps(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startId: string
  ): GraphAlgorithmStep[] {
    const steps: GraphAlgorithmStep[] = [];

    const code = `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const current = queue.shift();
    process(current);
    
    for (const neighbor of getNeighbors(current)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`;

    // Build adjacency list
    const adj = new Map<string, string[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
      adj.get(e.from)?.push(e.to);
      adj.get(e.to)?.push(e.from);
    });

    const visited = new Set<string>();
    const queue: string[] = [startId];
    visited.add(startId);

    steps.push({
      state: {
        nodes: [...nodes],
        edges: [...edges],
        visited: [startId],
        current: null,
        path: [],
        queue: [...queue],
        stack: [],
        distances: new Map(),
        message: `Starte BFS von Knoten ${startId}. Queue initialisiert.`,
      },
      code,
      lineHighlight: 3,
    });

    while (queue.length > 0) {
      const current = queue.shift()!;

      steps.push({
        state: {
          nodes: [...nodes],
          edges: [...edges],
          visited: Array.from(visited),
          current,
          path: [],
          queue: [...queue],
          stack: [],
          distances: new Map(),
          message: `Besuche Knoten ${current} (aus Queue entnommen)`,
        },
        code,
        lineHighlight: 7,
      });

      const neighbors = (adj.get(current) || []).sort();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);

          steps.push({
            state: {
              nodes: [...nodes],
              edges: [...edges],
              visited: Array.from(visited),
              current,
              path: [current, neighbor],
              queue: [...queue],
              stack: [],
              distances: new Map(),
              message: `Nachbar ${neighbor} entdeckt - zur Queue hinzugefügt`,
            },
            code,
            lineHighlight: 12,
          });
        }
      }
    }

    steps.push({
      state: {
        nodes: [...nodes],
        edges: [...edges],
        visited: Array.from(visited),
        current: null,
        path: [],
        queue: [],
        stack: [],
        distances: new Map(),
        message: `BFS abgeschlossen! Alle ${visited.size} Knoten besucht.`,
      },
      code,
      lineHighlight: 16,
    });

    return steps;
  }

  /**
   * Generate DFS (Depth-First Search) steps
   */
  static generateDFSSteps(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startId: string
  ): GraphAlgorithmStep[] {
    const steps: GraphAlgorithmStep[] = [];

    const code = `function dfs(graph, start) {
  const visited = new Set();
  const stack = [start];
  
  while (stack.length > 0) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    
    visited.add(current);
    process(current);
    
    for (const neighbor of getNeighbors(current)) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }
}`;

    // Build adjacency list
    const adj = new Map<string, string[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
      adj.get(e.from)?.push(e.to);
      adj.get(e.to)?.push(e.from);
    });

    const visited = new Set<string>();
    const stack: string[] = [startId];

    steps.push({
      state: {
        nodes: [...nodes],
        edges: [...edges],
        visited: [],
        current: null,
        path: [],
        queue: [],
        stack: [...stack],
        distances: new Map(),
        message: `Starte DFS von Knoten ${startId}. Stack initialisiert.`,
      },
      code,
      lineHighlight: 3,
    });

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (visited.has(current)) {
        continue;
      }
      visited.add(current);

      steps.push({
        state: {
          nodes: [...nodes],
          edges: [...edges],
          visited: Array.from(visited),
          current,
          path: [],
          queue: [],
          stack: [...stack],
          distances: new Map(),
          message: `Besuche Knoten ${current} (vom Stack genommen)`,
        },
        code,
        lineHighlight: 9,
      });

      const neighbors = (adj.get(current) || []).sort().reverse();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);

          steps.push({
            state: {
              nodes: [...nodes],
              edges: [...edges],
              visited: Array.from(visited),
              current,
              path: [current, neighbor],
              queue: [],
              stack: [...stack],
              distances: new Map(),
              message: `Nachbar ${neighbor} auf Stack gelegt`,
            },
            code,
            lineHighlight: 14,
          });
        }
      }
    }

    steps.push({
      state: {
        nodes: [...nodes],
        edges: [...edges],
        visited: Array.from(visited),
        current: null,
        path: [],
        queue: [],
        stack: [],
        distances: new Map(),
        message: `DFS abgeschlossen! Alle ${visited.size} Knoten besucht.`,
      },
      code,
      lineHighlight: 17,
    });

    return steps;
  }

  /**
   * Create a sample Binary Search Tree
   */
  static createSampleBST(): TreeNode {
    return {
      id: '1',
      value: 50,
      left: {
        id: '2',
        value: 30,
        left: { id: '4', value: 20 },
        right: { id: '5', value: 40 },
      },
      right: {
        id: '3',
        value: 70,
        left: { id: '6', value: 60 },
        right: { id: '7', value: 80 },
      },
    };
  }

  /**
   * Generate BST Search steps
   */
  static generateBSTSearchSteps(root: TreeNode, target: number): TreeAlgorithmStep[] {
    const steps: TreeAlgorithmStep[] = [];

    const code = `function searchBST(node, target) {
  if (node === null) {
    return null; // Nicht gefunden
  }
  
  if (target === node.value) {
    return node; // Gefunden!
  }
  
  if (target < node.value) {
    return searchBST(node.left, target);
  } else {
    return searchBST(node.right, target);
  }
}`;

    const visited: string[] = [];
    let current: TreeNode | null = root;

    steps.push({
      state: {
        root,
        visited: [],
        current: null,
        path: [],
        comparing: null,
        message: `Suche nach ${target} im Binary Search Tree`,
      },
      code,
      lineHighlight: 1,
    });

    while (current) {
      visited.push(current.id);

      steps.push({
        state: {
          root,
          visited: [...visited],
          current: current.id,
          path: [...visited],
          comparing: current.id,
          message: `Vergleiche ${target} mit Knoten ${current.value}`,
        },
        code,
        lineHighlight: 6,
      });

      if (target === current.value) {
        steps.push({
          state: {
            root,
            visited: [...visited],
            current: current.id,
            path: [...visited],
            comparing: null,
            message: `Gefunden! ${target} ist im Baum.`,
          },
          code,
          lineHighlight: 7,
        });
        return steps;
      }

      if (target < current.value) {
        steps.push({
          state: {
            root,
            visited: [...visited],
            current: current.id,
            path: [...visited],
            comparing: null,
            message: `${target} < ${current.value} → gehe nach links`,
          },
          code,
          lineHighlight: 11,
        });
        current = current.left || null;
      } else {
        steps.push({
          state: {
            root,
            visited: [...visited],
            current: current.id,
            path: [...visited],
            comparing: null,
            message: `${target} > ${current.value} → gehe nach rechts`,
          },
          code,
          lineHighlight: 13,
        });
        current = current.right || null;
      }
    }

    steps.push({
      state: {
        root,
        visited: [...visited],
        current: null,
        path: [...visited],
        comparing: null,
        message: `${target} nicht im Baum gefunden.`,
      },
      code,
      lineHighlight: 3,
    });

    return steps;
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
    const steps: GraphAlgorithmStep[] = [];

    const code = `function aStar(graph, start, goal) {
  const openSet = new PriorityQueue();
  const gScore = new Map(); // Kosten vom Start
  const fScore = new Map(); // g + heuristic
  const cameFrom = new Map();
  
  gScore.set(start, 0);
  fScore.set(start, heuristic(start, goal));
  openSet.add(start, fScore.get(start));
  
  while (!openSet.isEmpty()) {
    const current = openSet.extractMin();
    if (current === goal) {
      return reconstructPath(cameFrom, current);
    }
    
    for (const neighbor of getNeighbors(current)) {
      const tentative = gScore.get(current) + weight(current, neighbor);
      if (tentative < gScore.get(neighbor)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentative);
        fScore.set(neighbor, tentative + heuristic(neighbor, goal));
        openSet.add(neighbor, fScore.get(neighbor));
      }
    }
  }
  return null; // Kein Pfad gefunden
}`;

    // Build adjacency list
    const adj = new Map<string, { node: string; weight: number }[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
      adj.get(e.from)?.push({ node: e.to, weight: e.weight || 1 });
      adj.get(e.to)?.push({ node: e.from, weight: e.weight || 1 });
    });

    // Heuristic function (Euclidean distance)
    const heuristic = (a: string, b: string): number => {
      const nodeA = nodes.find(n => n.id === a);
      const nodeB = nodes.find(n => n.id === b);
      if (!nodeA || !nodeB) {
        return 0;
      }
      return Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)) / 50;
    };

    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const cameFrom = new Map<string, string>();
    const visited = new Set<string>();

    nodes.forEach(n => {
      gScore.set(n.id, Infinity);
      fScore.set(n.id, Infinity);
    });
    gScore.set(startId, 0);
    fScore.set(startId, heuristic(startId, endId));

    const openSet: { node: string; f: number }[] = [{ node: startId, f: fScore.get(startId)! }];

    steps.push({
      state: {
        nodes: [...nodes],
        edges: [...edges],
        visited: [],
        current: null,
        path: [],
        queue: [startId],
        stack: [],
        distances: new Map(gScore),
        message: `A* startet von ${startId}. Heuristik: Euklidische Distanz zum Ziel`,
      },
      code,
      lineHighlight: 6,
    });

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const { node: current } = openSet.shift()!;

      if (visited.has(current)) {
        continue;
      }
      visited.add(current);

      const h = heuristic(current, endId).toFixed(1);
      const g = gScore.get(current)!;

      steps.push({
        state: {
          nodes: [...nodes],
          edges: [...edges],
          visited: Array.from(visited),
          current,
          path: [],
          queue: openSet.map(p => p.node),
          stack: [],
          distances: new Map(gScore),
          message: `Besuche ${current}: g=${g}, h=${h}, f=${(g + parseFloat(h)).toFixed(1)}`,
        },
        code,
        lineHighlight: 12,
      });

      if (current === endId) {
        const path: string[] = [];
        let curr: string | undefined = endId;
        while (curr) {
          path.unshift(curr);
          curr = cameFrom.get(curr);
        }

        steps.push({
          state: {
            nodes: [...nodes],
            edges: [...edges],
            visited: Array.from(visited),
            current: endId,
            path,
            queue: [],
            stack: [],
            distances: new Map(gScore),
            message: `Ziel erreicht! Optimaler Pfad: ${path.join(' → ')} (Kosten: ${gScore.get(endId)})`,
          },
          code,
          lineHighlight: 14,
        });
        return steps;
      }

      const neighbors = adj.get(current) || [];
      for (const { node: neighbor, weight } of neighbors) {
        if (visited.has(neighbor)) {
          continue;
        }

        const tentativeG = (gScore.get(current) || 0) + weight;
        const currentG = gScore.get(neighbor) || Infinity;

        steps.push({
          state: {
            nodes: [...nodes],
            edges: [...edges],
            visited: Array.from(visited),
            current,
            path: [current, neighbor],
            queue: openSet.map(p => p.node),
            stack: [],
            distances: new Map(gScore),
            message: `Prüfe ${current} → ${neighbor}: g_neu=${tentativeG} ${tentativeG < currentG ? '< ' + currentG + ' → Update!' : '>= ' + currentG}`,
          },
          code,
          lineHighlight: 18,
        });

        if (tentativeG < currentG) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeG);
          const h = heuristic(neighbor, endId);
          fScore.set(neighbor, tentativeG + h);

          const existing = openSet.findIndex(p => p.node === neighbor);
          if (existing >= 0) {
            openSet[existing].f = tentativeG + h;
          } else {
            openSet.push({ node: neighbor, f: tentativeG + h });
          }
        }
      }
    }

    return steps;
  }

  /**
   * Generate Topological Sort steps (Kahn's Algorithm)
   * Used by: npm/yarn dependency resolution, Build systems (Make, Gradle), Task scheduling
   */
  static generateTopologicalSortSteps(
    nodes: GraphNode[],
    edges: GraphEdge[]
  ): GraphAlgorithmStep[] {
    const steps: GraphAlgorithmStep[] = [];

    const code = `function topologicalSort(graph) {
  const inDegree = new Map();
  const queue = [];
  const result = [];
  
  // Calculate in-degree for each node
  for (const node of graph.nodes) {
    inDegree.set(node, 0);
  }
  for (const edge of graph.edges) {
    inDegree.set(edge.to, inDegree.get(edge.to) + 1);
  }
  
  // Add nodes with in-degree 0 to queue
  for (const [node, degree] of inDegree) {
    if (degree === 0) queue.push(node);
  }
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    
    for (const neighbor of getOutgoing(node)) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }
  
  return result.length === graph.nodes.length ? result : null;
}`;

    // Calculate in-degrees
    const inDegree = new Map<string, number>();
    const outgoing = new Map<string, string[]>();

    nodes.forEach(n => {
      inDegree.set(n.id, 0);
      outgoing.set(n.id, []);
    });

    edges.forEach(e => {
      inDegree.set(e.to, (inDegree.get(e.to) || 0) + 1);
      outgoing.get(e.from)?.push(e.to);
    });

    const queue: string[] = [];
    const result: string[] = [];
    const visited: string[] = [];

    // Initial step
    steps.push({
      state: {
        nodes: [...nodes],
        edges: [...edges],
        visited: [],
        current: null,
        path: [],
        queue: [],
        stack: [],
        distances: new Map(Array.from(inDegree.entries()).map(([k, v]) => [k, v])),
        message: `Calculate in-degree für jeden Knoten (Anzahl eingehender Kanten)`,
      },
      code,
      lineHighlight: 7,
    });

    // Find nodes with in-degree 0
    nodes.forEach(n => {
      if (inDegree.get(n.id) === 0) {
        queue.push(n.id);
      }
    });

    steps.push({
      state: {
        nodes: [...nodes],
        edges: [...edges],
        visited: [],
        current: null,
        path: [],
        queue: [...queue],
        stack: [],
        distances: new Map(Array.from(inDegree.entries()).map(([k, v]) => [k, v])),
        message: `Knoten mit In-Degree 0: [${queue.join(', ')}] → Keine Abhängigkeiten`,
      },
      code,
      lineHighlight: 15,
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);
      visited.push(current);

      steps.push({
        state: {
          nodes: [...nodes],
          edges: [...edges],
          visited: [...visited],
          current,
          path: [...result],
          queue: [...queue],
          stack: [],
          distances: new Map(Array.from(inDegree.entries()).map(([k, v]) => [k, v])),
          message: `Verarbeite ${current} → Reihenfolge: [${result.join(', ')}]`,
        },
        code,
        lineHighlight: 20,
      });

      const neighbors = outgoing.get(current) || [];
      for (const neighbor of neighbors) {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);

        steps.push({
          state: {
            nodes: [...nodes],
            edges: [...edges],
            visited: [...visited],
            current,
            path: [current, neighbor],
            queue: [...queue],
            stack: [],
            distances: new Map(Array.from(inDegree.entries()).map(([k, v]) => [k, v])),
            message: `Reduziere In-Degree von ${neighbor}: ${newDegree + 1} → ${newDegree}`,
          },
          code,
          lineHighlight: 24,
        });

        if (newDegree === 0) {
          queue.push(neighbor);
          steps.push({
            state: {
              nodes: [...nodes],
              edges: [...edges],
              visited: [...visited],
              current,
              path: [],
              queue: [...queue],
              stack: [],
              distances: new Map(Array.from(inDegree.entries()).map(([k, v]) => [k, v])),
              message: `${neighbor} hat jetzt In-Degree 0 → zur Queue hinzugefügt`,
            },
            code,
            lineHighlight: 26,
          });
        }
      }
    }

    const success = result.length === nodes.length;
    steps.push({
      state: {
        nodes: [...nodes],
        edges: [...edges],
        visited: [...visited],
        current: null,
        path: [...result],
        queue: [],
        stack: [],
        distances: new Map(),
        message: success
          ? `Topologische Sortierung: [${result.join(' → ')}]`
          : `Zyklus erkannt! Keine topologische Sortierung möglich.`,
      },
      code,
      lineHighlight: 30,
    });

    return steps;
  }

  /**
   * Create a DAG (Directed Acyclic Graph) for topological sort
   */
  static createDAGGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [
      { id: 'A', x: 80, y: 80, label: 'A' },
      { id: 'B', x: 200, y: 50, label: 'B' },
      { id: 'C', x: 200, y: 150, label: 'C' },
      { id: 'D', x: 320, y: 80, label: 'D' },
      { id: 'E', x: 320, y: 180, label: 'E' },
      { id: 'F', x: 440, y: 120, label: 'F' },
    ];

    // Directed edges (dependencies)
    const edges: GraphEdge[] = [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' },
      { from: 'C', to: 'E' },
      { from: 'D', to: 'F' },
      { from: 'E', to: 'F' },
    ];

    return { nodes, edges };
  }

  /**
   * Generate Tree Preorder Traversal steps
   * Used by: Creating a copy of tree, Prefix expression, Serialization
   */
  static generatePreorderSteps(root: TreeNode): TreeAlgorithmStep[] {
    const steps: TreeAlgorithmStep[] = [];
    const result: number[] = [];

    const code = `function preorder(node) {
  if (node === null) return;
  
  process(node.value);   // Wurzel ZUERST
  preorder(node.left);   // Links
  preorder(node.right);  // Rechts
}
// Anwendung: Tree-Kopie, Prefix-Notation`;

    function traverse(node: TreeNode | undefined, path: string[]): void {
      if (!node) {
        return;
      }

      result.push(node.value);
      steps.push({
        state: {
          root,
          visited: result.map((_, i) => `node-${i}`),
          current: node.id,
          path: [...path, node.id],
          comparing: node.id,
          message: `Besuche ${node.value} ZUERST - Ergebnis: [${result.join(', ')}]`,
        },
        code,
        lineHighlight: 4,
      });

      steps.push({
        state: {
          root,
          visited: result.map((_, i) => `node-${i}`),
          current: node.id,
          path: [...path, node.id],
          comparing: null,
          message: `Gehe zum linken Kind von ${node.value}`,
        },
        code,
        lineHighlight: 5,
      });
      traverse(node.left, [...path, node.id]);

      steps.push({
        state: {
          root,
          visited: result.map((_, i) => `node-${i}`),
          current: node.id,
          path: [...path, node.id],
          comparing: null,
          message: `Gehe zum rechten Kind von ${node.value}`,
        },
        code,
        lineHighlight: 6,
      });
      traverse(node.right, [...path, node.id]);
    }

    steps.push({
      state: {
        root,
        visited: [],
        current: null,
        path: [],
        comparing: null,
        message: 'Starte Preorder-Traversierung (Wurzel → Links → Rechts)',
      },
      code,
      lineHighlight: 1,
    });

    traverse(root, []);

    steps.push({
      state: {
        root,
        visited: [],
        current: null,
        path: [],
        comparing: null,
        message: `Preorder abgeschlossen: [${result.join(', ')}]`,
      },
      code,
      lineHighlight: 8,
    });

    return steps;
  }

  /**
   * Generate Tree Postorder Traversal steps
   * Used by: Deleting tree, Postfix expression, Directory size calculation
   */
  static generatePostorderSteps(root: TreeNode): TreeAlgorithmStep[] {
    const steps: TreeAlgorithmStep[] = [];
    const result: number[] = [];

    const code = `function postorder(node) {
  if (node === null) return;
  
  postorder(node.left);  // Links
  postorder(node.right); // Rechts
  process(node.value);   // Wurzel ZULETZT
}
// Use: Tree deletion, Postfix, du -sh`;

    function traverse(node: TreeNode | undefined, path: string[]): void {
      if (!node) {
        return;
      }

      steps.push({
        state: {
          root,
          visited: result.map((_, i) => `node-${i}`),
          current: node.id,
          path: [...path, node.id],
          comparing: null,
          message: `Bei ${node.value} - gehe erst zum linken Kind`,
        },
        code,
        lineHighlight: 4,
      });
      traverse(node.left, [...path, node.id]);

      steps.push({
        state: {
          root,
          visited: result.map((_, i) => `node-${i}`),
          current: node.id,
          path: [...path, node.id],
          comparing: null,
          message: `Bei ${node.value} - gehe zum rechten Kind`,
        },
        code,
        lineHighlight: 5,
      });
      traverse(node.right, [...path, node.id]);

      result.push(node.value);
      steps.push({
        state: {
          root,
          visited: result.map((_, i) => `node-${i}`),
          current: node.id,
          path: [...path, node.id],
          comparing: node.id,
          message: `Besuche ${node.value} ZULETZT - Ergebnis: [${result.join(', ')}]`,
        },
        code,
        lineHighlight: 6,
      });
    }

    steps.push({
      state: {
        root,
        visited: [],
        current: null,
        path: [],
        comparing: null,
        message: 'Starte Postorder-Traversierung (Links → Rechts → Wurzel)',
      },
      code,
      lineHighlight: 1,
    });

    traverse(root, []);

    steps.push({
      state: {
        root,
        visited: [],
        current: null,
        path: [],
        comparing: null,
        message: `Postorder abgeschlossen: [${result.join(', ')}]`,
      },
      code,
      lineHighlight: 8,
    });

    return steps;
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
    const steps: GraphAlgorithmStep[] = [];

    const code = `function bellmanFord(graph, start) {
  const dist = new Map();
  const prev = new Map();
  
  // Initialisiere alle Distanzen mit ∞
  for (const node of graph.nodes) {
    dist.set(node, Infinity);
  }
  dist.set(start, 0);
  
  // Relaxiere alle Kanten |V|-1 mal
  for (let i = 0; i < nodes.length - 1; i++) {
    for (const edge of graph.edges) {
      if (dist.get(edge.from) + edge.weight < dist.get(edge.to)) {
        dist.set(edge.to, dist.get(edge.from) + edge.weight);
        prev.set(edge.to, edge.from);
      }
    }
  }
  
  // Check for negative cycles
  for (const edge of graph.edges) {
    if (dist.get(edge.from) + edge.weight < dist.get(edge.to)) {
      return "Negativer Zyklus erkannt!";
    }
  }
  return { dist, prev };
}`;

    const distances = new Map<string, number>();
    const previous = new Map<string, string>();

    nodes.forEach(n => distances.set(n.id, Infinity));
    distances.set(startId, 0);

    steps.push({
      state: {
        nodes: [...nodes],
        edges: [...edges],
        visited: [],
        current: null,
        path: [],
        queue: [],
        stack: [],
        distances: new Map(distances),
        message: `Bellman-Ford startet von ${startId}. Alle Distanzen = ∞, Start = 0`,
      },
      code,
      lineHighlight: 6,
    });

    // Relax all edges V-1 times
    for (let i = 0; i < nodes.length - 1; i++) {
      let updated = false;

      steps.push({
        state: {
          nodes: [...nodes],
          edges: [...edges],
          visited: [],
          current: null,
          path: [],
          queue: [],
          stack: [],
          distances: new Map(distances),
          message: `Iteration ${i + 1}/${nodes.length - 1}: Relaxiere alle Kanten`,
        },
        code,
        lineHighlight: 12,
      });

      for (const edge of edges) {
        const fromDist = distances.get(edge.from) || Infinity;
        const toDist = distances.get(edge.to) || Infinity;
        const weight = edge.weight || 1;

        if (fromDist !== Infinity && fromDist + weight < toDist) {
          distances.set(edge.to, fromDist + weight);
          previous.set(edge.to, edge.from);
          updated = true;

          steps.push({
            state: {
              nodes: [...nodes],
              edges: [...edges],
              visited: [edge.from],
              current: edge.to,
              path: [edge.from, edge.to],
              queue: [],
              stack: [],
              distances: new Map(distances),
              message: `Kante ${edge.from}→${edge.to}: ${fromDist} + ${weight} = ${fromDist + weight} < ${toDist} → Update!`,
            },
            code,
            lineHighlight: 15,
          });
        }
      }

      // Also check reverse edges (undirected graph)
      for (const edge of edges) {
        const fromDist = distances.get(edge.to) || Infinity;
        const toDist = distances.get(edge.from) || Infinity;
        const weight = edge.weight || 1;

        if (fromDist !== Infinity && fromDist + weight < toDist) {
          distances.set(edge.from, fromDist + weight);
          previous.set(edge.from, edge.to);
          updated = true;

          steps.push({
            state: {
              nodes: [...nodes],
              edges: [...edges],
              visited: [edge.to],
              current: edge.from,
              path: [edge.to, edge.from],
              queue: [],
              stack: [],
              distances: new Map(distances),
              message: `Kante ${edge.to}→${edge.from}: ${fromDist} + ${weight} = ${fromDist + weight} < ${toDist} → Update!`,
            },
            code,
            lineHighlight: 15,
          });
        }
      }

      if (!updated) {
        steps.push({
          state: {
            nodes: [...nodes],
            edges: [...edges],
            visited: [],
            current: null,
            path: [],
            queue: [],
            stack: [],
            distances: new Map(distances),
            message: `Keine Änderungen in Iteration ${i + 1} → Früher Abbruch möglich`,
          },
          code,
          lineHighlight: 18,
        });
        break;
      }
    }

    steps.push({
      state: {
        nodes: [...nodes],
        edges: [...edges],
        visited: Array.from(distances.keys()),
        current: null,
        path: [],
        queue: [],
        stack: [],
        distances: new Map(distances),
        message: `Bellman-Ford abgeschlossen! Kürzeste Distanzen von ${startId}: ${Array.from(
          distances.entries()
        )
          .map(([k, v]) => `${k}=${v}`)
          .join(', ')}`,
      },
      code,
      lineHighlight: 27,
    });

    return steps;
  }

  /**
   * Generate Tree Inorder Traversal steps
   */
  static generateInorderSteps(root: TreeNode): TreeAlgorithmStep[] {
    const steps: TreeAlgorithmStep[] = [];
    const result: number[] = [];

    const code = `function inorder(node) {
  if (node === null) return;
  
  inorder(node.left);    // Links
  process(node.value);   // Wurzel
  inorder(node.right);   // Rechts
}
// Ergebnis: sortierte Reihenfolge!`;

    function traverse(node: TreeNode | undefined, path: string[]): void {
      if (!node) {
        return;
      }

      steps.push({
        state: {
          root,
          visited: [...result.map((_, i) => path[i])].filter(Boolean),
          current: node.id,
          path: [...path, node.id],
          comparing: null,
          message: `Gehe zu linkem Kind von ${node.value}`,
        },
        code,
        lineHighlight: 4,
      });

      traverse(node.left, [...path, node.id]);

      result.push(node.value);
      steps.push({
        state: {
          root,
          visited: result.map((_, i) => `node-${i}`),
          current: node.id,
          path: [...path, node.id],
          comparing: node.id,
          message: `Besuche ${node.value} - Ergebnis: [${result.join(', ')}]`,
        },
        code,
        lineHighlight: 5,
      });

      traverse(node.right, [...path, node.id]);
    }

    steps.push({
      state: {
        root,
        visited: [],
        current: null,
        path: [],
        comparing: null,
        message: 'Starte Inorder-Traversierung (Links → Wurzel → Rechts)',
      },
      code,
      lineHighlight: 1,
    });

    traverse(root, []);

    steps.push({
      state: {
        root,
        visited: [],
        current: null,
        path: [],
        comparing: null,
        message: `Inorder abgeschlossen: [${result.join(', ')}] - sortiert!`,
      },
      code,
      lineHighlight: 8,
    });

    return steps;
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
              .map(([k, v]) => `${k}:${v === Infinity ? '∞' : v}`)
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
