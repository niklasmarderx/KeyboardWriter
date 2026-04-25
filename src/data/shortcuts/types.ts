/**
 * Keyboard Shortcuts & Commands Type Definitions
 */

export interface Shortcut {
  id: string;
  keys: string[]; // macOS keys (primary)
  keysLinux?: string[]; // Linux/Windows keys (Ctrl-based)
  description: string;
  descriptionEn?: string;
  category: string;
  categoryEn?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface Command {
  id: string;
  command: string;
  description: string;
  descriptionEn?: string;
  category: string;
  categoryEn?: string;
  example?: string;
  flags?: { flag: string; description: string; descriptionEn?: string }[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface ShortcutCollection {
  id: string;
  name: string;
  nameEn?: string;
  icon: string;
  description: string;
  descriptionEn?: string;
  color: string;
  shortcuts: Shortcut[];
}

export interface CommandCollection {
  id: string;
  name: string;
  nameEn?: string;
  icon: string;
  description: string;
  descriptionEn?: string;
  color: string;
  commands: Command[];
}
