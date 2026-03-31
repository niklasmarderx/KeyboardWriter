/**
 * Programming Exercises Data
 * Extended exercises for developers including multiple languages,
 * Git workflows, Vim commands, Regex, and more
 */

// Programming Languages with code snippets
export interface CodeSnippet {
  id: string;
  language: string;
  title: string;
  code: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
}

// Rust Code Snippets
export const RUST_SNIPPETS: CodeSnippet[] = [
  {
    id: 'rust-hello',
    language: 'rust',
    title: 'Hello World',
    code: `fn main() {
    println!("Hello, World!");
}`,
    difficulty: 'beginner',
  },
  {
    id: 'rust-variables',
    language: 'rust',
    title: 'Variables & Mutability',
    code: `fn main() {
    let x = 5;
    let mut y = 10;
    y = y + x;
    println!("y = {}", y);
}`,
    difficulty: 'beginner',
  },
  {
    id: 'rust-struct',
    language: 'rust',
    title: 'Struct & Impl',
    code: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'rust-enum',
    language: 'rust',
    title: 'Enums & Pattern Matching',
    code: `enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

fn process(msg: Message) {
    match msg {
        Message::Quit => println!("Quit"),
        Message::Move { x, y } => println!("Move to {}, {}", x, y),
        Message::Write(text) => println!("{}", text),
    }
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'rust-result',
    language: 'rust',
    title: 'Result & Error Handling',
    code: `use std::fs::File;
use std::io::Read;

fn read_file(path: &str) -> Result<String, std::io::Error> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}`,
    difficulty: 'advanced',
  },
  {
    id: 'rust-lifetime',
    language: 'rust',
    title: 'Lifetimes',
    code: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}`,
    difficulty: 'advanced',
  },
  {
    id: 'rust-trait',
    language: 'rust',
    title: 'Traits',
    code: `trait Greet {
    fn greet(&self) -> String;
    fn default_greeting(&self) -> String {
        format!("Hello from {}", self.greet())
    }
}

struct Person { name: String }

impl Greet for Person {
    fn greet(&self) -> String {
        self.name.clone()
    }
}`,
    difficulty: 'intermediate',
    description: 'Define and implement traits',
  },
  {
    id: 'rust-option',
    language: 'rust',
    title: 'Option & Unwrap',
    code: `fn find_user(id: u32) -> Option<String> {
    if id == 1 {
        Some(String::from("Alice"))
    } else {
        None
    }
}

fn main() {
    let user = find_user(1).unwrap_or_else(|| String::from("Guest"));
    println!("Hello, {}!", user);
}`,
    difficulty: 'intermediate',
    description: 'Option type for nullable values',
  },
  {
    id: 'rust-iter',
    language: 'rust',
    title: 'Iterators & Closures',
    code: `fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    let sum: i32 = numbers.iter()
        .filter(|&&x| x % 2 == 0)
        .map(|&x| x * x)
        .sum();

    println!("Sum of even squares: {}", sum);
}`,
    difficulty: 'intermediate',
    description: 'Functional-style iteration',
  },
  {
    id: 'rust-closure',
    language: 'rust',
    title: 'Closures',
    code: `fn apply<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    f(x)
}

fn main() {
    let double = |x| x * 2;
    let add_ten = |x| x + 10;

    println!("{}", apply(double, 5));
    println!("{}", apply(add_ten, 5));
}`,
    difficulty: 'intermediate',
    description: 'First-class closures',
  },
  {
    id: 'rust-thread',
    language: 'rust',
    title: 'Threads & Mutex',
    code: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let c = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            let mut num = c.lock().unwrap();
            *num += 1;
        }));
    }

    for h in handles { h.join().unwrap(); }
    println!("Counter: {}", *counter.lock().unwrap());
}`,
    difficulty: 'advanced',
    description: 'Shared state with Arc<Mutex<T>>',
  },
  {
    id: 'rust-generic',
    language: 'rust',
    title: 'Generics',
    code: `fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("Largest: {}", largest(&numbers));
}`,
    difficulty: 'intermediate',
    description: 'Generic functions with trait bounds',
  },
  {
    id: 'rust-async',
    language: 'rust',
    title: 'Async/Await',
    code: `use tokio::time::{sleep, Duration};

async fn fetch_data(id: u32) -> String {
    sleep(Duration::from_millis(100)).await;
    format!("Data for id {}", id)
}

#[tokio::main]
async fn main() {
    let result = fetch_data(42).await;
    println!("{}", result);
}`,
    difficulty: 'advanced',
    description: 'Async programming with tokio',
  },
  {
    id: 'rust-derive',
    language: 'rust',
    title: 'Derive Macros',
    code: `#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: f64,
    y: f64,
}

impl Point {
    fn distance(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}`,
    difficulty: 'beginner',
    description: 'Auto-derive common traits',
  },
  {
    id: 'rust-error-custom',
    language: 'rust',
    title: 'Custom Error Types',
    code: `use std::fmt;

#[derive(Debug)]
enum AppError {
    NotFound(String),
    ParseError(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::NotFound(msg) => write!(f, "Not found: {}", msg),
            AppError::ParseError(msg) => write!(f, "Parse error: {}", msg),
        }
    }
}`,
    difficulty: 'advanced',
    description: 'Custom error types with Display',
  },
];

// Go Code Snippets
export const GO_SNIPPETS: CodeSnippet[] = [
  {
    id: 'go-hello',
    language: 'go',
    title: 'Hello World',
    code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    difficulty: 'beginner',
  },
  {
    id: 'go-variables',
    language: 'go',
    title: 'Variables & Types',
    code: `package main

import "fmt"

func main() {
    var name string = "Go"
    age := 15
    isAwesome := true
    fmt.Printf("%s is %d years old. Awesome: %t", name, age, isAwesome)
}`,
    difficulty: 'beginner',
  },
  {
    id: 'go-struct',
    language: 'go',
    title: 'Structs & Methods',
    code: `type User struct {
    Name  string
    Email string
    Age   int
}

func (u *User) IsAdult() bool {
    return u.Age >= 18
}

func (u *User) String() string {
    return fmt.Sprintf("%s <%s>", u.Name, u.Email)
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'go-goroutine',
    language: 'go',
    title: 'Goroutines & Channels',
    code: `func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("worker %d processing job %d\\n", id, j)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
}`,
    difficulty: 'advanced',
  },
  {
    id: 'go-interface',
    language: 'go',
    title: 'Interfaces',
    code: `type Shape interface {
    Area() float64
    Perimeter() float64
}

type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * math.Pi * c.Radius
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'go-error',
    language: 'go',
    title: 'Error Handling',
    code: `import (
    "errors"
    "fmt"
)

var ErrNotFound = errors.New("not found")

func getUser(id int) (string, error) {
    if id <= 0 {
        return "", fmt.Errorf("invalid id %d: %w", id, ErrNotFound)
    }
    return "Alice", nil
}

func main() {
    user, err := getUser(-1)
    if errors.Is(err, ErrNotFound) {
        fmt.Println("User not found")
    } else if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println(user)
    }
}`,
    difficulty: 'intermediate',
    description: 'Idiomatic Go error handling',
  },
  {
    id: 'go-map',
    language: 'go',
    title: 'Maps & Slices',
    code: `func wordCount(s string) map[string]int {
    counts := make(map[string]int)
    words := strings.Fields(s)
    for _, w := range words {
        counts[w]++
    }
    return counts
}

func main() {
    counts := wordCount("hello world hello go")
    for word, n := range counts {
        fmt.Printf("%s: %d\n", word, n)
    }
}`,
    difficulty: 'beginner',
    description: 'Working with maps and slices',
  },
  {
    id: 'go-defer',
    language: 'go',
    title: 'Defer & Panic/Recover',
    code: `func safeDiv(a, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered panic: %v", r)
        }
    }()
    if b == 0 {
        panic("division by zero")
    }
    return a / b, nil
}`,
    difficulty: 'intermediate',
    description: 'Deferred calls and panic recovery',
  },
  {
    id: 'go-channel-select',
    language: 'go',
    title: 'Select Statement',
    code: `func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)

    go func() { ch1 <- "one" }()
    go func() { ch2 <- "two" }()

    for i := 0; i < 2; i++ {
        select {
        case msg1 := <-ch1:
            fmt.Println("Received from ch1:", msg1)
        case msg2 := <-ch2:
            fmt.Println("Received from ch2:", msg2)
        }
    }
}`,
    difficulty: 'advanced',
    description: 'Multiplexing channels with select',
  },
  {
    id: 'go-http',
    language: 'go',
    title: 'HTTP Handler',
    code: `package main

