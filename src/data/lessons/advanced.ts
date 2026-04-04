import { LessonType } from '../../domain/enums';
import { Lesson } from '../../domain/models';

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
      { id: 'adv-01-01', text: '! ! ! ? ? ? . . . , , ,', description: 'Satzzeichen einzeln' },
      { id: 'adv-01-02', text: '; ; ; : : : - - - _ _ _', description: 'Mehr Satzzeichen' },
      { id: 'adv-01-03', text: '! ? . , ; : - _ + = * /', description: 'Grundzeichen Mix' },
      { id: 'adv-01-04', text: '( ) ( ) [ ] [ ] { } { }', description: 'Klammern einzeln' },
      { id: 'adv-01-05', text: '( ) [ ] { } < > " \' `', description: 'Klammern und Quotes' },
      { id: 'adv-01-06', text: '@ @ @ # # # $ $ $ % % %', description: 'Spezialzeichen einzeln' },
      { id: 'adv-01-07', text: '@ # $ % ^ & | ~ §', description: 'Spezialzeichen Mix' },
      { id: 'adv-01-08', text: 'email@domain.de user@mail.com', description: 'E-Mail-Adressen' },
      { id: 'adv-01-09', text: '#hashtag #coding #keyboard', description: 'Hashtags' },
      { id: 'adv-01-10', text: '$100 €50 £25 ¥1000 CHF80', description: 'Währungen' },
      { id: 'adv-01-11', text: '50% 100% 25% 75% 33.3%', description: 'Prozente' },
      { id: 'adv-01-12', text: 'user_name my_file config_v2', description: 'Unterstriche' },
      { id: 'adv-01-13', text: 'file-name my-project api-v2', description: 'Bindestriche' },
      { id: 'adv-01-14', text: 'path/to/file src/main.ts', description: 'Pfade' },
      {
        id: 'adv-01-15',
        text: 'email@test.de #tag $50 25% path/file',
        description: 'Abschluss-Mix',
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
      { id: 'adv-02-01', text: '+ + + - - - * * * / / /', description: 'Operatoren einzeln' },
      { id: 'adv-02-02', text: '= = = != != != < < < > > >', description: 'Vergleiche einzeln' },
      { id: 'adv-02-03', text: '+ - * / = != < > <= >= ++', description: 'Grundoperatoren Mix' },
      { id: 'adv-02-04', text: '1 + 1 = 2; 2 + 2 = 4; 3 + 3 = 6', description: 'Addition' },
      { id: 'adv-02-05', text: '10 - 3 = 7; 15 - 8 = 7; 20 - 5 = 15', description: 'Subtraktion' },
      {
        id: 'adv-02-06',
        text: '5 * 6 = 30; 7 * 8 = 56; 9 * 9 = 81',
        description: 'Multiplikation',
      },
      { id: 'adv-02-07', text: '20 / 4 = 5; 36 / 6 = 6; 100 / 10 = 10', description: 'Division' },
      { id: 'adv-02-08', text: 'x = (a + b) / c; y = a * b - c', description: 'Formeln' },
      { id: 'adv-02-09', text: 'f(x) = x^2 + 2x + 1; g(x) = 3x - 5', description: 'Funktionen' },
      { id: 'adv-02-10', text: 'a < b; c >= d; x != y; z == 0', description: 'Vergleiche' },
      { id: 'adv-02-11', text: 'a <= b; c > d; x == y; z != 0', description: 'Mehr Vergleiche' },
      { id: 'adv-02-12', text: 'i++; j--; count += 1; total -= 5', description: 'Inkrement' },
      {
        id: 'adv-02-13',
        text: 'sum += value; product *= factor',
        description: 'Zusammengesetzte Ops',
      },
      { id: 'adv-02-14', text: 'result = (a + b) * (c - d) / e', description: 'Komplexe Formel' },
      { id: 'adv-02-15', text: '2 + 2 = 4; x < y; i++; f(x) = x^2', description: 'Abschluss-Mix' },
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
        description: 'Goethe - Faust 2',
      },
      {
        id: 'adv-03-03',
        text: 'Sein oder Nichtsein, das ist hier die Frage.',
        description: 'Shakespeare - Hamlet',
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
      {
        id: 'adv-03-06',
        text: 'Wer reitet so spät durch Nacht und Wind? Es ist der Vater mit seinem Kind.',
        description: 'Goethe - Erlkönig',
      },
      {
        id: 'adv-03-07',
        text: 'Das Schöne ist nichts als des Schrecklichen Anfang.',
        description: 'Rilke',
      },
      {
        id: 'adv-03-08',
        text: 'Alle Menschen werden Brüder, wo dein sanfter Flügel weilt.',
        description: 'Schiller - Freude',
      },
      {
        id: 'adv-03-09',
        text: 'Die beste Bildung findet ein gescheiter Mensch auf Reisen.',
        description: 'Goethe',
      },
      {
        id: 'adv-03-10',
        text: 'Edel sei der Mensch, hilfreich und gut!',
        description: 'Goethe - Das Göttliche',
      },
      {
        id: 'adv-03-11',
        text: 'Gefährlich ist es, den Leu zu wecken.',
        description: 'Schiller - Lied von der Glocke',
      },
      {
        id: 'adv-03-12',
        text: 'Ich weiß nicht, was soll es bedeuten, dass ich so traurig bin.',
        description: 'Heine - Loreley',
      },
      {
        id: 'adv-03-13',
        text: 'Am Ende hängen wir doch ab von Kreaturen, die wir machten.',
        description: 'Goethe - Faust',
      },
      {
        id: 'adv-03-14',
        text: 'Dunkel war es, der Mond schien helle.',
        description: 'Paradoxes Gedicht',
      },
      {
        id: 'adv-03-15',
        text: 'Da steh ich nun. Zwei Seelen wohnen. Sein oder Nichtsein.',
        description: 'Abschluss-Mix',
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
      { id: 'adv-04-01', text: 'Sehr geehrte Damen und Herren,', description: 'Anrede formal' },
      {
        id: 'adv-04-02',
        text: 'Sehr geehrter Herr Müller, sehr geehrte Frau Schmidt,',
        description: 'Anrede persönlich',
      },
      {
        id: 'adv-04-03',
        text: 'mit diesem Schreiben möchte ich mich vorstellen.',
        description: 'Einleitung',
      },
      {
        id: 'adv-04-04',
        text: 'Bezugnehmend auf Ihr Schreiben vom 15. März teilen wir Ihnen mit...',
        description: 'Bezugnahme',
      },
      {
        id: 'adv-04-05',
        text: 'Für Rückfragen stehe ich Ihnen gerne zur Verfügung.',
        description: 'Angebot',
      },
      {
        id: 'adv-04-06',
        text: 'Wir freuen uns auf eine baldige Rückmeldung Ihrerseits.',
        description: 'Abschluss',
      },
      { id: 'adv-04-07', text: 'Mit freundlichen Grüßen', description: 'Grußformel Standard' },
      { id: 'adv-04-08', text: 'Hochachtungsvoll verbleibe ich', description: 'Grußformel formal' },
      { id: 'adv-04-09', text: 'Max Mustermann, Geschäftsführer', description: 'Unterschrift' },
      { id: 'adv-04-10', text: 'Anlage: Vertrag, Rechnung, Lieferschein', description: 'Anlagen' },
      {
        id: 'adv-04-11',
        text: 'PS: Bitte beachten Sie unsere neuen Öffnungszeiten.',
        description: 'Postskriptum',
      },
      {
        id: 'adv-04-12',
        text: 'Betreff: Ihre Anfrage vom 10. April 2024',
        description: 'Betreffzeile',
      },
      {
        id: 'adv-04-13',
        text: 'Im Anhang finden Sie die gewünschten Unterlagen.',
        description: 'Anhang-Hinweis',
      },
      {
        id: 'adv-04-14',
        text: 'Wir bedanken uns für Ihr entgegengebrachtes Vertrauen.',
        description: 'Danksagung',
      },
      {
        id: 'adv-04-15',
        text: 'Sehr geehrte Damen und Herren, mit freundlichen Grüßen.',
        description: 'Abschluss-Mix',
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
        text: 'Ziel dieser Arbeit ist es, die Zusammenhänge zwischen...',
        description: 'Zielsetzung',
      },
      {
        id: 'adv-05-03',
        text: 'Gemäß der Hypothese wurde erwartet, dass die Ergebnisse zeigen...',
        description: 'Hypothese',
      },
      {
        id: 'adv-05-04',
        text: 'Die Daten wurden mittels quantitativer Methoden analysiert.',
        description: 'Methodik',
      },
      {
        id: 'adv-05-05',
        text: 'Die Stichprobe umfasste 500 Teilnehmer im Alter von 18 bis 65 Jahren.',
        description: 'Stichprobe',
      },
      {
        id: 'adv-05-06',
        text: 'Die Ergebnisse zeigen einen signifikanten Zusammenhang (p < 0.05).',
        description: 'Ergebnisse',
      },
      {
        id: 'adv-05-07',
        text: 'Die Korrelation betrug r = 0.78 und war hochsignifikant.',
        description: 'Statistik',
      },
      {
        id: 'adv-05-08',
        text: 'Diese Befunde stehen im Einklang mit früheren Studien.',
        description: 'Diskussion',
      },
      {
        id: 'adv-05-09',
        text: 'Limitationen dieser Studie umfassen die geringe Stichprobengröße.',
        description: 'Limitationen',
      },
      {
        id: 'adv-05-10',
        text: 'Zusammenfassend lässt sich feststellen, dass die Ergebnisse...',
        description: 'Fazit',
      },
      {
        id: 'adv-05-11',
        text: 'Künftige Forschung sollte diese Aspekte weiter untersuchen.',
        description: 'Ausblick',
      },
      {
        id: 'adv-05-12',
        text: 'Vgl. Müller (2023), S. 42-45; siehe auch Schmidt (2022).',
        description: 'Quellenangabe',
      },
      {
        id: 'adv-05-13',
        text: 'Abbildung 3 zeigt die Verteilung der Messwerte.',
        description: 'Abbildungen',
      },
      {
        id: 'adv-05-14',
        text: 'Tabelle 2 fasst die deskriptiven Statistiken zusammen.',
        description: 'Tabellen',
      },
      {
        id: 'adv-05-15',
        text: 'Die Hypothese konnte bestätigt werden (p < 0.001).',
        description: 'Abschluss-Mix',
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
        text: 'der die das der die das der die das',
        description: 'Top 3 schnell',
      },
      { id: 'adv-06-02', text: 'und in zu und in zu und in zu', description: 'Wörter 4-6 schnell' },
      {
        id: 'adv-06-03',
        text: 'der die das und in zu den mit von auf',
        description: '10 häufigste',
      },
      {
        id: 'adv-06-04',
        text: 'ist nicht sich auch ist nicht sich auch',
        description: 'Wörter 7-10 schnell',
      },
      {
        id: 'adv-06-05',
        text: 'ist nicht sich auch es an sie so eine',
        description: '11-19 häufigste',
      },
      { id: 'adv-06-06', text: 'das ist und die der nicht zu so es', description: 'Mix schnell' },
      {
        id: 'adv-06-07',
        text: 'ich du er ich du er ich du er sie es',
        description: 'Pronomen schnell',
      },
      { id: 'adv-06-08', text: 'ich du er sie es wir ihr sie Sie', description: 'Alle Pronomen' },
      {
        id: 'adv-06-09',
        text: 'haben sein haben sein haben sein werden',
        description: 'Verben schnell',
      },
      {
        id: 'adv-06-10',
        text: 'haben sein werden können müssen wollen',
        description: 'Modalverben',
      },
      {
        id: 'adv-06-11',
        text: 'der ist und ich habe wir sind sie hat',
        description: 'Kombis schnell',
      },
      {
        id: 'adv-06-12',
        text: 'in an auf aus bei mit nach zu von für',
        description: 'Präpositionen',
      },
      {
        id: 'adv-06-13',
        text: 'nicht auch noch schon immer nur sehr viel',
        description: 'Adverbien',
      },
      {
        id: 'adv-06-14',
        text: 'aber denn weil wenn oder aber denn weil',
        description: 'Konjunktionen',
      },
      {
        id: 'adv-06-15',
        text: 'der die das und ist haben werden ich du',
        description: 'Abschluss-Mix',
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
      { id: 'adv-07-01', text: 'allerdings allerdings allerdings', description: 'Füllwörter 1' },
      { id: 'adv-07-02', text: 'beispielsweise beispielsweise', description: 'Füllwörter 2' },
      {
        id: 'adv-07-03',
        text: 'allerdings beispielsweise beziehungsweise',
        description: 'Füllwörter Mix',
      },
      { id: 'adv-07-04', text: 'grundsätzlich grundsätzlich', description: 'Adverb 1' },
      { id: 'adv-07-05', text: 'wahrscheinlich selbstverständlich', description: 'Adverb 2' },
      {
        id: 'adv-07-06',
        text: 'grundsätzlich wahrscheinlich selbstverständlich',
        description: 'Adverbien Mix',
      },
      { id: 'adv-07-07', text: 'Verantwortung Verantwortung', description: 'Substantiv 1' },
      { id: 'adv-07-08', text: 'Möglichkeit Notwendigkeit', description: 'Substantiv 2' },
      {
        id: 'adv-07-09',
        text: 'Verantwortung Möglichkeit Notwendigkeit',
        description: 'Substantive Mix',
      },
      { id: 'adv-07-10', text: 'Zusammenarbeit Zusammenarbeit', description: 'Business 1' },
      { id: 'adv-07-11', text: 'Entwicklung Verbesserung', description: 'Business 2' },
      {
        id: 'adv-07-12',
        text: 'Zusammenarbeit Entwicklung Verbesserung',
        description: 'Business Mix',
      },
      { id: 'adv-07-13', text: 'Kundenzufriedenheit Qualitätssicherung', description: 'Komposita' },
      {
        id: 'adv-07-14',
        text: 'Geschäftsführung Projektmanagement Personalentwicklung',
        description: 'Management',
      },
      {
        id: 'adv-07-15',
        text: 'allerdings Verantwortung Zusammenarbeit',
        description: 'Abschluss-Mix',
      },
    ],
  },
];
