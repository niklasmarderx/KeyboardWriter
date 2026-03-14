import { LessonType } from '../domain/enums';
import { Lesson, LessonCategory, ProgrammingLesson, ShortcutLesson } from '../domain/models';

/**
 * ============================================================================
 * BEGINNER LESSONS - Level 1 (Absolute Anfänger)
 * Nur Grundreihe, sehr einfache Wiederholungen
 * ============================================================================
 */
export const BEGINNER_LESSONS: Lesson[] = [
  // ========== HOME ROW INTRODUCTION ==========
  {
    id: 'beginner-01',
    title: 'Erste Schritte: F und J',
    description: 'Lerne die wichtigsten Tasten: F und J haben Erhebungen zur Orientierung',
    type: LessonType.BASICS,
    category: 'beginner',
    level: 1,
    targetWPM: 10,
    targetAccuracy: 95,
    requiredKeys: ['f', 'j'],
    exercises: [
      { id: 'beg-01-01', text: 'fff jjj fff jjj fff jjj', description: 'F und J üben' },
      { id: 'beg-01-02', text: 'fj fj fj fj fj fj fj fj', description: 'Wechsel F-J' },
      { id: 'beg-01-03', text: 'jf jf jf jf jf jf jf jf', description: 'Wechsel J-F' },
      { id: 'beg-01-04', text: 'ff jj ff jj ff jj ff jj', description: 'Doppel-Anschläge' },
      { id: 'beg-01-05', text: 'fjfj fjfj fjfj fjfj fjfj', description: 'Schneller Wechsel' },
    ],
  },
  {
    id: 'beginner-02',
    title: 'Linke Hand: A S D F',
    description: 'Die linke Hand auf der Grundposition',
    type: LessonType.BASICS,
    category: 'beginner',
    level: 1,
    targetWPM: 12,
    targetAccuracy: 92,
    requiredKeys: ['a', 's', 'd', 'f'],
    exercises: [
      { id: 'beg-02-01', text: 'aaa sss ddd fff aaa sss ddd fff', description: 'Einzelne Finger' },
      { id: 'beg-02-02', text: 'asdf asdf asdf asdf asdf', description: 'Alle vier Finger' },
      { id: 'beg-02-03', text: 'fdsa fdsa fdsa fdsa fdsa', description: 'Rückwärts' },
      { id: 'beg-02-04', text: 'asd asd asd dsa dsa dsa', description: 'Drei Finger' },
      { id: 'beg-02-05', text: 'sad sad sad das das das', description: 'Erste Wörter' },
      { id: 'beg-02-06', text: 'fad fad fad dad dad dad', description: 'Weitere Wörter' },
    ],
  },
  {
    id: 'beginner-03',
    title: 'Rechte Hand: J K L Ö',
    description: 'Die rechte Hand auf der Grundposition',
    type: LessonType.BASICS,
    category: 'beginner',
    level: 1,
    targetWPM: 12,
    targetAccuracy: 92,
    requiredKeys: ['j', 'k', 'l', 'ö'],
    exercises: [
      { id: 'beg-03-01', text: 'jjj kkk lll ööö jjj kkk lll ööö', description: 'Einzelne Finger' },
      { id: 'beg-03-02', text: 'jklö jklö jklö jklö jklö', description: 'Alle vier Finger' },
      { id: 'beg-03-03', text: 'ölkj ölkj ölkj ölkj ölkj', description: 'Rückwärts' },
      { id: 'beg-03-04', text: 'jkl jkl jkl lkj lkj lkj', description: 'Drei Finger' },
      { id: 'beg-03-05', text: 'öl öl öl lök lök lök', description: 'Kombinationen' },
    ],
  },
  {
    id: 'beginner-04',
    title: 'Grundreihe komplett',
    description: 'Beide Hände zusammen auf der Grundreihe',
    type: LessonType.BASICS,
    category: 'beginner',
    level: 1,
    targetWPM: 15,
    targetAccuracy: 90,
    requiredKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ö'],
    exercises: [
      { id: 'beg-04-01', text: 'asdf jklö asdf jklö asdf jklö', description: 'Grundposition' },
      { id: 'beg-04-02', text: 'fjdk slöa fjdk slöa fjdk slöa', description: 'Handwechsel' },
      { id: 'beg-04-03', text: 'asdfjklö asdfjklö asdfjklö', description: 'Durchlauf' },
      { id: 'beg-04-04', text: 'ölkjfdsa ölkjfdsa ölkjfdsa', description: 'Rückwärts' },
      { id: 'beg-04-05', text: 'af af aj aj ak ak al al', description: 'Handwechsel kurz' },
      { id: 'beg-04-06', text: 'sj sk sl dk dl fl fö', description: 'Verschiedene Kombinationen' },
    ],
  },
  {
    id: 'beginner-05',
    title: 'Erste einfache Wörter',
    description: 'Wörter nur mit Grundreihe-Buchstaben',
    type: LessonType.BASICS,
    category: 'beginner',
    level: 1,
    targetWPM: 15,
    targetAccuracy: 90,
    requiredKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ö'],
    exercises: [
      { id: 'beg-05-01', text: 'das das das das das das', description: 'Wort: das' },
      { id: 'beg-05-02', text: 'lass lass lass lass lass', description: 'Wort: lass' },
      { id: 'beg-05-03', text: 'fall fall fall fall fall', description: 'Wort: fall' },
      { id: 'beg-05-04', text: 'all all all all all all', description: 'Wort: all' },
      { id: 'beg-05-05', text: 'das lass fall all das lass', description: 'Wörter gemischt' },
      { id: 'beg-05-06', text: 'salsa salsa falls falls', description: 'Längere Wörter' },
    ],
  },
  {
    id: 'beginner-06',
    title: 'G und H hinzufügen',
    description: 'Die Zeigefinger bewegen sich zur Mitte',
    type: LessonType.BASICS,
    category: 'beginner',
    level: 1,
    targetWPM: 15,
    targetAccuracy: 88,
    requiredKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö'],
    exercises: [
      { id: 'beg-06-01', text: 'fg fg fg hj hj hj fg hj fg hj', description: 'G und H einführen' },
      { id: 'beg-06-02', text: 'fgh fgh fgh ghf ghf ghf', description: 'Zusammen' },
      { id: 'beg-06-03', text: 'glas glas glas halb halb halb', description: 'Wörter mit G/H' },
      { id: 'beg-06-04', text: 'asdfg hjklö asdfg hjklö', description: 'Erweiterte Grundreihe' },
      { id: 'beg-06-05', text: 'das glas fällt das glas fällt', description: 'Sätze' },
      { id: 'beg-06-06', text: 'halb glas halb glas halb glas', description: 'Kombinationen' },
    ],
  },
  // ========== SPACEBAR INTRODUCTION ==========
  {
    id: 'beginner-07',
    title: 'Die Leertaste',
    description: 'Lerne die Leertaste mit dem Daumen zu bedienen',
    type: LessonType.BASICS,
    category: 'beginner',
    level: 1,
    targetWPM: 15,
    targetAccuracy: 90,
    requiredKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', ' '],
    exercises: [
      { id: 'beg-07-01', text: 'a a a s s s d d d f f f', description: 'Leertaste links' },
      { id: 'beg-07-02', text: 'j j j k k k l l l ö ö ö', description: 'Leertaste rechts' },
      { id: 'beg-07-03', text: 'das das das das das das', description: 'Wörter getrennt' },
      { id: 'beg-07-04', text: 'all das fall glas halb lad', description: 'Verschiedene Wörter' },
      { id: 'beg-07-05', text: 'das glas das glas das glas', description: 'Zwei Wörter' },
      { id: 'beg-07-06', text: 'lass das glas halb fall', description: 'Satzteile' },
    ],
  },
  // ========== SHORT SENTENCES ==========
  {
    id: 'beginner-08',
    title: 'Ganz kurze Sätze',
    description: 'Erste vollständige Sätze mit Grundreihe',
    type: LessonType.BASICS,
    category: 'beginner',
    level: 1,
    targetWPM: 18,
    targetAccuracy: 88,
    requiredKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', ' '],
    exercises: [
      { id: 'beg-08-01', text: 'das glas fällt', description: 'Kurzer Satz 1' },
      { id: 'beg-08-02', text: 'lass das glas', description: 'Kurzer Satz 2' },
      { id: 'beg-08-03', text: 'das halb glas', description: 'Kurzer Satz 3' },
      { id: 'beg-08-04', text: 'all das glas fällt halb', description: 'Längerer Satz' },
      { id: 'beg-08-05', text: 'falls das glas fällt lass', description: 'Noch länger' },
    ],
  },
];

/**
 * ============================================================================
 * BASIC LESSONS - Level 2-3 (Grundlagen erweitern)
 * Obere und untere Reihe hinzufügen
 * ============================================================================
 */