import (
    "encoding/json"
    "net/http"
)

type Response struct {
    Message string \`json:"message"\`
}

func handler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(Response{Message: "Hello, Go!"})
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}`,
    difficulty: 'intermediate',
    description: 'Simple HTTP server with JSON',
  },
  {
    id: 'go-context',
    language: 'go',
    title: 'Context',
    code: `func fetchWithTimeout(url string) ([]byte, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
    if err != nil {
        return nil, err
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    return io.ReadAll(resp.Body)
}`,
    difficulty: 'advanced',
    description: 'Cancellation with context',
  },
  {
    id: 'go-test',
    language: 'go',
    title: 'Table-Driven Tests',
    code: `func TestAdd(t *testing.T) {
    tests := []struct {
        a, b, want int
    }{
        {1, 2, 3},
        {0, 0, 0},
        {-1, 1, 0},
    }

    for _, tt := range tests {
        got := Add(tt.a, tt.b)
        if got != tt.want {
            t.Errorf("Add(%d, %d) = %d; want %d", tt.a, tt.b, got, tt.want)
        }
    }
}`,
    difficulty: 'intermediate',
    description: 'Go testing with table-driven tests',
  },
  {
    id: 'go-embed',
    language: 'go',
    title: 'Embedding & Composition',
    code: `type Animal struct {
    Name string
}

func (a Animal) Speak() string {
    return a.Name + " makes a sound"
}

type Dog struct {
    Animal
    Breed string
}

func (d Dog) Speak() string {
    return d.Name + " barks!"
}

func main() {
    d := Dog{Animal: Animal{Name: "Rex"}, Breed: "Labrador"}
    fmt.Println(d.Speak())
    fmt.Println(d.Animal.Speak())
}`,
    difficulty: 'intermediate',
    description: 'Struct embedding for composition',
  },
];

// SQL Snippets
export const SQL_SNIPPETS: CodeSnippet[] = [
  {
    id: 'sql-select',
    language: 'sql',
    title: 'Basic SELECT',
    code: `SELECT id, name, email
FROM users
WHERE active = true
ORDER BY created_at DESC
LIMIT 10;`,
    difficulty: 'beginner',
  },
  {
    id: 'sql-join',
    language: 'sql',
    title: 'JOIN Operations',
    code: `SELECT u.name, o.total, o.created_at
FROM users u
INNER JOIN orders o ON u.id = o.user_id
LEFT JOIN addresses a ON u.id = a.user_id
WHERE o.total > 100
ORDER BY o.created_at DESC;`,
    difficulty: 'intermediate',
  },
  {
    id: 'sql-subquery',
    language: 'sql',
    title: 'Subqueries',
    code: `SELECT name, email
FROM users
WHERE id IN (
    SELECT user_id
    FROM orders
    GROUP BY user_id
    HAVING COUNT(*) > 5
);`,
    difficulty: 'intermediate',
  },
  {
    id: 'sql-cte',
    language: 'sql',
    title: 'Common Table Expressions',
    code: `WITH monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', created_at) AS month,
        SUM(total) AS revenue
    FROM orders
    GROUP BY DATE_TRUNC('month', created_at)
)
SELECT month, revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month,
    revenue - LAG(revenue) OVER (ORDER BY month) AS growth
FROM monthly_sales;`,
    difficulty: 'advanced',
  },
  {
    id: 'sql-create',
    language: 'sql',
    title: 'CREATE TABLE',
    code: `CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category_id);`,
    difficulty: 'intermediate',
  },
];

// C/C++ Snippets
export const CPP_SNIPPETS: CodeSnippet[] = [
  {
    id: 'cpp-hello',
    language: 'cpp',
    title: 'Hello World',
    code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
    difficulty: 'beginner',
  },
  {
    id: 'cpp-class',
    language: 'cpp',
    title: 'Classes & Objects',
    code: `class Rectangle {
private:
    int width, height;
    
public:
    Rectangle(int w, int h) : width(w), height(h) {}
    
    int area() const {
        return width * height;
    }
    
    void resize(int w, int h) {
        width = w;
        height = h;
    }
};`,
    difficulty: 'intermediate',
  },
  {
    id: 'cpp-template',
    language: 'cpp',
    title: 'Templates',
    code: `template <typename T>
class Stack {
private:
    std::vector<T> elements;
    
public:
    void push(const T& elem) {
        elements.push_back(elem);
    }
    
    T pop() {
        T elem = elements.back();
        elements.pop_back();
        return elem;
    }
    
    bool empty() const {
        return elements.empty();
    }
};`,
    difficulty: 'advanced',
  },
  {
    id: 'cpp-smartptr',
    language: 'cpp',
    title: 'Smart Pointers',
    code: `#include <memory>

class Resource {
public:
    void use() { /* ... */ }
};

void example() {
    auto unique = std::make_unique<Resource>();
    auto shared = std::make_shared<Resource>();
    std::weak_ptr<Resource> weak = shared;
    
    unique->use();
    shared->use();
    
    if (auto locked = weak.lock()) {
        locked->use();
    }
}`,
    difficulty: 'advanced',
  },
];

// Python Snippets (including advanced: decorators, generators, context managers)
export const PYTHON_SNIPPETS: CodeSnippet[] = [
  {
    id: 'python-hello',
    language: 'python',
    title: 'Hello World',
    code: `def greet(name: str) -> str:
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("World"))`,
    difficulty: 'beginner',
    description: 'Basic function with type hints',
  },
  {
    id: 'python-list-comp',
    language: 'python',
    title: 'List Comprehensions',
    code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

evens = [n for n in numbers if n % 2 == 0]
squares = [n ** 2 for n in numbers]
matrix = [[i * j for j in range(1, 4)] for i in range(1, 4)]`,
    difficulty: 'beginner',
    description: 'Pythonic list comprehensions',
  },
  {
    id: 'python-decorator',
    language: 'python',
    title: 'Decorators',
    code: `import functools
import time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result
    return wrapper

@timer
def slow_operation():
    time.sleep(0.1)
    return "done"`,
    difficulty: 'intermediate',
    description: 'Function decorators with functools.wraps',
  },
  {
    id: 'python-decorator-args',
    language: 'python',
    title: 'Parametrized Decorators',
    code: `def retry(max_attempts: int = 3, delay: float = 1.0):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5)
def fetch_data(url: str) -> dict:
    ...`,
    difficulty: 'advanced',
    description: 'Decorator factory with arguments',
  },
  {
    id: 'python-generator',
    language: 'python',
    title: 'Generators',
    code: `def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

def take(n, iterable):
    for i, item in enumerate(iterable):
        if i >= n:
            break
        yield item

first_ten = list(take(10, fibonacci()))`,
    difficulty: 'intermediate',
    description: 'Generator functions with yield',
  },
  {
    id: 'python-generator-expr',
    language: 'python',
    title: 'Generator Expressions',
    code: `# Memory-efficient processing of large datasets
def process_large_file(filename: str):
    with open(filename) as f:
        lines = (line.strip() for line in f)
        non_empty = (line for line in lines if line)
        parsed = (line.split(",") for line in non_empty)
        return sum(float(row[1]) for row in parsed)`,
    difficulty: 'intermediate',
    description: 'Lazy evaluation with generator expressions',
  },
  {
    id: 'python-context-manager',
    language: 'python',
    title: 'Context Managers',
    code: `from contextlib import contextmanager
import sqlite3

@contextmanager
def db_transaction(path: str):
    conn = sqlite3.connect(path)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

with db_transaction("app.db") as conn:
    conn.execute("INSERT INTO logs VALUES (?)", ("event",))`,
    difficulty: 'intermediate',
    description: 'Context manager with contextlib',
  },
  {
    id: 'python-context-class',
    language: 'python',
    title: 'Class-based Context Manager',
    code: `class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, *args):
        self.elapsed = time.perf_counter() - self.start
        return False  # do not suppress exceptions

