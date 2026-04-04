/**
 * Programming Exercises Type Definitions
 */

// Programming Languages with code snippets
export interface CodeSnippet {
  id: string;
  language: string;
  title: string;
  code: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
}

export interface GitCommand {
  id: string;
  command: string;
  description: string;
  category: 'basic' | 'branching' | 'remote' | 'advanced' | 'github';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface GitWorkflow {
  id: string;
  title: string;
  description: string;
  steps: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface VimCommand {
  id: string;
  keys: string;
  description: string;
  category: 'movement' | 'editing' | 'visual' | 'search' | 'files' | 'advanced';
  mode: 'normal' | 'insert' | 'visual' | 'command';
}

export interface RegexPattern {
  id: string;
  pattern: string;
  description: string;
  example: string;
  matches: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface APIExample {
  id: string;
  title: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  body?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
