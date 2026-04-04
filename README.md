<div align="center">
  <img src="public/icons/icon.svg" alt="TypeCraft Logo" width="120" height="120">
  
  # TypeCraft
  
  **The Ultimate Typing Trainer for Programmers**
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  
  [Live Demo](https://niklasmarderx.github.io/TypeCraft/) | [Documentation](#features) | [Report Bug](https://github.com/niklasmarderx/TypeCraft/issues)

</div>

---

## Screenshots

### Main View

The clean, modern interface with dark mode and glassmorphism design.

![Main View](docs/screenshots/main.png)

### Practice Mode

Real-time typing practice with WPM tracking and visual keyboard feedback.

![Practice Mode](docs/screenshots/practicemode.png)

### Lessons

Structured learning path with progress tracking and skill-based lessons.

![Lessons](docs/screenshots/lessons.png)

---

## What Makes TypeCraft Special?

TypeCraft is not just another typing trainer. It is **specifically designed for programmers** and offers unique features:

| Feature                | Description                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------ |
| **Code Playground**    | 80+ interactive coding challenges with real Python/JS/Java/TypeScript in the browser |
| **Gamification**       | XP, levels, 36 achievements, daily challenges & streaks                              |
| **Dev Tools Training** | Git, Vim, Terminal, Regex, SQL, IDE shortcuts                                        |
| **Smart Analytics**    | Keyboard heatmaps, progress tracking, weakness analysis                              |
| **Offline First**      | PWA with full offline support                                                        |

---

## Feature Highlights

### Code Playground with Real Python in Browser

```python
# Solve 80+ challenges directly in your browser!
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Pyodide runs real Python code - no server needed!
```

<details>
<summary>Challenge Categories</summary>

- **30 JavaScript Challenges**: Hello World to Memoization, Currying, Binary Search
- **26 Python Challenges**: Basics to Matrix Transposition, Word Frequency
- **12 Java Challenges**: OOP concepts, inheritance, interfaces
- **12 TypeScript Challenges**: Types, generics, utility types
- **Algorithms**: FizzBuzz, Fibonacci, Factorial, GCD, Palindrome
- **Data Structures**: Array flatten, Chunking, Merge Sorted
- **Functional Programming**: Compose, Curry, Debounce, Throttle

</details>

### Programmer-Specific Training

<table>
<tr>
<td width="50%">

**Git Training**

- 40+ Git Commands
- Branch strategies
- Rebase vs Merge
- Git Flow Workflow

</td>
<td width="50%">

**Vim Training**

- Movement Commands
- Edit Commands
- Visual Mode
- Macros & Registers

</td>
</tr>
<tr>
<td>

**Regex Training**

- Pattern Matching
- Groups & Lookahead
- Real-World Examples
- Interactive Testing

</td>
<td>

**Terminal Training**

- Shell Commands
- Pipes & Redirections
- File Operations
- Process Management

</td>
</tr>
<tr>
<td colspan="2">

**SQL Training**

- 30+ SQL exercises
- SELECT, JOIN, GROUP BY
- Subqueries & CTEs
- Window Functions

</td>
</tr>
</table>

### Gamification

```
+--------------------------------------+
|  ACHIEVEMENT UNLOCKED!               |
|                                      |
|  "Speed Demon"                       |
|  Reach 100+ WPM in Code Mode         |
|                                      |
|  +500 XP                             |
+--------------------------------------+
```

- **25 Levels** with exponential XP curve
- **36 Achievements** in 5 categories
- **5 Rarity Tiers**: Common to Legendary
- **Daily Challenges** with bonus XP
- **Streak System** for consistent practice

### Intelligent Statistics

- **Keyboard Heatmap**: Shows problem keys visually
- **WPM & Accuracy Tracking**: Over time with graphs
- **Personalized Recommendations**: Based on weaknesses
- **Spaced Repetition**: Review difficult patterns optimally

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/niklasmarderx/TypeCraft.git
cd TypeCraft

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Tech Stack

| Technology                | Usage                           |
| ------------------------- | ------------------------------- |
| **TypeScript**            | Type-safe codebase              |
| **Vite**                  | Lightning-fast builds           |
| **Vanilla JS**            | No framework overhead           |
| **CSS Custom Properties** | Theming & Dark Mode             |
| **Pyodide**               | Python in browser (WebAssembly) |
| **Service Worker**        | Offline functionality           |
| **LocalStorage**          | Persistent progress             |

### Project Structure

```
typecraft/
+-- public/              # Static assets & PWA
+-- src/
|   +-- app/            # App Entry Point
|   +-- components/     # UI Components
|   |   +-- keyboard/   # Virtual Keyboard
|   |   +-- typing-area/# Typing Component
|   |   +-- charts/     # Statistics Charts
|   +-- core/           # Core Modules
|   |   +-- EventBus.ts # Pub/Sub System
|   |   +-- Store.ts    # State Management
|   |   +-- Router.ts   # SPA Router
|   +-- data/           # Lessons & Exercises
|   +-- domain/         # Domain Models
|   +-- pages/          # Page Components
|   +-- services/       # Business Logic
|   +-- styles/         # CSS Modules
+-- index.html
```

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

```bash
# Fork the repo
# Create a feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add some AmazingFeature'

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

### Tests

```bash
# Unit Tests
npm run test

# Type Checking
npm run type-check

# Linting
npm run lint
```

---

## Roadmap

- [x] Code Playground with 80+ challenges
- [x] Git, Vim, Regex, Terminal, SQL Training
- [x] Gamification System
- [x] PWA Support
- [ ] Multiplayer Typing Races
- [ ] VS Code Extension
- [ ] Cloud Sync
- [ ] More programming languages (C#, Swift, Kotlin)

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Acknowledgments

- [Pyodide](https://pyodide.org/) - Python in the browser
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- All contributors who make this project better!

---

<div align="center">

**Good luck with your training! Learning to type is like riding a bike - once learned, never forgotten.**

Star this repo if you like it!

Made with love for programmers

</div>
