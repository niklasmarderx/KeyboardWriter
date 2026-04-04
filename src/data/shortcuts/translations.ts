import { ALL_SHORTCUT_COLLECTIONS, ALL_COMMAND_COLLECTIONS } from './collections';

/**
 * Category translations from German to English
 */
export const CATEGORY_TRANSLATIONS: Record<string, string> = {
  // VS Code Categories
  Allgemein: 'General',
  Bearbeiten: 'Editing',
  'Bearbeiten Erweitert': 'Advanced Editing',
  Auswahl: 'Selection',
  'Multi-Cursor': 'Multi-Cursor',
  'Suchen & Ersetzen': 'Search & Replace',
  Navigation: 'Navigation',
  Folding: 'Folding',
  Ansicht: 'View',
  'Editor-Verwaltung': 'Editor Management',
  Debugging: 'Debugging',
  Terminal: 'Terminal',
  Git: 'Git',
  Refactoring: 'Refactoring',
  Snippets: 'Snippets',
  IntelliSense: 'IntelliSense',
  Breadcrumbs: 'Breadcrumbs',
  Problems: 'Problems',
  Output: 'Output',
  Workspace: 'Workspace',

  // macOS Categories
  System: 'System',
  Finder: 'Finder',
  'Finder Schnellzugriff': 'Finder Quick Access',
  Text: 'Text',
  'Text Navigation': 'Text Navigation',
  'Mission Control': 'Mission Control',
  Fenster: 'Window',
  Safari: 'Safari',
  Bedienungshilfen: 'Accessibility',
  'Microsoft Word': 'Microsoft Word',
  'Microsoft Excel': 'Microsoft Excel',
  'Microsoft PowerPoint': 'Microsoft PowerPoint',
  Sonderzeichen: 'Special Characters',

  // IntelliJ Categories
  'Code Intelligence': 'Code Intelligence',
  Suchen: 'Search',
  Ausführen: 'Run',
  Debug: 'Debug',
  Lesezeichen: 'Bookmarks',
  Tabs: 'Tabs',
  'Live Templates': 'Live Templates',

  // Chrome DevTools Categories
  Elements: 'Elements',
  Styles: 'Styles',
  Console: 'Console',
  Debugger: 'Debugger',
  Network: 'Network',
  Performance: 'Performance',

  // Vim Categories
  Modi: 'Modes',
  Dateien: 'Files',

  // Xcode Categories
  'Build & Run': 'Build & Run',
  'Interface Builder': 'Interface Builder',

  // Terminal Categories
  Auflisten: 'Listing',
  Dateioperationen: 'File Operations',
  Anzeigen: 'Viewing',
  Textverarbeitung: 'Text Processing',
  Prozesse: 'Processes',
  Netzwerk: 'Network',
  Komprimierung: 'Compression',
  Pipes: 'Pipes',
  History: 'History',

  // Git Categories
  Konfiguration: 'Configuration',
  Repository: 'Repository',
  Workflow: 'Workflow',
  Branches: 'Branches',
  Merging: 'Merging',
  Rückgängig: 'Undo',
  Stash: 'Stash',
  Tags: 'Tags',
  Submodules: 'Submodules',

  // Docker Categories
  Images: 'Images',
  Container: 'Container',
  Volumes: 'Volumes',
  Compose: 'Compose',
  Cleanup: 'Cleanup',

  // NPM Categories
  'NPM Basics': 'NPM Basics',
  'NPM Erweitert': 'NPM Advanced',
  Yarn: 'Yarn',
  NPX: 'NPX',

  // Homebrew Categories
  Basics: 'Basics',
  Wartung: 'Maintenance',
  Info: 'Info',
  Services: 'Services',
  Taps: 'Taps',
  Cask: 'Cask',
  Erweitert: 'Advanced',
};

/**
 * Description translations from German to English
 * Note: This is a comprehensive mapping of all shortcut descriptions
 */
