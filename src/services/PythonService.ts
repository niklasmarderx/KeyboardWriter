/**
 * Python Service
 * Executes Python code in the browser using Pyodide (WebAssembly)
 */

// Pyodide types
interface PyodideInterface {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (packages: string | string[]) => Promise<void>;
  globals: {
    get: (name: string) => unknown;
    set: (name: string, value: unknown) => void;
  };
}

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>;
  }
}

class PythonServiceClass {
  private pyodide: PyodideInterface | null = null;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;
  private readonly PYODIDE_VERSION = '0.25.0';
  private readonly CDN_URL = `https://cdn.jsdelivr.net/pyodide/v${this.PYODIDE_VERSION}/full/`;

  /**
   * Check if Pyodide is loaded
   */
  isLoaded(): boolean {
    return this.pyodide !== null;
  }

  /**
   * Check if Pyodide is currently loading
   */
  isCurrentlyLoading(): boolean {
    return this.isLoading;
  }

  /**
   * Load Pyodide (lazy loading - only when needed)
   */
  async load(): Promise<void> {
    if (this.pyodide) {
      return;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = this.doLoad();

    try {
      await this.loadPromise;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Internal load implementation
   */
  private async doLoad(): Promise<void> {
    try {
      // Load Pyodide script if not already loaded
      if (!window.loadPyodide) {
        await this.loadScript(`${this.CDN_URL}pyodide.js`);
      }

      // Initialize Pyodide
      this.pyodide = await window.loadPyodide({
        indexURL: this.CDN_URL,
      });

      // Setup stdout/stderr capture
      await this.pyodide.runPythonAsync(`
import sys
from io import StringIO

class OutputCapture:
    def __init__(self):
        self.stdout = StringIO()
        self.stderr = StringIO()
        
    def get_output(self):
        return self.stdout.getvalue()
    
    def get_error(self):
        return self.stderr.getvalue()
    
    def clear(self):
        self.stdout = StringIO()
        self.stderr = StringIO()

_output_capture = OutputCapture()
      `);
    } catch (error) {
      console.error('[PythonService] Failed to load Pyodide:', error);
      throw error;
    }
  }

  /**
   * Load external script
   */
  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.head.appendChild(script);
    });
  }

  /**
   * Execute Python code
   */
  async execute(code: string): Promise<{ output: string; error: string | null }> {
    if (!this.pyodide) {
      throw new Error('Pyodide not loaded. Call load() first.');
    }

    try {
      // Capture stdout and stderr
      const wrappedCode = `
import sys
from io import StringIO

_stdout_backup = sys.stdout
_stderr_backup = sys.stderr
_captured_stdout = StringIO()
_captured_stderr = StringIO()
sys.stdout = _captured_stdout
sys.stderr = _captured_stderr

_result = None
_error = None

try:
${code
  .split('\n')
  .map(line => '    ' + line)
  .join('\n')}
except Exception as e:
    _error = str(e)
finally:
    sys.stdout = _stdout_backup
    sys.stderr = _stderr_backup

(_captured_stdout.getvalue(), _captured_stderr.getvalue(), _result, _error)
      `;

      const result = (await this.pyodide.runPythonAsync(wrappedCode)) as [
        string,
        string,
        unknown,
        string | null,
      ];
      const [stdout, stderr, returnValue, error] = result;

      if (error) {
        return { output: stdout, error };
      }

      // Combine stdout with return value if present
      let output = stdout;
      if (returnValue !== null && returnValue !== undefined) {
        if (output && !output.endsWith('\n')) {
          output += '\n';
        }
        output += String(returnValue);
      }

      return { output: output || '(No output)', error: stderr || null };
    } catch (error) {
      return {
        output: '',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Execute Python code and get return value
   */
  async executeWithReturn(
    code: string,
    functionName: string,
    args: unknown[] = []
  ): Promise<{ result: unknown; error: string | null }> {
    if (!this.pyodide) {
      throw new Error('Pyodide not loaded. Call load() first.');
    }

    try {
      // Execute the code to define functions
      await this.pyodide.runPythonAsync(code);

      // Call the function with arguments
      const argsStr = args.map(arg => JSON.stringify(arg)).join(', ');
      const callCode = `${functionName}(${argsStr})`;

      const result = await this.pyodide.runPythonAsync(callCode);
      return { result, error: null };
    } catch (error) {
      return {
        result: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Load additional Python packages
   */
  async loadPackages(packages: string[]): Promise<void> {
    if (!this.pyodide) {
      throw new Error('Pyodide not loaded. Call load() first.');
    }
    await this.pyodide.loadPackage(packages);
  }

  /**
   * Get estimated download size
   */
  getDownloadSize(): string {
    return '~11 MB';
  }
}

export const PythonService = new PythonServiceClass();
