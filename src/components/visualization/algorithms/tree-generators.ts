/**
 * Tree algorithm step generators
 * Extracted from GraphVisualizer.ts
 */

import type { TreeNode, TreeAlgorithmStep } from './types';

/**
 * Create a sample Binary Search Tree
 */
export function createSampleBST(): TreeNode {
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
export function generateBSTSearchSteps(root: TreeNode, target: number): TreeAlgorithmStep[] {
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
          message: `${target} < ${current.value} \u2192 gehe nach links`,
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
          message: `${target} > ${current.value} \u2192 gehe nach rechts`,
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
 * Generate Tree Preorder Traversal steps
 * Used by: Creating a copy of tree, Prefix expression, Serialization
 */
export function generatePreorderSteps(root: TreeNode): TreeAlgorithmStep[] {
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
      message: 'Starte Preorder-Traversierung (Wurzel \u2192 Links \u2192 Rechts)',
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
 * Generate Tree Inorder Traversal steps
 */
export function generateInorderSteps(root: TreeNode): TreeAlgorithmStep[] {
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
      message: 'Starte Inorder-Traversierung (Links \u2192 Wurzel \u2192 Rechts)',
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
 * Generate Tree Postorder Traversal steps
 * Used by: Deleting tree, Postfix expression, Directory size calculation
 */
export function generatePostorderSteps(root: TreeNode): TreeAlgorithmStep[] {
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
      message: 'Starte Postorder-Traversierung (Links \u2192 Rechts \u2192 Wurzel)',
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
