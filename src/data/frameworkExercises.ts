/**
 * Framework Exercises Data
 * React, Vue, and other modern framework patterns for typing practice
 */

import { CodeSnippet } from './programming';

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

// Vue.js Composition API
export const VUE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'vue-composition-basic',
    language: 'typescript',
    title: 'Vue 3 Composition API',
    description: 'Grundlegendes Vue 3 Component',
    code: `<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
});

const emit = defineEmits<{
  (e: 'increment', value: number): void;
  (e: 'reset'): void;
}>();

const counter = ref(props.count);

const doubled = computed(() => counter.value * 2);

function increment() {
  counter.value++;
  emit('increment', counter.value);
}

onMounted(() => {
  console.log('Component mounted');
});
</script>

<template>
  <div class="counter">
    <h2>{{ title }}</h2>
    <p>Count: {{ counter }} (doubled: {{ doubled }})</p>
    <button @click="increment">Increment</button>
    <button @click="emit('reset')">Reset</button>
  </div>
</template>`,
    difficulty: 'beginner',
  },
  {
    id: 'vue-composables',
    language: 'typescript',
    title: 'Vue Composables',
    description: 'Wiederverwendbare Logik mit Composables',
    code: `// composables/useCounter.ts
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  
  const doubled = computed(() => count.value * 2);
  const isPositive = computed(() => count.value > 0);
  
  function increment() {
    count.value++;
  }
  
  function decrement() {
    count.value--;
  }
  
  function reset() {
    count.value = initialValue;
  }
  
  return {
    count,
    doubled,
    isPositive,
    increment,
    decrement,
    reset
  };
}

// composables/useFetch.ts
import { ref, watchEffect } from 'vue';

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(true);
  
  watchEffect(async () => {
    loading.value = true;
    try {
      const response = await fetch(url);
      data.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  });
  
  return { data, error, loading };
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'vue-pinia-store',
    language: 'typescript',
    title: 'Pinia Store',
    description: 'State Management mit Pinia',
    code: `// stores/userStore.ts
import { defineStore } from 'pinia';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoading: false,
    error: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user,
    userName: (state) => state.user?.name ?? 'Guest'
  },
  
  actions: {
    async login(email: string, password: string) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        this.user = await response.json();
      } catch (e) {
        this.error = 'Login failed';
      } finally {
        this.isLoading = false;
      }
    },
    
    logout() {
      this.user = null;
    }
  }
});`,
    difficulty: 'intermediate',
  },
  {
    id: 'vue-router-setup',
    language: 'typescript',
    title: 'Vue Router Setup',
    description: 'Routing mit Vue Router',
    code: `// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: () => import('@/views/UserProfile.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = useUserStore().isLoggedIn;
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;`,
    difficulty: 'intermediate',
  },
  {
    id: 'vue-directive-custom',
    language: 'typescript',
    title: 'Custom Directives',
    description: 'Eigene Vue Direktiven',
    code: `// directives/vFocus.ts
import type { Directive } from 'vue';

export const vFocus: Directive = {
  mounted(el: HTMLElement) {
    el.focus();
  }
};

// directives/vClickOutside.ts
export const vClickOutside: Directive = {
  mounted(el: HTMLElement, binding) {
    el._clickOutsideHandler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el._clickOutsideHandler);
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutsideHandler);
  }
};

// Usage in component
<template>
  <input v-focus placeholder="Auto-focused" />
  <div v-click-outside="closeDropdown">
    <button @click="isOpen = !isOpen">Toggle</button>
    <ul v-show="isOpen">
      <li>Option 1</li>
      <li>Option 2</li>
    </ul>
  </div>
</template>`,
    difficulty: 'advanced',
  },
];

// Svelte Components
export const SVELTE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'svelte-basic-component',
    language: 'typescript',
    title: 'Svelte Basic Component',
    description: 'Grundlegendes Svelte Component',
    code: `<script lang="ts">
  export let name: string = 'World';
  export let count: number = 0;
  
  let doubled: number;
  $: doubled = count * 2;
  
  function increment() {
    count += 1;
  }
  
  function reset() {
    count = 0;
  }
