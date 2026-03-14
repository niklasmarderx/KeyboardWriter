/**
 * Framework Exercises Data
 * React, Vue, and other modern framework patterns for typing practice
 */

import { CodeSnippet } from './programmingExercises';

// React Hooks
export const REACT_HOOKS: CodeSnippet[] = [
  {
    id: 'react-useState',
    language: 'typescript',
    title: 'useState Hook',
    description: 'Grundlegender State Hook',
    code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
    difficulty: 'beginner',
  },
  {
    id: 'react-useEffect',
    language: 'typescript',
    title: 'useEffect Hook',
    description: 'Side Effects mit Cleanup',
    code: `import { useState, useEffect } from 'react';

function DataFetcher({ id }: { id: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchData() {
      try {
        const response = await fetch(\`/api/data/\${id}\`, {
          signal: abortController.signal
        });
        const json = await response.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    
    return () => abortController.abort();
  }, [id]);
  
  if (loading) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'react-useContext',
    language: 'typescript',
    title: 'useContext Hook',
    description: 'Context für globalen State',
    code: `import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'react-useReducer',
    language: 'typescript',
    title: 'useReducer Hook',
    description: 'Komplexer State mit Reducer',
    code: `import { useReducer } from 'react';

interface State {
  count: number;
  step: number;
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; payload: number }
  | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    case 'reset':
      return { count: 0, step: 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'react-useMemo-useCallback',
    language: 'typescript',
    title: 'useMemo & useCallback',
    description: 'Performance-Optimierung',
    code: `import { useState, useMemo, useCallback } from 'react';

interface Item {
  id: number;
  name: string;
  price: number;
}

function ShoppingList({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState('');
  
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  const totalPrice = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + item.price, 0);
  }, [filteredItems]);
  
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);
  
  return (
    <div>
      <input value={filter} onChange={handleFilterChange} />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name} - \${item.price}</li>
        ))}
      </ul>
      <p>Total: \${totalPrice}</p>
    </div>
  );
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'react-useRef',
    language: 'typescript',
    title: 'useRef Hook',
    description: 'DOM-Referenzen und persistente Werte',
    code: `import { useRef, useEffect, useState } from 'react';

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCount = useRef(0);
  const [value, setValue] = useState('');
  
  useEffect(() => {
    renderCount.current++;
    console.log(\`Render count: \${renderCount.current}\`);
  });
  
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  return (
    <div>
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}`,
    difficulty: 'beginner',
  },
];

// React Components Patterns
export const REACT_COMPONENTS: CodeSnippet[] = [
  {
    id: 'react-functional-component',
    language: 'typescript',
    title: 'Functional Component',
    description: 'TypeScript React Component mit Props',
    code: `import { FC } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children
}) => {
  const baseClasses = 'rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;`,
    difficulty: 'beginner',
  },
  {
    id: 'react-form-component',
    language: 'typescript',
    title: 'Form Component',
    description: 'Kontrolliertes Formular mit Validation',
    code: `import { useState, FormEvent } from 'react';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
      />
      {errors.email && <span>{errors.email}</span>}
      
      <input
        type="password"
        value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.target.value })}
      />
      {errors.password && <span>{errors.password}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'react-modal-component',
    language: 'typescript',
    title: 'Modal Component',
    description: 'Wiederverwendbares Modal mit Portal',
    code: `import { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}`,
    difficulty: 'intermediate',
  },
];

// Custom Hooks
export const CUSTOM_HOOKS: CodeSnippet[] = [
  {
    id: 'hook-useLocalStorage',
    language: 'typescript',
    title: 'useLocalStorage Hook',
    description: 'State mit LocalStorage-Persistenz',
    code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setStoredValue] as const;
}

// Usage
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  return <div>Current theme: {theme}</div>;
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'hook-useFetch',
    language: 'typescript',
    title: 'useFetch Hook',
    description: 'Generischer Fetch-Hook mit Loading/Error',
    code: `import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchData() {
      setState(prev => ({ ...prev, loading: true }));
      
      try {
        const response = await fetch(url, {
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          setState({ data: null, loading: false, error });
        }
      }
    }
    
    fetchData();
    
    return () => abortController.abort();
  }, [url]);
  
  return state;
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'hook-useDebounce',
    language: 'typescript',
    title: 'useDebounce Hook',
    description: 'Debounce für Inputs',
    code: `import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage: Search Input
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) {
      // API call with debounced value
      console.log('Searching for:', debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}`,
    difficulty: 'beginner',
  },
  {
    id: 'hook-useOnClickOutside',
    language: 'typescript',
    title: 'useOnClickOutside Hook',
    description: 'Erkennt Klicks außerhalb eines Elements',
    code: `import { useEffect, RefObject } from 'react';

function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// Usage: Dropdown
function Dropdown() {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  useOnClickOutside(ref, () => setIsOpen(false));
  
  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>Dropdown Content</div>}
    </div>
  );
}`,
    difficulty: 'intermediate',
  },
];

