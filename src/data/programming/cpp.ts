import { CodeSnippet } from './types';

// C/C++ Snippets
export const CPP_SNIPPETS: CodeSnippet[] = [
  {
    id: 'cpp-hello',
    language: 'cpp',
    title: 'Hello World',
    code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
    difficulty: 'beginner',
  },
  {
    id: 'cpp-class',
    language: 'cpp',
    title: 'Classes & Objects',
    code: `class Rectangle {
private:
    int width, height;

public:
    Rectangle(int w, int h) : width(w), height(h) {}

    int area() const {
        return width * height;
    }

    void resize(int w, int h) {
        width = w;
        height = h;
    }
};`,
    difficulty: 'intermediate',
  },
  {
    id: 'cpp-template',
    language: 'cpp',
    title: 'Templates',
    code: `template <typename T>
class Stack {
private:
    std::vector<T> elements;

public:
    void push(const T& elem) {
        elements.push_back(elem);
    }

    T pop() {
        T elem = elements.back();
        elements.pop_back();
        return elem;
    }

    bool empty() const {
        return elements.empty();
    }
};`,
    difficulty: 'advanced',
  },
  {
    id: 'cpp-smartptr',
    language: 'cpp',
    title: 'Smart Pointers',
    code: `#include <memory>

class Resource {
public:
    void use() { /* ... */ }
};

void example() {
    auto unique = std::make_unique<Resource>();
    auto shared = std::make_shared<Resource>();
    std::weak_ptr<Resource> weak = shared;

    unique->use();
    shared->use();

    if (auto locked = weak.lock()) {
        locked->use();
    }
}`,
    difficulty: 'advanced',
  },
];