export const BASIC_LESSONS: Lesson[] = [
  // ========== TOP ROW INTRODUCTION ==========
  {
    id: 'basics-01',
    title: 'Obere Reihe: E und I',
    description: 'Die wichtigsten Vokale auf der oberen Reihe',
    type: LessonType.BASICS,
    category: 'basics',
    level: 2,
    targetWPM: 18,
    targetAccuracy: 88,
    requiredKeys: ['e', 'i'],
    exercises: [
      { id: 'bas-01-01', text: 'eee iii eee iii eee iii', description: 'E und I üben' },
      { id: 'bas-01-02', text: 'ei ei ei ie ie ie ei ie', description: 'Wechsel' },
      { id: 'bas-01-03', text: 'die die die sie sie sie', description: 'Erste Wörter' },
      { id: 'bas-01-04', text: 'sei lei fei dei sei lei', description: 'Kombinationen' },
      { id: 'bas-01-05', text: 'die sie die sie die sie', description: 'Wortpaare' },
    ],
  },
  {
    id: 'basics-02',
    title: 'Obere Reihe: R und U',
    description: 'Zeigefinger auf der oberen Reihe',
    type: LessonType.BASICS,
    category: 'basics',
    level: 2,
    targetWPM: 18,
    targetAccuracy: 88,
    requiredKeys: ['r', 'u'],
    exercises: [
      { id: 'bas-02-01', text: 'rrr uuu rrr uuu rrr uuu', description: 'R und U üben' },
      { id: 'bas-02-02', text: 'ru ru ur ur ru ur ru ur', description: 'Wechsel' },
      { id: 'bas-02-03', text: 'ruf ruf ruf fur fur fur', description: 'Wörter' },
      { id: 'bas-02-04', text: 'ruhe ruhe rufe rufe ruhe', description: 'Längere Wörter' },
      { id: 'bas-02-05', text: 'der die das der die das', description: 'Artikel' },
    ],
  },
  {
    id: 'basics-03',
    title: 'Obere Reihe komplett',
    description: 'Alle Buchstaben der oberen Reihe: QWERTZUIOP',
    type: LessonType.BASICS,
    category: 'basics',
    level: 2,
    targetWPM: 20,
    targetAccuracy: 85,
    requiredKeys: ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p'],
    exercises: [
      { id: 'bas-03-01', text: 'qwer tzui opü qwer tzui opü', description: 'Obere Reihe lernen' },
      { id: 'bas-03-02', text: 'wir rufen sie heute wieder', description: 'Kurze Sätze' },
      { id: 'bas-03-03', text: 'er ist dort wo er war', description: 'Einfache Sätze' },
      { id: 'bas-03-04', text: 'peter trifft otto peter trifft', description: 'Namen' },
      { id: 'bas-03-05', text: 'tier tier tier wort wort wort', description: 'Wörter üben' },
      { id: 'bas-03-06', text: 'reis reis weit weit zeit zeit', description: 'Mehr Wörter' },
    ],
  },
  // ========== BOTTOM ROW INTRODUCTION ==========
  {
    id: 'basics-04',
    title: 'Untere Reihe: N und M',
    description: 'Die wichtigsten Buchstaben der unteren Reihe',
    type: LessonType.BASICS,
    category: 'basics',
    level: 2,
    targetWPM: 18,
    targetAccuracy: 88,
    requiredKeys: ['n', 'm'],
    exercises: [
      { id: 'bas-04-01', text: 'nnn mmm nnn mmm nnn mmm', description: 'N und M üben' },
      { id: 'bas-04-02', text: 'nm nm mn mn nm mn nm mn', description: 'Wechsel' },
      { id: 'bas-04-03', text: 'name name mann mann name', description: 'Wörter' },
      { id: 'bas-04-04', text: 'nun nun man man nun man', description: 'Kurze Wörter' },
      { id: 'bas-04-05', text: 'mein mein nein nein mein', description: 'Wichtige Wörter' },
    ],
  },
  {
    id: 'basics-05',
    title: 'Untere Reihe komplett',
    description: 'Alle Buchstaben der unteren Reihe: YXCVBNM',
    type: LessonType.BASICS,
    category: 'basics',
    level: 2,
    targetWPM: 20,
    targetAccuracy: 85,
    requiredKeys: ['y', 'x', 'c', 'v', 'b', 'n', 'm'],
    exercises: [
      { id: 'bas-05-01', text: 'yxcv bnm yxcv bnm yxcv bnm', description: 'Untere Reihe lernen' },
      { id: 'bas-05-02', text: 'von vor nach neben zwischen', description: 'Präpositionen' },
      { id: 'bas-05-03', text: 'buch macht sinn buch macht', description: 'Wörter kombinieren' },
      { id: 'bas-05-04', text: 'max und moritz machen quatsch', description: 'Namen und Verben' },
      { id: 'bas-05-05', text: 'box mix vox nix box mix vox', description: 'X-Wörter' },
      { id: 'bas-05-06', text: 'cyber cyber cyber cyber cyber', description: 'Y-Wörter' },
    ],
  },
  // ========== ALLE BUCHSTABEN KOMBINIEREN ==========
  {
    id: 'basics-06',
    title: 'Alle Buchstaben zusammen',
    description: 'Übungen mit allen drei Reihen',
    type: LessonType.BASICS,
    category: 'basics',
    level: 3,
    targetWPM: 22,
    targetAccuracy: 85,
    exercises: [
      { id: 'bas-06-01', text: 'der die das ein eine einer einem', description: 'Artikel' },
      { id: 'bas-06-02', text: 'und oder aber denn weil wenn', description: 'Konjunktionen' },
      { id: 'bas-06-03', text: 'ist sind war waren wird werden', description: 'Hilfsverben' },
      { id: 'bas-06-04', text: 'ich du er sie es wir ihr sie', description: 'Pronomen' },
      { id: 'bas-06-05', text: 'haben sein werden können müssen', description: 'Modalverben' },
      { id: 'bas-06-06', text: 'gehen kommen sehen hören sprechen', description: 'Verben' },
    ],
  },
  {
    id: 'basics-07',
    title: 'Häufige Wörter Stufe 1',
    description: 'Die 50 häufigsten deutschen Wörter',
    type: LessonType.BASICS,
    category: 'basics',
    level: 3,
    targetWPM: 25,
    targetAccuracy: 88,
    exercises: [
      { id: 'bas-07-01', text: 'der die das und in zu den mit', description: 'Top 8 Wörter' },
      { id: 'bas-07-02', text: 'von auf ist sich nicht auch', description: 'Wörter 9-14' },
      { id: 'bas-07-03', text: 'er es an sie so wie eine', description: 'Wörter 15-21' },
      { id: 'bas-07-04', text: 'nur diese noch nach dem dann', description: 'Wörter 22-27' },
      { id: 'bas-07-05', text: 'wir aber bei ihr mir gegen', description: 'Wörter 28-33' },
      { id: 'bas-07-06', text: 'schon durch immer also sehr', description: 'Wörter 34-38' },
    ],
  },
  {
    id: 'basics-08',
    title: 'Großbuchstaben lernen',
    description: 'Die Shift-Taste für Großschreibung',
    type: LessonType.BASICS,
    category: 'basics',
    level: 3,
    targetWPM: 20,
    targetAccuracy: 90,
    exercises: [
      { id: 'bas-08-01', text: 'Anna Peter Hans Lisa Maria', description: 'Namen' },
      { id: 'bas-08-02', text: 'Berlin Hamburg München Köln', description: 'Städte' },
      { id: 'bas-08-03', text: 'Der Die Das Ein Eine Einer', description: 'Artikel groß' },
      { id: 'bas-08-04', text: 'Anna geht nach Berlin heute', description: 'Sätze mit Namen' },
      { id: 'bas-08-05', text: 'Peter und Lisa sind in Hamburg', description: 'Längerer Satz' },
    ],
  },
];

/**
 * ============================================================================
 * INTERMEDIATE LESSONS - Level 3-4 (Fortgeschrittene Grundlagen)
 * Zahlen und erste Sonderzeichen
 * ============================================================================
 */