with Timer() as t:
    time.sleep(0.1)

print(f"Elapsed: {t.elapsed:.3f}s")`,
    difficulty: 'intermediate',
    description: '__enter__ and __exit__ protocol',
  },
  {
    id: 'python-dataclass',
    language: 'python',
    title: 'Dataclasses',
    code: `from dataclasses import dataclass, field
from typing import List

@dataclass(frozen=True)
class Point:
    x: float
    y: float

    def distance_to(self, other: "Point") -> float:
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5

@dataclass
class Polygon:
    vertices: List[Point] = field(default_factory=list)

    def perimeter(self) -> float:
        if len(self.vertices) < 2:
            return 0.0
        pairs = zip(self.vertices, self.vertices[1:] + [self.vertices[0]])
        return sum(a.distance_to(b) for a, b in pairs)`,
    difficulty: 'intermediate',
    description: 'Python dataclasses with frozen and field',
  },
  {
    id: 'python-async',
    language: 'python',
    title: 'Async/Await',
    code: `import asyncio
import aiohttp

async def fetch(session: aiohttp.ClientSession, url: str) -> dict:
    async with session.get(url) as response:
        return await response.json()

async def fetch_all(urls: list[str]) -> list[dict]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        return await asyncio.gather(*tasks)`,
    difficulty: 'advanced',
    description: 'Concurrent HTTP with asyncio and aiohttp',
  },
  {
    id: 'python-protocol',
    language: 'python',
    title: 'Protocols (Structural Typing)',
    code: `from typing import Protocol, runtime_checkable

@runtime_checkable
class Serializable(Protocol):
    def to_dict(self) -> dict: ...
    def to_json(self) -> str: ...

def save(obj: Serializable, path: str) -> None:
    import json
    with open(path, "w") as f:
        json.dump(obj.to_dict(), f)`,
    difficulty: 'advanced',
    description: 'Structural subtyping with Protocol',
  },
];

// Docker/YAML Snippets
export const DOCKER_SNIPPETS: CodeSnippet[] = [
  {
    id: 'docker-basic',
    language: 'dockerfile',
    title: 'Basic Dockerfile',
    code: `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]`,
    difficulty: 'beginner',
  },
  {
    id: 'docker-multistage',
    language: 'dockerfile',
    title: 'Multi-Stage Build',
    code: `FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
    difficulty: 'intermediate',
  },
  {
    id: 'docker-compose',
    language: 'yaml',
    title: 'Docker Compose',
    code: `version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/app
    depends_on:
      - db
      
  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret

volumes:
  postgres_data:`,
    difficulty: 'intermediate',
  },
  {
    id: 'docker-compose-full',
    language: 'yaml',
    title: 'Docker Compose Full Stack',
    code: `version: '3.8'

services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev
    ports:
      - "4000:4000"
    volumes:
      - ./api:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started

  db:
    image: postgres:15-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 5s
      timeout: 5s
      retries: 5

  cache:
    image: redis:7-alpine
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

volumes:
  pgdata:`,
    difficulty: 'advanced',
    description: 'Full-stack Docker Compose with healthchecks',
  },
  {
    id: 'docker-compose-override',
    language: 'yaml',
    title: 'Docker Compose Override',
    code: `# docker-compose.override.yml (dev overrides)
version: '3.8'

services:
  api:
    command: npm run dev
    environment:
      - DEBUG=*
      - LOG_LEVEL=debug
    ports:
      - "9229:9229"  # Node.js debugger

  db:
    ports:
      - "5432:5432"  # Expose for local tools

  adminer:
    image: adminer
    ports:
      - "8080:8080"`,
    difficulty: 'intermediate',
    description: 'Environment-specific overrides',
  },
];

// PHP Snippets
export const PHP_SNIPPETS: CodeSnippet[] = [
  {
    id: 'php-hello',
    language: 'php',
    title: 'Hello World',
    code: `<?php
echo "Hello, World!";
?>`,
    difficulty: 'beginner',
  },
  {
    id: 'php-variables',
    language: 'php',
    title: 'Variables & Types',
    code: `<?php
$name = "PHP";
$version = 8.2;
$isModern = true;
$items = ["apple", "banana", "orange"];

echo "Language: $name version $version";
echo "<br>";
print_r($items);
?>`,
    difficulty: 'beginner',
  },
  {
    id: 'php-class',
    language: 'php',
    title: 'Classes & Objects',
    code: `<?php
class User {
    private string $name;
    private string $email;
    
    public function __construct(string $name, string $email) {
        $this->name = $name;
        $this->email = $email;
    }
    
    public function getName(): string {
        return $this->name;
    }
    
    public function toArray(): array {
        return [
            'name' => $this->name,
            'email' => $this->email
        ];
    }
}
?>`,
    difficulty: 'intermediate',
  },
  {
    id: 'php-interface',
    language: 'php',
    title: 'Interfaces & Traits',
    code: `<?php
interface Repository {
    public function find(int $id): ?Model;
    public function save(Model $model): void;
    public function delete(int $id): bool;
}

trait Timestamps {
    protected DateTime $createdAt;
    protected DateTime $updatedAt;
    
    public function touch(): void {
        $this->updatedAt = new DateTime();
    }
}

class UserRepository implements Repository {
    use Timestamps;
    
    public function find(int $id): ?Model {
        // Implementation
    }
}
?>`,
    difficulty: 'advanced',
  },
  {
    id: 'php-pdo',
    language: 'php',
    title: 'PDO Database',
    code: `<?php
$dsn = 'mysql:host=localhost;dbname=myapp;charset=utf8mb4';
$pdo = new PDO($dsn, $user, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

$stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
$stmt->execute(['id' => $userId]);
$user = $stmt->fetch();
?>`,
    difficulty: 'intermediate',
  },
];

// Ruby Snippets
export const RUBY_SNIPPETS: CodeSnippet[] = [
  {
    id: 'ruby-hello',
    language: 'ruby',
    title: 'Hello World',
    code: `puts "Hello, World!"`,
    difficulty: 'beginner',
  },
  {
    id: 'ruby-variables',
    language: 'ruby',
    title: 'Variables & Types',
    code: `name = "Ruby"
version = 3.2
is_dynamic = true
items = ["apple", "banana", "orange"]

puts "Language: #{name} version #{version}"
items.each { |item| puts item }`,
    difficulty: 'beginner',
  },
  {
    id: 'ruby-class',
    language: 'ruby',
    title: 'Classes & Modules',
    code: `class User
  attr_accessor :name, :email
  
  def initialize(name, email)
    @name = name
    @email = email
  end
  
  def to_s
    "#{name} <#{email}>"
  end
end

module Authenticatable
  def authenticate(password)
    BCrypt::Password.new(password_digest) == password
  end
end`,
    difficulty: 'intermediate',
  },
  {
    id: 'ruby-blocks',
    language: 'ruby',
    title: 'Blocks & Iterators',
    code: `numbers = [1, 2, 3, 4, 5]

squared = numbers.map { |n| n ** 2 }
evens = numbers.select { |n| n.even? }
sum = numbers.reduce(0) { |acc, n| acc + n }

numbers.each_with_index do |num, index|
  puts "Index #{index}: #{num}"
end`,
    difficulty: 'intermediate',
  },
  {
    id: 'ruby-rails-model',
    language: 'ruby',
    title: 'Rails Model',
    code: `class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  has_one :profile
  belongs_to :organization
  
  validates :email, presence: true, uniqueness: true
  validates :name, length: { minimum: 2, maximum: 50 }
  
  scope :active, -> { where(active: true) }
  scope :admins, -> { where(role: 'admin') }
  
  before_save :normalize_email
  
  private
  
  def normalize_email
    self.email = email.downcase.strip
  end
end`,
    difficulty: 'advanced',
  },
];

