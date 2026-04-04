/**
 * Story Mode Service - Manages quests, chapters, and story progression
 */

import { EventBus } from '../core/EventBus';
import { StorageService } from '../core/StorageService';
import {
  BossBattle,
  Chapter,
  PlayerStats,
  Quest,
  QuestDifficulty,
  QuestReward,
  QuestStatus,
  QuestType,
  StoryProgress,
} from '../domain/models/Quest';

const STORAGE_KEYS = {
  STORY_PROGRESS: 'keyboardwriter_story_progress',
  PLAYER_STATS: 'keyboardwriter_player_stats',
};

// Level XP requirements (exponential curve)
const LEVEL_XP_REQUIREMENTS: number[] = [
  0, // Level 1
  100, // Level 2
  250, // Level 3
  500, // Level 4
  850, // Level 5
  1300, // Level 6
  1900, // Level 7
  2650, // Level 8
  3550, // Level 9
  4600, // Level 10
  5850, // Level 11
  7300, // Level 12
  8950, // Level 13
  10800, // Level 14
  12900, // Level 15
  15250, // Level 16
  17850, // Level 17
  20700, // Level 18
  23800, // Level 19
  27150, // Level 20
  30750, // Level 21
  34600, // Level 22
  38700, // Level 23
  43050, // Level 24
  47650, // Level 25
];

export class StoryModeService {
  private storyProgress: StoryProgress;
  private playerStats: PlayerStats;
  private chapters: Chapter[] = [];

  constructor() {
    this.storyProgress = this.loadStoryProgress();
    this.playerStats = this.loadPlayerStats();
    this.initializeChapters();
  }

  private loadStoryProgress(): StoryProgress {
    const saved = StorageService.load<StoryProgress>(STORAGE_KEYS.STORY_PROGRESS);
    if (saved) {
      return saved;
    }

    return {
      currentChapter: 'chapter_1',
      currentQuest: 'quest_1_1',
      completedQuests: [],
      completedChapters: [],
      totalXpEarned: 0,
      totalCoinsEarned: 0,
      bossesDefeated: [],
      startedAt: Date.now(),
      lastPlayedAt: Date.now(),
    };
  }