export const INTERMEDIATE_LESSONS: Lesson[] = [
  // ========== ZAHLEN ==========
  {
    id: 'inter-01',
    title: 'Zahlen 1-5',
    description: 'Die Zahlen der linken Hand',
    type: LessonType.BASICS,
    category: 'intermediate',
    level: 3,
    targetWPM: 18,
    targetAccuracy: 90,
    requiredKeys: ['1', '2', '3', '4', '5'],
    exercises: [
      { id: 'int-01-01', text: '111 222 333 444 555 111 222', description: 'Einzelne Zahlen' },
      { id: 'int-01-02', text: '12345 12345 12345 12345', description: 'Reihenfolge' },
      { id: 'int-01-03', text: '54321 54321 54321 54321', description: 'Rückwärts' },
      { id: 'int-01-04', text: '13 24 35 42 51 13 24 35', description: 'Kombinationen' },
      { id: 'int-01-05', text: '12 Äpfel 34 Birnen 55 Euro', description: 'Mit Wörtern' },
    ],
  },
  {
    id: 'inter-02',
    title: 'Zahlen 6-0',
    description: 'Die Zahlen der rechten Hand',
    type: LessonType.BASICS,
    category: 'intermediate',
    level: 3,
    targetWPM: 18,
    targetAccuracy: 90,
    requiredKeys: ['6', '7', '8', '9', '0'],
    exercises: [
      { id: 'int-02-01', text: '666 777 888 999 000 666 777', description: 'Einzelne Zahlen' },
      { id: 'int-02-02', text: '67890 67890 67890 67890', description: 'Reihenfolge' },
      { id: 'int-02-03', text: '09876 09876 09876 09876', description: 'Rückwärts' },
      { id: 'int-02-04', text: '68 79 80 97 60 68 79 80', description: 'Kombinationen' },
      { id: 'int-02-05', text: '68 Prozent 90 Grad 100 Euro', description: 'Mit Wörtern' },
    ],
  },
  {
    id: 'inter-03',
    title: 'Alle Zahlen zusammen',
    description: 'Übungen mit allen Zahlen 0-9',
    type: LessonType.BASICS,
    category: 'intermediate',
    level: 3,
    targetWPM: 20,
    targetAccuracy: 88,
    requiredKeys: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    exercises: [
      { id: 'int-03-01', text: '1234567890 1234567890 1234567890', description: 'Alle Zahlen' },
      { id: 'int-03-02', text: '0987654321 0987654321 0987654321', description: 'Rückwärts' },
      { id: 'int-03-03', text: '2024 2025 2026 1990 1985 2000', description: 'Jahreszahlen' },
      { id: 'int-03-04', text: '100 200 300 500 750 1000 1500', description: 'Runde Zahlen' },
      { id: 'int-03-05', text: '3.14 2.71 1.41 9.81 6.67 8.31', description: 'Dezimalzahlen' },
      { id: 'int-03-06', text: '12:30 15:45 08:00 23:59 00:00', description: 'Uhrzeiten' },
    ],
  },
  // ========== PUNKT UND KOMMA ==========
  {
    id: 'inter-04',
    title: 'Punkt und Komma',
    description: 'Die wichtigsten Satzzeichen',
    type: LessonType.BASICS,
    category: 'intermediate',
    level: 3,
    targetWPM: 20,
    targetAccuracy: 88,
    requiredKeys: ['.', ','],
    exercises: [
      { id: 'int-04-01', text: 'Hallo, wie geht es dir heute.', description: 'Komma und Punkt' },
      { id: 'int-04-02', text: 'Rot, Blau, Grün, Gelb, Orange.', description: 'Aufzählung' },
      { id: 'int-04-03', text: 'Ja. Nein. Vielleicht. Genau.', description: 'Kurze Sätze' },
      { id: 'int-04-04', text: 'Eins, zwei, drei, vier, fünf.', description: 'Zahlen aufzählen' },
      { id: 'int-04-05', text: 'Er kam, sah und siegte.', description: 'Klassiker' },
    ],
  },
  {
    id: 'inter-05',
    title: 'Fragezeichen und Ausrufezeichen',
    description: 'Fragen stellen und ausrufen',
    type: LessonType.BASICS,
    category: 'intermediate',
    level: 4,
    targetWPM: 20,
    targetAccuracy: 88,
    requiredKeys: ['?', '!'],
    exercises: [
      { id: 'int-05-01', text: 'Wie geht es dir? Gut! Und dir?', description: 'Frage und Antwort' },
      { id: 'int-05-02', text: 'Was? Wann? Wo? Warum? Wer? Wie?', description: 'W-Fragen' },
      { id: 'int-05-03', text: 'Toll! Super! Klasse! Fantastisch!', description: 'Ausrufe' },
      { id: 'int-05-04', text: 'Kommst du? Ja! Wann? Jetzt! Wohin?', description: 'Dialog' },
      { id: 'int-05-05', text: 'Hilfe! Achtung! Stop! Los! Weiter!', description: 'Warnungen' },
    ],
  },
  {
    id: 'inter-06',
    title: 'Bindestrich und Apostroph',
    description: 'Zusammengesetzte Wörter und Auslassungen',
    type: LessonType.BASICS,
    category: 'intermediate',
    level: 4,
    targetWPM: 20,
    targetAccuracy: 88,
    requiredKeys: ['-', "'"],
    exercises: [
      { id: 'int-06-01', text: 'E-Mail On-line Up-to-date', description: 'Bindestriche' },
      { id: 'int-06-02', text: 'Nord-Süd Ost-West Alt-Neu', description: 'Gegensätze' },
      { id: 'int-06-03', text: "das geht's wie geht's gibt's", description: 'Auslassungen' },
      {
        id: 'int-06-04',
        text: 'Schritt-für-Schritt Tag-und-Nacht',
        description: 'Lange Verbindungen',
      },
      { id: 'int-06-05', text: "Das ist's gewesen. Wie geht's dir?", description: 'Im Satz' },
    ],
  },
  // ========== MEHR SONDERZEICHEN ==========
  {
    id: 'inter-07',
    title: 'Klammern',
    description: 'Runde und eckige Klammern',
    type: LessonType.BASICS,
    category: 'intermediate',
    level: 4,
    targetWPM: 18,
    targetAccuracy: 85,
    requiredKeys: ['(', ')', '[', ']'],
    exercises: [
      { id: 'int-07-01', text: '(das) (ist) (ein) (Test)', description: 'Runde Klammern' },
      { id: 'int-07-02', text: '[1] [2] [3] [a] [b] [c]', description: 'Eckige Klammern' },
      { id: 'int-07-03', text: 'Text (in Klammern) hier', description: 'Im Satz' },
      { id: 'int-07-04', text: 'Siehe [Anhang] für Details (wichtig)', description: 'Gemischt' },
      { id: 'int-07-05', text: '(a) erstes (b) zweites (c) drittes', description: 'Aufzählung' },
    ],
  },
  {
    id: 'inter-08',
    title: 'Anführungszeichen',
    description: 'Zitate und direkte Rede',
    type: LessonType.BASICS,
    category: 'intermediate',
    level: 4,
    targetWPM: 18,
    targetAccuracy: 85,
    requiredKeys: ['"'],
    exercises: [
      { id: 'int-08-01', text: '"Hallo" "Welt" "Test" "Ende"', description: 'Einzelne Wörter' },
      { id: 'int-08-02', text: 'Er sagte: "Das ist gut."', description: 'Direkte Rede' },
      { id: 'int-08-03', text: '"Wie geht es dir?" fragte sie.', description: 'Frage in Rede' },
      { id: 'int-08-04', text: 'Das Wort "Beispiel" bedeutet...', description: 'Zitat im Satz' },
      { id: 'int-08-05', text: '"Ja", sagte er, "das stimmt."', description: 'Unterbrochene Rede' },
    ],
  },
];

/**
 * ============================================================================
 * WORD LESSONS - Level 3-5 (Wortschatz aufbauen)
 * Wortübungen für Geschwindigkeit
 * ============================================================================
 */
