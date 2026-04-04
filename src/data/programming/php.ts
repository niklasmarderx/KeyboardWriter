import { CodeSnippet } from './types';

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
