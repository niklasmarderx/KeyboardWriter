import { CodeSnippet } from './types';

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
