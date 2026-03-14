/**
 * Algorithm Visualizer Component
 * Beautiful step-by-step visualizations for algorithms
 */

export type VisualizationState = {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot?: number;
  current?: number;
  left?: number;
  right?: number;
  mid?: number;
  found?: number;
  message: string;
};

export type AlgorithmStep = {
  state: VisualizationState;
  code: string;
  lineHighlight: number;
};

/**
 * Algorithm Visualizer - Creates beautiful animations
 */
export class AlgorithmVisualizer {
  private readonly containerId: string;
  private steps: AlgorithmStep[] = [];
  private currentStep: number = 0;
  private isPlaying: boolean = false;
  private speed: number = 500; // ms
  private animationFrame: number | null = null;

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  /**
   * Generate Bubble Sort steps
   */
  static generateBubbleSortSteps(arr: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...arr];
    const n = array.length;
    const sorted: number[] = [];

    const code = `function bubbleSort(arr) {
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr[j], arr[j + 1]);
      }
    }
  }
}`;

    steps.push({
      state: {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        message: 'Start Bubble Sort',
      },
      code,
      lineHighlight: 1,
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Comparing
        steps.push({
          state: {
            array: [...array],
            comparing: [j, j + 1],
            swapping: [],
            sorted: [...sorted],
            message: `Vergleiche ${array[j]} und ${array[j + 1]}`,
          },
          code,
          lineHighlight: 3,
        });

        if (array[j] > array[j + 1]) {
          // Swapping
          steps.push({
            state: {
              array: [...array],
              comparing: [],
              swapping: [j, j + 1],
              sorted: [...sorted],
              message: `Tausche ${array[j]} und ${array[j + 1]}`,
            },
            code,
            lineHighlight: 4,
          });

          [array[j], array[j + 1]] = [array[j + 1], array[j]];

          steps.push({
            state: {
              array: [...array],
              comparing: [],
              swapping: [],
              sorted: [...sorted],
              message: `Getauscht!`,
            },
            code,
            lineHighlight: 4,
          });
        }
      }
      sorted.unshift(n - 1 - i);
    }

    sorted.unshift(0);
    steps.push({
      state: {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [...sorted],
        message: 'Array sortiert!',
      },
      code,
      lineHighlight: 7,
    });