</script>

<div class="counter">
  <h1>Hello {name}!</h1>
  <p>Count: {count} (doubled: {doubled})</p>
  <button on:click={increment}>Increment</button>
  <button on:click={reset}>Reset</button>
</div>

<style>
  .counter {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  button {
    margin-right: 0.5rem;
    padding: 0.5rem 1rem;
  }
</style>`,
    difficulty: 'beginner',
  },
  {
    id: 'svelte-stores',
    language: 'typescript',
    title: 'Svelte Stores',
    description: 'State Management mit Svelte Stores',
    code: `// stores/counter.ts
import { writable, derived, readable } from 'svelte/store';

// Writable Store
export const count = writable(0);

// Derived Store
export const doubled = derived(count, $count => $count * 2);

// Readable Store (z.B. für Zeit)
export const time = readable(new Date(), (set) => {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);
  
  return () => clearInterval(interval);
});

// Custom Store mit Methoden
function createCounter() {
  const { subscribe, set, update } = writable(0);
  
  return {
    subscribe,
    increment: () => update(n => n + 1),
    decrement: () => update(n => n - 1),
    reset: () => set(0)
  };
}

export const counter = createCounter();

// Usage in Component
<script>
  import { count, doubled, counter } from './stores/counter';
</script>

<p>Count: {$count}, Doubled: {$doubled}</p>
<button on:click={counter.increment}>+</button>`,
    difficulty: 'intermediate',
  },
  {
    id: 'svelte-lifecycle',
    language: 'typescript',
    title: 'Svelte Lifecycle',
    description: 'Lifecycle Hooks in Svelte',
    code: `<script lang="ts">
  import { onMount, onDestroy, beforeUpdate, afterUpdate, tick } from 'svelte';
  
  export let data: string[];
  let container: HTMLDivElement;
  
  onMount(() => {
    console.log('Component mounted');
    // Ideal für API calls, DOM manipulation
    return () => {
      console.log('Cleanup on unmount');
    };
  });
  
  onDestroy(() => {
    console.log('Component destroyed');
  });
  
  beforeUpdate(() => {
    console.log('Before DOM update');
  });
  
  afterUpdate(() => {
    console.log('After DOM update');
    // Scroll to bottom after update
    container?.scrollTo(0, container.scrollHeight);
  });
  
  async function addItem() {
    data = [...data, 'New Item'];
    await tick(); // Wait for DOM update
    console.log('DOM has been updated');
  }
</script>

