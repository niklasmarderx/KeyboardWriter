/**
 * Graph algorithm step generators
 * Extracted from GraphVisualizer.ts
 */

import type { GraphNode, GraphEdge, GraphAlgorithmStep } from './types';

/**
 * Create a sample graph for demonstrations
 */
export function createSampleGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
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
export function createDijkstraGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
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
 * Create a DAG (Directed Acyclic Graph) for topological sort
 */
export function createDAGGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
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
 * Generate Dijkstra's Algorithm steps
 */
export function generateDijkstraSteps(
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

  // Initialisiere alle Distanzen mit \u221e
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
      message: `Starte Dijkstra von Knoten ${startId}. Alle Distanzen auf \u221e gesetzt, Start = 0`,
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
          message: `Ziel erreicht! K\u00fcrzester Pfad: ${path.join(' \u2192 ')} (Distanz: ${distances.get(endId)})`,
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
          message: `Pr\u00fcfe Kante ${current} \u2192 ${neighbor}: ${distances.get(current)} + ${weight} = ${alt} ${alt < currentDist ? '< ' + currentDist + ' \u2192 Update!' : '>= ' + currentDist}`,
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
export function generateBFSSteps(
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
            message: `Nachbar ${neighbor} entdeckt - zur Queue hinzugef\u00fcgt`,
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
export function generateDFSSteps(
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
 * Generate A* (A-Star) Algorithm steps - The industry standard for pathfinding
 * Used by: Google Maps, Video Games (Starcraft, Age of Empires), Robotics
 */
export function generateAStarSteps(
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
          message: `Ziel erreicht! Optimaler Pfad: ${path.join(' \u2192 ')} (Kosten: ${gScore.get(endId)})`,
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
          message: `Pr\u00fcfe ${current} \u2192 ${neighbor}: g_neu=${tentativeG} ${tentativeG < currentG ? '< ' + currentG + ' \u2192 Update!' : '>= ' + currentG}`,
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
export function generateTopologicalSortSteps(
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
      message: `Calculate in-degree f\u00fcr jeden Knoten (Anzahl eingehender Kanten)`,
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
      message: `Knoten mit In-Degree 0: [${queue.join(', ')}] \u2192 Keine Abh\u00e4ngigkeiten`,
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
        message: `Verarbeite ${current} \u2192 Reihenfolge: [${result.join(', ')}]`,
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
          message: `Reduziere In-Degree von ${neighbor}: ${newDegree + 1} \u2192 ${newDegree}`,
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
            message: `${neighbor} hat jetzt In-Degree 0 \u2192 zur Queue hinzugef\u00fcgt`,
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
        ? `Topologische Sortierung: [${result.join(' \u2192 ')}]`
        : `Zyklus erkannt! Keine topologische Sortierung m\u00f6glich.`,
    },
    code,
    lineHighlight: 30,
  });

  return steps;
}

/**
 * Generate Bellman-Ford Algorithm steps
 * Used by: Network routing (RIP protocol), Currency arbitrage detection, Negative weight handling
 */
export function generateBellmanFordSteps(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: string
): GraphAlgorithmStep[] {
  const steps: GraphAlgorithmStep[] = [];

  const code = `function bellmanFord(graph, start) {
  const dist = new Map();
  const prev = new Map();

  // Initialisiere alle Distanzen mit \u221e
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
      message: `Bellman-Ford startet von ${startId}. Alle Distanzen = \u221e, Start = 0`,
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
            message: `Kante ${edge.from}\u2192${edge.to}: ${fromDist} + ${weight} = ${fromDist + weight} < ${toDist} \u2192 Update!`,
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
            message: `Kante ${edge.to}\u2192${edge.from}: ${fromDist} + ${weight} = ${fromDist + weight} < ${toDist} \u2192 Update!`,
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
          message: `Keine \u00c4nderungen in Iteration ${i + 1} \u2192 Fr\u00fcher Abbruch m\u00f6glich`,
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
      message: `Bellman-Ford abgeschlossen! K\u00fcrzeste Distanzen von ${startId}: ${Array.from(
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