// Kotlin Snippets
export const KOTLIN_SNIPPETS: CodeSnippet[] = [
  {
    id: 'kotlin-hello',
    language: 'kotlin',
    title: 'Hello World',
    code: `fun main() {
    println("Hello, World!")
}`,
    difficulty: 'beginner',
  },
  {
    id: 'kotlin-variables',
    language: 'kotlin',
    title: 'Variables & Types',
    code: `fun main() {
    val name: String = "Kotlin"  // immutable
    var version = 1.9  // mutable, type inference
    val isModern = true
    val items = listOf("apple", "banana", "orange")
    
    println("Language: $name version $version")
    items.forEach { println(it) }
}`,
    difficulty: 'beginner',
  },
  {
    id: 'kotlin-class',
    language: 'kotlin',
    title: 'Data Classes',
    code: `data class User(
    val id: Long,
    val name: String,
    val email: String,
    val role: Role = Role.USER
)

enum class Role {
    USER, ADMIN, MODERATOR
}

fun main() {
    val user = User(1, "John", "john@example.com")
    val admin = user.copy(role = Role.ADMIN)
    
    println(user)
    println(admin)
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'kotlin-nullable',
    language: 'kotlin',
    title: 'Null Safety',
    code: `fun findUser(id: Long): User? {
    return repository.findById(id)
}

fun main() {
    val user: User? = findUser(1)
    
    // Safe call
    val name = user?.name
    
    // Elvis operator
    val displayName = user?.name ?: "Anonymous"
    
    // Safe cast
    val admin = user as? Admin
    
    // Let block
    user?.let {
        println("Found user: \${it.name}")
    }
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'kotlin-coroutines',
    language: 'kotlin',
    title: 'Coroutines',
    code: `import kotlinx.coroutines.*

suspend fun fetchUser(id: Long): User {
    delay(1000)  // simulate network call
    return User(id, "John")
}

suspend fun fetchPosts(userId: Long): List<Post> {
    delay(1000)
    return listOf(Post(1, "Hello World"))
}

fun main() = runBlocking {
    val user = async { fetchUser(1) }
    val posts = async { fetchPosts(1) }
    
    println("User: \${user.await()}")
    println("Posts: \${posts.await()}")
}`,
    difficulty: 'advanced',
  },
];

// Swift Snippets
export const SWIFT_SNIPPETS: CodeSnippet[] = [
  {
    id: 'swift-hello',
    language: 'swift',
    title: 'Hello World',
    code: `print("Hello, World!")`,
    difficulty: 'beginner',
  },
  {
    id: 'swift-variables',
    language: 'swift',
    title: 'Variables & Types',
    code: `let name: String = "Swift"  // constant
var version = 5.9  // variable
let isModern = true
let items = ["apple", "banana", "orange"]

print("Language: \\(name) version \\(version)")
for item in items {
    print(item)
}`,
    difficulty: 'beginner',
  },
  {
    id: 'swift-struct',
    language: 'swift',
    title: 'Structs & Classes',
    code: `struct User {
    let id: Int
    var name: String
    var email: String
    
    var displayName: String {
        return "\\(name) <\\(email)>"
    }
    
    mutating func updateEmail(_ newEmail: String) {
        email = newEmail
    }
}

class UserManager {
    private var users: [User] = []
    
    func addUser(_ user: User) {
        users.append(user)
    }
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'swift-optionals',
    language: 'swift',
    title: 'Optionals',
    code: `func findUser(byId id: Int) -> User? {
    return users.first { $0.id == id }
}

// Optional binding
if let user = findUser(byId: 1) {
    print("Found: \\(user.name)")
}

// Guard statement
guard let user = findUser(byId: 1) else {
    print("User not found")
    return
}

// Optional chaining
let name = user?.profile?.displayName ?? "Anonymous"

// Nil coalescing
let email = user?.email ?? "no-email@example.com"`,
    difficulty: 'intermediate',
  },
  {
    id: 'swift-async',
    language: 'swift',
    title: 'Async/Await',
    code: `func fetchUser(id: Int) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}

func loadData() async {
    do {
        async let user = fetchUser(id: 1)
        async let posts = fetchPosts(userId: 1)
        
        let (userData, postsData) = await (try user, try posts)
        print("User: \\(userData), Posts: \\(postsData)")
    } catch {
        print("Error: \\(error)")
    }
}`,
    difficulty: 'advanced',
  },
];

// Kubernetes/DevOps Snippets
export const K8S_SNIPPETS: CodeSnippet[] = [
  {
    id: 'k8s-deployment',
    language: 'yaml',
    title: 'Kubernetes Deployment',
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: myapp:1.0.0
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10`,
    difficulty: 'intermediate',
  },
  {
    id: 'k8s-service',
    language: 'yaml',
    title: 'Kubernetes Service',
    code: `apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer`,
    difficulty: 'beginner',
  },
  {
    id: 'k8s-configmap',
    language: 'yaml',
    title: 'ConfigMap & Secret',
    code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_HOST: "postgres-service"
  LOG_LEVEL: "info"
---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  DATABASE_PASSWORD: "supersecret"
  API_KEY: "abc123"`,
    difficulty: 'intermediate',
  },
  {
    id: 'k8s-ingress',
    language: 'yaml',
    title: 'Ingress',
    code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - myapp.example.com
    secretName: tls-secret
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80`,
    difficulty: 'advanced',
  },
  {
    id: 'k8s-hpa',
    language: 'yaml',
    title: 'Horizontal Pod Autoscaler',
    code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80`,
    difficulty: 'advanced',
  },
  {
    id: 'k8s-kubectl-basics',
    language: 'bash',
    title: 'kubectl Basic Commands',
    code: `# Get resources
kubectl get pods -n production
kubectl get deployments --all-namespaces
kubectl describe pod web-app-abc123

# Apply manifests
kubectl apply -f deployment.yaml
kubectl apply -f ./k8s/

# Manage deployments
kubectl rollout status deployment/web-app
kubectl rollout history deployment/web-app
kubectl rollout undo deployment/web-app`,
    difficulty: 'beginner',
    description: 'Essential kubectl commands',
  },
  {
    id: 'k8s-kubectl-debug',
    language: 'bash',
    title: 'kubectl Debugging',
    code: `# Logs
kubectl logs web-app-abc123 --follow --tail=100
kubectl logs -l app=web-app --since=1h

# Exec into pod
kubectl exec -it web-app-abc123 -- /bin/sh

# Port forwarding
kubectl port-forward pod/web-app-abc123 8080:3000
kubectl port-forward svc/web-app-service 8080:80

# Events and resource usage
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl top pods -n production
kubectl top nodes`,
    difficulty: 'intermediate',
    description: 'Debugging and troubleshooting with kubectl',
  },
  {
    id: 'k8s-kubectl-advanced',
    language: 'bash',
    title: 'kubectl Advanced',
    code: `# Patch resources
kubectl patch deployment web-app -p '{"spec":{"replicas":5}}'

# Scale
kubectl scale deployment web-app --replicas=0
kubectl scale deployment web-app --replicas=3

# Labels and selectors
kubectl label pod web-app-abc env=staging
kubectl get pods -l "app=web-app,env=production"

# Output formats
kubectl get pods -o wide
kubectl get pod web-app-abc -o yaml
kubectl get pods -o jsonpath='{.items[*].metadata.name}'`,
    difficulty: 'advanced',
    description: 'Advanced kubectl patterns',
  },
];

// GitHub Actions/CI Snippets
export const CICD_SNIPPETS: CodeSnippet[] = [
  {
    id: 'gha-basic',
    language: 'yaml',
    title: 'GitHub Actions Basic',
    code: `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build`,
    difficulty: 'beginner',
  },
  {
    id: 'gha-matrix',
    language: 'yaml',
    title: 'Matrix Strategy',
    code: `name: Test Matrix

on: [push, pull_request]

jobs:
  test:
    runs-on: \${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [18, 20, 22]
        exclude:
          - os: windows-latest
            node: 18
    
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node }}
    - run: npm ci
    - run: npm test`,
    difficulty: 'intermediate',
  },
  {
    id: 'gha-deploy',
    language: 'yaml',
    title: 'Deploy Workflow',
    code: `name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Build Docker image
      run: docker build -t myapp:\${{ github.sha }} .
    
    - name: Login to Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}
    
    - name: Push image
      run: |
        docker tag myapp:\${{ github.sha }} ghcr.io/\${{ github.repository }}:\${{ github.sha }}
        docker push ghcr.io/\${{ github.repository }}:\${{ github.sha }}
    
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/myapp myapp=ghcr.io/\${{ github.repository }}:\${{ github.sha }}`,
    difficulty: 'advanced',
  },
];

// HTML/CSS Snippets
export const HTML_CSS_SNIPPETS: CodeSnippet[] = [
  {
    id: 'html-basic',
    language: 'html',
    title: 'HTML5 Boilerplate',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <h1>Welcome</h1>
    </main>
</body>
</html>`,
    difficulty: 'beginner',
  },
  {
    id: 'css-flexbox',
    language: 'css',
    title: 'Flexbox Layout',
    code: `.container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.item {
    flex: 1 1 300px;
    padding: 1rem;
    background: #f0f0f0;
    border-radius: 8px;
}`,
    difficulty: 'beginner',
  },
  {
    id: 'css-grid',
    language: 'css',
    title: 'CSS Grid Layout',
    code: `.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-template-rows: auto;
    gap: 1.5rem;
    padding: 2rem;
}

.grid-item {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 2rem;
    color: white;
}`,
    difficulty: 'intermediate',
  },
];

