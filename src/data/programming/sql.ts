import { CodeSnippet } from './types';

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
