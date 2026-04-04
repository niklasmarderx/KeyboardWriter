/**
 * Keyboard Shortcuts & Commands Data
 * Comprehensive collections for VS Code, macOS, IntelliJ IDEA, Terminal, Git, Docker, and more
 *
 * This barrel file re-exports everything for backward compatibility.
 */

// Types
export type { Shortcut, Command, ShortcutCollection, CommandCollection } from './types';

// Individual shortcut collections
export { VS_CODE_SHORTCUTS } from './vscode';
export { MACOS_SHORTCUTS } from './macos';
export { INTELLIJ_SHORTCUTS } from './intellij';
export { CHROME_DEVTOOLS_SHORTCUTS } from './chrome-devtools';
export { VIM_SHORTCUTS } from './vim';
export { XCODE_SHORTCUTS } from './xcode';

// Individual command collections
export { TERMINAL_COMMANDS } from './terminal';
export { GIT_COMMANDS } from './git';
export { DOCKER_COMMANDS } from './docker';
export { NPM_COMMANDS } from './npm';
export { HOMEBREW_COMMANDS } from './homebrew';

// Aggregated collections and helper functions
export {
  ALL_SHORTCUT_COLLECTIONS,
  ALL_COMMAND_COLLECTIONS,
  getShortcutCollection,
  getCommandCollection,
  getShortcutCategories,
  getCommandCategories,
  getAllShortcuts,
  getAllCommands,
  getTotalShortcutCount,
  getTotalCommandCount,
  searchAll,
  getCategories,
} from './collections';

// Translations
export {
  CATEGORY_TRANSLATIONS,
  DESCRIPTION_TRANSLATIONS,
  COLLECTION_TRANSLATIONS,
  getTranslatedDescription,
  getTranslatedCategory,
  getTranslatedCollectionInfo,
} from './translations';
