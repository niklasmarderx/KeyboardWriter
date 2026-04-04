/**
 * Types for Graph & Tree Visualization algorithms
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