export const WORD_LESSONS: Lesson[] = [
  // ========== COMMON WORDS ==========
  {
    id: 'words-01',
    title: 'Die 100 häufigsten Wörter',
    description: 'Die am meisten verwendeten deutschen Wörter',
    type: LessonType.WORDS,
    category: 'words',
    level: 3,
    targetWPM: 30,
    targetAccuracy: 92,
    exercises: [
      { id: 'wrd-01-01', text: 'der die das ein eine einer einem', description: 'Artikel' },
      { id: 'wrd-01-02', text: 'und oder aber denn weil wenn', description: 'Konjunktionen' },
      { id: 'wrd-01-03', text: 'ist sind war waren wird werden', description: 'Sein-Formen' },
      { id: 'wrd-01-04', text: 'ich du er sie es wir ihr sie', description: 'Pronomen' },
      { id: 'wrd-01-05', text: 'haben sein werden können müssen', description: 'Hilfsverben' },
      { id: 'wrd-01-06', text: 'in an auf aus bei mit nach zu', description: 'Präpositionen' },
    ],
  },
  {
    id: 'words-02',
    title: 'Verben im Alltag',
    description: 'Häufig verwendete Verben',
    type: LessonType.WORDS,
    category: 'words',
    level: 3,
    targetWPM: 30,
    targetAccuracy: 90,
    exercises: [
      { id: 'wrd-02-01', text: 'gehen kommen sehen hören sprechen', description: 'Bewegung' },
      { id: 'wrd-02-02', text: 'machen tun arbeiten spielen lernen', description: 'Aktivitäten' },
      { id: 'wrd-02-03', text: 'essen trinken schlafen wachen', description: 'Grundbedürfnisse' },
      { id: 'wrd-02-04', text: 'denken glauben meinen wissen', description: 'Denken' },
      { id: 'wrd-02-05', text: 'suchen finden nehmen geben', description: 'Handlungen' },
    ],
  },
  {
    id: 'words-03',
    title: 'Adjektive',
    description: 'Beschreibende Wörter',
    type: LessonType.WORDS,
    category: 'words',
    level: 3,
    targetWPM: 32,
    targetAccuracy: 90,
    exercises: [
      { id: 'wrd-03-01', text: 'groß klein lang kurz hoch tief', description: 'Größe' },
      { id: 'wrd-03-02', text: 'gut schlecht schön hässlich', description: 'Bewertung' },
      { id: 'wrd-03-03', text: 'alt neu jung frisch modern', description: 'Alter' },
      { id: 'wrd-03-04', text: 'schnell langsam früh spät', description: 'Tempo' },
      { id: 'wrd-03-05', text: 'warm kalt heiß kühl mild', description: 'Temperatur' },
    ],
  },
  // ========== SIMPLE SENTENCES ==========
  {
    id: 'words-04',
    title: 'Kurze Sätze',
    description: 'Einfache deutsche Sätze',
    type: LessonType.WORDS,
    category: 'words',
    level: 4,
    targetWPM: 35,
    targetAccuracy: 90,
    exercises: [
      { id: 'wrd-04-01', text: 'Das Wetter ist heute sehr schön.', description: 'Wetter' },
      { id: 'wrd-04-02', text: 'Ich gehe morgen in die Stadt.', description: 'Zukunft' },
      { id: 'wrd-04-03', text: 'Hast du das Buch schon gelesen?', description: 'Frage' },
      { id: 'wrd-04-04', text: 'Er arbeitet jeden Tag sehr hart.', description: 'Arbeit' },
      { id: 'wrd-04-05', text: 'Wir treffen uns heute Abend.', description: 'Verabredung' },
      { id: 'wrd-04-06', text: 'Das Essen schmeckt sehr gut.', description: 'Essen' },
    ],
  },
  {
    id: 'words-05',
    title: 'Mittellange Sätze',
    description: 'Sätze mit mehr Details',
    type: LessonType.WORDS,
    category: 'words',
    level: 4,
    targetWPM: 38,
    targetAccuracy: 88,
    exercises: [
      { id: 'wrd-05-01', text: 'Der Mann geht jeden Morgen zur Arbeit.', description: 'Routine' },
      { id: 'wrd-05-02', text: 'Die Kinder spielen im Garten Fußball.', description: 'Freizeit' },
      {
        id: 'wrd-05-03',
        text: 'Ich habe gestern einen Film gesehen.',
        description: 'Vergangenheit',
      },
      { id: 'wrd-05-04', text: 'Sie kauft im Supermarkt frisches Obst.', description: 'Einkaufen' },
      { id: 'wrd-05-05', text: 'Das Auto steht vor dem großen Haus.', description: 'Beschreibung' },
    ],
  },
  // ========== LONGER TEXTS ==========
  {
    id: 'words-06',
    title: 'Lange Sätze',
    description: 'Komplexere deutsche Sätze',
    type: LessonType.WORDS,
    category: 'words',
    level: 5,
    targetWPM: 40,
    targetAccuracy: 88,
    exercises: [
      {
        id: 'wrd-06-01',
        text: 'Franz jagt im komplett verwahrlosten Taxi quer durch Bayern.',
        description: 'Pangram',
      },
      {
        id: 'wrd-06-02',
        text: 'Zwölf große Boxkämpfer jagen Viktor quer über den Sylter Deich.',
        description: 'Pangram 2',
      },
      {
        id: 'wrd-06-03',
        text: 'Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich.',
        description: 'Pangram 3',
      },
      {
        id: 'wrd-06-04',
        text: 'Falsches Üben von Xylophonmusik quält jeden größeren Zwerg.',
        description: 'Pangram 4',
      },
      {
        id: 'wrd-06-05',
        text: 'Jeder wackere Bayer vertilgt bequem zwo Pfund Kalbshaxen.',
        description: 'Pangram 5',
      },
    ],
  },
  {
    id: 'words-07',
    title: 'Absätze üben',
    description: 'Zusammenhängende Textpassagen',
    type: LessonType.WORDS,
    category: 'words',
    level: 5,
    targetWPM: 42,
    targetAccuracy: 86,
    exercises: [
      {
        id: 'wrd-07-01',
        text: 'Der frühe Vogel fängt den Wurm. Aber die zweite Maus bekommt den Käse. So ist das Leben manchmal.',
        description: 'Sprichwörter',
      },
      {
        id: 'wrd-07-02',
        text: 'Es war einmal ein kleines Mädchen mit dem Namen Rotkäppchen. Es lebte mit seiner Mutter in einem kleinen Haus.',
        description: 'Märchen',
      },
      {
        id: 'wrd-07-03',
        text: 'Die Sonne scheint warm auf die grüne Wiese. Die Vögel singen fröhlich in den Bäumen. Es ist ein schöner Tag.',
        description: 'Beschreibung',
      },
    ],
  },
  // ========== THEMEN ==========
  {
    id: 'words-08',
    title: 'Thema: Computer',
    description: 'Fachvokabular aus der Computerwelt',
    type: LessonType.WORDS,
    category: 'words',
    level: 4,
    targetWPM: 35,
    targetAccuracy: 88,
    exercises: [
      {
        id: 'wrd-08-01',
        text: 'Computer Monitor Tastatur Maus Bildschirm',
        description: 'Hardware',
      },
      {
        id: 'wrd-08-02',
        text: 'Software Programm Anwendung System Betrieb',
        description: 'Software',
      },
      { id: 'wrd-08-03', text: 'Datei Ordner Speicher Festplatte Cloud', description: 'Speicher' },
      { id: 'wrd-08-04', text: 'Internet Browser Website Email Download', description: 'Internet' },
      {
        id: 'wrd-08-05',
        text: 'Der Computer startet langsam heute Morgen.',
        description: 'Im Satz',
      },
    ],
  },
  {
    id: 'words-09',
    title: 'Thema: Büro',
    description: 'Wörter aus dem Büroalltag',
    type: LessonType.WORDS,
    category: 'words',
    level: 4,
    targetWPM: 35,
    targetAccuracy: 88,
    exercises: [
      {
        id: 'wrd-09-01',
        text: 'Meeting Termin Besprechung Konferenz Team',
        description: 'Termine',
      },
      {
        id: 'wrd-09-02',
        text: 'Dokument Bericht Präsentation Protokoll',
        description: 'Dokumente',
      },
      {
        id: 'wrd-09-03',
        text: 'Chef Kollege Mitarbeiter Abteilung Firma',
        description: 'Personen',
      },
      { id: 'wrd-09-04', text: 'Drucker Scanner Kopierer Fax Telefon', description: 'Geräte' },
      { id: 'wrd-09-05', text: 'Das Meeting beginnt um neun Uhr.', description: 'Im Satz' },
    ],
  },
  {
    id: 'words-10',
    title: 'Thema: Reisen',
    description: 'Vokabular rund ums Reisen',
    type: LessonType.WORDS,
    category: 'words',
    level: 4,
    targetWPM: 35,
    targetAccuracy: 88,
    exercises: [
      {
        id: 'wrd-10-01',
        text: 'Flugzeug Zug Bus Auto Schiff Fahrrad',
        description: 'Verkehrsmittel',
      },
      { id: 'wrd-10-02', text: 'Bahnhof Flughafen Hotel Restaurant Museum', description: 'Orte' },
      { id: 'wrd-10-03', text: 'Koffer Rucksack Tasche Gepäck Ticket', description: 'Gepäck' },
      { id: 'wrd-10-04', text: 'Reisepass Visum Buchung Reservierung', description: 'Dokumente' },
      { id: 'wrd-10-05', text: 'Wir fliegen morgen nach Berlin.', description: 'Im Satz' },
    ],
  },
];

/**
 * ============================================================================
 * ADVANCED LESSONS - Level 5-6 (Fortgeschritten)
 * Komplexe Texte und alle Sonderzeichen
 * ============================================================================
 */