  private loadPlayerStats(): PlayerStats {
    const saved = StorageService.load<PlayerStats>(STORAGE_KEYS.PLAYER_STATS);
    if (saved) {
      return saved;
    }

    return {
      level: 1,
      xp: 0,
      xpToNextLevel: LEVEL_XP_REQUIREMENTS[1],
      coins: 0,
      skillPoints: 0,
      totalPracticeTime: 0,
      highestWpm: 0,
      averageAccuracy: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  private saveProgress(): void {
    this.storyProgress.lastPlayedAt = Date.now();
    StorageService.save(STORAGE_KEYS.STORY_PROGRESS, this.storyProgress);
    StorageService.save(STORAGE_KEYS.PLAYER_STATS, this.playerStats);
  }

  private initializeChapters(): void {
    this.chapters = [
      // Chapter 1: The Beginning
      {
        id: 'chapter_1',
        title: 'The Beginning',
        titleDe: 'Der Anfang',
        description: 'Learn the fundamentals of touch typing',
        descriptionDe: 'Lerne die Grundlagen des Zehnfingersystems',
        icon: 'book',
        color: '#4CAF50',
        unlockRequirements: {},
        quests: [
          {
            id: 'quest_1_1',
            chapterId: 'chapter_1',
            title: 'First Steps',
            titleDe: 'Erste Schritte',
            description: 'Complete your first typing lesson',
            descriptionDe: 'Schliesse deine erste Tipp-Lektion ab',
            type: QuestType.LESSON_COMPLETE,
            difficulty: QuestDifficulty.BEGINNER,
            status: QuestStatus.AVAILABLE,
            requirements: [
              { type: QuestType.LESSON_COMPLETE, target: 1, current: 0, unit: 'lessons' },
            ],
            rewards: { xp: 50, coins: 10 },
            prerequisites: [],
            story: {
              intro:
                'Welcome, aspiring typist! Your journey to keyboard mastery begins here. Start with the basics and learn proper finger placement.',
              introDe:
                'Willkommen, angehender Tastatur-Meister! Deine Reise zur Tastatur-Beherrschung beginnt hier. Starte mit den Grundlagen und lerne die richtige Fingerhaltung.',
              completion:
                'Excellent! You have taken your first step. The path to mastery is long, but every journey begins with a single keystroke.',
              completionDe:
                'Ausgezeichnet! Du hast deinen ersten Schritt gemacht. Der Weg zur Meisterschaft ist lang, aber jede Reise beginnt mit einem einzelnen Tastenanschlag.',
            },
            hints: ['Focus on the home row keys: A, S, D, F and J, K, L, ;'],
          },
          {
            id: 'quest_1_2',
            chapterId: 'chapter_1',
            title: 'Finding Your Rhythm',
            titleDe: 'Deinen Rhythmus finden',
            description: 'Reach 20 WPM in a typing session',
            descriptionDe: 'Erreiche 20 WPM in einer Tipp-Sitzung',
            type: QuestType.TYPING_SPEED,
            difficulty: QuestDifficulty.BEGINNER,
            status: QuestStatus.LOCKED,
            requirements: [{ type: QuestType.TYPING_SPEED, target: 20, current: 0, unit: 'WPM' }],
            rewards: { xp: 75, coins: 15 },
            prerequisites: ['quest_1_1'],
            story: {
              intro:
                'Now that you know the basics, it is time to build some speed. Try to type at a steady pace.',
              introDe:
                'Jetzt, da du die Grundlagen kennst, ist es Zeit, etwas Geschwindigkeit aufzubauen. Versuche, in einem gleichmaessigen Tempo zu tippen.',
              completion: 'You are finding your rhythm! Speed will come naturally with practice.',
              completionDe:
                'Du findest deinen Rhythmus! Geschwindigkeit kommt natuerlich mit Uebung.',
            },
          },
          {
            id: 'quest_1_3',
            chapterId: 'chapter_1',
            title: 'Accuracy Matters',
            titleDe: 'Genauigkeit zaehlt',
            description: 'Achieve 90% accuracy in a lesson',
            descriptionDe: 'Erreiche 90% Genauigkeit in einer Lektion',
            type: QuestType.TYPING_ACCURACY,
            difficulty: QuestDifficulty.EASY,
            status: QuestStatus.LOCKED,
            requirements: [{ type: QuestType.TYPING_ACCURACY, target: 90, current: 0, unit: '%' }],
            rewards: { xp: 100, coins: 20 },
            prerequisites: ['quest_1_2'],
            story: {
              intro: 'Speed is nothing without accuracy. A true master types with precision.',
              introDe:
                'Geschwindigkeit ist nichts ohne Genauigkeit. Ein wahrer Meister tippt mit Praezision.',
              completion:
                'Impressive accuracy! Remember: it is better to type slowly and correctly than fast and full of errors.',
              completionDe:
                'Beeindruckende Genauigkeit! Denke daran: Es ist besser, langsam und korrekt zu tippen als schnell und voller Fehler.',
            },
          },
          {
            id: 'quest_1_4',
            chapterId: 'chapter_1',
            title: 'Practice Makes Perfect',
            titleDe: 'Uebung macht den Meister',
            description: 'Complete 5 lessons',
            descriptionDe: 'Schliesse 5 Lektionen ab',
            type: QuestType.LESSON_COMPLETE,
            difficulty: QuestDifficulty.EASY,
            status: QuestStatus.LOCKED,
            requirements: [
              { type: QuestType.LESSON_COMPLETE, target: 5, current: 0, unit: 'lessons' },
            ],
            rewards: { xp: 150, coins: 30, skillPoints: 1 },
            prerequisites: ['quest_1_3'],
            story: {
              intro: 'Consistency is key. Regular practice will cement your muscle memory.',
              introDe:
                'Bestaendigkeit ist der Schluessel. Regelmaessiges Ueben wird dein Muskelgedaechtnis festigen.',
              completion: 'Five lessons complete! Your fingers are beginning to remember the way.',
              completionDe:
                'Fuenf Lektionen abgeschlossen! Deine Finger beginnen, sich den Weg zu merken.',
            },
          },
          {
            id: 'quest_1_5',
            chapterId: 'chapter_1',
            title: 'Chapter Boss: The Novice Test',
            titleDe: 'Kapitel-Boss: Die Anfaengerprufung',
            description: 'Type at 25 WPM with 85% accuracy for 60 seconds',
            descriptionDe: 'Tippe mit 25 WPM und 85% Genauigkeit fuer 60 Sekunden',
            type: QuestType.BOSS_BATTLE,
            difficulty: QuestDifficulty.EASY,
            status: QuestStatus.LOCKED,
            requirements: [
              { type: QuestType.TYPING_SPEED, target: 25, current: 0, unit: 'WPM' },
              { type: QuestType.TYPING_ACCURACY, target: 85, current: 0, unit: '%' },
            ],
            rewards: { xp: 300, coins: 100, skillPoints: 2, achievement: 'chapter_1_complete' },
            prerequisites: ['quest_1_4'],
            timeLimit: 60,
            story: {
              intro: 'You have learned the basics. Now prove your worth in the Novice Test!',
              introDe:
                'Du hast die Grundlagen gelernt. Jetzt beweise deinen Wert in der Anfaengerprufung!',
              completion:
                'Chapter 1 Complete! You are no longer a beginner. The real journey begins now.',
              completionDe:
                'Kapitel 1 abgeschlossen! Du bist kein Anfaenger mehr. Die wahre Reise beginnt jetzt.',
            },
          },
        ],
        boss: {
          id: 'boss_1',
          name: 'The Novice Guardian',
          nameDe: 'Der Anfaenger-Waechter',
          avatar: 'guardian_novice',
          difficulty: QuestDifficulty.EASY,
          targetWpm: 25,
          targetAccuracy: 85,
          timeLimit: 60,
          dialogue: {
            intro: 'So, you wish to prove yourself? Show me what you have learned!',
            introDe: 'So, du willst dich beweisen? Zeig mir, was du gelernt hast!',
            taunt: 'Your fingers stumble. Focus!',
            tauntDe: 'Deine Finger stolpern. Konzentriere dich!',
            defeat: 'Impossible! You have bested me. Continue your journey...',
            defeatDe: 'Unmoeglich! Du hast mich besiegt. Setze deine Reise fort...',
            victory: 'Not fast enough. Practice more and return!',
            victoryDe: 'Nicht schnell genug. Uebe mehr und kehre zurueck!',
          },
          rewards: { xp: 300, coins: 100, skillPoints: 2 },
        },
      },
      // Chapter 2: Building Speed
      {
        id: 'chapter_2',
        title: 'Building Speed',
        titleDe: 'Geschwindigkeit aufbauen',
        description: 'Push your typing speed to new heights',
        descriptionDe: 'Bringe deine Tippgeschwindigkeit auf neue Hoehen',
        icon: 'flash',
        color: '#FF5722',
        unlockRequirements: { completedChapters: ['chapter_1'] },
        quests: [
          {
            id: 'quest_2_1',
            chapterId: 'chapter_2',
            title: 'Breaking Barriers',
            titleDe: 'Barrieren durchbrechen',
            description: 'Reach 40 WPM',
            descriptionDe: 'Erreiche 40 WPM',
            type: QuestType.TYPING_SPEED,
            difficulty: QuestDifficulty.MEDIUM,
            status: QuestStatus.LOCKED,
            requirements: [{ type: QuestType.TYPING_SPEED, target: 40, current: 0, unit: 'WPM' }],
            rewards: { xp: 200, coins: 40 },
            prerequisites: ['quest_1_5'],
            story: {
              intro:
                'Time to push your limits. 40 WPM is a milestone that separates beginners from intermediate typists.',
              introDe:
                'Zeit, deine Grenzen zu erweitern. 40 WPM ist ein Meilenstein, der Anfaenger von fortgeschrittenen Tippern trennt.',
              completion: '40 WPM achieved! You are officially an intermediate typist now.',
              completionDe:
                '40 WPM erreicht! Du bist jetzt offiziell ein fortgeschrittener Tipper.',
            },
          },
          {
            id: 'quest_2_2',
            chapterId: 'chapter_2',
            title: 'The Daily Discipline',
            titleDe: 'Die taegliche Disziplin',
            description: 'Maintain a 3-day streak',
            descriptionDe: 'Halte einen 3-Tage-Streak',
            type: QuestType.STREAK,
            difficulty: QuestDifficulty.MEDIUM,
            status: QuestStatus.LOCKED,
            requirements: [{ type: QuestType.STREAK, target: 3, current: 0, unit: 'days' }],
            rewards: { xp: 250, coins: 50, skillPoints: 1 },
            prerequisites: ['quest_2_1'],
            story: {
              intro:
                'True masters practice every day. Build your streak and your skills will follow.',
              introDe:
                'Wahre Meister ueben jeden Tag. Baue deinen Streak auf und deine Faehigkeiten werden folgen.',
              completion: 'Three days of dedication! Keep this momentum going.',
              completionDe: 'Drei Tage Hingabe! Halte diesen Schwung aufrecht.',
            },
          },
          {
            id: 'quest_2_3',
            chapterId: 'chapter_2',
            title: 'Speed and Precision',
            titleDe: 'Geschwindigkeit und Praezision',
            description: 'Reach 50 WPM with 92% accuracy',
            descriptionDe: 'Erreiche 50 WPM mit 92% Genauigkeit',
            type: QuestType.TYPING_SPEED,
            difficulty: QuestDifficulty.MEDIUM,
            status: QuestStatus.LOCKED,
            requirements: [
              { type: QuestType.TYPING_SPEED, target: 50, current: 0, unit: 'WPM' },
              { type: QuestType.TYPING_ACCURACY, target: 92, current: 0, unit: '%' },
            ],
            rewards: { xp: 300, coins: 60 },
            prerequisites: ['quest_2_2'],
            story: {
              intro: 'Speed without accuracy is useless. Master both.',
              introDe: 'Geschwindigkeit ohne Genauigkeit ist nutzlos. Meistere beides.',
              completion: 'Balance achieved! You type with both speed and precision.',
              completionDe: 'Balance erreicht! Du tippst mit Geschwindigkeit und Praezision.',
            },
          },
          {
            id: 'quest_2_4',
            chapterId: 'chapter_2',
            title: 'Endurance Test',
            titleDe: 'Ausdauer-Test',
            description: 'Practice for 30 minutes total',
            descriptionDe: 'Uebe insgesamt 30 Minuten',
            type: QuestType.PRACTICE_TIME,
            difficulty: QuestDifficulty.MEDIUM,
            status: QuestStatus.LOCKED,
            requirements: [
              { type: QuestType.PRACTICE_TIME, target: 30, current: 0, unit: 'minutes' },
            ],
            rewards: { xp: 350, coins: 70, skillPoints: 1 },
            prerequisites: ['quest_2_3'],
            story: {
              intro: 'Endurance is as important as speed. Build your typing stamina.',
              introDe:
                'Ausdauer ist genauso wichtig wie Geschwindigkeit. Baue deine Tipp-Ausdauer auf.',
              completion: '30 minutes of practice! Your stamina is growing.',
              completionDe: '30 Minuten Uebung! Deine Ausdauer waechst.',
            },
          },
          {
            id: 'quest_2_5',
            chapterId: 'chapter_2',
            title: 'Chapter Boss: The Speed Phantom',
            titleDe: 'Kapitel-Boss: Das Geschwindigkeits-Phantom',
            description: 'Defeat the Speed Phantom: 55 WPM with 90% accuracy',
            descriptionDe: 'Besiege das Geschwindigkeits-Phantom: 55 WPM mit 90% Genauigkeit',
            type: QuestType.BOSS_BATTLE,
            difficulty: QuestDifficulty.MEDIUM,
            status: QuestStatus.LOCKED,
            requirements: [
              { type: QuestType.TYPING_SPEED, target: 55, current: 0, unit: 'WPM' },
              { type: QuestType.TYPING_ACCURACY, target: 90, current: 0, unit: '%' },
            ],
            rewards: { xp: 500, coins: 150, skillPoints: 3, achievement: 'chapter_2_complete' },
            prerequisites: ['quest_2_4'],
            timeLimit: 90,
            story: {
              intro: 'The Speed Phantom awaits. Only the swift may pass!',
              introDe: 'Das Geschwindigkeits-Phantom wartet. Nur die Schnellen duerfen passieren!',
              completion: 'The Speed Phantom is defeated! Your speed is impressive.',
              completionDe:
                'Das Geschwindigkeits-Phantom ist besiegt! Deine Geschwindigkeit ist beeindruckend.',
            },
          },
        ],
        boss: {
          id: 'boss_2',
          name: 'The Speed Phantom',
          nameDe: 'Das Geschwindigkeits-Phantom',
          avatar: 'phantom_speed',
          difficulty: QuestDifficulty.MEDIUM,
          targetWpm: 55,
          targetAccuracy: 90,
          timeLimit: 90,
          dialogue: {
            intro: 'Can you keep up with my speed? Let us see!',
            introDe: 'Kannst du mit meiner Geschwindigkeit mithalten? Lass uns sehen!',
            taunt: 'Too slow! I expected more from you.',
            tauntDe: 'Zu langsam! Ich habe mehr von dir erwartet.',
            defeat: 'Impressive speed! You have earned my respect.',
            defeatDe: 'Beeindruckende Geschwindigkeit! Du hast meinen Respekt verdient.',
            victory: 'Perhaps with more practice... Try again!',
            victoryDe: 'Vielleicht mit mehr Uebung... Versuche es noch einmal!',
          },
          rewards: { xp: 500, coins: 150, skillPoints: 3 },
        },
      },
      // Chapter 3: Code Warrior
      {
        id: 'chapter_3',
        title: 'Code Warrior',
        titleDe: 'Code-Krieger',
        description: 'Master the syntax of programming',
        descriptionDe: 'Meistere die Syntax der Programmierung',
        icon: 'code',
        color: '#9C27B0',
        unlockRequirements: { completedChapters: ['chapter_2'], minLevel: 5 },
        quests: [
          {
            id: 'quest_3_1',
            chapterId: 'chapter_3',
            title: 'Bracket Mastery',
            titleDe: 'Klammer-Meisterschaft',
            description: 'Complete a special keys lesson with 85% accuracy',
            descriptionDe: 'Schliesse eine Sonderzeichen-Lektion mit 85% Genauigkeit ab',
            type: QuestType.SPECIAL_KEYS,
            difficulty: QuestDifficulty.MEDIUM,
            status: QuestStatus.LOCKED,
            requirements: [{ type: QuestType.SPECIAL_KEYS, target: 85, current: 0, unit: '%' }],
            rewards: { xp: 300, coins: 60 },
            prerequisites: ['quest_2_5'],
            story: {
              intro: 'Programming requires mastery of special characters. Start with brackets.',
              introDe:
                'Programmieren erfordert die Beherrschung von Sonderzeichen. Beginne mit Klammern.',
              completion: 'Brackets conquered! {[()]} are now your friends.',
              completionDe: 'Klammern bezwungen! {[()]} sind jetzt deine Freunde.',
            },
          },
          {
            id: 'quest_3_2',
            chapterId: 'chapter_3',
            title: 'Code Challenge I',
            titleDe: 'Code-Herausforderung I',
            description: 'Complete your first coding challenge',
            descriptionDe: 'Schliesse deine erste Coding-Herausforderung ab',
            type: QuestType.CODE_CHALLENGE,
            difficulty: QuestDifficulty.MEDIUM,
            status: QuestStatus.LOCKED,
            requirements: [
              { type: QuestType.CODE_CHALLENGE, target: 1, current: 0, unit: 'challenges' },
            ],
            rewards: { xp: 400, coins: 80, skillPoints: 1 },
            prerequisites: ['quest_3_1'],
            story: {
              intro: 'Time to put your skills to the test with real code!',
              introDe: 'Zeit, deine Faehigkeiten mit echtem Code zu testen!',
              completion:
                'Your first code challenge complete! The path of the programmer opens before you.',
              completionDe:
                'Deine erste Code-Herausforderung abgeschlossen! Der Weg des Programmierers oeffnet sich vor dir.',
            },
          },
          {
            id: 'quest_3_3',
            chapterId: 'chapter_3',
            title: 'The Polyglot Path',
            titleDe: 'Der Polyglotten-Pfad',
            description: 'Complete challenges in 3 different languages',
            descriptionDe: 'Schliesse Herausforderungen in 3 verschiedenen Sprachen ab',
            type: QuestType.CODE_CHALLENGE,
            difficulty: QuestDifficulty.HARD,
            status: QuestStatus.LOCKED,
            requirements: [
              { type: QuestType.CODE_CHALLENGE, target: 3, current: 0, unit: 'languages' },
            ],
            rewards: { xp: 500, coins: 100, skillPoints: 2 },
            prerequisites: ['quest_3_2'],
            story: {
              intro: 'A true programmer speaks many languages. Master multiple syntaxes.',
              introDe:
                'Ein wahrer Programmierer spricht viele Sprachen. Meistere mehrere Syntaxen.',
              completion: 'Polyglot achieved! Python, JavaScript, and more bow to your fingers.',
              completionDe:
                'Polyglott erreicht! Python, JavaScript und mehr verneigen sich vor deinen Fingern.',
            },
          },
          {
            id: 'quest_3_4',
            chapterId: 'chapter_3',
            title: 'Code Speed',
            titleDe: 'Code-Geschwindigkeit',
            description: 'Type code at 45 WPM with 88% accuracy',
            descriptionDe: 'Tippe Code mit 45 WPM und 88% Genauigkeit',
            type: QuestType.TYPING_SPEED,
            difficulty: QuestDifficulty.HARD,
            status: QuestStatus.LOCKED,
            requirements: [
              { type: QuestType.TYPING_SPEED, target: 45, current: 0, unit: 'WPM' },
              { type: QuestType.TYPING_ACCURACY, target: 88, current: 0, unit: '%' },
            ],
            rewards: { xp: 450, coins: 90 },
            prerequisites: ['quest_3_3'],
            story: {
              intro: 'Code has different rhythm than prose. Master its unique cadence.',
              introDe:
                'Code hat einen anderen Rhythmus als Prosa. Meistere seine einzigartige Kadenz.',
              completion: 'Your code flows like water! Syntax is no longer a barrier.',
              completionDe: 'Dein Code fliesst wie Wasser! Syntax ist keine Barriere mehr.',
            },
          },
          {
            id: 'quest_3_5',
            chapterId: 'chapter_3',
            title: 'Chapter Boss: The Syntax Serpent',
            titleDe: 'Kapitel-Boss: Die Syntax-Schlange',
            description: 'Type complex code at 50 WPM with 85% accuracy',
            descriptionDe: 'Tippe komplexen Code mit 50 WPM und 85% Genauigkeit',
            type: QuestType.BOSS_BATTLE,
            difficulty: QuestDifficulty.HARD,
            status: QuestStatus.LOCKED,
            requirements: [
              { type: QuestType.TYPING_SPEED, target: 50, current: 0, unit: 'WPM' },
              { type: QuestType.TYPING_ACCURACY, target: 85, current: 0, unit: '%' },
            ],
            rewards: { xp: 750, coins: 200, skillPoints: 4, achievement: 'chapter_3_complete' },
            prerequisites: ['quest_3_4'],
            timeLimit: 120,
            story: {
              intro: 'The Syntax Serpent guards the gates of advanced programming. Face it!',
              introDe:
                'Die Syntax-Schlange bewacht die Tore des fortgeschrittenen Programmierens. Stelle dich ihr!',
              completion: 'The Syntax Serpent falls! You are now a true Code Warrior.',
              completionDe: 'Die Syntax-Schlange faellt! Du bist jetzt ein wahrer Code-Krieger.',
            },
          },
        ],
        boss: {
          id: 'boss_3',
          name: 'The Syntax Serpent',
          nameDe: 'Die Syntax-Schlange',
          avatar: 'serpent_syntax',
          difficulty: QuestDifficulty.HARD,
          targetWpm: 50,
          targetAccuracy: 85,
          timeLimit: 120,
          dialogue: {
            intro: 'Sssso, you think you can code? Show me your ssskills!',
            introDe: 'Sssso, du glaubst, du kannst coden? Zeig mir deine Faehigkeiten!',
            taunt: 'Sssyntax errors everywhere! How dissappointing.',
            tauntDe: 'Sssyntax-Fehler ueberall! Wie enttaeuschend.',
            defeat: 'Impresssive! You have mastered the sssyntax.',
            defeatDe: 'Beeindruckend! Du hast die Sssyntax gemeistert.',
            victory: 'More practice needed, young coder. Return when you are ready.',
            victoryDe: 'Mehr Uebung noetig, junger Coder. Komm zurueck, wenn du bereit bist.',
          },
          rewards: { xp: 750, coins: 200, skillPoints: 4 },
        },
      },
    ];
  }

  // Get all chapters
  getChapters(): Chapter[] {
    return this.chapters.map(chapter => ({
      ...chapter,
      quests: chapter.quests.map(quest => this.updateQuestStatus(quest)),
    }));
  }

  // Get a specific chapter
  getChapter(chapterId: string): Chapter | undefined {
    const chapter = this.chapters.find(c => c.id === chapterId);
    if (!chapter) {
      return undefined;
    }

    return {
      ...chapter,
      quests: chapter.quests.map(quest => this.updateQuestStatus(quest)),
    };
  }

  // Get current quest
  getCurrentQuest(): Quest | undefined {
    for (const chapter of this.chapters) {
      const quest = chapter.quests.find(q => q.id === this.storyProgress.currentQuest);
      if (quest) {
        return this.updateQuestStatus(quest);
      }
    }
    return undefined;
  }

  // Update quest status based on progress
  private updateQuestStatus(quest: Quest): Quest {
    const updatedQuest = { ...quest };

    if (this.storyProgress.completedQuests.includes(quest.id)) {
      updatedQuest.status = QuestStatus.COMPLETED;
    } else if (quest.id === this.storyProgress.currentQuest) {
      updatedQuest.status = QuestStatus.IN_PROGRESS;
    } else if (this.arePrerequisitesMet(quest.prerequisites)) {
      updatedQuest.status = QuestStatus.AVAILABLE;
    } else {
      updatedQuest.status = QuestStatus.LOCKED;
    }

    return updatedQuest;
  }

  // Check if prerequisites are met
  private arePrerequisitesMet(prerequisites: string[]): boolean {
    return prerequisites.every(prereq => this.storyProgress.completedQuests.includes(prereq));
  }

  // Start a quest
  startQuest(questId: string): boolean {
    const quest = this.findQuest(questId);
    if (!quest) {
      return false;
    }

    if (quest.status === QuestStatus.AVAILABLE || quest.status === QuestStatus.IN_PROGRESS) {
      this.storyProgress.currentQuest = questId;
      this.saveProgress();
      EventBus.emit('quest:started', { quest });
      return true;
    }

    return false;
  }

  // Update quest progress
  updateQuestProgress(type: QuestType, value: number): void {
    const currentQuest = this.getCurrentQuest();
    if (!currentQuest) {
      return;
    }

    let updated = false;
    for (const req of currentQuest.requirements) {
      if (req.type === type) {
        req.current = Math.max(req.current, value);
        updated = true;
      }
    }

    if (updated) {
      this.saveProgress();
      EventBus.emit('quest:progress', { quest: currentQuest });

      // Check if quest is complete
      if (this.isQuestComplete(currentQuest)) {
        this.completeQuest(currentQuest.id);
      }
    }
  }

  // Check if quest is complete
  private isQuestComplete(quest: Quest): boolean {
    return quest.requirements.every(req => req.current >= req.target);
  }

  // Complete a quest
  completeQuest(questId: string): void {
    const quest = this.findQuest(questId);
    if (!quest || this.storyProgress.completedQuests.includes(questId)) {
      return;
    }

    // Add to completed
    this.storyProgress.completedQuests.push(questId);

    // Award rewards
    this.awardRewards(quest.rewards);

    // Check for chapter completion
    const chapter = this.chapters.find(c => c.id === quest.chapterId);
    if (chapter) {
      const allQuestsComplete = chapter.quests.every(q =>
        this.storyProgress.completedQuests.includes(q.id)
      );
      if (allQuestsComplete && !this.storyProgress.completedChapters.includes(chapter.id)) {
        this.completeChapter(chapter.id);
      }
    }

    // Set next quest
    this.setNextQuest(quest);

    this.saveProgress();
    EventBus.emit('quest:completed', { quest, rewards: quest.rewards });
  }

  // Complete a chapter
  private completeChapter(chapterId: string): void {
    if (!this.storyProgress.completedChapters.includes(chapterId)) {
      this.storyProgress.completedChapters.push(chapterId);
      EventBus.emit('chapter:completed', { chapterId });
    }
  }

  // Set the next available quest
  private setNextQuest(completedQuest: Quest): void {
    const chapter = this.chapters.find(c => c.id === completedQuest.chapterId);
    if (!chapter) {
      return;
    }

    // Find next quest in chapter
    const questIndex = chapter.quests.findIndex(q => q.id === completedQuest.id);
    if (questIndex < chapter.quests.length - 1) {
      this.storyProgress.currentQuest = chapter.quests[questIndex + 1].id;
      return;
    }

    // Find next chapter
    const chapterIndex = this.chapters.findIndex(c => c.id === chapter.id);
    if (chapterIndex < this.chapters.length - 1) {
      const nextChapter = this.chapters[chapterIndex + 1];
      if (this.isChapterUnlocked(nextChapter)) {
        this.storyProgress.currentChapter = nextChapter.id;
        this.storyProgress.currentQuest = nextChapter.quests[0].id;
      }
    }
  }

  // Check if chapter is unlocked
  isChapterUnlocked(chapter: Chapter): boolean {
    const reqs = chapter.unlockRequirements;

    if (reqs.completedChapters) {
      if (!reqs.completedChapters.every(c => this.storyProgress.completedChapters.includes(c))) {
        return false;
      }
    }

    if (reqs.minLevel && this.playerStats.level < reqs.minLevel) {
      return false;
    }

    if (reqs.minWpm && this.playerStats.highestWpm < reqs.minWpm) {
      return false;
    }

    return true;
  }

  // Find a quest by ID
  private findQuest(questId: string): Quest | undefined {
    for (const chapter of this.chapters) {
      const quest = chapter.quests.find(q => q.id === questId);
      if (quest) {
        return quest;
      }
    }
    return undefined;
  }

  // Award rewards
  private awardRewards(rewards: QuestReward): void {
    this.storyProgress.totalXpEarned += rewards.xp;
    this.storyProgress.totalCoinsEarned += rewards.coins;

    this.playerStats.coins += rewards.coins;
    if (rewards.skillPoints) {
      this.playerStats.skillPoints += rewards.skillPoints;
    }

    this.addXP(rewards.xp);
  }

  // Add XP and handle level ups
  addXP(amount: number): void {
    this.playerStats.xp += amount;

    while (
      this.playerStats.level < LEVEL_XP_REQUIREMENTS.length - 1 &&
      this.playerStats.xp >= LEVEL_XP_REQUIREMENTS[this.playerStats.level]
    ) {
      this.playerStats.xp -= LEVEL_XP_REQUIREMENTS[this.playerStats.level];
      this.playerStats.level++;
      this.playerStats.skillPoints++;

      EventBus.emit('player:levelup', {
        level: this.playerStats.level,
        skillPoints: this.playerStats.skillPoints,
      });
    }

    this.playerStats.xpToNextLevel =
      this.playerStats.level < LEVEL_XP_REQUIREMENTS.length - 1
        ? LEVEL_XP_REQUIREMENTS[this.playerStats.level] - this.playerStats.xp
        : 0;

    this.saveProgress();
  }

  // Get player stats
  getPlayerStats(): PlayerStats {
    return { ...this.playerStats };
  }

  // Get story progress
  getStoryProgress(): StoryProgress {
    return { ...this.storyProgress };
  }

  // Update typing stats
  updateTypingStats(wpm: number, accuracy: number, practiceTime: number): void {
    if (wpm > this.playerStats.highestWpm) {
      this.playerStats.highestWpm = wpm;
    }

    this.playerStats.totalPracticeTime += practiceTime;

    // Update average accuracy (weighted)
    const totalSessions = Math.floor(this.playerStats.totalPracticeTime / 60) || 1;
    this.playerStats.averageAccuracy =
      (this.playerStats.averageAccuracy * (totalSessions - 1) + accuracy) / totalSessions;

    // Update quest progress
    this.updateQuestProgress(QuestType.TYPING_SPEED, wpm);
    this.updateQuestProgress(QuestType.TYPING_ACCURACY, accuracy);
    this.updateQuestProgress(QuestType.PRACTICE_TIME, this.playerStats.totalPracticeTime / 60);

    this.saveProgress();
  }

  // Update streak
  updateStreak(streak: number): void {
    this.playerStats.currentStreak = streak;
    if (streak > this.playerStats.longestStreak) {
      this.playerStats.longestStreak = streak;
    }
    this.updateQuestProgress(QuestType.STREAK, streak);
    this.saveProgress();
  }

  // Boss battle methods
  startBossBattle(bossId: string): BossBattle | undefined {
    for (const chapter of this.chapters) {
      if (chapter.boss?.id === bossId) {
        EventBus.emit('boss:battle:start', { boss: chapter.boss });
        return chapter.boss;
      }
    }
    return undefined;
  }

  completeBossBattle(bossId: string, success: boolean, wpm: number, accuracy: number): void {
    const boss = this.findBoss(bossId);
    if (!boss) {
      return;
    }

    if (success) {
      if (!this.storyProgress.bossesDefeated.includes(bossId)) {
        this.storyProgress.bossesDefeated.push(bossId);
        this.awardRewards(boss.rewards);
      }
      EventBus.emit('boss:battle:victory', { boss, wpm, accuracy });
    } else {
      EventBus.emit('boss:battle:defeat', { boss, wpm, accuracy });
    }

    this.saveProgress();
  }

  private findBoss(bossId: string): BossBattle | undefined {
    for (const chapter of this.chapters) {
      if (chapter.boss?.id === bossId) {
        return chapter.boss;
      }
    }
    return undefined;
  }

  // Reset progress (for testing)
  resetProgress(): void {
    this.storyProgress = {
      currentChapter: 'chapter_1',
      currentQuest: 'quest_1_1',
      completedQuests: [],
      completedChapters: [],
      totalXpEarned: 0,
      totalCoinsEarned: 0,
      bossesDefeated: [],
      startedAt: Date.now(),
      lastPlayedAt: Date.now(),
    };
    this.playerStats = {
      level: 1,
      xp: 0,
      xpToNextLevel: LEVEL_XP_REQUIREMENTS[1],
      coins: 0,
      skillPoints: 0,
      totalPracticeTime: 0,
      highestWpm: 0,
      averageAccuracy: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
    this.saveProgress();
  }
}

export const storyModeService = new StoryModeService();