export const DESCRIPTION_TRANSLATIONS: Record<string, string> = {
  // VS Code - General
  'Schneller Dateizugriff (Quick Open)': 'Quick Open File',
  'Befehlspalette öffnen': 'Open Command Palette',
  'Einstellungen öffnen': 'Open Settings',
  'Tastaturkürzel anzeigen': 'Show Keyboard Shortcuts',
  'Aktiven Tab schließen': 'Close Active Tab',
  'Fenster schließen': 'Close Window',
  'Neues Fenster öffnen': 'Open New Window',
  'Neue Datei erstellen': 'Create New File',
  'Datei öffnen': 'Open File',
  'Datei speichern': 'Save File',
  'Datei speichern unter': 'Save File As',
  'Alle Dateien speichern': 'Save All Files',
  'Alle Tabs schließen': 'Close All Tabs',
  'Tab fixieren (Keep Open)': 'Keep Tab Open',
  'VS Code beenden': 'Quit VS Code',
  'Integriertes Terminal öffnen': 'Open Integrated Terminal',
  'Zuletzt geschlossenen Tab öffnen': 'Reopen Closed Tab',
  'Zwischen offenen Tabs wechseln': 'Switch Between Open Tabs',
  'Datei im Explorer anzeigen': 'Reveal File in Explorer',
  'Dateipfad kopieren': 'Copy File Path',

  // VS Code - Editing
  'Zeile ausschneiden (ohne Auswahl)': 'Cut Line (no selection)',
  'Zeile kopieren (ohne Auswahl)': 'Copy Line (no selection)',
  Einfügen: 'Paste',
  'Zeile nach oben verschieben': 'Move Line Up',
  'Zeile nach unten verschieben': 'Move Line Down',
  'Zeile nach oben kopieren': 'Copy Line Up',
  'Zeile nach unten kopieren': 'Copy Line Down',
  'Zeile löschen': 'Delete Line',
  'Neue Zeile darunter einfügen': 'Insert Line Below',
  'Neue Zeile darüber einfügen': 'Insert Line Above',
  'Zur passenden Klammer springen': 'Jump to Matching Bracket',
  'Zeile einrücken': 'Indent Line',
  'Zeile ausrücken': 'Outdent Line',
  'Zeilen-Kommentar umschalten': 'Toggle Line Comment',
  'Block-Kommentar umschalten': 'Toggle Block Comment',
  Rückgängig: 'Undo',
  Wiederholen: 'Redo',
  'Letzte Cursor-Aktion rückgängig': 'Undo Last Cursor Action',
  'IntelliSense auslösen': 'Trigger IntelliSense',
  'Quick Fix / Schnelle Aktionen': 'Quick Fix / Quick Actions',

  // VS Code - Advanced Editing
  'Auswahl formatieren': 'Format Selection',
  'Dokument formatieren': 'Format Document',
  'Trailing Whitespace entfernen': 'Remove Trailing Whitespace',
  'Sprache der Datei ändern': 'Change File Language',
  'Zu Zeile gehen': 'Go to Line',
  'Zeilen-Kommentar hinzufügen': 'Add Line Comment',
  'Zeilen-Kommentar entfernen': 'Remove Line Comment',
  'Zeichen vertauschen': 'Transpose Characters',
  'Groß-/Kleinschreibung ändern': 'Change Case',
  'Zeilen verbinden': 'Join Lines',

  // VS Code - Selection
  'Wort auswählen / Nächstes Vorkommen hinzufügen': 'Select Word / Add Next Occurrence',
  'Letztes Vorkommen überspringen': 'Skip Last Occurrence',
  'Alle Vorkommen auswählen': 'Select All Occurrences',
  'Aktuelle Zeile auswählen': 'Select Current Line',
  'Alles auswählen': 'Select All',
  'Auswahl erweitern': 'Expand Selection',
  'Auswahl verkleinern': 'Shrink Selection',
  'Auswahl wortweise erweitern': 'Expand Selection by Word',
  'Auswahl wortweise verkleinern': 'Shrink Selection by Word',
  'Bis zum Zeilenende auswählen': 'Select to End of Line',
  'Bis zum Zeilenanfang auswählen': 'Select to Start of Line',
  'Zeile nach oben auswählen': 'Select Line Above',
  'Zeile nach unten auswählen': 'Select Line Below',
  'Alle Vorkommen des Wortes löschen': 'Delete All Occurrences',

  // VS Code - Multi-Cursor
  'Cursor an Position hinzufügen': 'Add Cursor at Position',
  'Cursor oberhalb hinzufügen': 'Add Cursor Above',
  'Cursor unterhalb hinzufügen': 'Add Cursor Below',
  'Cursor bei allen Vorkommen': 'Add Cursor at All Occurrences',
  'Alle Vorkommen ändern': 'Change All Occurrences',
  'Cursor oben einfügen (Column)': 'Insert Cursor Above (Column)',
  'Cursor unten einfügen (Column)': 'Insert Cursor Below (Column)',
  'Cursor am Ende jeder Zeile': 'Add Cursor at End of Each Line',
  'Multi-Cursor beenden': 'Exit Multi-Cursor',
  'Letzten Cursor rückgängig': 'Undo Last Cursor',

  // VS Code - Search & Replace
  'Suchen in Datei': 'Find in File',
  'Ersetzen in Datei': 'Replace in File',
  'In Dateien suchen': 'Find in Files',
  'In Dateien ersetzen': 'Replace in Files',
  'Nächstes Vorkommen finden': 'Find Next Occurrence',
  'Vorheriges Vorkommen finden': 'Find Previous Occurrence',
  'Nächstes Vorkommen (Alternative)': 'Find Next (Alternative)',
  'Vorheriges Vorkommen (Alternative)': 'Find Previous (Alternative)',
  'Alle Treffer auswählen': 'Select All Matches',
  'Groß-/Kleinschreibung umschalten': 'Toggle Case Sensitive',
  'Ganzes Wort umschalten': 'Toggle Whole Word',
  'Regex umschalten': 'Toggle Regex',
  'Suche schließen': 'Close Search',

  // VS Code - Navigation
  'Zu Datei gehen': 'Go to File',
  'Zu Symbol in Datei gehen': 'Go to Symbol in File',
  'Zu Symbol im Workspace gehen': 'Go to Symbol in Workspace',
  'Zum Dateianfang': 'Go to Start of File',
  'Zum Dateiende': 'Go to End of File',
  'Zurück navigieren': 'Navigate Back',
  'Vorwärts navigieren': 'Navigate Forward',
  'Zur Definition gehen': 'Go to Definition',
  'Definition anzeigen (Peek)': 'Peek Definition',
  'Definition zur Seite öffnen': 'Open Definition to Side',
  'Alle Referenzen anzeigen': 'Show All References',
  'Symbol umbenennen': 'Rename Symbol',
  'Hover-Info anzeigen': 'Show Hover Info',
  'Zum nächsten Problem gehen': 'Go to Next Problem',
  'Zum vorherigen Problem gehen': 'Go to Previous Problem',
  'Zum Zeilenanfang': 'Go to Start of Line',
  'Zum Zeilenende': 'Go to End of Line',
  'Wort zurück': 'Word Back',
  'Wort vor': 'Word Forward',

  // VS Code - Folding
  'Bereich einklappen': 'Fold Region',
  'Bereich ausklappen': 'Unfold Region',
  'Alle Unterbereiche einklappen': 'Fold All Subregions',
  'Alle Unterbereiche ausklappen': 'Unfold All Subregions',
  'Alle einklappen': 'Fold All',
  'Alle ausklappen': 'Unfold All',
  'Level 1 einklappen': 'Fold Level 1',
  'Level 2 einklappen': 'Fold Level 2',
  'Level 3 einklappen': 'Fold Level 3',
  'Level 4 einklappen': 'Fold Level 4',

  // VS Code - View
  'Seitenleiste umschalten': 'Toggle Sidebar',
  'Panel umschalten': 'Toggle Panel',
  'Terminal umschalten': 'Toggle Terminal',
  'Explorer anzeigen': 'Show Explorer',
  'Suche anzeigen': 'Show Search',
  'Source Control anzeigen': 'Show Source Control',
  'Debug-Ansicht anzeigen': 'Show Debug',
  'Extensions anzeigen': 'Show Extensions',
  'Zen-Modus umschalten': 'Toggle Zen Mode',
  'Editor-Layout: Einzeln': 'Editor Layout: Single',
  'Editor-Layout: Zwei Spalten': 'Editor Layout: Two Columns',
  'Editor-Layout: Drei Spalten': 'Editor Layout: Three Columns',
  'Vollbild umschalten': 'Toggle Full Screen',
  'Zoom vergrößern': 'Zoom In',
  'Zoom verkleinern': 'Zoom Out',
  'Zoom zurücksetzen': 'Reset Zoom',
  'Editor teilen': 'Split Editor',
  'Editor orthogonal teilen': 'Split Editor Orthogonally',
  'Markdown-Vorschau': 'Markdown Preview',
  'Markdown-Vorschau zur Seite': 'Markdown Preview to Side',

  // VS Code - Editor Management
  'Erste Editor-Gruppe fokussieren': 'Focus First Editor Group',
  'Zweite Editor-Gruppe fokussieren': 'Focus Second Editor Group',
  'Dritte Editor-Gruppe fokussieren': 'Focus Third Editor Group',
  'Fokus auf linke Gruppe': 'Focus Left Group',
  'Fokus auf rechte Gruppe': 'Focus Right Group',
  'Fokus auf obere Gruppe': 'Focus Above Group',
  'Fokus auf untere Gruppe': 'Focus Below Group',
  'Editor in linke Gruppe verschieben': 'Move Editor to Left Group',
  'Editor in rechte Gruppe verschieben': 'Move Editor to Right Group',
  'Nächsten Tab öffnen': 'Open Next Tab',
  'Vorherigen Tab öffnen': 'Open Previous Tab',

  // VS Code - Debugging
  'Debugging starten / fortsetzen': 'Start / Continue Debugging',
  'Debugging stoppen': 'Stop Debugging',
  'Debugging neu starten': 'Restart Debugging',
  'Breakpoint umschalten': 'Toggle Breakpoint',
  'Step Over': 'Step Over',
  'Step Into': 'Step Into',
  'Step Out': 'Step Out',
  'Debug Hover Info': 'Debug Hover Info',
  'Inline Breakpoint': 'Inline Breakpoint',
  'Debugging pausieren': 'Pause Debugging',

  // VS Code - Terminal
  'Terminal anzeigen/verbergen': 'Show/Hide Terminal',
  'Neues Terminal erstellen': 'Create New Terminal',
  'Terminal teilen': 'Split Terminal',
  'Im Terminal nach oben scrollen': 'Scroll Up in Terminal',
  'Im Terminal nach unten scrollen': 'Scroll Down in Terminal',
  'Terminal leeren': 'Clear Terminal',
  'Vorheriges Terminal': 'Previous Terminal',
  'Nächstes Terminal': 'Next Terminal',
  'Auswahl kopieren (Terminal)': 'Copy Selection (Terminal)',
  'In Terminal einfügen': 'Paste into Terminal',

  // VS Code - Git
  'Source Control öffnen': 'Open Source Control',
  'Git: Diff anzeigen': 'Git: Show Diff',
  'Commit (in Source Control)': 'Commit (in Source Control)',

  // VS Code - Refactoring
  'Code-Aktionen / Quick Fix': 'Code Actions / Quick Fix',
  'Refactoring-Menü öffnen': 'Open Refactoring Menu',
  'Alle Referenzen umbenennen': 'Rename All References',

  // VS Code - Snippets
  'Snippet-Vorschläge anzeigen': 'Show Snippet Suggestions',
  'Snippet einfügen/erweitern': 'Insert/Expand Snippet',
  'Zum vorherigen Snippet-Placeholder': 'Previous Snippet Placeholder',

  // VS Code - IntelliSense
  'Parameter-Hinweise anzeigen': 'Show Parameter Hints',
  'Quick Info anzeigen': 'Show Quick Info',
  'Vorschlag akzeptieren': 'Accept Suggestion',
  'Vorschlag akzeptieren (Tab)': 'Accept Suggestion (Tab)',
  'IntelliSense schließen': 'Close IntelliSense',

  // VS Code - Breadcrumbs
  'Breadcrumbs fokussieren': 'Focus Breadcrumbs',
  'Breadcrumb auswählen': 'Select Breadcrumb',
  'Zum vorherigen Breadcrumb': 'Previous Breadcrumb',
  'Zum nächsten Breadcrumb': 'Next Breadcrumb',

  // VS Code - Problems
  'Problems-Panel umschalten': 'Toggle Problems Panel',

  // VS Code - Output
  'Output-Panel anzeigen': 'Show Output Panel',
  'Debug Console anzeigen': 'Show Debug Console',

  // VS Code - Workspace
  'Ordner in neuem Fenster öffnen': 'Open Folder in New Window',
  'Ordner aus Workspace entfernen': 'Remove Folder from Workspace',
  'Aktive Datei in neuem Fenster': 'Open Active File in New Window',

  // macOS - System
  'Spotlight öffnen': 'Open Spotlight',
  'Screenshot (ganzer Bildschirm)': 'Screenshot (Full Screen)',
  'Screenshot (Auswahl)': 'Screenshot (Selection)',
  'Screenshot (Fenster)': 'Screenshot (Window)',
  'Screenshot-Werkzeug öffnen': 'Open Screenshot Tool',
  'Screenshot Touch Bar': 'Screenshot Touch Bar',
  'App wechseln (vorwärts)': 'Switch App (Forward)',
  'App wechseln (rückwärts)': 'Switch App (Backward)',
  'Zwischen Fenstern einer App wechseln': 'Switch Between Windows of App',
  'App beenden': 'Quit App',
  'App ausblenden': 'Hide App',
  'Andere Apps ausblenden': 'Hide Other Apps',
  'Fenster minimieren': 'Minimize Window',
  'Alle Fenster minimieren': 'Minimize All Windows',
  'Fenster/Tab schließen': 'Close Window/Tab',
  'Alle Fenster schließen': 'Close All Windows',
  'Einstellungen der App': 'App Settings',
  'Sofort beenden Dialog': 'Force Quit Dialog',
  'Bildschirm sperren': 'Lock Screen',
  'Mac neu starten': 'Restart Mac',
  'Bildschirme ausschalten': 'Turn Off Displays',
  'Alle Apps beenden und neu starten': 'Quit All Apps and Restart',
  'Mac in Ruhezustand': 'Put Mac to Sleep',
  'Emoji & Symbole': 'Emoji & Symbols',

  // macOS - Finder
  'Neues Finder-Fenster': 'New Finder Window',
  'Neuen Ordner erstellen': 'Create New Folder',
  'Neuer intelligenter Ordner': 'New Smart Folder',
  'Neuer Tab': 'New Tab',
  'In Papierkorb verschieben': 'Move to Trash',
  'Papierkorb leeren': 'Empty Trash',
  'Sofort löschen (ohne Papierkorb)': 'Delete Immediately (Without Trash)',
  Öffnen: 'Open',
  'Informationen anzeigen': 'Get Info',
  'Informationen (ein Fenster für alle)': 'Get Info (Single Window)',
  Duplizieren: 'Duplicate',
  'Volume auswerfen': 'Eject Volume',
  'Quick Look': 'Quick Look',
  'Quick Look (Alternative)': 'Quick Look (Alternative)',
  'Versteckte Dateien anzeigen/verbergen': 'Show/Hide Hidden Files',
  'Gehe zu Ordner...': 'Go to Folder...',
  'Übergeordneten Ordner öffnen': 'Open Parent Folder',
  'Ausgewähltes Element öffnen': 'Open Selected Item',
  'Übergeordneten Ordner in neuem Fenster': 'Open Parent in New Window',
  'Symbol-Ansicht': 'Icon View',
  'Listen-Ansicht': 'List View',
  'Spalten-Ansicht': 'Column View',
  'Galerie-Ansicht': 'Gallery View',
  Darstellungsoptionen: 'View Options',
  'Mit Server verbinden': 'Connect to Server',
  'Alias erstellen': 'Create Alias',
  'Original anzeigen (bei Alias)': 'Show Original (for Alias)',
  Suchen: 'Search',
  Zurück: 'Back',
  Vorwärts: 'Forward',

  // macOS - Finder Quick Access
  'Programme-Ordner': 'Applications Folder',
  Computer: 'Computer',
  Schreibtisch: 'Desktop',
  'Alle meine Dateien': 'All My Files',
  'Gehe zu Ordner': 'Go to Folder',
  Benutzerordner: 'Home Folder',
  'iCloud Drive': 'iCloud Drive',
  Netzwerk: 'Network',
  Dokumente: 'Documents',
  AirDrop: 'AirDrop',
  Dienstprogramme: 'Utilities',
  Downloads: 'Downloads',

  // macOS - Text
  Kopieren: 'Copy',
  Ausschneiden: 'Cut',
  'Einfügen ohne Formatierung': 'Paste Without Formatting',
  'Einfügen mit Stil anpassen': 'Paste and Match Style',
  Fett: 'Bold',
  Kursiv: 'Italic',
  Unterstrichen: 'Underline',
  'Schriften einblenden': 'Show Fonts',
  Weitersuchen: 'Find Next',
  'Rückwärts suchen': 'Find Previous',
  'Auswahl zum Suchen verwenden': 'Use Selection for Find',
  'Zur Auswahl springen': 'Jump to Selection',
  'Rechtschreibung prüfen': 'Check Spelling',
  'Rechtschreibung und Grammatik': 'Spelling and Grammar',

  // macOS - Text Navigation
  'Zum Dokumentanfang': 'Go to Start of Document',
  'Zum Dokumentende': 'Go to End of Document',
  'Ein Wort zurück': 'One Word Back',
  'Ein Wort vor': 'One Word Forward',
  'Zum Zeilenanfang (Emacs)': 'Go to Start of Line (Emacs)',
  'Zum Zeilenende (Emacs)': 'Go to End of Line (Emacs)',
  'Eine Zeile hoch': 'One Line Up',
  'Eine Zeile runter': 'One Line Down',
  'Ein Zeichen zurück': 'One Character Back',
  'Ein Zeichen vor': 'One Character Forward',
  'Zeichen nach Cursor löschen': 'Delete Character After Cursor',
  'Text bis Zeilenende löschen': 'Delete to End of Line',
  'Zeichen vor Cursor löschen': 'Delete Character Before Cursor',
  'Neue Zeile nach Cursor': 'New Line After Cursor',
  'Entf (Forward Delete)': 'Forward Delete',
  'Wort löschen': 'Delete Word',
  'Bis Zeilenanfang löschen': 'Delete to Start of Line',

  // macOS - Mission Control
  'App-Fenster anzeigen': 'Show App Windows',
  'Einen Space nach links': 'Move One Space Left',
  'Einen Space nach rechts': 'Move One Space Right',
  'Zu Space 1 wechseln': 'Switch to Space 1',
  'Zu Space 2 wechseln': 'Switch to Space 2',
  'Zu Space 3 wechseln': 'Switch to Space 3',
  'Schreibtisch anzeigen': 'Show Desktop',
  'Dashboard anzeigen': 'Show Dashboard',

  // macOS - Window
  'Vollbildmodus umschalten': 'Toggle Full Screen Mode',
  'Andere ausblenden': 'Hide Others',
  'Neues Fenster': 'New Window',

  // macOS - Safari
  'Adresszeile fokussieren': 'Focus Address Bar',
  'Tab schließen': 'Close Tab',
  'Letzten Tab wiederherstellen': 'Restore Last Tab',
  'Seite neu laden': 'Reload Page',
  'Seite ohne Cache neu laden': 'Reload Page Without Cache',
  'Lesezeichen-Leiste ein/aus': 'Toggle Bookmarks Bar',
  'Leseliste anzeigen': 'Show Reading List',
  'Lesezeichen hinzufügen': 'Add Bookmark',
  'Web-Suche (Google etc.)': 'Web Search (Google etc.)',
  'Zu Tab 1': 'Go to Tab 1',
  'Zu Tab 2': 'Go to Tab 2',
  'Zum letzten Tab': 'Go to Last Tab',
  'Tab-Übersicht': 'Tab Overview',
  'Web Inspector': 'Web Inspector',
  'JavaScript-Konsole': 'JavaScript Console',

  // macOS - Accessibility
  'VoiceOver ein/aus': 'Toggle VoiceOver',
  'Zoom ein/aus': 'Toggle Zoom',
  Vergrößern: 'Zoom In',
  Verkleinern: 'Zoom Out',
  'Farben umkehren': 'Invert Colors',
  'Tastatursteuerung aktivieren': 'Enable Keyboard Control',

  // macOS - Microsoft Word
  'Neues Dokument': 'New Document',
  'Dokument öffnen': 'Open Document',
  Speichern: 'Save',
  'Speichern unter': 'Save As',
  Drucken: 'Print',
  'Zentriert ausrichten': 'Center Align',
  'Links ausrichten': 'Left Align',
  'Rechts ausrichten': 'Right Align',
  Blocksatz: 'Justify',
  'Schrift vergrößern': 'Increase Font Size',
  'Schrift verkleinern': 'Decrease Font Size',
  'Hyperlink einfügen': 'Insert Hyperlink',
  KAPITÄLCHEN: 'Small Caps',
  'Schriftart Dialog': 'Font Dialog',
  'Formatierung entfernen': 'Remove Formatting',
  'Überschrift 1': 'Heading 1',
  'Überschrift 2': 'Heading 2',
  'Überschrift 3': 'Heading 3',
  Seitenumbruch: 'Page Break',
  Abschnittswechsel: 'Section Break',
  'Suchen und Ersetzen': 'Find and Replace',

  // macOS - Microsoft Excel
  'Neue Arbeitsmappe': 'New Workbook',
  'Arbeitsmappe öffnen': 'Open Workbook',
  'Spalte auswählen': 'Select Column',
  'Zeile auswählen': 'Select Row',
  'Zeile/Spalte einfügen': 'Insert Row/Column',
  'Zeile/Spalte löschen': 'Delete Row/Column',
  Währungsformat: 'Currency Format',
  Prozentformat: 'Percentage Format',
  Datumsformat: 'Date Format',
  Zahlenformat: 'Number Format',
  'Zelle bearbeiten': 'Edit Cell',
  'Eingabe bestätigen (runter)': 'Confirm Input (Down)',
  'Eingabe bestätigen (rechts)': 'Confirm Input (Right)',
  'Eingabe abbrechen': 'Cancel Input',
  AutoSumme: 'AutoSum',
  'Formeln anzeigen/verbergen': 'Show/Hide Formulas',
  'Zu Zelle A1': 'Go to Cell A1',
  'Zur letzten Zelle': 'Go to Last Cell',
  'Gehe zu Zelle': 'Go to Cell',
  'Absoluter/Relativer Zellbezug': 'Toggle Absolute/Relative Reference',
  'Aktuelles Datum einfügen': 'Insert Current Date',
  'Aktuelle Uhrzeit einfügen': 'Insert Current Time',
  AutoFilter: 'AutoFilter',
  'AutoSumme (Alternative)': 'AutoSum (Alternative)',

  // macOS - Microsoft PowerPoint
  'Neue Präsentation': 'New Presentation',
  'Präsentation öffnen': 'Open Presentation',
  'Neue Folie': 'New Slide',
  'Folie duplizieren': 'Duplicate Slide',
  'Präsentation starten (Anfang)': 'Start Presentation (Beginning)',
  'Präsentation starten (aktuelle Folie)': 'Start Presentation (Current Slide)',
  'Präsentation beenden': 'End Presentation',
  'Nächste Folie (Präsentation)': 'Next Slide (Presentation)',
  'Vorherige Folie (Präsentation)': 'Previous Slide (Presentation)',
  'Schwarzer Bildschirm': 'Black Screen',
  'Weißer Bildschirm': 'White Screen',
  'Objekte gruppieren': 'Group Objects',
  'Gruppierung aufheben': 'Ungroup Objects',
  Zentriert: 'Center',
  'Objekt duplizieren': 'Duplicate Object',
  'In Vordergrund': 'Bring to Front',
  'In Hintergrund': 'Send to Back',
  'Eine Ebene nach vorne': 'Bring Forward',
  'Eine Ebene nach hinten': 'Send Backward',

  // macOS - Special Characters
  'É (Akut)': 'É (Acute)',
  'Ü (Umlaut)': 'Ü (Umlaut)',
  'ß (Eszett)': 'ß (Eszett)',
  '© (Copyright)': '© (Copyright)',
  '® (Registered)': '® (Registered)',
  '™ (Trademark)': '™ (Trademark)',
  '• (Bullet)': '• (Bullet)',
  '– (Gedankenstrich)': '– (En Dash)',
  '— (langer Strich)': '— (Em Dash)',

  // IntelliJ - General
  'Aktion suchen': 'Find Action',
  'Überall suchen (Search Everywhere)': 'Search Everywhere',
  Projektstruktur: 'Project Structure',
  'Editor maximieren/minimieren': 'Toggle Editor Maximization',
  'Alles speichern': 'Save All',
  'Dateisystem synchronisieren': 'Synchronize File System',
  'Kürzlich ausgeführte Konfigurationen': 'Recent Run Configurations',
  'IDE beenden': 'Quit IDE',
  'Spaltenauswahl-Modus': 'Column Selection Mode',

  // IntelliJ - Navigation
  'Klasse öffnen': 'Open Class',
  'Symbol öffnen': 'Open Symbol',
  'Letzte Dateien': 'Recent Files',
  'Letzte Bearbeitungsstellen': 'Recent Edit Locations',
  'Zur Deklaration gehen': 'Go to Declaration',
  'Zur Implementierung gehen': 'Go to Implementation',
  'Zur Super-Methode/Klasse gehen': 'Go to Super Method/Class',
  'Zum Typ gehen': 'Go to Type',
  'Zum nächsten Fehler': 'Go to Next Error',
  'Zum vorherigen Fehler': 'Go to Previous Error',
  'Zur letzten Position': 'Go to Last Position',
  'Zur nächsten Position': 'Go to Next Position',
  'Dateistruktur anzeigen': 'Show File Structure',
  'Typ-Hierarchie': 'Type Hierarchy',
  'Methoden-Hierarchie': 'Method Hierarchy',
  'Aufruf-Hierarchie': 'Call Hierarchy',
  'Zur Navigationsleiste': 'Go to Navigation Bar',
  'Quelle bearbeiten': 'Edit Source',
  'Quelle anzeigen': 'View Source',
  'Datei in View auswählen': 'Select File in View',
  'Terminal öffnen': 'Open Terminal',

  // IntelliJ - Editing
  'Zeile duplizieren': 'Duplicate Line',
  'Statement vervollständigen': 'Complete Statement',
  'Statement nach oben verschieben': 'Move Statement Up',
  'Statement nach unten verschieben': 'Move Statement Down',
  'Zeilen-Kommentar': 'Line Comment',
  'Block-Kommentar': 'Block Comment',
  'Code formatieren': 'Format Code',
  'Einrückung korrigieren': 'Correct Indentation',
  'Imports optimieren': 'Optimize Imports',
  'Code-Block aufklappen': 'Expand Code Block',
  'Code-Block zuklappen': 'Collapse Code Block',
  'Alle aufklappen': 'Expand All',
  'Alle zuklappen': 'Collapse All',

  // IntelliJ - Code Intelligence
  'Basic Autocomplete': 'Basic Autocomplete',
  'Smart Autocomplete': 'Smart Autocomplete',
  'Parameter-Info': 'Parameter Info',
  'Quick Documentation': 'Quick Documentation',
  'Code generieren (Generate)': 'Generate Code',
  'Methoden überschreiben': 'Override Methods',
  'Methoden implementieren': 'Implement Methods',
  'Surround with...': 'Surround with...',
  'Intention Actions / Quick Fix': 'Intention Actions / Quick Fix',
  'Live Template einfügen': 'Insert Live Template',
  'Mit Live Template umschließen': 'Surround with Live Template',
  'Externe Dokumentation': 'External Documentation',

  // IntelliJ - Selection
  'Nächstes Vorkommen auswählen': 'Select Next Occurrence',
  'Auswahl aufheben': 'Deselect',

  // IntelliJ - Refactoring
  Umbenennen: 'Rename',
  'Signatur ändern': 'Change Signature',
  Inline: 'Inline',
  'Methode extrahieren': 'Extract Method',
  'Variable extrahieren': 'Extract Variable',
  'Feld extrahieren': 'Extract Field',
  'Konstante extrahieren': 'Extract Constant',
  'Parameter extrahieren': 'Extract Parameter',
  'Refactor This (Menü)': 'Refactor This (Menu)',
  Verschieben: 'Move',
  'Safe Delete': 'Safe Delete',

  // IntelliJ - Search
  Ersetzen: 'Replace',
  'Nächstes Vorkommen': 'Next Occurrence',
  'Vorheriges Vorkommen': 'Previous Occurrence',
  'Verwendungen finden': 'Find Usages',
  'Verwendungen anzeigen': 'Show Usages',
  'Verwendungen in Datei hervorheben': 'Highlight Usages in File',

  // IntelliJ - Run & Debug
  Ausführen: 'Run',
  'Debug starten': 'Start Debug',
  'Konfiguration wählen und ausführen': 'Select Configuration and Run',
  'Konfiguration wählen und debuggen': 'Select Configuration and Debug',
  Stoppen: 'Stop',
  'Force Step Into': 'Force Step Into',
  'Zum Cursor ausführen': 'Run to Cursor',
  'Weiter (Resume)': 'Resume',
  'Breakpoints anzeigen': 'Show Breakpoints',
  'Ausdruck auswerten': 'Evaluate Expression',
  'Ausführungskonfiguration bearbeiten': 'Edit Run Configuration',

  // IntelliJ - Git
  Commit: 'Commit',
  Push: 'Push',
  'Update/Pull': 'Update/Pull',
  'VCS-Operationen-Menü': 'VCS Operations Menu',
  'Datei zu VCS hinzufügen': 'Add File to VCS',
  'Diff anzeigen': 'Show Diff',
  'Änderungen verwerfen': 'Discard Changes',
  'Commit-Verlauf': 'Commit History',
  'Annotate (Blame)': 'Annotate (Blame)',

  // IntelliJ - Tool Windows
  'Projekt-Fenster': 'Project Window',
  Favoriten: 'Favorites',
  'Find-Fenster': 'Find Window',
  'Run-Fenster': 'Run Window',
  'Debug-Fenster': 'Debug Window',
  'Problems-Fenster': 'Problems Window',
  'Struktur-Fenster': 'Structure Window',
  'Services-Fenster': 'Services Window',
  'Git-Fenster': 'Git Window',
  'Alle Tool-Fenster verbergen': 'Hide All Tool Windows',
  'Zurück zum Editor': 'Return to Editor',
  'Tool-Fenster schließen und fokussieren': 'Close and Focus Tool Window',

  // IntelliJ - Bookmarks
  'Lesezeichen umschalten': 'Toggle Bookmark',
  'Lesezeichen mit Mnemonik': 'Bookmark with Mnemonic',
  'Zu Lesezeichen 0 gehen': 'Go to Bookmark 0',
  'Alle Lesezeichen anzeigen': 'Show All Bookmarks',

  // IntelliJ - Tabs
  'Vorheriger Tab': 'Previous Tab',
  'Nächster Tab': 'Next Tab',

  // IntelliJ - Live Templates
  'Code mit Template umschließen': 'Surround with Template',

  // IntelliJ - Multi-Cursor
  'Cursor hinzufügen': 'Add Cursor',
  'Mehrere Cursor (gedrückt halten + Pfeile)': 'Multiple Cursors (Hold + Arrows)',

  // Chrome DevTools
  'DevTools öffnen/schließen': 'Open/Close DevTools',
  'Console öffnen': 'Open Console',
  'Element untersuchen': 'Inspect Element',
  'Element-Selektor': 'Element Selector',
  'Command Menu': 'Command Menu',
  'Device Mode umschalten': 'Toggle Device Mode',
  'Drawer umschalten': 'Toggle Drawer',
  'Dock-Position wechseln': 'Change Dock Position',
  'Vorheriges Panel': 'Previous Panel',
  'Nächstes Panel': 'Next Panel',
  'Element auswählen': 'Select Element',
  'Element auf-/zuklappen': 'Expand/Collapse Element',
  'Attribut bearbeiten': 'Edit Attribute',
  'Nächstes Attribut': 'Next Attribute',
  'Element verstecken': 'Hide Element',
  'Als HTML bearbeiten': 'Edit as HTML',
  'Element löschen': 'Delete Element',
  'Eigenschaft bearbeiten': 'Edit Property',
  'Nächste Eigenschaft': 'Next Property',
  'Farbformat wechseln': 'Change Color Format',
  'Wert um 1 ändern': 'Change Value by 1',
  'Wert um 10 ändern': 'Change Value by 10',
  'Wert um 100 ändern': 'Change Value by 100',
  'Wert um 0.1 ändern': 'Change Value by 0.1',
  'Console leeren': 'Clear Console',
  Autovervollständigung: 'Autocomplete',
  'Vorherige Befehle': 'Previous Commands',
  'Ausdruck ausführen': 'Execute Expression',
  'Mehrzeilige Eingabe': 'Multi-line Input',
  'Pausieren/Fortsetzen': 'Pause/Resume',
  'Breakpoint setzen': 'Set Breakpoint',
  'Breakpoint aktivieren/deaktivieren': 'Enable/Disable Breakpoint',
  'Alle Breakpoints deaktivieren': 'Disable All Breakpoints',
  'Zu Funktion gehen': 'Go to Function',
  'Recording starten/stoppen': 'Start/Stop Recording',
  'Requests löschen': 'Clear Requests',
  'Ausgewählten Request wiederholen': 'Repeat Selected Request',
  'In Requests suchen': 'Search Requests',
  'Profil speichern': 'Save Profile',
  'Profil laden': 'Load Profile',

  // Vim - Modes
  'Insert Mode (vor Cursor)': 'Insert Mode (Before Cursor)',
  'Insert am Zeilenanfang': 'Insert at Line Start',
  'Append (nach Cursor)': 'Append (After Cursor)',
  'Append am Zeilenende': 'Append at Line End',
  'Neue Zeile darunter': 'New Line Below',
  'Neue Zeile darüber': 'New Line Above',
  'Normal Mode': 'Normal Mode',
  'Visual Mode': 'Visual Mode',
  'Visual Line Mode': 'Visual Line Mode',
  'Visual Block Mode': 'Visual Block Mode',

  // Vim - Navigation
  Links: 'Left',
  Runter: 'Down',
  Hoch: 'Up',
  Rechts: 'Right',
  'Nächstes Wort': 'Next Word',
  'Vorheriges Wort': 'Previous Word',
  Wortende: 'End of Word',
  Zeilenanfang: 'Start of Line',
  'Erstes Zeichen': 'First Character',
  Dateianfang: 'Start of File',
  Dateiende: 'End of File',
  'Zu Zeile n': 'Go to Line n',
  'Passende Klammer': 'Matching Bracket',
  'Seite vor': 'Page Down',
  'Seite zurück': 'Page Up',

  // Vim - Editing
  'Zeichen löschen': 'Delete Character',
  'Bis Zeilenende löschen': 'Delete to End of Line',
  'Zeile kopieren': 'Copy Line',
  'Wort kopieren': 'Copy Word',
  'Nach Cursor einfügen': 'Paste After Cursor',
  'Vor Cursor einfügen': 'Paste Before Cursor',
  'Letzten Befehl wiederholen': 'Repeat Last Command',
  'Zeichen ersetzen': 'Replace Character',
  'Replace Mode': 'Replace Mode',
  'Wort ändern': 'Change Word',
  'Zeile ändern': 'Change Line',
  Einrücken: 'Indent',
  Ausrücken: 'Outdent',

  // Vim - Search
  'Vorwärts suchen': 'Search Forward',
  'Rückwärts suchen (Vim)': 'Search Backward',
  'Nächstes Ergebnis': 'Next Result',
  'Vorheriges Ergebnis': 'Previous Result',
  'Wort unter Cursor suchen': 'Search Word Under Cursor',
  'In Zeile ersetzen': 'Replace in Line',
  'Global ersetzen': 'Replace Globally',

  // Vim - Files
  Beenden: 'Quit',
  'Speichern und beenden': 'Save and Quit',
  'Ohne speichern beenden': 'Quit Without Saving',

  // Xcode
  'Quick Open': 'Quick Open',
  'Im Navigator zeigen': 'Reveal in Navigator',
  Einstellungen: 'Preferences',
  'Navigator ein/aus': 'Toggle Navigator',
  'Utilities ein/aus': 'Toggle Utilities',
  'Debug-Bereich ein/aus': 'Toggle Debug Area',
  Build: 'Build',
  Run: 'Run',
  Stop: 'Stop',
  'Tests ausführen': 'Run Tests',
  'Clean Build Folder': 'Clean Build Folder',
  Analyze: 'Analyze',
  'Run ohne Build': 'Run Without Building',
  'Project Navigator': 'Project Navigator',
  'Source Control Navigator': 'Source Control Navigator',
  'Symbol Navigator': 'Symbol Navigator',
  'Find Navigator': 'Find Navigator',
  'Issue Navigator': 'Issue Navigator',
  'Test Navigator': 'Test Navigator',
  'Debug Navigator': 'Debug Navigator',
  'Breakpoint Navigator': 'Breakpoint Navigator',
  'Report Navigator': 'Report Navigator',
  'Zur Definition': 'Go to Definition',
  'Kommentar umschalten': 'Toggle Comment',
  'Einrücken links': 'Indent Left',
  'Einrücken rechts': 'Indent Right',
  'Code falten': 'Fold Code',
  'Code auffalten': 'Unfold Code',
  'Breakpoints aktivieren/deaktivieren': 'Enable/Disable Breakpoints',
  Continue: 'Continue',
  'Assistant Editor': 'Assistant Editor',
  'Standard Editor': 'Standard Editor',
  'Size to Fit': 'Size to Fit',
  'File Inspector': 'File Inspector',
  'Attributes Inspector': 'Attributes Inspector',
  'Size Inspector': 'Size Inspector',
  'Library öffnen': 'Open Library',

  // Terminal Commands - additional descriptions would go here
  // Git Commands, Docker Commands, NPM Commands, Homebrew Commands
  // (These are already largely technical terms that don't need translation)
};