export const ADVANCED_LESSONS: Lesson[] = [
  // ========== ALLE SONDERZEICHEN ==========
  {
    id: 'adv-01',
    title: 'Alle Sonderzeichen Übersicht',
    description: 'Systematisches Training aller wichtigen Sonderzeichen',
    type: LessonType.BASICS,
    category: 'advanced',
    level: 5,
    targetWPM: 25,
    targetAccuracy: 85,
    exercises: [
      { id: 'adv-01-01', text: '! ? . , ; : - _ + = * / \\', description: 'Grundzeichen' },
      { id: 'adv-01-02', text: '( ) [ ] { } < > " \' `', description: 'Klammern und Quotes' },
      { id: 'adv-01-03', text: '@ # $ % ^ & | ~ §', description: 'Spezialzeichen' },
      { id: 'adv-01-04', text: 'email@domain.de #hashtag $100 50%', description: 'Anwendungen' },
      {
        id: 'adv-01-05',
        text: 'user_name file-name path/to/file',
        description: 'Namenskonventionen',
      },
    ],
  },
  {
    id: 'adv-02',
    title: 'Mathematische Zeichen',
    description: 'Für technische und wissenschaftliche Texte',
    type: LessonType.BASICS,
    category: 'advanced',
    level: 5,
    targetWPM: 22,
    targetAccuracy: 88,
    exercises: [
      { id: 'adv-02-01', text: '+ - * / = != < > <= >= ++', description: 'Grundoperatoren' },
      {
        id: 'adv-02-02',
        text: '2 + 2 = 4; 10 - 3 = 7; 5 * 6 = 30',
        description: 'Einfache Rechnung',
      },
      { id: 'adv-02-03', text: 'x = (a + b) / c; y = a * b - c', description: 'Formeln' },
      { id: 'adv-02-04', text: 'a < b; c >= d; x != y; z == 0', description: 'Vergleiche' },
      { id: 'adv-02-05', text: 'i++; j--; count += 1; total -= 5', description: 'Inkrement' },
    ],
  },
  // ========== DEUTSCHE LITERATUR ==========
  {
    id: 'adv-03',
    title: 'Deutsche Klassiker 1',
    description: 'Zitate aus der deutschen Literatur',
    type: LessonType.WORDS,
    category: 'advanced',
    level: 5,
    targetWPM: 40,
    targetAccuracy: 88,
    exercises: [
      {
        id: 'adv-03-01',
        text: 'Da steh ich nun, ich armer Tor, und bin so klug als wie zuvor.',
        description: 'Goethe - Faust',
      },
      {
        id: 'adv-03-02',
        text: 'Zwei Seelen wohnen, ach! in meiner Brust.',
        description: 'Goethe - Faust',
      },
      {
        id: 'adv-03-03',
        text: 'Sein oder Nichtsein, das ist hier die Frage.',
        description: 'Shakespeare - Hamlet (deutsch)',
      },
      {
        id: 'adv-03-04',
        text: 'Die Gedanken sind frei, wer kann sie erraten?',
        description: 'Volkslied',
      },
      {
        id: 'adv-03-05',
        text: 'Über allen Gipfeln ist Ruh, in allen Wipfeln spürest du kaum einen Hauch.',
        description: 'Goethe - Wanderers Nachtlied',
      },
    ],
  },
  {
    id: 'adv-04',
    title: 'Geschäftsbriefe',
    description: 'Formelle Korrespondenz',
    type: LessonType.WORDS,
    category: 'advanced',
    level: 5,
    targetWPM: 38,
    targetAccuracy: 90,
    exercises: [
      {
        id: 'adv-04-01',
        text: 'Sehr geehrte Damen und Herren, mit diesem Schreiben möchte ich...',
        description: 'Anrede',
      },
      {
        id: 'adv-04-02',
        text: 'Bezugnehmend auf Ihr Schreiben vom 15. März teilen wir Ihnen mit...',
        description: 'Bezugnahme',
      },
      {
        id: 'adv-04-03',
        text: 'Wir freuen uns auf eine baldige Rückmeldung Ihrerseits.',
        description: 'Abschluss',
      },
      {
        id: 'adv-04-04',
        text: 'Mit freundlichen Grüßen, Max Mustermann, Geschäftsführer',
        description: 'Grußformel',
      },
      {
        id: 'adv-04-05',
        text: 'Anlage: Vertrag, Rechnung, Lieferschein',
        description: 'Anlagen',
      },
    ],
  },
  {
    id: 'adv-05',
    title: 'Wissenschaftliche Texte',
    description: 'Akademisches Schreiben',
    type: LessonType.WORDS,
    category: 'advanced',
    level: 6,
    targetWPM: 35,
    targetAccuracy: 90,
    exercises: [
      {
        id: 'adv-05-01',
        text: 'Die vorliegende Untersuchung befasst sich mit der Analyse von...',
        description: 'Einleitung',
      },
      {
        id: 'adv-05-02',
        text: 'Gemäß der Hypothese wurde erwartet, dass die Ergebnisse zeigen...',
        description: 'Hypothese',
      },
      {
        id: 'adv-05-03',
        text: 'Die Daten wurden mittels quantitativer Methoden analysiert.',
        description: 'Methodik',
      },
      {
        id: 'adv-05-04',
        text: 'Zusammenfassend lässt sich feststellen, dass die Ergebnisse...',
        description: 'Fazit',
      },
      {
        id: 'adv-05-05',
        text: 'Vgl. Müller (2023), S. 42-45; siehe auch Schmidt (2022).',
        description: 'Quellenangabe',
      },
    ],
  },
  // ========== SCHNELLIGKEITSTRAINING ==========
  {
    id: 'adv-06',
    title: 'Speed Drill 1',
    description: 'Hochfrequenz-Wörter für maximale Geschwindigkeit',
    type: LessonType.WORDS,
    category: 'advanced',
    level: 5,
    targetWPM: 50,
    targetAccuracy: 92,
    exercises: [
      {
        id: 'adv-06-01',
        text: 'der die das und in zu den mit von auf',
        description: '10 häufigste',
      },
      {
        id: 'adv-06-02',
        text: 'ist nicht sich auch es an sie so eine',
        description: '11-19 häufigste',
      },
      { id: 'adv-06-03', text: 'das ist und die der nicht zu so es', description: 'Mix schnell' },
      {
        id: 'adv-06-04',
        text: 'ich du er sie es wir ihr sie Sie',
        description: 'Pronomen schnell',
      },
      {
        id: 'adv-06-05',
        text: 'haben sein werden können müssen wollen',
        description: 'Verben schnell',
      },
    ],
  },
  {
    id: 'adv-07',
    title: 'Speed Drill 2',
    description: 'Längere Wörter im Schnelldurchlauf',
    type: LessonType.WORDS,
    category: 'advanced',
    level: 6,
    targetWPM: 45,
    targetAccuracy: 90,
    exercises: [
      {
        id: 'adv-07-01',
        text: 'allerdings beispielsweise beziehungsweise',
        description: 'Füllwörter',
      },
      {
        id: 'adv-07-02',
        text: 'grundsätzlich wahrscheinlich selbstverständlich',
        description: 'Adverbien',
      },
      {
        id: 'adv-07-03',
        text: 'Verantwortung Möglichkeit Notwendigkeit',
        description: 'Substantive',
      },
      { id: 'adv-07-04', text: 'Zusammenarbeit Entwicklung Verbesserung', description: 'Business' },
      { id: 'adv-07-05', text: 'Kundenzufriedenheit Qualitätssicherung', description: 'Komposita' },
    ],
  },
];

/**
 * ============================================================================
 * EXPERT LESSONS - Level 6+ (Experte)
 * Sehr komplexe Texte und Spezialthemen
 * ============================================================================
 */
export const EXPERT_LESSONS: Lesson[] = [
  // ========== PHILOSOPHIE UND LITERATUR ==========
  {
    id: 'exp-01',
    title: 'Philosophische Texte',
    description: 'Anspruchsvolle philosophische Passagen',
    type: LessonType.WORDS,
    category: 'expert',
    level: 6,
    targetWPM: 40,
    targetAccuracy: 88,
    exercises: [
      {
        id: 'exp-01-01',
        text: 'Ich denke, also bin ich. Diese fundamentale Erkenntnis bildet die Grundlage der cartesianischen Philosophie.',
        description: 'Descartes',
      },
      {
        id: 'exp-01-02',
        text: 'Der kategorische Imperativ fordert: Handle nur nach derjenigen Maxime, durch die du zugleich wollen kannst, dass sie ein allgemeines Gesetz werde.',
        description: 'Kant',
      },
      {
        id: 'exp-01-03',
        text: 'Der Mensch ist zur Freiheit verurteilt. Er ist frei, sobald er in die Welt geworfen ist, und verantwortlich für alles, was er tut.',
        description: 'Sartre',
      },
      {
        id: 'exp-01-04',
        text: 'Die Sprache ist das Haus des Seins. In ihrer Behausung wohnt der Mensch.',
        description: 'Heidegger',
      },
    ],
  },
  {
    id: 'exp-02',
    title: 'Rechtliche Texte',
    description: 'Juristische Formulierungen',
    type: LessonType.WORDS,
    category: 'expert',
    level: 6,
    targetWPM: 35,
    targetAccuracy: 92,
    exercises: [
      {
        id: 'exp-02-01',
        text: 'Gemäß § 1 Absatz 1 des Bürgerlichen Gesetzbuchs beginnt die Rechtsfähigkeit des Menschen mit der Vollendung der Geburt.',
        description: 'BGB',
      },
      {
        id: 'exp-02-02',
        text: 'Der Beklagte wird verurteilt, an die Klägerin einen Betrag in Höhe von 5.000 Euro nebst Zinsen zu zahlen.',
        description: 'Urteil',
      },
      {
        id: 'exp-02-03',
        text: 'Die Parteien schließen hiermit folgenden Vertrag unter Ausschluss der ordentlichen Gerichtsbarkeit.',
        description: 'Vertrag',
      },
      {
        id: 'exp-02-04',
        text: 'Vorbehaltlich abweichender Vereinbarungen gelten die Allgemeinen Geschäftsbedingungen.',
        description: 'AGB',
      },
    ],
  },
  {
    id: 'exp-03',
    title: 'Medizinische Texte',
    description: 'Fachvokabular aus der Medizin',
    type: LessonType.WORDS,
    category: 'expert',
    level: 6,
    targetWPM: 32,
    targetAccuracy: 90,
    exercises: [
      {
        id: 'exp-03-01',
        text: 'Die Diagnose lautet: akute Appendizitis mit beginnender Peritonitis. Eine sofortige Appendektomie ist indiziert.',
        description: 'Diagnose',
      },
      {
        id: 'exp-03-02',
        text: 'Der Patient zeigt Symptome einer Hypoglykämie: Schwitzen, Zittern, Tachykardie und Verwirrtheit.',
        description: 'Symptome',
      },
      {
        id: 'exp-03-03',
        text: 'Therapie: Acetylsalicylsäure 100mg täglich, Metoprolol 47,5mg zweimal täglich.',
        description: 'Medikation',
      },
      {
        id: 'exp-03-04',
        text: 'Auskultation: Herztöne rein, rhythmisch. Lunge: vesikuläres Atemgeräusch beidseits.',
        description: 'Untersuchung',
      },
    ],
  },
  // ========== TECHNIK ==========
  {
    id: 'exp-04',
    title: 'Technische Dokumentation',
    description: 'Anspruchsvolle technische Texte',
    type: LessonType.WORDS,
    category: 'expert',
    level: 6,
    targetWPM: 35,
    targetAccuracy: 88,
    exercises: [
      {
        id: 'exp-04-01',
        text: 'Das System verwendet eine Microservices-Architektur mit Kubernetes-Orchestrierung und horizontaler Skalierung.',
        description: 'Architektur',
      },
      {
        id: 'exp-04-02',
        text: 'Der Algorithmus hat eine Zeitkomplexität von O(n log n) und eine Raumkomplexität von O(n).',
        description: 'Algorithmen',
      },
      {
        id: 'exp-04-03',
        text: 'Die REST-API unterstützt CRUD-Operationen mit OAuth 2.0 Authentifizierung und Rate-Limiting.',
        description: 'APIs',
      },
      {
        id: 'exp-04-04',
        text: 'Der CI/CD-Pipeline-Prozess umfasst: Build, Test, Security-Scan, Staging-Deployment und Production-Release.',
        description: 'DevOps',
      },
    ],
  },
  // ========== EXTREME CHALLENGES ==========
  {
    id: 'exp-05',
    title: 'Symbol-Marathon',
    description: 'Alle Sonderzeichen in komplexen Kombinationen',
    type: LessonType.BASICS,
    category: 'expert',
    level: 6,
    targetWPM: 25,
    targetAccuracy: 85,
    exercises: [
      {
        id: 'exp-05-01',
        text: 'user@example.com -> email_validated = true;',
        description: 'Code-Mix',
      },
      {
        id: 'exp-05-02',
        text: '{"key": "value", "count": 42, "valid": true}',
        description: 'JSON',
      },
      {
        id: 'exp-05-03',
        text: '<div class="container" id="main">Content</div>',
        description: 'HTML',
      },
      {
        id: 'exp-05-04',
        text: 'SELECT * FROM users WHERE age >= 18 AND status = "active";',
        description: 'SQL',
      },
      {
        id: 'exp-05-05',
        text: 'npm install --save-dev @types/node typescript ts-node',
        description: 'CLI',
      },
    ],
  },
  {
    id: 'exp-06',
    title: 'Geschwindigkeits-Challenge',
    description: 'Für absolute Profis - 60+ WPM Ziel',
    type: LessonType.WORDS,
    category: 'expert',
    level: 6,
    targetWPM: 60,
    targetAccuracy: 92,
    exercises: [
      {
        id: 'exp-06-01',
        text: 'der die das und in zu den mit von auf ist nicht sich auch es an sie so eine als für auf',
        description: 'Häufigste Wörter',
      },
      {
        id: 'exp-06-02',
        text: 'Die schnelle braune Fuchs springt über den faulen Hund. Der frühe Vogel fängt den Wurm.',
        description: 'Klassiker',
      },
      {
        id: 'exp-06-03',
        text: 'wir sie können werden hier machen haben diese hat sein war bei werden sollen durch schon',
        description: 'Mehr Häufige',
      },
      {
        id: 'exp-06-04',
        text: 'Übung macht den Meister. Wer A sagt, muss auch B sagen. Ende gut, alles gut.',
        description: 'Sprichwörter',
      },
    ],
  },
];

