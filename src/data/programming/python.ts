import { CodeSnippet } from './types';

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
