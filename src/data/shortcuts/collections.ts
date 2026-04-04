import type { ShortcutCollection, CommandCollection, Shortcut, Command } from './types';
import { VS_CODE_SHORTCUTS } from './vscode';
import { MACOS_SHORTCUTS } from './macos';
import { INTELLIJ_SHORTCUTS } from './intellij';
import { CHROME_DEVTOOLS_SHORTCUTS } from './chrome-devtools';
import { VIM_SHORTCUTS } from './vim';
import { XCODE_SHORTCUTS } from './xcode';
import { TERMINAL_COMMANDS } from './terminal';
import { GIT_COMMANDS } from './git';
import { DOCKER_COMMANDS } from './docker';
import { NPM_COMMANDS } from './npm';
import { HOMEBREW_COMMANDS } from './homebrew';

export const ALL_SHORTCUT_COLLECTIONS: ShortcutCollection[] = [
  VS_CODE_SHORTCUTS,
  MACOS_SHORTCUTS,
  INTELLIJ_SHORTCUTS,
  CHROME_DEVTOOLS_SHORTCUTS,
  VIM_SHORTCUTS,
  XCODE_SHORTCUTS,
];

export const ALL_COMMAND_COLLECTIONS: CommandCollection[] = [
  TERMINAL_COMMANDS,
  GIT_COMMANDS,
  DOCKER_COMMANDS,
  NPM_COMMANDS,
  HOMEBREW_COMMANDS,
];

/**
 * Get shortcut collection by ID
 */
export function getShortcutCollection(id: string): ShortcutCollection | undefined {
  return ALL_SHORTCUT_COLLECTIONS.find(c => c.id === id);
}

/**
 * Get command collection by ID
 */
export function getCommandCollection(id: string): CommandCollection | undefined {
  return ALL_COMMAND_COLLECTIONS.find(c => c.id === id);
}

/**
 * Get unique categories for a shortcut collection
 */
export function getShortcutCategories(collection: ShortcutCollection): string[] {
  const categories = new Set(collection.shortcuts.map(s => s.category));
  return Array.from(categories);
}

/**
 * Get unique categories for a command collection
 */
export function getCommandCategories(collection: CommandCollection): string[] {
  const categories = new Set(collection.commands.map(c => c.category));
  return Array.from(categories);
}

/**
 * Get all shortcuts flattened
 */
export function getAllShortcuts(): Shortcut[] {
  return ALL_SHORTCUT_COLLECTIONS.flatMap(c => c.shortcuts);
}

/**
 * Get all commands flattened
 */
export function getAllCommands(): Command[] {
  return ALL_COMMAND_COLLECTIONS.flatMap(c => c.commands);
}

/**
 * Get total counts
 */
export function getTotalShortcutCount(): number {
  return ALL_SHORTCUT_COLLECTIONS.reduce((sum, c) => sum + c.shortcuts.length, 0);
}

export function getTotalCommandCount(): number {
  return ALL_COMMAND_COLLECTIONS.reduce((sum, c) => sum + c.commands.length, 0);
}

/**
 * Search shortcuts and commands
 */
export function searchAll(query: string): { shortcuts: Shortcut[]; commands: Command[] } {
  const lowerQuery = query.toLowerCase();

  const shortcuts = getAllShortcuts().filter(
    s =>
      s.description.toLowerCase().includes(lowerQuery) ||
      s.category.toLowerCase().includes(lowerQuery) ||
      s.keys.some(k => k.toLowerCase().includes(lowerQuery))
  );

  const commands = getAllCommands().filter(
    c =>
      c.description.toLowerCase().includes(lowerQuery) ||
      c.category.toLowerCase().includes(lowerQuery) ||
      c.command.toLowerCase().includes(lowerQuery)
  );

  return { shortcuts, commands };
}

/**
 * Legacy compatibility - get categories (for shortcuts)
 */
export function getCategories(collection: ShortcutCollection): string[] {
  return getShortcutCategories(collection);
}