<div bind:this={container} class="list">
  {#each data as item}
    <p>{item}</p>
  {/each}
</div>
<button on:click={addItem}>Add Item</button>`,
    difficulty: 'intermediate',
  },
  {
    id: 'svelte-transitions',
    language: 'typescript',
    title: 'Svelte Transitions',
    description: 'Animationen mit Svelte Transitions',
    code: `<script lang="ts">
  import { fade, fly, slide, scale, draw } from 'svelte/transition';
  import { elasticOut, cubicInOut } from 'svelte/easing';
  
  let visible = true;
  let items = ['Item 1', 'Item 2', 'Item 3'];
</script>

<button on:click={() => visible = !visible}>
  Toggle
</button>

{#if visible}
  <!-- Fade Transition -->
  <div transition:fade={{ duration: 300 }}>
    Fades in and out
  </div>
  
  <!-- Fly Transition -->
  <div transition:fly={{ y: 200, duration: 500 }}>
    Flies from below
  </div>
  
  <!-- Custom Parameters -->
  <div 
    in:fly={{ y: -50, duration: 300, easing: elasticOut }}
    out:fade={{ duration: 200 }}
  >
    Different in/out transitions
  </div>
{/if}

<!-- List Transitions -->
{#each items as item (item)}
  <div 
    animate:flip={{ duration: 300 }}
    transition:slide
  >
    {item}
  </div>
{/each}`,
    difficulty: 'intermediate',
  },
  {
    id: 'svelte-actions',
    language: 'typescript',
    title: 'Svelte Actions',
    description: 'Wiederverwendbare DOM-Logik',
    code: `<script lang="ts">
  import type { Action } from 'svelte/action';
  
  // Click Outside Action
  const clickOutside: Action<HTMLElement, () => void> = (node, callback) => {
    const handleClick = (event: MouseEvent) => {
      if (!node.contains(event.target as Node)) {
        callback();
      }
    };
    
    document.addEventListener('click', handleClick, true);
    
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  };
  
  // Tooltip Action
  const tooltip: Action<HTMLElement, string> = (node, text) => {
    let tooltipEl: HTMLDivElement;
    
    const showTooltip = () => {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'tooltip';
      tooltipEl.textContent = text;
      document.body.appendChild(tooltipEl);
      
      const rect = node.getBoundingClientRect();
      tooltipEl.style.top = \`\${rect.top - 30}px\`;
      tooltipEl.style.left = \`\${rect.left}px\`;
    };
    
    const hideTooltip = () => {
      tooltipEl?.remove();
    };
    
    node.addEventListener('mouseenter', showTooltip);
    node.addEventListener('mouseleave', hideTooltip);
    
    return {
      update(newText) {
        text = newText;
      },
      destroy() {
        node.removeEventListener('mouseenter', showTooltip);
        node.removeEventListener('mouseleave', hideTooltip);
      }
    };
  };
  
  let isOpen = false;
</script>

<div use:clickOutside={() => isOpen = false}>
  <button use:tooltip={'Click to toggle'}>
    Toggle Menu
  </button>
</div>`,
    difficulty: 'advanced',
  },
];

// Node.js / Express Snippets
export const NODEJS_SNIPPETS: CodeSnippet[] = [
  {
    id: 'node-express-basic',
    language: 'typescript',
    title: 'Express Basic Setup',
    description: 'Grundlegende Express App',
    code: `import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.path}\`);
  next();
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
    difficulty: 'beginner',
  },
  {
    id: 'node-express-router',
    language: 'typescript',
    title: 'Express Router & Controller',
    description: 'Modulare Routen-Struktur',
    code: `// routes/users.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createUserSchema, updateUserSchema } from '../schemas/user';

const router = Router();
const controller = new UserController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateRequest(createUserSchema), controller.create);
router.put('/:id', authMiddleware, validateRequest(updateUserSchema), controller.update);
router.delete('/:id', authMiddleware, controller.delete);

export default router;

// controllers/UserController.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private userService = new UserService();
  
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };
  
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
  
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'node-middleware',
    language: 'typescript',
    title: 'Express Middleware',
    description: 'Custom Middleware Patterns',
    code: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Auth Middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Rate Limiting Middleware
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (limit: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const now = Date.now();
    const record = requestCounts.get(ip);
    
    if (!record || now > record.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (record.count >= limit) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    record.count++;
    next();
  };
};

// Validation Middleware
import { z } from 'zod';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        next(error);
      }
    }
  };
};`,
    difficulty: 'intermediate',
  },
  {
    id: 'node-prisma',
    language: 'typescript',
    title: 'Prisma ORM',
    description: 'Datenbank mit Prisma',
    code: `// prisma/schema.prisma
/*
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}
*/

// services/UserService.ts
import { PrismaClient, User, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      include: { posts: true }
    });
  }
  
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { posts: { where: { published: true } } }
    });
  }
  
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }
  
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }
  
  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'node-websocket',
    language: 'typescript',
    title: 'WebSocket Server',
    description: 'Real-time Kommunikation',
    code: `import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import express from 'express';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

interface Client {
  ws: WebSocket;
  id: string;
  room?: string;
}

const clients = new Map<string, Client>();

wss.on('connection', (ws: WebSocket) => {
  const clientId = crypto.randomUUID();
  clients.set(clientId, { ws, id: clientId });
  
  console.log(\`Client connected: \${clientId}\`);
  
  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(clientId, message);
    } catch (error) {
      console.error('Invalid message:', error);
    }
  });
  
  ws.on('close', () => {
    clients.delete(clientId);
    console.log(\`Client disconnected: \${clientId}\`);
  });
  
  ws.send(JSON.stringify({ type: 'connected', clientId }));
});

function handleMessage(clientId: string, message: any) {
  const client = clients.get(clientId);
  if (!client) return;
  
  switch (message.type) {
    case 'join':
      client.room = message.room;
      broadcast(message.room, { type: 'userJoined', clientId });
      break;
      
    case 'message':
      if (client.room) {
        broadcast(client.room, {
          type: 'message',
          from: clientId,
          content: message.content
        });
      }
      break;
  }
}

function broadcast(room: string, message: any) {
  clients.forEach((client) => {
    if (client.room === room && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  });
}

server.listen(3000, () => console.log('Server running on port 3000'));`,
    difficulty: 'advanced',
  },
];