/**
 * Collection name translations
 */
export const COLLECTION_TRANSLATIONS: Record<string, { name: string; description: string }> = {
  vscode: {
    name: 'VS Code',
    description: 'Visual Studio Code keyboard shortcuts for macOS',
  },
  macos: {
    name: 'macOS',
    description: 'macOS system keyboard shortcuts',
  },
  intellij: {
    name: 'IntelliJ IDEA',
    description: 'IntelliJ IDEA / JetBrains IDE keyboard shortcuts',
  },
  devtools: {
    name: 'Chrome DevTools',
    description: 'Chrome Developer Tools keyboard shortcuts',
  },
  vim: {
    name: 'Vim',
    description: 'Vim editor basic commands',
  },
  xcode: {
    name: 'Xcode',
    description: 'Xcode IDE keyboard shortcuts for iOS/macOS development',
  },
  terminal: {
    name: 'Terminal',
    description: 'Shell commands for macOS Terminal (zsh/bash)',
  },
  git: {
    name: 'Git',
    description: 'Git version control commands',
  },
  docker: {
    name: 'Docker',
    description: 'Docker container commands',
  },
  npm: {
    name: 'NPM / Yarn',
    description: 'Node Package Manager commands',
  },
  homebrew: {
    name: 'Homebrew',
    description: 'macOS package manager',
  },
};

/**
 * Get translated description based on language
 */
export function getTranslatedDescription(description: string, language: 'en' | 'de'): string {
  if (language === 'de') {
    return description;
  }
  return DESCRIPTION_TRANSLATIONS[description] || description;
}

/**
 * Get translated category based on language
 */
export function getTranslatedCategory(category: string, language: 'en' | 'de'): string {
  if (language === 'de') {
    return category;
  }
  return CATEGORY_TRANSLATIONS[category] || category;
}

/**
 * Get translated collection info based on language
 */
export function getTranslatedCollectionInfo(
  collectionId: string,
  language: 'en' | 'de'
): { name: string; description: string } | undefined {
  if (language === 'de') {
    const collection =
      ALL_SHORTCUT_COLLECTIONS.find(c => c.id === collectionId) ||
      ALL_COMMAND_COLLECTIONS.find(c => c.id === collectionId);
    if (collection) {
      return { name: collection.name, description: collection.description };
    }
    return undefined;
  }
  return COLLECTION_TRANSLATIONS[collectionId];
}
