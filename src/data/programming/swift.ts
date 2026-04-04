import { CodeSnippet } from './types';

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