// TypeScript Patterns
export const TYPESCRIPT_PATTERNS: CodeSnippet[] = [
  {
    id: 'ts-generics',
    language: 'typescript',
    title: 'Generics',
    description: 'Generische Funktionen und Typen',
    code: `// Generic Function
function identity<T>(arg: T): T {
  return arg;
}

// Generic Interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Generic Class
class Repository<T extends { id: string }> {
  private items: Map<string, T> = new Map();
  
  add(item: T): void {
    this.items.set(item.id, item);
  }
  
  get(id: string): T | undefined {
    return this.items.get(id);
  }
  
  getAll(): T[] {
    return Array.from(this.items.values());
  }
  
  delete(id: string): boolean {
    return this.items.delete(id);
  }
}

// Usage
interface User {
  id: string;
  name: string;
  email: string;
}

const userRepo = new Repository<User>();`,
    difficulty: 'intermediate',
  },
  {
    id: 'ts-utility-types',
    language: 'typescript',
    title: 'Utility Types',
    description: 'Eingebaute TypeScript Utility Types',
    code: `interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  role: 'admin' | 'user';
}

// Partial - All properties optional
type PartialUser = Partial<User>;

// Required - All properties required
type RequiredUser = Required<User>;

// Pick - Select specific properties
type UserCredentials = Pick<User, 'email' | 'name'>;

// Omit - Remove specific properties
type PublicUser = Omit<User, 'email' | 'age'>;

// Record - Create object type
type UserRoles = Record<string, User>;

// Readonly - All properties readonly
type ReadonlyUser = Readonly<User>;

// Extract / Exclude
type AdminRole = Extract<User['role'], 'admin'>;
type NonAdminRole = Exclude<User['role'], 'admin'>;

// ReturnType / Parameters
type FetchFn = (url: string, options?: RequestInit) => Promise<Response>;
type FetchReturn = ReturnType<FetchFn>;
type FetchParams = Parameters<FetchFn>;`,
    difficulty: 'intermediate',
  },
  {
    id: 'ts-discriminated-unions',
    language: 'typescript',
    title: 'Discriminated Unions',
    description: 'Type-safe State Management',
    code: `// Discriminated Union for API State
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Usage with exhaustive type checking
function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle':
      return <div>Ready to fetch</div>;
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <div>Data: {JSON.stringify(state.data)}</div>;
    case 'error':
      return <div>Error: {state.error.message}</div>;
    default:
      // Exhaustive check
      const _exhaustive: never = state;
      return _exhaustive;
  }
}

// Action types for reducers
type Action =
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number }
  | { type: 'RESET' };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'INCREMENT':
      return state + action.payload;
    case 'DECREMENT':
      return state - action.payload;
    case 'RESET':
      return 0;
  }
}`,
    difficulty: 'advanced',
  },
];

// Testing Patterns
export const TESTING_PATTERNS: CodeSnippet[] = [
  {
    id: 'test-vitest-basic',
    language: 'typescript',
    title: 'Vitest Basic Tests',
    description: 'Unit Tests mit Vitest',
    code: `import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Calculator', () => {
  let calculator: Calculator;
  
  beforeEach(() => {
    calculator = new Calculator();
  });
  
  it('should add two numbers', () => {
    expect(calculator.add(2, 3)).toBe(5);
  });
  
  it('should subtract two numbers', () => {
    expect(calculator.subtract(5, 3)).toBe(2);
  });
  
  it('should throw on division by zero', () => {
    expect(() => calculator.divide(10, 0)).toThrow('Division by zero');
  });
});

// Mocking
describe('UserService', () => {
  it('should fetch user data', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ id: '1', name: 'John' })
    });
    global.fetch = mockFetch;
    
    const user = await userService.getUser('1');
    
    expect(mockFetch).toHaveBeenCalledWith('/api/users/1');
    expect(user.name).toBe('John');
  });
});`,
    difficulty: 'intermediate',
  },
  {
    id: 'test-react-testing-library',
    language: 'typescript',
    title: 'React Testing Library',
    description: 'Component Tests mit RTL',
    code: `import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

describe('LoginForm', () => {
  it('should render email and password inputs', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  it('should show validation errors', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
  
  it('should call onSubmit with form data', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    render(<LoginForm onSubmit={handleSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});`,
    difficulty: 'intermediate',
  },
];

// All Framework Snippets Combined
export const ALL_FRAMEWORK_SNIPPETS: CodeSnippet[] = [
  ...REACT_HOOKS,
  ...REACT_COMPONENTS,
  ...CUSTOM_HOOKS,
  ...TYPESCRIPT_PATTERNS,
  ...TESTING_PATTERNS,
];

// Categories for UI display
export const FRAMEWORK_CATEGORIES = [
  { id: 'react-hooks', name: 'React Hooks', icon: 'react', snippets: REACT_HOOKS },
  {
    id: 'react-components',
    name: 'React Components',
    icon: 'component',
    snippets: REACT_COMPONENTS,
  },
  { id: 'custom-hooks', name: 'Custom Hooks', icon: 'hook', snippets: CUSTOM_HOOKS },
  { id: 'typescript', name: 'TypeScript Patterns', icon: 'ts', snippets: TYPESCRIPT_PATTERNS },
  { id: 'testing', name: 'Testing', icon: 'test', snippets: TESTING_PATTERNS },
];