    return steps;
  }

  /**
   * Generate Quick Sort steps
   */
  static generateQuickSortSteps(arr: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...arr];
    const sorted: number[] = [];

    const code = `function quickSort(arr, low, high) {
  if (low < high) {
    const pivot = partition(arr, low, high);
    quickSort(arr, low, pivot - 1);
    quickSort(arr, pivot + 1, high);
  }
}`;

    function partition(low: number, high: number): number {
      const pivotValue = array[high];
      steps.push({
        state: {
          array: [...array],
          comparing: [],
          swapping: [],
          sorted: [...sorted],
          pivot: high,
          message: `Pivot gewählt: ${pivotValue}`,
        },
        code,
        lineHighlight: 3,
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        steps.push({
          state: {
            array: [...array],
            comparing: [j, high],
            swapping: [],
            sorted: [...sorted],
            pivot: high,
            current: j,
            message: `Vergleiche ${array[j]} mit Pivot ${pivotValue}`,
          },
          code,
          lineHighlight: 3,
        });

        if (array[j] < pivotValue) {
          i++;
          if (i !== j) {
            steps.push({
              state: {
                array: [...array],
                comparing: [],
                swapping: [i, j],
                sorted: [...sorted],
                pivot: high,
                message: `Tausche ${array[i]} und ${array[j]}`,
              },
              code,
              lineHighlight: 3,
            });

            [array[i], array[j]] = [array[j], array[i]];
          }
        }
      }

      if (i + 1 !== high) {
        steps.push({
          state: {
            array: [...array],
            comparing: [],
            swapping: [i + 1, high],
            sorted: [...sorted],
            pivot: high,
            message: `Platziere Pivot an Position ${i + 1}`,
          },
          code,
          lineHighlight: 3,
        });

        [array[i + 1], array[high]] = [array[high], array[i + 1]];
      }

      sorted.push(i + 1);
      return i + 1;
    }

    function quickSort(low: number, high: number): void {
      if (low < high) {
        const pi = partition(low, high);
        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      }
    }

    steps.push({
      state: {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        message: 'Start Quick Sort',
      },
      code,
      lineHighlight: 1,
    });

    quickSort(0, array.length - 1);

    steps.push({
      state: {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: array.length }, (_, i) => i),
        message: 'Array sortiert!',
      },
      code,
      lineHighlight: 6,
    });

    return steps;
  }

  /**
   * Generate Binary Search steps
   */
  static generateBinarySearchSteps(arr: number[], target: number): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...arr].sort((a, b) => a - b);

    const code = `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`;

    let left = 0;
    let right = array.length - 1;

    steps.push({
      state: {
        array,
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: array.length }, (_, i) => i),
        left,
        right,
        message: `Suche nach ${target} in sortiertem Array`,
      },
      code,
      lineHighlight: 2,
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        state: {
          array,
          comparing: [mid],
          swapping: [],
          sorted: Array.from({ length: array.length }, (_, i) => i),
          left,
          right,
          mid,
          message: `Mitte: Index ${mid}, Wert ${array[mid]}`,
        },
        code,
        lineHighlight: 4,
      });

      if (array[mid] === target) {
        steps.push({
          state: {
            array,
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: array.length }, (_, i) => i),
            found: mid,
            message: `Gefunden! ${target} ist an Index ${mid}`,
          },
          code,
          lineHighlight: 5,
        });
        return steps;
      }

      if (array[mid] < target) {
        steps.push({
          state: {
            array,
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: array.length }, (_, i) => i),
            left: mid + 1,
            right,
            message: `${array[mid]} < ${target}, suche rechts`,
          },
          code,
          lineHighlight: 6,
        });
        left = mid + 1;
      } else {
        steps.push({
          state: {
            array,
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: array.length }, (_, i) => i),
            left,
            right: mid - 1,
            message: `${array[mid]} > ${target}, suche links`,
          },
          code,
          lineHighlight: 7,
        });
        right = mid - 1;
      }
    }

    steps.push({
      state: {
        array,
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: array.length }, (_, i) => i),
        message: `${target} nicht gefunden`,
      },
      code,
      lineHighlight: 9,
    });

    return steps;
  }

  /**
   * Generate Insertion Sort steps
   */
  static generateInsertionSortSteps(arr: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...arr];
    const n = array.length;

    const code = `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`;

    steps.push({
      state: {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [0],
        message: 'Start Insertion Sort',
      },
      code,
      lineHighlight: 1,
    });

    for (let i = 1; i < n; i++) {
      const key = array[i];
      let j = i - 1;

      steps.push({
        state: {
          array: [...array],
          comparing: [i],
          swapping: [],
          sorted: Array.from({ length: i }, (_, idx) => idx),
          current: i,
          message: `Schlüssel: ${key}`,
        },
        code,
        lineHighlight: 3,
      });

      while (j >= 0 && array[j] > key) {
        steps.push({
          state: {
            array: [...array],
            comparing: [j, i],
            swapping: [],
            sorted: Array.from({ length: i }, (_, idx) => idx),
            message: `${array[j]} > ${key}, verschiebe nach rechts`,
          },
          code,
          lineHighlight: 5,
        });

        array[j + 1] = array[j];
        j--;

        steps.push({
          state: {
            array: [...array],
            comparing: [],
            swapping: [],
            sorted: Array.from({ length: i }, (_, idx) => idx),
            message: `Verschoben`,
          },
          code,
          lineHighlight: 6,
        });
      }

      array[j + 1] = key;

      steps.push({
        state: {
          array: [...array],
          comparing: [],
          swapping: [],
          sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
          message: `${key} eingefügt an Position ${j + 1}`,
        },
        code,
        lineHighlight: 9,
      });
    }

    steps.push({
      state: {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        message: 'Array sortiert!',
      },
      code,
      lineHighlight: 10,
    });

    return steps;
  }

  /**
   * Generate Selection Sort steps
   */
  static generateSelectionSortSteps(arr: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...arr];
    const n = array.length;

    const code = `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    swap(arr[i], arr[minIdx]);
  }
}`;

    steps.push({
      state: {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        message: 'Start Selection Sort',
      },
      code,
      lineHighlight: 1,
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      steps.push({
        state: {
          array: [...array],
          comparing: [i],
          swapping: [],
          sorted: Array.from({ length: i }, (_, idx) => idx),
          current: i,
          message: `Suche Minimum ab Index ${i}`,
        },
        code,
        lineHighlight: 3,
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          state: {
            array: [...array],
            comparing: [minIdx, j],
            swapping: [],
            sorted: Array.from({ length: i }, (_, idx) => idx),
            message: `Vergleiche ${array[minIdx]} und ${array[j]}`,
          },
          code,
          lineHighlight: 5,
        });

        if (array[j] < array[minIdx]) {
          minIdx = j;
          steps.push({
            state: {
              array: [...array],
              comparing: [minIdx],
              swapping: [],
              sorted: Array.from({ length: i }, (_, idx) => idx),
              message: `Neues Minimum: ${array[minIdx]}`,
            },
            code,
            lineHighlight: 6,
          });
        }
      }

      if (minIdx !== i) {
        steps.push({
          state: {
            array: [...array],
            comparing: [],
            swapping: [i, minIdx],
            sorted: Array.from({ length: i }, (_, idx) => idx),
            message: `Tausche ${array[i]} und ${array[minIdx]}`,
          },
          code,
          lineHighlight: 9,
        });

        [array[i], array[minIdx]] = [array[minIdx], array[i]];
      }

      steps.push({
        state: {
          array: [...array],
          comparing: [],
          swapping: [],
          sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
          message: `Position ${i} sortiert`,
        },
        code,
        lineHighlight: 9,
      });
    }

    steps.push({
      state: {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        message: 'Array sortiert!',
      },
      code,
      lineHighlight: 10,
    });

    return steps;
  }

  /**
   * Generate Merge Sort steps
   */
  static generateMergeSortSteps(arr: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...arr];

    const code = `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`;

    steps.push({
      state: {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        message: 'Start Merge Sort',
      },
      code,
      lineHighlight: 1,
    });

    function mergeSortHelper(start: number, end: number): void {
      if (start >= end) {
        return;
      }

      const mid = Math.floor((start + end) / 2);

      steps.push({
        state: {
          array: [...array],
          comparing: [mid],
          swapping: [],
          sorted: [],
          message: `Teile Array bei Index ${mid}`,
        },
        code,
        lineHighlight: 3,
      });

      mergeSortHelper(start, mid);
      mergeSortHelper(mid + 1, end);

      // Merge
      const temp: number[] = [];
      let i = start;
      let j = mid + 1;

      while (i <= mid && j <= end) {
        steps.push({
          state: {
            array: [...array],
            comparing: [i, j],
            swapping: [],
            sorted: [],
            message: `Vergleiche ${array[i]} und ${array[j]}`,
          },
          code,
          lineHighlight: 6,
        });

        if (array[i] <= array[j]) {
          temp.push(array[i++]);
        } else {
          temp.push(array[j++]);
        }
      }

      while (i <= mid) {
        temp.push(array[i++]);
      }
      while (j <= end) {
        temp.push(array[j++]);
      }

      for (let k = 0; k < temp.length; k++) {
        array[start + k] = temp[k];
        steps.push({
          state: {
            array: [...array],
            comparing: [],
            swapping: [start + k],
            sorted: [],
            message: `Setze ${temp[k]} an Position ${start + k}`,
          },
          code,
          lineHighlight: 6,
        });
      }
    }

    mergeSortHelper(0, array.length - 1);

    steps.push({
      state: {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: array.length }, (_, i) => i),
        message: 'Array sortiert!',
      },
      code,
      lineHighlight: 6,
    });

    return steps;
  }

  /**
   * Generate Heap Sort steps
   */
  static generateHeapSortSteps(arr: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...arr];
    const n = array.length;

    const code = `function heapSort(arr) {
  buildMaxHeap(arr);
  for (let i = n - 1; i > 0; i--) {
    swap(arr[0], arr[i]);
    heapify(arr, i, 0);
  }
}`;

    steps.push({
      state: {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: [],
        message: 'Start Heap Sort - baue Max-Heap',
      },
      code,
      lineHighlight: 1,
    });

    function heapify(size: number, root: number): void {
      let largest = root;
      const left = 2 * root + 1;
      const right = 2 * root + 2;

      if (left < size) {
        steps.push({
          state: {
            array: [...array],
            comparing: [largest, left],
            swapping: [],
            sorted: Array.from({ length: n - size }, (_, i) => n - 1 - i),
            message: `Vergleiche ${array[largest]} mit linkem Kind ${array[left]}`,
          },
          code,
          lineHighlight: 5,
        });

        if (array[left] > array[largest]) {
          largest = left;
        }
      }

      if (right < size) {
        steps.push({
          state: {
            array: [...array],
            comparing: [largest, right],
            swapping: [],
            sorted: Array.from({ length: n - size }, (_, i) => n - 1 - i),
            message: `Vergleiche ${array[largest]} mit rechtem Kind ${array[right]}`,
          },
          code,
          lineHighlight: 5,
        });

        if (array[right] > array[largest]) {
          largest = right;
        }
      }

      if (largest !== root) {
        steps.push({
          state: {
            array: [...array],
            comparing: [],
            swapping: [root, largest],
            sorted: Array.from({ length: n - size }, (_, i) => n - 1 - i),
            message: `Tausche ${array[root]} und ${array[largest]}`,
          },
          code,
          lineHighlight: 5,
        });

        [array[root], array[largest]] = [array[largest], array[root]];
        heapify(size, largest);
      }
    }

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      steps.push({
        state: {
          array: [...array],
          comparing: [],
          swapping: [0, i],
          sorted: Array.from({ length: n - i }, (_, j) => n - 1 - j),
          message: `Tausche Maximum ${array[0]} ans Ende`,
        },
        code,
        lineHighlight: 4,
      });

      [array[0], array[i]] = [array[i], array[0]];
      heapify(i, 0);
    }

    steps.push({
      state: {
        array: [...array],
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        message: 'Array sortiert!',
      },
      code,
      lineHighlight: 6,
    });

    return steps;
  }

  /**
   * Generate Linear Search steps
   */
  static generateLinearSearchSteps(arr: number[], target: number): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const array = [...arr];

    const code = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`;

    steps.push({
      state: {
        array,
        comparing: [],
        swapping: [],
        sorted: [],
        message: `Suche nach ${target} - durchlaufe alle Elemente`,
      },
      code,
      lineHighlight: 1,
    });

    for (let i = 0; i < array.length; i++) {
      steps.push({
        state: {
          array,
          comparing: [i],
          swapping: [],
          sorted: [],
          current: i,
          message: `Prufe Index ${i}: ${array[i]} === ${target}?`,
        },
        code,
        lineHighlight: 3,
      });

      if (array[i] === target) {
        steps.push({
          state: {
            array,
            comparing: [],
            swapping: [],
            sorted: [],
            found: i,
            message: `Gefunden! ${target} ist an Index ${i}`,
          },
          code,
          lineHighlight: 4,
        });
        return steps;
      }
    }

    steps.push({
      state: {
        array,
        comparing: [],
        swapping: [],
        sorted: [],
        message: `${target} nicht gefunden`,
      },
      code,
      lineHighlight: 7,
    });

    return steps;
  }

  /**
   * Set steps
   */
  setSteps(steps: AlgorithmStep[]): void {
    this.steps = steps;
    this.currentStep = 0;
    this.render();
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

    const maxValue = Math.max(...step.state.array);
    const barWidth = Math.min(50, Math.floor(400 / step.state.array.length) - 4);

    container.innerHTML = `
      <div class="algo-vis algo-vis-sidebyside">
        <div class="algo-vis-left">
          <div class="algo-vis-bars">
            ${step.state.array
              .map((value, index) => {
                let barClass = 'algo-bar';
                if (step.state.comparing.includes(index)) {
                  barClass += ' comparing';
                }
                if (step.state.swapping.includes(index)) {
                  barClass += ' swapping';
                }
                if (step.state.sorted.includes(index)) {
                  barClass += ' sorted';
                }
                if (step.state.pivot === index) {
                  barClass += ' pivot';
                }
                if (step.state.found === index) {
                  barClass += ' found';
                }
                if (step.state.current === index) {
                  barClass += ' current';
                }
                if (step.state.left === index) {
                  barClass += ' left-bound';
                }
                if (step.state.right === index) {
                  barClass += ' right-bound';
                }
                if (step.state.mid === index) {
                  barClass += ' mid';
                }

                const height = (value / maxValue) * 180;
                return `
                <div class="${barClass}" style="height: ${height}px; width: ${barWidth}px;">
                  <span class="algo-bar-value">${value}</span>
                </div>
              `;
              })
              .join('')}
          </div>
          
          <div class="algo-vis-message">${step.state.message}</div>
          
          <div class="algo-vis-controls">
            <button class="algo-btn" id="algo-first" ${this.currentStep === 0 ? 'disabled' : ''}>⏮</button>
            <button class="algo-btn" id="algo-prev" ${this.currentStep === 0 ? 'disabled' : ''}>◀</button>
            <button class="algo-btn algo-btn-play" id="algo-play">${this.isPlaying ? '⏸' : '▶'}</button>
            <button class="algo-btn" id="algo-next" ${this.currentStep >= this.steps.length - 1 ? 'disabled' : ''}>▶</button>
            <button class="algo-btn" id="algo-last" ${this.currentStep >= this.steps.length - 1 ? 'disabled' : ''}>⏭</button>
          </div>
          
          <div class="algo-vis-progress">
            <input type="range" min="0" max="${this.steps.length - 1}" value="${this.currentStep}" id="algo-slider" />
            <span class="algo-step-info">${this.currentStep + 1} / ${this.steps.length}</span>
          </div>
          
          <div class="algo-vis-speed">
            <label>Speed:</label>
            <input type="range" min="100" max="2000" value="${2100 - this.speed}" id="algo-speed" />
            <span>${this.speed}ms</span>
          </div>
        </div>
        
        <div class="algo-vis-right">
          <div class="algo-vis-code">
            <div class="algo-code-header">Code</div>
            <pre><code>${this.highlightCode(step.code, step.lineHighlight)}</code></pre>
          </div>
        </div>
      </div>
      
      <style>
        .algo-vis.algo-vis-sidebyside {
          display: grid !important;
          grid-template-columns: minmax(300px, 1fr) minmax(300px, 1fr) !important;
          gap: 1rem !important;
          align-items: start !important;
        }
        
        .algo-vis-sidebyside .algo-vis-left {
          display: flex !important;
          flex-direction: column !important;
          gap: 0.75rem !important;
          min-width: 300px !important;
        }
        
        .algo-vis-sidebyside .algo-vis-right {
          display: flex !important;
          flex-direction: column !important;
          min-width: 300px !important;
          height: 100% !important;
        }
        
        .algo-vis-sidebyside .algo-vis-right .algo-vis-code {
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
        }
        
        .algo-code-header {
          padding: 0.5rem 0.75rem !important;
          background: #313244 !important;
          border-radius: 0.5rem 0.5rem 0 0 !important;
          font-size: 0.875rem !important;
          font-weight: 600 !important;
          color: #cdd6f4 !important;
        }
        
        .algo-vis-sidebyside .algo-vis-right .algo-vis-code pre {
          flex: 1 !important;
          margin: 0 !important;
          border-radius: 0 0 0.5rem 0.5rem !important;
          background: #1e1e2e !important;
          padding: 1rem !important;
          overflow-x: auto !important;
          font-size: 0.8rem !important;
          line-height: 1.5 !important;
        }
        
        @media (max-width: 700px) {
          .algo-vis.algo-vis-sidebyside {
            grid-template-columns: 1fr !important;
          }
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
    document.getElementById('algo-first')?.addEventListener('click', () => this.goToStep(0));
    document.getElementById('algo-prev')?.addEventListener('click', () => this.prevStep());
    document.getElementById('algo-play')?.addEventListener('click', () => this.togglePlay());
    document.getElementById('algo-next')?.addEventListener('click', () => this.nextStep());
    document
      .getElementById('algo-last')
      ?.addEventListener('click', () => this.goToStep(this.steps.length - 1));

    document.getElementById('algo-slider')?.addEventListener('input', e => {
      const value = parseInt((e.target as HTMLInputElement).value);
      this.goToStep(value);
    });

    document.getElementById('algo-speed')?.addEventListener('input', e => {
      const value = parseInt((e.target as HTMLInputElement).value);
      this.speed = 2100 - value;
      this.render();
    });
  }

  /**
   * Go to specific step
   */
  goToStep(step: number): void {
    this.currentStep = Math.max(0, Math.min(step, this.steps.length - 1));
    this.render();
  }

  /**
   * Next step
   */
  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render();
    } else {
      this.stop();
    }
  }

  /**
   * Previous step
   */
  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  }

  /**
   * Toggle play/pause
   */
  togglePlay(): void {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  /**
   * Play animation
   */
  play(): void {
    this.isPlaying = true;
    this.render();
    this.animate();
  }

  /**
   * Stop animation
   */
  stop(): void {
    this.isPlaying = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.render();
  }

  /**
   * Animate steps
   */
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

  /**
   * Reset visualization
   */
  reset(): void {
    this.stop();
    this.currentStep = 0;
    this.render();
  }

  /**
   * Destroy
   */
  destroy(): void {
    this.stop();
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = '';
    }
  }
}
