import { LessonType } from '../../domain/enums';
import { Lesson } from '../../domain/models';

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