// Git Commands & Workflows
export interface GitCommand {
  id: string;
  command: string;
  description: string;
  category: 'basic' | 'branching' | 'remote' | 'advanced' | 'github';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const GIT_COMMANDS: GitCommand[] = [
  // Basic Commands
  {
    id: 'git-init',
    command: 'git init',
    description: 'Neues Repository erstellen',
    category: 'basic',
    difficulty: 'beginner',
  },
  {
    id: 'git-clone',
    command: 'git clone https://github.com/user/repo.git',
    description: 'Repository klonen',
    category: 'basic',
    difficulty: 'beginner',
  },
  {
    id: 'git-add',
    command: 'git add .',
    description: 'Alle Änderungen stagen',
    category: 'basic',
    difficulty: 'beginner',
  },
  {
    id: 'git-commit',
    command: 'git commit -m "feat: add new feature"',
    description: 'Commit erstellen',
    category: 'basic',
    difficulty: 'beginner',
  },
  {
    id: 'git-status',
    command: 'git status',
    description: 'Status anzeigen',
    category: 'basic',
    difficulty: 'beginner',
  },
  {
    id: 'git-log',
    command: 'git log --oneline --graph',
    description: 'Commit-Historie anzeigen',
    category: 'basic',
    difficulty: 'beginner',
  },
  {
    id: 'git-diff',
    command: 'git diff HEAD~1',
    description: 'Änderungen vergleichen',
    category: 'basic',
    difficulty: 'beginner',
  },

  // Branching
  {
    id: 'git-branch',
    command: 'git branch feature/new-feature',
    description: 'Neuen Branch erstellen',
    category: 'branching',
    difficulty: 'beginner',
  },
  {
    id: 'git-checkout',
    command: 'git checkout -b feature/login',
    description: 'Branch erstellen und wechseln',
    category: 'branching',
    difficulty: 'beginner',
  },
  {
    id: 'git-switch',
    command: 'git switch -c hotfix/critical-bug',
    description: 'Neuer Branch (moderner Syntax)',
    category: 'branching',
    difficulty: 'beginner',
  },
  {
    id: 'git-merge',
    command: 'git merge feature/login --no-ff',
    description: 'Branch mergen',
    category: 'branching',
    difficulty: 'intermediate',
  },
  {
    id: 'git-rebase',
    command: 'git rebase main',
    description: 'Commits auf main rebasen',
    category: 'branching',
    difficulty: 'intermediate',
  },
  {
    id: 'git-rebase-i',
    command: 'git rebase -i HEAD~3',
    description: 'Interaktiver Rebase',
    category: 'branching',
    difficulty: 'advanced',
  },
  {
    id: 'git-cherry-pick',
    command: 'git cherry-pick abc123',
    description: 'Einzelnen Commit übernehmen',
    category: 'branching',
    difficulty: 'intermediate',
  },

  // Remote Operations
  {
    id: 'git-push',
    command: 'git push origin main',
    description: 'Push zu Remote',
    category: 'remote',
    difficulty: 'beginner',
  },
  {
    id: 'git-pull',
    command: 'git pull --rebase origin main',
    description: 'Pull mit Rebase',
    category: 'remote',
    difficulty: 'intermediate',
  },
  {
    id: 'git-fetch',
    command: 'git fetch --all --prune',
    description: 'Alle Remotes fetchen',
    category: 'remote',
    difficulty: 'intermediate',
  },
  {
    id: 'git-remote',
    command: 'git remote add upstream https://github.com/original/repo.git',
    description: 'Remote hinzufügen',
    category: 'remote',
    difficulty: 'intermediate',
  },
  {
    id: 'git-push-force',
    command: 'git push --force-with-lease origin feature',
    description: 'Sicherer Force Push',
    category: 'remote',
    difficulty: 'advanced',
  },

  // Advanced
  {
    id: 'git-stash',
    command: 'git stash push -m "WIP: feature"',
    description: 'Änderungen stashen',
    category: 'advanced',
    difficulty: 'intermediate',
  },
  {
    id: 'git-stash-pop',
    command: 'git stash pop',
    description: 'Stash anwenden',
    category: 'advanced',
    difficulty: 'intermediate',
  },
  {
    id: 'git-reset',
    command: 'git reset --soft HEAD~1',
    description: 'Soft Reset (behält Änderungen)',
    category: 'advanced',
    difficulty: 'intermediate',
  },
  {
    id: 'git-reset-hard',
    command: 'git reset --hard HEAD~1',
    description: 'Hard Reset (verwirft alles)',
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 'git-reflog',
    command: 'git reflog',
    description: 'Alle Aktionen anzeigen',
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 'git-bisect',
    command: 'git bisect start HEAD v1.0 --',
    description: 'Bug-Commit finden',
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 'git-worktree',
    command: 'git worktree add ../feature-branch feature',
    description: 'Worktree erstellen',
    category: 'advanced',
    difficulty: 'advanced',
  },

  // GitHub CLI
  {
    id: 'gh-pr-create',
    command: 'gh pr create --title "feat: add login" --body "Description"',
    description: 'PR erstellen',
    category: 'github',
    difficulty: 'intermediate',
  },
  {
    id: 'gh-pr-list',
    command: 'gh pr list --state open --author @me',
    description: 'PRs auflisten',
    category: 'github',
    difficulty: 'beginner',
  },
  {
    id: 'gh-pr-checkout',
    command: 'gh pr checkout 123',
    description: 'PR auschecken',
    category: 'github',
    difficulty: 'intermediate',
  },
  {
    id: 'gh-pr-merge',
    command: 'gh pr merge 123 --squash --delete-branch',
    description: 'PR mergen',
    category: 'github',
    difficulty: 'intermediate',
  },
  {
    id: 'gh-issue-create',
    command: 'gh issue create --title "Bug: ..." --label bug',
    description: 'Issue erstellen',
    category: 'github',
    difficulty: 'beginner',
  },
  {
    id: 'gh-repo-clone',
    command: 'gh repo clone owner/repo',
    description: 'Repo klonen',
    category: 'github',
    difficulty: 'beginner',
  },
  {
    id: 'gh-repo-fork',
    command: 'gh repo fork --clone',
    description: 'Repo forken',
    category: 'github',
    difficulty: 'intermediate',
  },
  {
    id: 'gh-workflow-run',
    command: 'gh workflow run deploy.yml -f environment=prod',
    description: 'Workflow starten',
    category: 'github',
    difficulty: 'advanced',
  },
  {
    id: 'gh-release',
    command: 'gh release create v1.0.0 --generate-notes',
    description: 'Release erstellen',
    category: 'github',
    difficulty: 'intermediate',
  },
];

// Git Workflow Scenarios
export interface GitWorkflow {
  id: string;
  title: string;
  description: string;
  steps: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const GIT_WORKFLOWS: GitWorkflow[] = [
  {
    id: 'workflow-feature',
    title: 'Feature Branch Workflow',
    description: 'Neues Feature entwickeln und mergen',
    steps: [
      'git checkout main',
      'git pull origin main',
      'git checkout -b feature/user-authentication',
      'git add .',
      'git commit -m "feat: implement user login"',
      'git push -u origin feature/user-authentication',
      'gh pr create --title "feat: user authentication" --body "Implements login/logout"',
    ],
    difficulty: 'beginner',
  },
  {
    id: 'workflow-hotfix',
    title: 'Hotfix Workflow',
    description: 'Kritischen Bug schnell fixen',
    steps: [
      'git checkout main',
      'git pull origin main',
      'git checkout -b hotfix/critical-security-fix',
      'git add .',
      'git commit -m "fix: patch security vulnerability"',
      'git push origin hotfix/critical-security-fix',
      'gh pr create --title "fix: critical security patch" --label "priority:critical"',
      'gh pr merge --squash --delete-branch',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'workflow-rebase',
    title: 'Feature Rebase Workflow',
    description: 'Feature Branch auf main rebasen',
    steps: [
      'git checkout feature/my-feature',
      'git fetch origin main',
      'git rebase origin/main',
      'git push --force-with-lease origin feature/my-feature',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'workflow-squash',
    title: 'Commits Squashen',
    description: 'Mehrere Commits zu einem zusammenfassen',
    steps: [
      'git log --oneline -5',
      'git rebase -i HEAD~3',
      'git push --force-with-lease origin feature',
    ],
    difficulty: 'advanced',
  },
  {
    id: 'workflow-conflict',
    title: 'Merge Conflict lösen',
    description: 'Konflikte beim Mergen beheben',
    steps: [
      'git merge feature/other-branch',
      'git status',
      'git add .',
      'git commit -m "merge: resolve conflicts with other-branch"',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'workflow-fork',
    title: 'Fork Workflow (Open Source)',
    description: 'Zu einem Open Source Projekt beitragen',
    steps: [
      'gh repo fork original/repo --clone',
      'git remote add upstream https://github.com/original/repo.git',
      'git checkout -b feature/my-contribution',
      'git add .',
      'git commit -m "feat: add new feature"',
      'git push origin feature/my-contribution',
      'gh pr create --repo original/repo --title "feat: my contribution"',
    ],
    difficulty: 'intermediate',
  },
];

// Vim Commands
export interface VimCommand {
  id: string;
  keys: string;
  description: string;
  category: 'movement' | 'editing' | 'visual' | 'search' | 'files' | 'advanced';
  mode: 'normal' | 'insert' | 'visual' | 'command';
}

export const VIM_COMMANDS: VimCommand[] = [
  // Movement
  {
    id: 'vim-hjkl',
    keys: 'h j k l',
    description: 'Links, Unten, Oben, Rechts',
    category: 'movement',
    mode: 'normal',
  },
  { id: 'vim-w', keys: 'w', description: 'Nächstes Wort', category: 'movement', mode: 'normal' },
  { id: 'vim-b', keys: 'b', description: 'Vorheriges Wort', category: 'movement', mode: 'normal' },
  { id: 'vim-e', keys: 'e', description: 'Ende des Wortes', category: 'movement', mode: 'normal' },
  { id: 'vim-0', keys: '0', description: 'Zeilenanfang', category: 'movement', mode: 'normal' },
  { id: 'vim-dollar', keys: '$', description: 'Zeilenende', category: 'movement', mode: 'normal' },
  { id: 'vim-gg', keys: 'gg', description: 'Dateianfang', category: 'movement', mode: 'normal' },
  { id: 'vim-G', keys: 'G', description: 'Dateiende', category: 'movement', mode: 'normal' },
  {
    id: 'vim-ctrl-d',
    keys: 'Ctrl+d',
    description: 'Halbe Seite runter',
    category: 'movement',
    mode: 'normal',
  },
  {
    id: 'vim-ctrl-u',
    keys: 'Ctrl+u',
    description: 'Halbe Seite hoch',
    category: 'movement',
    mode: 'normal',
  },
  {
    id: 'vim-percent',
    keys: '%',
    description: 'Zur passenden Klammer',
    category: 'movement',
    mode: 'normal',
  },

  // Editing
  { id: 'vim-i', keys: 'i', description: 'Insert vor Cursor', category: 'editing', mode: 'normal' },
  {
    id: 'vim-a',
    keys: 'a',
    description: 'Insert nach Cursor',
    category: 'editing',
    mode: 'normal',
  },
  {
    id: 'vim-I',
    keys: 'I',
    description: 'Insert am Zeilenanfang',
    category: 'editing',
    mode: 'normal',
  },
  {
    id: 'vim-A',
    keys: 'A',
    description: 'Insert am Zeilenende',
    category: 'editing',
    mode: 'normal',
  },
  { id: 'vim-o', keys: 'o', description: 'Neue Zeile unten', category: 'editing', mode: 'normal' },
  { id: 'vim-O', keys: 'O', description: 'Neue Zeile oben', category: 'editing', mode: 'normal' },
  { id: 'vim-x', keys: 'x', description: 'Zeichen löschen', category: 'editing', mode: 'normal' },
  { id: 'vim-dd', keys: 'dd', description: 'Zeile löschen', category: 'editing', mode: 'normal' },
  { id: 'vim-dw', keys: 'dw', description: 'Wort löschen', category: 'editing', mode: 'normal' },
  {
    id: 'vim-d$',
    keys: 'd$',
    description: 'Bis Zeilenende löschen',
    category: 'editing',
    mode: 'normal',
  },
  { id: 'vim-yy', keys: 'yy', description: 'Zeile kopieren', category: 'editing', mode: 'normal' },
  {
    id: 'vim-p',
    keys: 'p',
    description: 'Einfügen nach Cursor',
    category: 'editing',
    mode: 'normal',
  },
  {
    id: 'vim-P',
    keys: 'P',
    description: 'Einfügen vor Cursor',
    category: 'editing',
    mode: 'normal',
  },
  { id: 'vim-u', keys: 'u', description: 'Undo', category: 'editing', mode: 'normal' },
  { id: 'vim-ctrl-r', keys: 'Ctrl+r', description: 'Redo', category: 'editing', mode: 'normal' },
  { id: 'vim-ciw', keys: 'ciw', description: 'Wort ändern', category: 'editing', mode: 'normal' },
  {
    id: 'vim-cit',
    keys: 'cit',
    description: 'Tag-Inhalt ändern',
    category: 'editing',
    mode: 'normal',
  },

  // Visual Mode
  { id: 'vim-v', keys: 'v', description: 'Visual Mode', category: 'visual', mode: 'normal' },
  { id: 'vim-V', keys: 'V', description: 'Visual Line Mode', category: 'visual', mode: 'normal' },
  {
    id: 'vim-ctrl-v',
    keys: 'Ctrl+v',
    description: 'Visual Block Mode',
    category: 'visual',
    mode: 'normal',
  },
  {
    id: 'vim-viw',
    keys: 'viw',
    description: 'Wort selektieren',
    category: 'visual',
    mode: 'normal',
  },
  {
    id: 'vim-vib',
    keys: 'vi{',
    description: 'Block {} selektieren',
    category: 'visual',
    mode: 'normal',
  },

  // Search
  {
    id: 'vim-slash',
    keys: '/pattern',
    description: 'Vorwärts suchen',
    category: 'search',
    mode: 'normal',
  },
  {
    id: 'vim-question',
    keys: '?pattern',
    description: 'Rückwärts suchen',
    category: 'search',
    mode: 'normal',
  },
  { id: 'vim-n', keys: 'n', description: 'Nächstes Ergebnis', category: 'search', mode: 'normal' },
  {
    id: 'vim-N',
    keys: 'N',
    description: 'Vorheriges Ergebnis',
    category: 'search',
    mode: 'normal',
  },
  {
    id: 'vim-star',
    keys: '*',
    description: 'Wort unter Cursor suchen',
    category: 'search',
    mode: 'normal',
  },
  {
    id: 'vim-substitute',
    keys: ':%s/old/new/g',
    description: 'Suchen & Ersetzen',
    category: 'search',
    mode: 'command',
  },

  // Files
  { id: 'vim-save', keys: ':w', description: 'Speichern', category: 'files', mode: 'command' },
  { id: 'vim-quit', keys: ':q', description: 'Beenden', category: 'files', mode: 'command' },
  {
    id: 'vim-savequit',
    keys: ':wq',
    description: 'Speichern & Beenden',
    category: 'files',
    mode: 'command',
  },
  {
    id: 'vim-forcequit',
    keys: ':q!',
    description: 'Ohne Speichern beenden',
    category: 'files',
    mode: 'command',
  },
  {
    id: 'vim-edit',
    keys: ':e filename',
    description: 'Datei öffnen',
    category: 'files',
    mode: 'command',
  },
  {
    id: 'vim-split',
    keys: ':sp filename',
    description: 'Horizontal teilen',
    category: 'files',
    mode: 'command',
  },
  {
    id: 'vim-vsplit',
    keys: ':vsp filename',
    description: 'Vertikal teilen',
    category: 'files',
    mode: 'command',
  },

  // Advanced
  {
    id: 'vim-macro-record',
    keys: 'qa',
    description: 'Makro aufnehmen in a',
    category: 'advanced',
    mode: 'normal',
  },
  {
    id: 'vim-macro-stop',
    keys: 'q',
    description: 'Makro stoppen',
    category: 'advanced',
    mode: 'normal',
  },
  {
    id: 'vim-macro-play',
    keys: '@a',
    description: 'Makro a abspielen',
    category: 'advanced',
    mode: 'normal',
  },
  {
    id: 'vim-dot',
    keys: '.',
    description: 'Letzte Aktion wiederholen',
    category: 'advanced',
    mode: 'normal',
  },
  {
    id: 'vim-marks',
    keys: 'ma',
    description: 'Mark a setzen',
    category: 'advanced',
    mode: 'normal',
  },
  {
    id: 'vim-goto-mark',
    keys: "'a",
    description: 'Zu Mark a springen',
    category: 'advanced',
    mode: 'normal',
  },
];

// Regex Patterns
export interface RegexPattern {
  id: string;
  pattern: string;
  description: string;
  example: string;
  matches: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const REGEX_PATTERNS: RegexPattern[] = [
  {
    id: 'regex-email',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description: 'E-Mail Adressen',
    example: 'user@example.com',
    matches: ['user@example.com', 'test.user@domain.org'],
    difficulty: 'intermediate',
  },
  {
    id: 'regex-url',
    pattern: 'https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(/\\S*)?',
    description: 'URLs',
    example: 'https://example.com/path',
    matches: ['https://example.com', 'http://test.org/page'],
    difficulty: 'intermediate',
  },
  {
    id: 'regex-phone',
    pattern: '\\+?[0-9]{1,3}[- ]?\\(?[0-9]{3}\\)?[- ]?[0-9]{3}[- ]?[0-9]{4}',
    description: 'Telefonnummern',
    example: '+1 (555) 123-4567',
    matches: ['+1 (555) 123-4567', '555-123-4567'],
    difficulty: 'intermediate',
  },
  {
    id: 'regex-ip',
    pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
    description: 'IPv4 Adressen',
    example: '192.168.1.1',
    matches: ['192.168.1.1', '10.0.0.1'],
    difficulty: 'intermediate',
  },
  {
    id: 'regex-date',
    pattern: '\\d{4}-\\d{2}-\\d{2}',
    description: 'ISO Datum',
    example: '2024-01-15',
    matches: ['2024-01-15', '2023-12-31'],
    difficulty: 'beginner',
  },
  {
    id: 'regex-hex',
    pattern: '#[0-9A-Fa-f]{6}\\b',
    description: 'Hex Farbcodes',
    example: '#FF5733',
    matches: ['#FF5733', '#000000'],
    difficulty: 'beginner',
  },
  {
    id: 'regex-uuid',
    pattern: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
    description: 'UUIDs',
    example: '550e8400-e29b-41d4-a716-446655440000',
    matches: ['550e8400-e29b-41d4-a716-446655440000'],
    difficulty: 'intermediate',
  },
  {
    id: 'regex-password',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    description: 'Starkes Passwort',
    example: 'Pass@word1',
    matches: ['Pass@word1', 'Secure$123'],
    difficulty: 'advanced',
  },
  {
    id: 'regex-html-tag',
    pattern: '<([a-z]+)[^>]*>(.*?)</\\1>',
    description: 'HTML Tags',
    example: '<div class="test">content</div>',
    matches: ['<div>text</div>', '<span>content</span>'],
    difficulty: 'advanced',
  },
  {
    id: 'regex-word-boundary',
    pattern: '\\bword\\b',
    description: 'Wort-Grenze',
    example: 'word',
    matches: ['word in sentence'],
    difficulty: 'beginner',
  },
];

// JSON API Examples
export interface APIExample {
  id: string;
  title: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  body?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const API_EXAMPLES: APIExample[] = [
  {
    id: 'api-get-users',
    title: 'GET Users',
    method: 'GET',
    endpoint: '/api/v1/users?page=1&limit=10',
    difficulty: 'beginner',
  },
  {
    id: 'api-get-user',
    title: 'GET User by ID',
    method: 'GET',
    endpoint: '/api/v1/users/123',
    difficulty: 'beginner',
  },
  {
    id: 'api-post-user',
    title: 'POST Create User',
    method: 'POST',
    endpoint: '/api/v1/users',
    body: `{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "developer"
}`,
    difficulty: 'beginner',
  },
  {
    id: 'api-put-user',
    title: 'PUT Update User',
    method: 'PUT',
    endpoint: '/api/v1/users/123',
    body: `{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "role": "admin"
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'api-patch-user',
    title: 'PATCH Partial Update',
    method: 'PATCH',
    endpoint: '/api/v1/users/123',
    body: `{
  "role": "admin"
}`,
    difficulty: 'intermediate',
  },
  {
    id: 'api-delete-user',
    title: 'DELETE User',
    method: 'DELETE',
    endpoint: '/api/v1/users/123',
    difficulty: 'beginner',
  },
  {
    id: 'api-nested',
    title: 'Nested JSON',
    method: 'POST',
    endpoint: '/api/v1/orders',
    body: `{
  "customer": {
    "id": 123,
    "name": "John Doe"
  },
  "items": [
    { "productId": 1, "quantity": 2, "price": 29.99 },
    { "productId": 2, "quantity": 1, "price": 49.99 }
  ],
  "shipping": {
    "address": "123 Main St",
    "city": "Berlin",
    "country": "Germany"
  },
  "total": 109.97
}`,
    difficulty: 'advanced',
  },
];

// Collect all snippets
export const ALL_CODE_SNIPPETS: CodeSnippet[] = [
  ...RUST_SNIPPETS,
  ...GO_SNIPPETS,
  ...PYTHON_SNIPPETS,
  ...SQL_SNIPPETS,
  ...CPP_SNIPPETS,
  ...DOCKER_SNIPPETS,
  ...PHP_SNIPPETS,
  ...RUBY_SNIPPETS,
  ...KOTLIN_SNIPPETS,
  ...SWIFT_SNIPPETS,
  ...K8S_SNIPPETS,
  ...CICD_SNIPPETS,
  ...HTML_CSS_SNIPPETS,
];

// Get snippets by language
export function getSnippetsByLanguage(language: string): CodeSnippet[] {
  return ALL_CODE_SNIPPETS.filter(s => s.language === language);
}

// Get snippets by difficulty
export function getSnippetsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): CodeSnippet[] {
  return ALL_CODE_SNIPPETS.filter(s => s.difficulty === difficulty);
}

// Get all available languages
export function getAvailableLanguages(): string[] {
  return [...new Set(ALL_CODE_SNIPPETS.map(s => s.language))];
}

// Language configurations for syntax highlighting
export const LANGUAGE_CONFIGS: Record<
  string,
  {
    name: string;
    extension: string;
    keywords: string[];
    types: string[];
    builtins: string[];
  }
> = {
  rust: {
    name: 'Rust',
    extension: '.rs',
    keywords: [
      'fn',
      'let',
      'mut',
      'const',
      'if',
      'else',
      'match',
      'loop',
      'while',
      'for',
      'in',
      'return',
      'use',
      'mod',
      'pub',
      'struct',
      'enum',
      'impl',
      'trait',
      'where',
      'async',
      'await',
      'move',
      'self',
      'Self',
      'super',
      'crate',
      'dyn',
      'type',
      'as',
      'ref',
    ],
    types: [
      'i8',
      'i16',
      'i32',
      'i64',
      'i128',
      'isize',
      'u8',
      'u16',
      'u32',
      'u64',
      'u128',
      'usize',
      'f32',
      'f64',
      'bool',
      'char',
      'str',
      'String',
      'Vec',
      'Option',
      'Result',
      'Box',
      'Rc',
      'Arc',
      'Cell',
      'RefCell',
    ],
    builtins: [
      'println!',
      'print!',
      'format!',
      'vec!',
      'panic!',
      'assert!',
      'assert_eq!',
      'dbg!',
      'todo!',
      'unimplemented!',
    ],
  },
  go: {
    name: 'Go',
    extension: '.go',
    keywords: [
      'package',
      'import',
      'func',
      'var',
      'const',
      'type',
      'struct',
      'interface',
      'map',
      'chan',
      'go',
      'defer',
      'select',
      'case',
      'default',
      'if',
      'else',
      'for',
      'range',
      'switch',
      'return',
      'break',
      'continue',
      'fallthrough',
      'goto',
    ],
    types: [
      'int',
      'int8',
      'int16',
      'int32',
      'int64',
      'uint',
      'uint8',
      'uint16',
      'uint32',
      'uint64',
      'float32',
      'float64',
      'complex64',
      'complex128',
      'byte',
      'rune',
      'string',
      'bool',
      'error',
    ],
    builtins: [
      'make',
      'new',
      'len',
      'cap',
      'append',
      'copy',
      'delete',
      'close',
      'panic',
      'recover',
      'print',
      'println',
    ],
  },
  sql: {
    name: 'SQL',
    extension: '.sql',
    keywords: [
      'SELECT',
      'FROM',
      'WHERE',
      'JOIN',
      'INNER',
      'LEFT',
      'RIGHT',
      'OUTER',
      'ON',
      'AND',
      'OR',
      'NOT',
      'IN',
      'EXISTS',
      'BETWEEN',
      'LIKE',
      'IS',
      'NULL',
      'ORDER',
      'BY',
      'GROUP',
      'HAVING',
      'LIMIT',
      'OFFSET',
      'AS',
      'DISTINCT',
      'UNION',
      'ALL',
      'INSERT',
      'INTO',
      'VALUES',
      'UPDATE',
      'SET',
      'DELETE',
      'CREATE',
      'TABLE',
      'ALTER',
      'DROP',
      'INDEX',
      'PRIMARY',
      'KEY',
      'FOREIGN',
      'REFERENCES',
      'CASCADE',
      'WITH',
      'RECURSIVE',
      'OVER',
      'PARTITION',
      'WINDOW',
    ],
    types: [
      'INTEGER',
      'INT',
      'BIGINT',
      'SMALLINT',
      'DECIMAL',
      'NUMERIC',
      'FLOAT',
      'REAL',
      'DOUBLE',
      'VARCHAR',
      'CHAR',
      'TEXT',
      'DATE',
      'TIME',
      'TIMESTAMP',
      'BOOLEAN',
      'SERIAL',
      'JSON',
      'JSONB',
      'UUID',
      'ARRAY',
    ],
    builtins: [
      'COUNT',
      'SUM',
      'AVG',
      'MIN',
      'MAX',
      'COALESCE',
      'NULLIF',
      'CAST',
      'CASE',
      'WHEN',
      'THEN',
      'ELSE',
      'END',
      'NOW',
      'CURRENT_DATE',
      'CURRENT_TIMESTAMP',
      'DATE_TRUNC',
      'EXTRACT',
      'ROW_NUMBER',
      'RANK',
      'DENSE_RANK',
      'LAG',
      'LEAD',
      'FIRST_VALUE',
      'LAST_VALUE',
    ],
  },
  cpp: {
    name: 'C++',
    extension: '.cpp',
    keywords: [
      'class',
      'struct',
      'enum',
      'union',
      'template',
      'typename',
      'public',
      'private',
      'protected',
      'virtual',
      'override',
      'final',
      'static',
      'const',
      'constexpr',
      'mutable',
      'volatile',
      'inline',
      'extern',
      'namespace',
      'using',
      'typedef',
      'auto',
      'decltype',
      'sizeof',
      'alignof',
      'new',
      'delete',
      'this',
      'if',
      'else',
      'switch',
      'case',
      'default',
      'for',
      'while',
      'do',
      'break',
      'continue',
      'return',
      'try',
      'catch',
      'throw',
      'noexcept',
    ],
    types: [
      'int',
      'char',
      'short',
      'long',
      'float',
      'double',
      'bool',
      'void',
      'wchar_t',
      'char16_t',
      'char32_t',
      'size_t',
      'ptrdiff_t',
      'nullptr_t',
      'string',
      'vector',
      'map',
      'set',
      'list',
      'deque',
      'array',
      'unique_ptr',
      'shared_ptr',
      'weak_ptr',
    ],
    builtins: [
      'std',
      'cout',
      'cin',
      'endl',
      'cerr',
      'clog',
      'printf',
      'scanf',
      'malloc',
      'free',
      'memcpy',
      'memset',
      'strlen',
      'strcmp',
      'strcpy',
    ],
  },
  dockerfile: {
    name: 'Dockerfile',
    extension: 'Dockerfile',
    keywords: [
      'FROM',
      'AS',
      'RUN',
      'CMD',
      'ENTRYPOINT',
      'COPY',
      'ADD',
      'WORKDIR',
      'ENV',
      'ARG',
      'EXPOSE',
      'VOLUME',
      'USER',
      'LABEL',
      'HEALTHCHECK',
      'SHELL',
      'STOPSIGNAL',
      'ONBUILD',
    ],
    types: [],
    builtins: [],
  },
  yaml: {
    name: 'YAML',
    extension: '.yml',
    keywords: ['true', 'false', 'null', 'yes', 'no', 'on', 'off'],
    types: [],
    builtins: [],
  },
  html: {
    name: 'HTML',
    extension: '.html',
    keywords: [
      'DOCTYPE',
      'html',
      'head',
      'body',
      'title',
      'meta',
      'link',
      'script',
      'style',
      'div',
      'span',
      'p',
      'a',
      'img',
      'ul',
      'ol',
      'li',
      'table',
      'tr',
      'td',
      'th',
      'form',
      'input',
      'button',
      'label',
      'select',
      'option',
      'textarea',
      'header',
      'footer',
      'nav',
      'main',
      'section',
      'article',
      'aside',
    ],
    types: [],
    builtins: [],
  },
  css: {
    name: 'CSS',
    extension: '.css',
    keywords: ['@import', '@media', '@keyframes', '@font-face', '@supports', '@page', '@charset'],
    types: [
      'px',
      'em',
      'rem',
      '%',
      'vh',
      'vw',
      'vmin',
      'vmax',
      'fr',
      'ch',
      'ex',
      'deg',
      'rad',
      'turn',
      'ms',
      's',
    ],
    builtins: [
      'display',
      'position',
      'width',
      'height',
      'margin',
      'padding',
      'border',
      'background',
      'color',
      'font',
      'flex',
      'grid',
      'transform',
      'transition',
      'animation',
      'opacity',
      'z-index',
      'overflow',
      'cursor',
      'pointer-events',
    ],
  },
};
