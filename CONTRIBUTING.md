# Contributing to TypeCraft

Thank you for your interest in TypeCraft! We welcome all contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/).
Please read our Code of Conduct before contributing.

**TL;DR**: Be kind, respectful, and constructive.

---

## How Can I Contribute?

### Bug Reports

Found a bug? Great! Here's how to report it:

1. **Check first** if the bug already [exists as an issue](https://github.com/yourusername/keyboardwriter/issues)
2. If not, [create a new issue](https://github.com/yourusername/keyboardwriter/issues/new)
3. Include the following information:
   - Description of the bug
   - Steps to reproduce
   - Expected vs. actual behavior
   - Browser & OS
   - Screenshots (if helpful)

### Feature Requests

Have an idea for a new feature?

1. [Create an issue](https://github.com/yourusername/keyboardwriter/issues/new) with the `enhancement` label
2. Describe the feature and its benefits

### Code Contributions

Want to contribute code? Fantastic!

**Good First Issues**: Look for issues with the [`good first issue`](https://github.com/yourusername/keyboardwriter/labels/good%20first%20issue) label

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/keyboardwriter.git
cd keyboardwriter

# 3. Add the original repo as upstream
git remote add upstream https://github.com/yourusername/keyboardwriter.git

# 4. Install dependencies
npm install

# 5. Start the dev server
npm run dev
```

### Available Scripts

| Script               | Description             |
| -------------------- | ----------------------- |
| `npm run dev`        | Start Vite dev server   |
| `npm run build`      | Create production build |
| `npm run preview`    | Preview the build       |
| `npm run lint`       | ESLint check            |
| `npm run lint:fix`   | ESLint auto-fix         |
| `npm run format`     | Prettier formatting     |
| `npm run type-check` | TypeScript check        |
| `npm run test`       | Unit tests              |

---

## Code Style

We use **ESLint** and **Prettier** for consistent code style.

### TypeScript Guidelines

```typescript
// Good: Explicit types for public APIs
function calculateWPM(chars: number, timeMs: number): number {
  return Math.round((chars / 5) / (timeMs / 60000));
}

// Good: Interface for complex objects
interface Challenge {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Avoid: any
function process(data: any) { ... }

// Better: Generics or concrete types
function process<T>(data: T): T { ... }
```

### File Structure

```
src/
+-- components/     # Reusable UI components
+-- core/           # Core modules (Store, EventBus, etc.)
+-- data/           # Static data (Lessons, Exercises)
+-- domain/         # Domain Models & Enums
+-- pages/          # Page components
+-- services/       # Business logic services
+-- styles/         # CSS modules
```

### Naming Conventions

| Type            | Convention               | Example                   |
| --------------- | ------------------------ | ------------------------- |
| Files (Classes) | PascalCase               | `VirtualKeyboard.ts`      |
| Files (Utils)   | camelCase                | `helpers.ts`              |
| Classes         | PascalCase               | `class TypingEngine`      |
| Functions       | camelCase                | `function calculateWPM()` |
| Constants       | UPPER_SNAKE              | `const MAX_WPM = 300`     |
| Interfaces      | PascalCase (no I-prefix) | `interface Challenge`     |

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                 |
| ---------- | --------------------------- |
| `feat`     | New feature                 |
| `fix`      | Bug fix                     |
| `docs`     | Documentation               |
| `style`    | Formatting (no code change) |
| `refactor` | Code refactoring            |
| `perf`     | Performance improvement     |
| `test`     | Add/modify tests            |
| `chore`    | Build, dependencies, etc.   |

### Examples

```bash
# Feature
feat(playground): add Python matrix transpose challenge

# Bug Fix
fix(keyboard): correct finger highlighting for special chars

# Documentation
docs: update README with new screenshots

# Refactoring
refactor(store): simplify state management logic
```

---

## Pull Request Process

### 1. Create a Branch

```bash
# Get the latest changes
git fetch upstream
git checkout main
git merge upstream/main

# Create a feature branch
git checkout -b feat/amazing-feature
```

### 2. Develop

- Write code
- Add tests (if possible)
- Make sure all tests pass: `npm run test`
- Check types: `npm run type-check`
- Check linting: `npm run lint`

### 3. Commit

```bash
git add .
git commit -m "feat(scope): add amazing feature"
```

### 4. Push & Create PR

```bash
git push origin feat/amazing-feature
```

Then on GitHub: **"Compare & pull request"**

### PR Checklist

- [ ] Code follows the style guide
- [ ] All tests pass
- [ ] Type-check has no errors
- [ ] Lint-check has no errors
- [ ] PR description explains the changes
- [ ] Screenshots added (for UI changes)

### Review Process

1. At least one maintainer reviews the PR
2. Feedback is discussed
3. Changes are made (if necessary)
4. PR is merged!

---

## Recognition

All contributors are mentioned in the README and receive a virtual achievement:

```
"Open Source Hero"
Your first merged Pull Request!
```

---

## Questions?

- Create an [Issue](https://github.com/yourusername/keyboardwriter/issues)
- Or start a [Discussion](https://github.com/yourusername/keyboardwriter/discussions)

**Thank you for your contribution!**
