import { LessonType } from '../../domain/enums';
import { ShortcutLesson } from '../../domain/models';

/**
 * ============================================================================
 * SHORTCUT LESSONS - Level 4-5 (IDE Shortcuts)
 * ============================================================================
 */
export const SHORTCUT_LESSONS: ShortcutLesson[] = [
  {
    id: 'shortcuts-vscode-01',
    title: 'VS Code Essentials',
    description: 'Die wichtigsten VS Code Shortcuts',
    type: LessonType.SHORTCUTS,
    category: 'shortcuts',
    level: 4,
    ide: 'vscode',
    targetWPM: 15,
    targetAccuracy: 95,
    shortcuts: [
      {
        id: 'sc-01',
        keys: ['Cmd', 'P'],
        action: 'Quick Open',
        description: 'Datei schnell öffnen',
        category: 'Navigation',
      },
      {
        id: 'sc-02',
        keys: ['Cmd', 'Shift', 'P'],
        action: 'Command Palette',
        description: 'Befehls-Palette',
        category: 'Navigation',
      },
      {
        id: 'sc-03',
        keys: ['Cmd', 'D'],
        action: 'Select Word',
        description: 'Wort auswählen',
        category: 'Editing',
      },
      {
        id: 'sc-04',
        keys: ['Cmd', 'Shift', 'K'],
        action: 'Delete Line',
        description: 'Zeile löschen',
        category: 'Editing',
      },
      {
        id: 'sc-05',
        keys: ['Alt', 'Up/Down'],
        action: 'Move Line',
        description: 'Zeile verschieben',
        category: 'Editing',
      },
    ],
    exercises: [
      {
        id: 'shortcuts-vscode-01-01',
        text: 'Cmd+P Cmd+Shift+P Cmd+D',
        description: 'Navigation Shortcuts',
      },
      {
        id: 'shortcuts-vscode-01-02',
        text: 'Cmd+Shift+K Alt+Up Alt+Down',
        description: 'Editing Shortcuts',
      },
      { id: 'shortcuts-vscode-01-03', text: 'Cmd+B Cmd+J Cmd+`', description: 'Panel Shortcuts' },
    ],
  },
  {
    id: 'shortcuts-vscode-02',
    title: 'VS Code Advanced',
    description: 'Fortgeschrittene VS Code Shortcuts',
    type: LessonType.SHORTCUTS,
    category: 'shortcuts',
    level: 5,
    ide: 'vscode',
    targetWPM: 15,
    targetAccuracy: 92,
    shortcuts: [
      {
        id: 'sc-06',
        keys: ['Cmd', 'Shift', 'L'],
        action: 'Select All Occurrences',
        description: 'Alle Vorkommen auswählen',
        category: 'Multi-Cursor',
      },
      {
        id: 'sc-07',
        keys: ['Cmd', 'Alt', 'Up/Down'],
        action: 'Add Cursor',
        description: 'Cursor hinzufügen',
        category: 'Multi-Cursor',
      },
      {
        id: 'sc-08',
        keys: ['F12'],
        action: 'Go to Definition',
        description: 'Zur Definition springen',
        category: 'Navigation',
      },
      {
        id: 'sc-09',
        keys: ['Cmd', 'Shift', 'F'],
        action: 'Search in Files',
        description: 'In Dateien suchen',
        category: 'Search',
      },
    ],
    exercises: [
      {
        id: 'shortcuts-vscode-02-01',
        text: 'Cmd+Shift+L Cmd+Alt+Up F12',
        description: 'Multi-Cursor Shortcuts',
      },
      {
        id: 'shortcuts-vscode-02-02',
        text: 'Cmd+Shift+F Cmd+H Cmd+G',
        description: 'Search Shortcuts',
      },
    ],
  },
  {
    id: 'shortcuts-intellij-01',
    title: 'IntelliJ Essentials',
    description: 'Die wichtigsten IntelliJ Shortcuts',
    type: LessonType.SHORTCUTS,
    category: 'shortcuts',
    level: 4,
    ide: 'intellij',
    targetWPM: 15,
    targetAccuracy: 95,
    shortcuts: [
      {
        id: 'sc-ij-01',
        keys: ['Cmd', 'Shift', 'A'],
        action: 'Find Action',
        description: 'Aktion finden',
        category: 'Navigation',
      },
      {
        id: 'sc-ij-02',
        keys: ['Cmd', 'E'],
        action: 'Recent Files',
        description: 'Letzte Dateien',
        category: 'Navigation',
      },
      {
        id: 'sc-ij-03',
        keys: ['Cmd', 'B'],
        action: 'Go to Declaration',
        description: 'Zur Deklaration',
        category: 'Navigation',
      },
      {
        id: 'sc-ij-04',
        keys: ['Alt', 'Enter'],
        action: 'Quick Fix',
        description: 'Schnellkorrektur',
        category: 'Editing',
      },
    ],
    exercises: [
      {
        id: 'shortcuts-intellij-01-01',
        text: 'Cmd+Shift+A Cmd+E Cmd+B',
        description: 'Navigation Shortcuts',
      },
      {
        id: 'shortcuts-intellij-01-02',
        text: 'Alt+Enter Cmd+N Ctrl+Space',
        description: 'Editing Shortcuts',
      },
    ],
  },
  {
    id: 'shortcuts-vim-01',
    title: 'Vim Basics',
    description: 'Grundlegende Vim-Befehle',
    type: LessonType.SHORTCUTS,
    category: 'shortcuts',
    level: 5,
    ide: 'vim',
    targetWPM: 20,
    targetAccuracy: 90,
    shortcuts: [
      {
        id: 'sc-vim-01',
        keys: ['i'],
        action: 'Insert Mode',
        description: 'Einfügemodus',
        category: 'Modi',
      },
      {
        id: 'sc-vim-02',
        keys: ['Esc'],
        action: 'Normal Mode',
        description: 'Normalmodus',
        category: 'Modi',
      },
      {
        id: 'sc-vim-03',
        keys: ['h', 'j', 'k', 'l'],
        action: 'Navigation',
        description: 'Cursor bewegen',
        category: 'Navigation',
      },
      {
        id: 'sc-vim-04',
        keys: ['d', 'd'],
        action: 'Delete Line',
        description: 'Zeile löschen',
        category: 'Editing',
      },
      {
        id: 'sc-vim-05',
        keys: ['y', 'y'],
        action: 'Yank Line',
        description: 'Zeile kopieren',
        category: 'Editing',
      },
    ],
    exercises: [
      { id: 'shortcuts-vim-01-01', text: 'i Esc :w :q :wq dd yy p', description: 'Vim Basics' },
      { id: 'shortcuts-vim-01-02', text: 'hjkl w b e 0 $ gg G', description: 'Vim Navigation' },
      { id: 'shortcuts-vim-01-03', text: 'ciw diw yiw viw', description: 'Vim Text Objects' },
    ],
  },
];