/**
 * ============================================================================
 * PROGRAMMING LESSONS - Level 4-6 (Code-Übungen)
 * Von einfach bis komplex sortiert
 * ============================================================================
 */
export const PROGRAMMING_LESSONS: ProgrammingLesson[] = [
  // ========== JAVASCRIPT BEGINNER ==========
  {
    id: 'prog-js-01',
    title: 'JavaScript Anfänger',
    description: 'Erste Schritte mit JavaScript',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 4,
    programmingLanguage: 'javascript',
    syntaxHighlight: true,
    targetWPM: 22,
    targetAccuracy: 95,
    exercises: [
      { id: 'pjs-01-01', text: 'let x = 5;', description: 'Variable deklarieren' },
      { id: 'pjs-01-02', text: 'const name = "Max";', description: 'Konstante' },
      { id: 'pjs-01-03', text: 'let sum = a + b;', description: 'Addition' },
      { id: 'pjs-01-04', text: 'console.log("Hello");', description: 'Ausgabe' },
      { id: 'pjs-01-05', text: 'let arr = [1, 2, 3];', description: 'Array' },
      { id: 'pjs-01-06', text: 'if (x > 0) { }', description: 'If-Statement' },
    ],
  },
  {
    id: 'prog-js-02',
    title: 'JavaScript Funktionen',
    description: 'Funktionen in JavaScript',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 4,
    programmingLanguage: 'javascript',
    syntaxHighlight: true,
    targetWPM: 24,
    targetAccuracy: 92,
    exercises: [
      { id: 'pjs-02-01', text: 'function add(a, b) { return a + b; }', description: 'Funktion' },
      { id: 'pjs-02-02', text: 'const multiply = (a, b) => a * b;', description: 'Arrow Function' },
      {
        id: 'pjs-02-03',
        text: 'function greet(name = "User") { }',
        description: 'Default Parameter',
      },
      { id: 'pjs-02-04', text: 'const result = calculate(5, 3);', description: 'Funktionsaufruf' },
      { id: 'pjs-02-05', text: 'const square = x => x * x;', description: 'Kurze Arrow' },
    ],
  },
  {
    id: 'prog-js-03',
    title: 'JavaScript Intermediate',
    description: 'Fortgeschrittene JavaScript-Konzepte',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 5,
    programmingLanguage: 'javascript',
    syntaxHighlight: true,
    targetWPM: 25,
    targetAccuracy: 90,
    exercises: [
      { id: 'pjs-03-01', text: 'const doubled = arr.map(x => x * 2);', description: 'Array.map' },
      {
        id: 'pjs-03-02',
        text: 'const filtered = arr.filter(x => x > 5);',
        description: 'Array.filter',
      },
      {
        id: 'pjs-03-03',
        text: 'const sum = arr.reduce((a, b) => a + b, 0);',
        description: 'Array.reduce',
      },
      { id: 'pjs-03-04', text: 'const { name, age } = user;', description: 'Destructuring' },
      {
        id: 'pjs-03-05',
        text: 'const merged = { ...obj1, ...obj2 };',
        description: 'Spread Operator',
      },
      { id: 'pjs-03-06', text: 'const items = [...arr1, ...arr2];', description: 'Array Spread' },
    ],
  },
  {
    id: 'prog-js-04',
    title: 'JavaScript Advanced',
    description: 'Async/Await und Promises',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 5,
    programmingLanguage: 'javascript',
    syntaxHighlight: true,
    targetWPM: 24,
    targetAccuracy: 88,
    exercises: [
      {
        id: 'pjs-04-01',
        text: 'async function fetchData() { await api.get(); }',
        description: 'Async/Await',
      },
      {
        id: 'pjs-04-02',
        text: 'const data = await fetch(url).then(r => r.json());',
        description: 'Fetch',
      },
      {
        id: 'pjs-04-03',
        text: 'Promise.all([p1, p2, p3]).then(results => { });',
        description: 'Promise.all',
      },
      {
        id: 'pjs-04-04',
        text: 'try { await save(); } catch (e) { handle(e); }',
        description: 'Try/Catch',
      },
      {
        id: 'pjs-04-05',
        text: 'const delay = ms => new Promise(r => setTimeout(r, ms));',
        description: 'Custom Promise',
      },
    ],
  },
  // ========== TYPESCRIPT ==========
  {
    id: 'prog-ts-01',
    title: 'TypeScript Basics',
    description: 'TypeScript-Typisierung lernen',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 5,
    programmingLanguage: 'typescript',
    syntaxHighlight: true,
    targetWPM: 22,
    targetAccuracy: 92,
    exercises: [
      { id: 'pts-01-01', text: 'const count: number = 42;', description: 'Typisierte Variable' },
      { id: 'pts-01-02', text: 'let name: string = "Max";', description: 'String-Typ' },
      { id: 'pts-01-03', text: 'let active: boolean = true;', description: 'Boolean-Typ' },
      { id: 'pts-01-04', text: 'const items: string[] = [];', description: 'Array-Typ' },
      {
        id: 'pts-01-05',
        text: 'function greet(name: string): void { }',
        description: 'Void Return',
      },
    ],
  },
  {
    id: 'prog-ts-02',
    title: 'TypeScript Interfaces',
    description: 'Interfaces und Types',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 5,
    programmingLanguage: 'typescript',
    syntaxHighlight: true,
    targetWPM: 22,
    targetAccuracy: 90,
    exercises: [
      {
        id: 'pts-02-01',
        text: 'interface User { name: string; age: number; }',
        description: 'Interface',
      },
      { id: 'pts-02-02', text: 'type Status = "active" | "inactive";', description: 'Union Type' },
      {
        id: 'pts-02-03',
        text: 'interface Config { readonly id: string; }',
        description: 'Readonly',
      },
      {
        id: 'pts-02-04',
        text: 'interface Opt { name?: string; }',
        description: 'Optional Property',
      },
      {
        id: 'pts-02-05',
        text: 'type Callback = (data: string) => void;',
        description: 'Function Type',
      },
    ],
  },
  {
    id: 'prog-ts-03',
    title: 'TypeScript Advanced',
    description: 'Generics und fortgeschrittene Typen',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 6,
    programmingLanguage: 'typescript',
    syntaxHighlight: true,
    targetWPM: 22,
    targetAccuracy: 88,
    exercises: [
      {
        id: 'pts-03-01',
        text: 'function identity<T>(arg: T): T { return arg; }',
        description: 'Generic Function',
      },
      {
        id: 'pts-03-02',
        text: 'type Result<T> = { data: T; error?: string };',
        description: 'Generic Type',
      },
      {
        id: 'pts-03-03',
        text: 'type Partial<T> = { [P in keyof T]?: T[P] };',
        description: 'Mapped Type',
      },
      {
        id: 'pts-03-04',
        text: 'type Pick<T, K extends keyof T> = { [P in K]: T[P] };',
        description: 'Pick Utility',
      },
      {
        id: 'pts-03-05',
        text: 'class Service<T> implements IService<T> { }',
        description: 'Generic Class',
      },
    ],
  },
  // ========== PYTHON ==========
  {
    id: 'prog-py-01',
    title: 'Python Anfänger',
    description: 'Python-Grundlagen',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 4,
    programmingLanguage: 'python',
    syntaxHighlight: true,
    targetWPM: 25,
    targetAccuracy: 94,
    exercises: [
      { id: 'ppy-01-01', text: 'name = "Python"', description: 'Variable' },
      { id: 'ppy-01-02', text: 'numbers = [1, 2, 3, 4, 5]', description: 'Liste' },
      { id: 'ppy-01-03', text: 'print(f"Hello {name}")', description: 'F-String' },
      { id: 'ppy-01-04', text: 'for i in range(10): print(i)', description: 'For-Loop' },
      { id: 'ppy-01-05', text: 'if x > 0: print("positive")', description: 'If-Statement' },
    ],
  },
  {
    id: 'prog-py-02',
    title: 'Python Funktionen',
    description: 'Funktionen in Python',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 4,
    programmingLanguage: 'python',
    syntaxHighlight: true,
    targetWPM: 24,
    targetAccuracy: 92,
    exercises: [
      { id: 'ppy-02-01', text: 'def greet(name): return f"Hello {name}"', description: 'Funktion' },
      { id: 'ppy-02-02', text: 'def add(a, b=0): return a + b', description: 'Default Parameter' },
      { id: 'ppy-02-03', text: 'square = lambda x: x ** 2', description: 'Lambda' },
      { id: 'ppy-02-04', text: 'def func(*args, **kwargs): pass', description: '*args **kwargs' },
      { id: 'ppy-02-05', text: '@decorator\ndef func(): pass', description: 'Decorator' },
    ],
  },
  {
    id: 'prog-py-03',
    title: 'Python Intermediate',
    description: 'Fortgeschrittenes Python',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 5,
    programmingLanguage: 'python',
    syntaxHighlight: true,
    targetWPM: 24,
    targetAccuracy: 90,
    exercises: [
      {
        id: 'ppy-03-01',
        text: 'squared = [x**2 for x in range(10)]',
        description: 'List Comprehension',
      },
      { id: 'ppy-03-02', text: 'data = {"name": "John", "age": 30}', description: 'Dictionary' },
      {
        id: 'ppy-03-03',
        text: 'filtered = {k: v for k, v in d.items() if v > 0}',
        description: 'Dict Comprehension',
      },
      {
        id: 'ppy-03-04',
        text: 'with open("file.txt") as f: data = f.read()',
        description: 'Context Manager',
      },
      { id: 'ppy-03-05', text: 'result = map(lambda x: x * 2, numbers)', description: 'Map' },
    ],
  },
  {
    id: 'prog-py-04',
    title: 'Python OOP',
    description: 'Objektorientiertes Python',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 5,
    programmingLanguage: 'python',
    syntaxHighlight: true,
    targetWPM: 22,
    targetAccuracy: 90,
    exercises: [
      {
        id: 'ppy-04-01',
        text: 'class User: def __init__(self, name): self.name = name',
        description: 'Klasse',
      },
      {
        id: 'ppy-04-02',
        text: 'class Admin(User): def __init__(self): super().__init__()',
        description: 'Vererbung',
      },
      {
        id: 'ppy-04-03',
        text: '@property\ndef name(self): return self._name',
        description: 'Property',
      },
      {
        id: 'ppy-04-04',
        text: '@classmethod\ndef create(cls): return cls()',
        description: 'Classmethod',
      },
      { id: 'ppy-04-05', text: '@staticmethod\ndef helper(): pass', description: 'Staticmethod' },
    ],
  },
  {
    id: 'prog-py-05',
    title: 'Python Async',
    description: 'Asynchrones Python',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 6,
    programmingLanguage: 'python',
    syntaxHighlight: true,
    targetWPM: 22,
    targetAccuracy: 88,
    exercises: [
      {
        id: 'ppy-05-01',
        text: 'async def fetch(): return await api.get()',
        description: 'Async Function',
      },
      { id: 'ppy-05-02', text: 'await asyncio.gather(task1, task2)', description: 'Gather' },
      {
        id: 'ppy-05-03',
        text: 'async with aiohttp.ClientSession() as session:',
        description: 'Async Context',
      },
      {
        id: 'ppy-05-04',
        text: 'result = await asyncio.wait_for(coro, timeout=5)',
        description: 'Timeout',
      },
      { id: 'ppy-05-05', text: 'asyncio.run(main())', description: 'Run' },
    ],
  },
  // ========== JAVA ==========
  {
    id: 'prog-java-01',
    title: 'Java Anfänger',
    description: 'Java-Grundlagen',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 4,
    programmingLanguage: 'java',
    syntaxHighlight: true,
    targetWPM: 22,
    targetAccuracy: 92,
    exercises: [
      { id: 'pjv-01-01', text: 'public class Main { }', description: 'Klasse' },
      { id: 'pjv-01-02', text: 'public static void main(String[] args) { }', description: 'Main' },
      { id: 'pjv-01-03', text: 'int number = 42;', description: 'Primitive' },
      { id: 'pjv-01-04', text: 'String name = "Java";', description: 'String' },
      { id: 'pjv-01-05', text: 'System.out.println("Hello World");', description: 'Print' },
    ],
  },
  {
    id: 'prog-java-02',
    title: 'Java OOP',
    description: 'Objektorientierung in Java',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 5,
    programmingLanguage: 'java',
    syntaxHighlight: true,
    targetWPM: 22,
    targetAccuracy: 90,
    exercises: [
      { id: 'pjv-02-01', text: 'public class User extends Person { }', description: 'Vererbung' },
      {
        id: 'pjv-02-02',
        text: 'public interface Service { void execute(); }',
        description: 'Interface',
      },
      {
        id: 'pjv-02-03',
        text: 'public abstract class Base { abstract void run(); }',
        description: 'Abstract',
      },
      { id: 'pjv-02-04', text: '@Override public String toString() { }', description: 'Override' },
      {
        id: 'pjv-02-05',
        text: 'implements Comparable<User>, Serializable',
        description: 'Multiple Interface',
      },
    ],
  },
  {
    id: 'prog-java-03',
    title: 'Java Collections & Streams',
    description: 'Moderne Java Features',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 5,
    programmingLanguage: 'java',
    syntaxHighlight: true,
    targetWPM: 22,
    targetAccuracy: 88,
    exercises: [
      {
        id: 'pjv-03-01',
        text: 'List<String> items = new ArrayList<>();',
        description: 'ArrayList',
      },
      {
        id: 'pjv-03-02',
        text: 'Map<String, Integer> map = new HashMap<>();',
        description: 'HashMap',
      },
      {
        id: 'pjv-03-03',
        text: 'items.stream().filter(x -> x.length() > 3).collect(Collectors.toList());',
        description: 'Stream',
      },
      {
        id: 'pjv-03-04',
        text: 'Optional<User> user = repository.findById(id);',
        description: 'Optional',
      },
      {
        id: 'pjv-03-05',
        text: 'var result = items.stream().map(String::toUpperCase).toList();',
        description: 'Method Reference',
      },
    ],
  },
  // ========== HTML/CSS ==========
  {
    id: 'prog-html-01',
    title: 'HTML Basics',
    description: 'HTML-Grundlagen',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 4,
    programmingLanguage: 'html',
    syntaxHighlight: true,
    targetWPM: 25,
    targetAccuracy: 90,
    exercises: [
      { id: 'phtml-01-01', text: '<!DOCTYPE html>', description: 'Doctype' },
      { id: 'phtml-01-02', text: '<html lang="de"></html>', description: 'HTML Tag' },
      { id: 'phtml-01-03', text: '<head><title>Titel</title></head>', description: 'Head' },
      { id: 'phtml-01-04', text: '<div class="container"></div>', description: 'Div mit Klasse' },
      { id: 'phtml-01-05', text: '<a href="https://example.com">Link</a>', description: 'Anchor' },
      { id: 'phtml-01-06', text: '<img src="bild.jpg" alt="Beschreibung">', description: 'Image' },
    ],
  },
  {
    id: 'prog-css-01',
    title: 'CSS Basics',
    description: 'CSS-Grundlagen',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 4,
    programmingLanguage: 'css',
    syntaxHighlight: true,
    targetWPM: 25,
    targetAccuracy: 90,
    exercises: [
      { id: 'pcss-01-01', text: '.container { width: 100%; }', description: 'Klassen-Selektor' },
      { id: 'pcss-01-02', text: '#main { margin: 0 auto; }', description: 'ID-Selektor' },
      { id: 'pcss-01-03', text: 'display: flex; justify-content: center;', description: 'Flexbox' },
      { id: 'pcss-01-04', text: 'padding: 10px 20px; border-radius: 8px;', description: 'Spacing' },
      { id: 'pcss-01-05', text: 'background-color: #007bff; color: white;', description: 'Farben' },
    ],
  },
  // ========== REACT/ANGULAR ==========
  {
    id: 'prog-react-01',
    title: 'React Basics',
    description: 'React Component Syntax',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 5,
    programmingLanguage: 'react',
    syntaxHighlight: true,
    targetWPM: 22,
    targetAccuracy: 90,
    exercises: [
      {
        id: 'preact-01-01',
        text: 'function App() { return <div>Hello</div>; }',
        description: 'Functional Component',
      },
      {
        id: 'preact-01-02',
        text: 'const [count, setCount] = useState(0);',
        description: 'useState',
      },
      {
        id: 'preact-01-03',
        text: 'useEffect(() => { fetchData(); }, []);',
        description: 'useEffect',
      },
      {
        id: 'preact-01-04',
        text: '<button onClick={() => setCount(c => c + 1)}>+</button>',
        description: 'Event Handler',
      },
      {
        id: 'preact-01-05',
        text: '{items.map(item => <li key={item.id}>{item.name}</li>)}',
        description: 'List Rendering',
      },
    ],
  },
  {
    id: 'prog-angular-01',
    title: 'Angular Basics',
    description: 'Angular Component Syntax',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 5,
    programmingLanguage: 'angular',
    syntaxHighlight: true,
    targetWPM: 22,
    targetAccuracy: 90,
    exercises: [
      {
        id: 'pang-01-01',
        text: '@Component({ selector: "app-root" })',
        description: 'Component Decorator',
      },
      { id: 'pang-01-02', text: '<div *ngIf="isVisible">Content</div>', description: 'ngIf' },
      {
        id: 'pang-01-03',
        text: '<li *ngFor="let item of items">{{ item }}</li>',
        description: 'ngFor',
      },
      { id: 'pang-01-04', text: '[(ngModel)]="username"', description: 'Two-way Binding' },
      { id: 'pang-01-05', text: '@Injectable({ providedIn: "root" })', description: 'Service' },
    ],
  },
  // ========== SQL ==========
  {
    id: 'prog-sql-01',
    title: 'SQL Basics',
    description: 'SQL-Grundlagen',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 4,
    programmingLanguage: 'sql',
    syntaxHighlight: true,
    targetWPM: 25,
    targetAccuracy: 92,
    exercises: [
      { id: 'psql-01-01', text: 'SELECT * FROM users;', description: 'Select All' },
      {
        id: 'psql-01-02',
        text: 'SELECT name, email FROM users WHERE active = 1;',
        description: 'Where',
      },
      {
        id: 'psql-01-03',
        text: 'INSERT INTO users (name, email) VALUES ("Max", "max@test.de");',
        description: 'Insert',
      },
      {
        id: 'psql-01-04',
        text: 'UPDATE users SET name = "Anna" WHERE id = 1;',
        description: 'Update',
      },
      { id: 'psql-01-05', text: 'DELETE FROM users WHERE id = 5;', description: 'Delete' },
    ],
  },
  {
    id: 'prog-sql-02',
    title: 'SQL Advanced',
    description: 'Fortgeschrittene SQL-Abfragen',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 5,
    programmingLanguage: 'sql',
    syntaxHighlight: true,
    targetWPM: 22,
    targetAccuracy: 90,
    exercises: [
      {
        id: 'psql-02-01',
        text: 'SELECT * FROM users u JOIN orders o ON u.id = o.user_id;',
        description: 'Join',
      },
      {
        id: 'psql-02-02',
        text: 'SELECT COUNT(*), status FROM orders GROUP BY status;',
        description: 'Group By',
      },
      {
        id: 'psql-02-03',
        text: 'SELECT * FROM users ORDER BY created_at DESC LIMIT 10;',
        description: 'Order Limit',
      },
      {
        id: 'psql-02-04',
        text: 'SELECT * FROM users WHERE name LIKE "%Max%";',
        description: 'Like',
      },
      {
        id: 'psql-02-05',
        text: 'SELECT COALESCE(nickname, name) as display_name FROM users;',
        description: 'Coalesce',
      },
    ],
  },
  // ========== BASH/SHELL ==========
  {
    id: 'prog-bash-01',
    title: 'Bash/Shell Basics',
    description: 'Shell-Scripting Grundlagen',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 5,
    programmingLanguage: 'bash',
    syntaxHighlight: true,
    targetWPM: 25,
    targetAccuracy: 90,
    exercises: [
      { id: 'pbash-01-01', text: '#!/bin/bash', description: 'Shebang' },
      { id: 'pbash-01-02', text: 'echo "Hello World"', description: 'Echo' },
      { id: 'pbash-01-03', text: 'name="Max"; echo $name', description: 'Variable' },
      {
        id: 'pbash-01-04',
        text: 'if [ -f "$file" ]; then echo "exists"; fi',
        description: 'If-Statement',
      },
      { id: 'pbash-01-05', text: 'for i in {1..10}; do echo $i; done', description: 'For-Loop' },
      { id: 'pbash-01-06', text: 'cat file.txt | grep "pattern" | wc -l', description: 'Pipes' },
    ],
  },
  // ========== GIT COMMANDS ==========
  {
    id: 'prog-git-01',
    title: 'Git Commands',
    description: 'Die wichtigsten Git-Befehle',
    type: LessonType.PROGRAMMING,
    category: 'programming',
    level: 4,
    programmingLanguage: 'git',
    syntaxHighlight: true,
    targetWPM: 28,
    targetAccuracy: 92,
    exercises: [
      { id: 'pgit-01-01', text: 'git init', description: 'Initialize' },
      {
        id: 'pgit-01-02',
        text: 'git add . && git commit -m "Initial commit"',
        description: 'Add & Commit',
      },
      { id: 'pgit-01-03', text: 'git push origin main', description: 'Push' },
      { id: 'pgit-01-04', text: 'git pull origin main', description: 'Pull' },
      { id: 'pgit-01-05', text: 'git checkout -b feature/new-feature', description: 'Branch' },
      { id: 'pgit-01-06', text: 'git merge feature/new-feature', description: 'Merge' },
    ],
  },
];

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

