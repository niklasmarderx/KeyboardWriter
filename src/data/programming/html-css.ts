import { CodeSnippet } from './types';

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
