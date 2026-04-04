import { CodeSnippet } from './types';

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