/**
 * ============================================================================
 * COMBINED EXPORTS
 * ============================================================================
 */

/**
 * All lessons combined
 */
export const ALL_LESSONS: Lesson[] = [
  ...BEGINNER_LESSONS,
  ...BASIC_LESSONS,
  ...INTERMEDIATE_LESSONS,
  ...WORD_LESSONS,
  ...ADVANCED_LESSONS,
  ...EXPERT_LESSONS,
  ...PROGRAMMING_LESSONS,
  ...SHORTCUT_LESSONS,
];

/**
 * Lesson categories
 */
export const LESSON_CATEGORIES: LessonCategory[] = [
  {
    id: 'beginner',
    name: 'Anfänger',
    description: 'Absolute Grundlagen - nur Grundreihe',
    icon: '',
    lessonIds: BEGINNER_LESSONS.map(l => l.id),
  },
  {
    id: 'basics',
    name: 'Grundlagen',
    description: 'Alle Buchstaben und erste Sätze',
    icon: '',
    lessonIds: BASIC_LESSONS.map(l => l.id),
  },
  {
    id: 'intermediate',
    name: 'Fortgeschritten',
    description: 'Zahlen und Sonderzeichen',
    icon: '',
    lessonIds: INTERMEDIATE_LESSONS.map(l => l.id),
  },
  {
    id: 'words',
    name: 'Wörter & Sätze',
    description: 'Wortschatz und Textübungen',
    icon: '',
    lessonIds: WORD_LESSONS.map(l => l.id),
  },
  {
    id: 'advanced',
    name: 'Fortgeschritten+',
    description: 'Komplexe Texte und alle Zeichen',
    icon: '',
    lessonIds: ADVANCED_LESSONS.map(l => l.id),
  },
  {
    id: 'expert',
    name: 'Experte',
    description: 'Maximale Herausforderung',
    icon: '',
    lessonIds: EXPERT_LESSONS.map(l => l.id),
  },
  {
    id: 'programming',
    name: 'Programmierung',
    description: 'Code-Snippets in verschiedenen Sprachen',
    icon: '',
    lessonIds: PROGRAMMING_LESSONS.map(l => l.id),
  },
  {
    id: 'shortcuts',
    name: 'IDE Shortcuts',
    description: 'Tastenkürzel für VS Code, IntelliJ, Vim',
    icon: '',
    lessonIds: SHORTCUT_LESSONS.map(l => l.id),
  },
];

