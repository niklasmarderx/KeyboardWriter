import { CodeSnippet } from './types';

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