// Docker Extended Snippets
export const DOCKER_EXTENDED_SNIPPETS: CodeSnippet[] = [
  {
    id: 'docker-node-production',
    language: 'dockerfile',
    title: 'Node.js Production Dockerfile',
    description: 'Optimiertes Node.js Image',
    code: `# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build application
COPY . .
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy built files
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./

USER appuser

EXPOSE 3000

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]`,
    difficulty: 'intermediate',
  },
  {
    id: 'docker-compose-full',
    language: 'yaml',
    title: 'Docker Compose Full Stack',
    description: 'Komplette Entwicklungsumgebung',
    code: `version: '3.8'

services:
  app:
    build:
      context: .
      target: development
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    command: npm run dev

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "80:80"
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    name: myapp_network`,
    difficulty: 'intermediate',
  },
  {
    id: 'docker-github-actions',
    language: 'yaml',
    title: 'Docker CI/CD Pipeline',
    description: 'GitHub Actions Docker Build',
    code: `name: Docker Build & Push

on:
  push:
    branches: [main]
    tags: ['v*']
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=sha

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: \${{ github.event_name != 'pull_request' }}
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max`,
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

// Extended Testing Patterns
export const TESTING_EXTENDED: CodeSnippet[] = [
  {
    id: 'test-e2e-playwright',
    language: 'typescript',
    title: 'Playwright E2E Tests',
    description: 'End-to-End Tests mit Playwright',
    code: `import { test, expect, Page } from '@playwright/test';

test.describe('User Authentication', () => {
  let page: Page;
  
  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto('/login');
  });
  
  test('should login with valid credentials', async () => {
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome');
  });
  
  test('should show error for invalid credentials', async () => {
    await page.fill('[data-testid="email"]', 'invalid@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
  
  test('should logout successfully', async () => {
    // First login
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Then logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    
    await expect(page).toHaveURL('/login');
  });
});`,
    difficulty: 'intermediate',
  },
  {
    id: 'test-api-supertest',
    language: 'typescript',
    title: 'API Tests mit Supertest',
    description: 'Integration Tests für Express APIs',
    code: `import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../src/app';
import { prisma } from '../src/db';

describe('Users API', () => {
  let authToken: string;
  
  beforeAll(async () => {
    // Create test user and get token
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    
    authToken = response.body.token;
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });
  
  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', \`Bearer \${authToken}\`)
        .expect(200);
      
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('email');
    });
    
    it('should return 401 without auth token', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });
  
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', \`Bearer \${authToken}\`)
        .send(newUser)
        .expect(201);
      
      expect(response.body).toMatchObject({
        email: newUser.email,
        name: newUser.name
      });
      expect(response.body).not.toHaveProperty('password');
    });
    
    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', \`Bearer \${authToken}\`)
        .send({ email: 'invalid-email' })
        .expect(400);
      
      expect(response.body).toHaveProperty('errors');
    });
  });
});`,
    difficulty: 'advanced',
  },
  {
    id: 'test-mocking-advanced',
    language: 'typescript',
    title: 'Advanced Mocking',
    description: 'Fortgeschrittene Mocking-Techniken',
    code: `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Module
vi.mock('../services/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true })
}));

// Spy on existing methods
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('NotificationService', () => {
  let service: NotificationService;
  let mockEmailService: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    mockEmailService = {
      sendEmail: vi.fn().mockResolvedValue({ success: true })
    };
    service = new NotificationService(mockEmailService);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('should send notification and log result', async () => {
    const result = await service.notify('user@example.com', 'Hello!');
    
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'Notification',
      body: 'Hello!'
    });
    expect(consoleSpy).toHaveBeenCalledWith('Notification sent successfully');
    expect(result.success).toBe(true);
  });
  
  it('should handle email service failure', async () => {
    mockEmailService.sendEmail.mockRejectedValueOnce(new Error('SMTP error'));
    
    await expect(service.notify('user@example.com', 'Hello!'))
      .rejects.toThrow('Failed to send notification');
  });
  
  it('should retry on temporary failure', async () => {
    mockEmailService.sendEmail
      .mockRejectedValueOnce(new Error('Temporary error'))
      .mockResolvedValueOnce({ success: true });
    
    const result = await service.notifyWithRetry('user@example.com', 'Hello!');
    
    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2);
    expect(result.success).toBe(true);
  });
});

// Timer Mocking
describe('Scheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('should execute callback after delay', () => {
    const callback = vi.fn();
    scheduler.scheduleTask(callback, 5000);
    
    expect(callback).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(5000);
    
    expect(callback).toHaveBeenCalledTimes(1);
  });
});`,
    difficulty: 'advanced',
  },
  {
    id: 'test-snapshot',
    language: 'typescript',
    title: 'Snapshot Testing',
    description: 'Snapshot Tests für Components',
    code: `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('UserCard Snapshots', () => {
  const defaultProps = {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
      role: 'admin'
    }
  };
  
  it('should match snapshot with default props', () => {
    const { container } = render(<UserCard {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });
  
  it('should match snapshot without avatar', () => {
    const propsWithoutAvatar = {
      ...defaultProps,
      user: { ...defaultProps.user, avatar: undefined }
    };
    const { container } = render(<UserCard {...propsWithoutAvatar} />);
    expect(container).toMatchSnapshot();
  });
  
  it('should match inline snapshot', () => {
    const { getByTestId } = render(<UserCard {...defaultProps} />);
    
    expect(getByTestId('user-name').textContent).toMatchInlineSnapshot(\`"John Doe"\`);
    expect(getByTestId('user-email').textContent).toMatchInlineSnapshot(\`"john@example.com"\`);
  });
});

// JSON Snapshot
describe('API Response Snapshots', () => {
  it('should match user response schema', async () => {
    const response = await api.getUser('1');
    
    expect(response).toMatchSnapshot({
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
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
  ...TESTING_EXTENDED,
  ...VUE_SNIPPETS,
  ...SVELTE_SNIPPETS,
  ...NODEJS_SNIPPETS,
  ...DOCKER_EXTENDED_SNIPPETS,
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
  { id: 'testing', name: 'Testing Basics', icon: 'test', snippets: TESTING_PATTERNS },
  { id: 'testing-advanced', name: 'Testing Advanced', icon: 'test', snippets: TESTING_EXTENDED },
  { id: 'vue', name: 'Vue.js', icon: 'vue', snippets: VUE_SNIPPETS },
  { id: 'svelte', name: 'Svelte', icon: 'svelte', snippets: SVELTE_SNIPPETS },
  { id: 'nodejs', name: 'Node.js / Express', icon: 'node', snippets: NODEJS_SNIPPETS },
  { id: 'docker', name: 'Docker & DevOps', icon: 'docker', snippets: DOCKER_EXTENDED_SNIPPETS },
];

// Helper functions
export function getSnippetsByCategory(categoryId: string): CodeSnippet[] {
  const category = FRAMEWORK_CATEGORIES.find(c => c.id === categoryId);
  return category?.snippets || [];
}

export function getSnippetsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): CodeSnippet[] {
  return ALL_FRAMEWORK_SNIPPETS.filter(s => s.difficulty === difficulty);
}

export function searchSnippets(query: string): CodeSnippet[] {
  const lowerQuery = query.toLowerCase();
  return ALL_FRAMEWORK_SNIPPETS.filter(
    s =>
      s.title.toLowerCase().includes(lowerQuery) ||
      s.description?.toLowerCase().includes(lowerQuery) ||
      s.code.toLowerCase().includes(lowerQuery)
  );
}