/**
 * ============================================================================
 * HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * Get lesson by ID
 */
export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find(lesson => lesson.id === id);
}

/**
 * Get lessons by category
 */
export function getLessonsByCategory(categoryId: string): Lesson[] {
  return ALL_LESSONS.filter(lesson => lesson.category === categoryId);
}

/**
 * Get lessons by type
 */
export function getLessonsByType(type: LessonType): Lesson[] {
  return ALL_LESSONS.filter(lesson => lesson.type === type);
}

/**
 * Get lessons by level
 */
export function getLessonsByLevel(level: number): Lesson[] {
  return ALL_LESSONS.filter(lesson => lesson.level === level);
}

/**
 * Get lessons by level range
 */
export function getLessonsByLevelRange(minLevel: number, maxLevel: number): Lesson[] {
  return ALL_LESSONS.filter(lesson => lesson.level >= minLevel && lesson.level <= maxLevel);
}

/**
 * Get lessons by difficulty (based on level)
 */
export function getLessonsByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
): Lesson[] {
  switch (difficulty) {
    case 'beginner':
      return getLessonsByLevelRange(1, 2);
    case 'intermediate':
      return getLessonsByLevelRange(3, 4);
    case 'advanced':
      return getLessonsByLevelRange(5, 5);
    case 'expert':
      return getLessonsByLevelRange(6, 10);
    default:
      return ALL_LESSONS;
  }
}

/**
 * Get next lesson for user progress
 */
export function getNextLesson(completedLessonIds: string[]): Lesson | undefined {
  return ALL_LESSONS.find(lesson => !completedLessonIds.includes(lesson.id));
}

/**
 * Get programming lessons by language
 */
export function getProgrammingLessonsByLanguage(
  language: ProgrammingLesson['programmingLanguage']
): ProgrammingLesson[] {
  return PROGRAMMING_LESSONS.filter(lesson => lesson.programmingLanguage === language);
}

/**
 * Get shortcut lessons by IDE
 */
export function getShortcutLessonsByIDE(ide: ShortcutLesson['ide']): ShortcutLesson[] {
  return SHORTCUT_LESSONS.filter(lesson => lesson.ide === ide);
}

/**
 * Get random exercises from a lesson
 */
export function getRandomExercises(lesson: Lesson, count: number): typeof lesson.exercises {
  const shuffled = [...lesson.exercises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get total exercise count
 */
export function getTotalExerciseCount(): number {
  return ALL_LESSONS.reduce((sum, lesson) => sum + lesson.exercises.length, 0);
}

/**
 * Get statistics about lessons
 */
export function getLessonStats(): {
  totalLessons: number;
  totalExercises: number;
  byLevel: Record<number, number>;
  byCategory: Record<string, number>;
} {
  const stats = {
    totalLessons: ALL_LESSONS.length,
    totalExercises: getTotalExerciseCount(),
    byLevel: {} as Record<number, number>,
    byCategory: {} as Record<string, number>,
  };

  ALL_LESSONS.forEach(lesson => {
    stats.byLevel[lesson.level] = (stats.byLevel[lesson.level] || 0) + 1;
    stats.byCategory[lesson.category] = (stats.byCategory[lesson.category] || 0) + 1;
  });

  return stats;
}
