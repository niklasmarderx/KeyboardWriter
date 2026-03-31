/**
 * Achievement categories
 */
export type AchievementCategory =
  | 'speed'
  | 'accuracy'
  | 'consistency'
  | 'milestones'
  | 'special'
  | 'languages'
  | 'race';

/**
 * Achievement rarity
 */
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * Achievement definition
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  xpReward: number;
  requirement: AchievementRequirement;
  hidden?: boolean;
}

/**
 * Achievement requirement types
 */
export type AchievementRequirement =
  | { type: 'wpm'; value: number }
  | { type: 'accuracy'; value: number }
  | { type: 'streak'; value: number }
  | { type: 'sessions'; value: number }
  | { type: 'lessons'; value: number }
  | { type: 'keystrokes'; value: number }
  | { type: 'practice_time'; value: number } // in minutes
  | { type: 'perfect_sessions'; value: number }
  | { type: 'code_snippets'; value: number }
  | { type: 'level'; value: number }
  | { type: 'race_wins'; value: number }
  | { type: 'race_wpm'; value: number }
  | { type: 'language_snippets'; value: number; language: string };

/**
 * User's achievement progress
 */
export interface UserAchievement {
  achievementId: string;
  unlockedAt: number;
  progress: number; // 0-100
}

/**
 * XP Level thresholds
 */
export const LEVEL_XP_THRESHOLDS: number[] = [
  0, // Level 1
  100, // Level 2
  250, // Level 3
  500, // Level 4
  850, // Level 5
  1300, // Level 6
  1850, // Level 7
  2500, // Level 8
  3250, // Level 9
  4100, // Level 10
  5050, // Level 11
  6100, // Level 12
  7250, // Level 13
  8500, // Level 14
  9850, // Level 15
  11300, // Level 16
  12850, // Level 17
  14500, // Level 18
  16250, // Level 19
  18100, // Level 20
  20050, // Level 21
  22100, // Level 22
  24250, // Level 23
  26500, // Level 24
  28850, // Level 25
];

/**
 * Calculate level from XP
 */
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Get XP needed for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_XP_THRESHOLDS.length) {
    return (
      LEVEL_XP_THRESHOLDS[LEVEL_XP_THRESHOLDS.length - 1] +
      (currentLevel - LEVEL_XP_THRESHOLDS.length + 1) * 2500
    );
  }
  return LEVEL_XP_THRESHOLDS[currentLevel];
}

/**
 * Get current level progress percentage
 */
export function getLevelProgress(xp: number, level: number): number {
  const currentLevelXP = LEVEL_XP_THRESHOLDS[level - 1] || 0;
  const nextLevelXP = getXPForNextLevel(level);
  const xpInCurrentLevel = xp - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  return Math.min(Math.round((xpInCurrentLevel / xpNeededForLevel) * 100), 100);
}

/**
 * All achievements definitions
 */
export const ACHIEVEMENTS: Achievement[] = [
  // Speed Achievements
  {
    id: 'speed_beginner',
    name: 'Schnellstarter',
    description: 'Erreiche 20 WPM',
    category: 'speed',
    rarity: 'common',
    icon: 'speedometer',
    xpReward: 25,
    requirement: { type: 'wpm', value: 20 },
  },
  {
    id: 'speed_intermediate',
    name: 'Flotte Finger',
    description: 'Erreiche 40 WPM',
    category: 'speed',
    rarity: 'uncommon',
    icon: 'speedometer',
    xpReward: 50,
    requirement: { type: 'wpm', value: 40 },
  },
  {
    id: 'speed_advanced',
    name: 'Turbo-Tipper',
    description: 'Erreiche 60 WPM',
    category: 'speed',
    rarity: 'rare',
    icon: 'speedometer',
    xpReward: 100,
    requirement: { type: 'wpm', value: 60 },
  },
  {
    id: 'speed_expert',
    name: 'Blitzschnell',
    description: 'Erreiche 80 WPM',
    category: 'speed',
    rarity: 'epic',
    icon: 'speedometer',
    xpReward: 200,
    requirement: { type: 'wpm', value: 80 },
  },
  {
    id: 'speed_master',
    name: 'Tastatur-Meister',
    description: 'Erreiche 100 WPM',
    category: 'speed',
    rarity: 'legendary',
    icon: 'speedometer',
    xpReward: 500,
    requirement: { type: 'wpm', value: 100 },
  },

  // Accuracy Achievements
  {
    id: 'accuracy_good',
    name: 'Präzise',
    description: 'Erreiche 90% Genauigkeit',
    category: 'accuracy',
    rarity: 'common',
    icon: 'target',
    xpReward: 25,
    requirement: { type: 'accuracy', value: 90 },
  },
  {
    id: 'accuracy_great',
    name: 'Scharfschütze',
    description: 'Erreiche 95% Genauigkeit',
    category: 'accuracy',
    rarity: 'uncommon',
    icon: 'target',
    xpReward: 50,
    requirement: { type: 'accuracy', value: 95 },
  },
  {
    id: 'accuracy_excellent',
    name: 'Perfektionist',
    description: 'Erreiche 98% Genauigkeit',
    category: 'accuracy',
    rarity: 'rare',
    icon: 'target',
    xpReward: 100,
    requirement: { type: 'accuracy', value: 98 },
  },
  {
    id: 'accuracy_perfect',
    name: 'Fehlerfrei',
    description: 'Erreiche 100% Genauigkeit in einer Session',
    category: 'accuracy',
    rarity: 'epic',
    icon: 'target',
    xpReward: 200,
    requirement: { type: 'accuracy', value: 100 },
  },

  // Consistency Achievements (Streaks)
  {
    id: 'streak_3',
    name: 'Am Ball bleiben',
    description: '3-Tage-Streak',
    category: 'consistency',
    rarity: 'common',
    icon: 'flame',
    xpReward: 30,
    requirement: { type: 'streak', value: 3 },
  },
  {
    id: 'streak_7',
    name: 'Wochenkrieger',
    description: '7-Tage-Streak',
    category: 'consistency',
    rarity: 'uncommon',
    icon: 'flame',
    xpReward: 75,
    requirement: { type: 'streak', value: 7 },
  },
  {
    id: 'streak_14',
    name: 'Zwei-Wochen-Champion',
    description: '14-Tage-Streak',
    category: 'consistency',
    rarity: 'rare',
    icon: 'flame',
    xpReward: 150,
    requirement: { type: 'streak', value: 14 },
  },
  {
    id: 'streak_30',
    name: 'Monatliche Hingabe',
    description: '30-Tage-Streak',
    category: 'consistency',
    rarity: 'epic',
    icon: 'flame',
    xpReward: 350,
    requirement: { type: 'streak', value: 30 },
  },
  {
    id: 'streak_100',
    name: 'Unaufhaltsam',
    description: '100-Tage-Streak',
    category: 'consistency',
    rarity: 'legendary',
    icon: 'flame',
    xpReward: 1000,
    requirement: { type: 'streak', value: 100 },
  },

  // Milestone Achievements
  {
    id: 'sessions_10',
    name: 'Erste Schritte',
    description: 'Schließe 10 Sessions ab',
    category: 'milestones',
    rarity: 'common',
    icon: 'check',
    xpReward: 20,
    requirement: { type: 'sessions', value: 10 },
  },
  {
    id: 'sessions_50',
    name: 'Regelmäßiger Übender',
    description: 'Schließe 50 Sessions ab',
    category: 'milestones',
    rarity: 'uncommon',
    icon: 'check',
    xpReward: 75,
    requirement: { type: 'sessions', value: 50 },
  },
  {
    id: 'sessions_100',
    name: 'Engagierter Lerner',
    description: 'Schließe 100 Sessions ab',
    category: 'milestones',
    rarity: 'rare',
    icon: 'check',
    xpReward: 150,
    requirement: { type: 'sessions', value: 100 },
  },
  {
    id: 'sessions_500',
    name: 'Veteran',
    description: 'Schließe 500 Sessions ab',
    category: 'milestones',
    rarity: 'epic',
    icon: 'check',
    xpReward: 400,
    requirement: { type: 'sessions', value: 500 },
  },
  {
    id: 'lessons_5',
    name: 'Lektionenlerner',
    description: 'Schließe 5 Lektionen ab',
    category: 'milestones',
    rarity: 'common',
    icon: 'book',
    xpReward: 30,
    requirement: { type: 'lessons', value: 5 },
  },
  {
    id: 'lessons_all',
    name: 'Curriculum-Meister',
    description: 'Schließe alle Lektionen ab',
    category: 'milestones',
    rarity: 'legendary',
    icon: 'book',
    xpReward: 500,
    requirement: { type: 'lessons', value: 30 },
  },
  {
    id: 'keystrokes_10k',
    name: 'Fleißige Finger',
    description: '10.000 Tastenanschläge',
    category: 'milestones',
    rarity: 'common',
    icon: 'keyboard',
    xpReward: 25,
    requirement: { type: 'keystrokes', value: 10000 },
  },
  {
    id: 'keystrokes_100k',
    name: 'Tastatur-Marathon',
    description: '100.000 Tastenanschläge',
    category: 'milestones',
    rarity: 'rare',
    icon: 'keyboard',
    xpReward: 150,
    requirement: { type: 'keystrokes', value: 100000 },
  },
  {
    id: 'keystrokes_1m',
    name: 'Millionen-Klicker',
    description: '1.000.000 Tastenanschläge',
    category: 'milestones',
    rarity: 'legendary',
    icon: 'keyboard',
    xpReward: 750,
    requirement: { type: 'keystrokes', value: 1000000 },
  },
  {
    id: 'practice_1h',
    name: 'Zeit investiert',
    description: '1 Stunde Übungszeit',
    category: 'milestones',
    rarity: 'common',
    icon: 'clock',
    xpReward: 30,
    requirement: { type: 'practice_time', value: 60 },
  },
  {
    id: 'practice_10h',
    name: 'Ausdauernd',
    description: '10 Stunden Übungszeit',
    category: 'milestones',
    rarity: 'rare',
    icon: 'clock',
    xpReward: 200,
    requirement: { type: 'practice_time', value: 600 },
  },
  {
    id: 'practice_100h',
    name: 'Zeitlos engagiert',
    description: '100 Stunden Übungszeit',
    category: 'milestones',
    rarity: 'legendary',
    icon: 'clock',
    xpReward: 1000,
    requirement: { type: 'practice_time', value: 6000 },
  },

  // Special Achievements
  {
    id: 'perfect_session_1',
    name: 'Makellos',
    description: 'Erste perfekte Session (100% Genauigkeit)',
    category: 'special',
    rarity: 'rare',
    icon: 'star',
    xpReward: 100,
    requirement: { type: 'perfect_sessions', value: 1 },
  },
  {
    id: 'perfect_session_10',
    name: 'Perfektion personifiziert',
    description: '10 perfekte Sessions',
    category: 'special',
    rarity: 'epic',
    icon: 'star',
    xpReward: 300,
    requirement: { type: 'perfect_sessions', value: 10 },
  },
  {
    id: 'code_beginner',
    name: 'Code-Anfänger',
    description: 'Tippe 5 Code-Snippets',
    category: 'special',
    rarity: 'uncommon',
    icon: 'code',
    xpReward: 50,
    requirement: { type: 'code_snippets', value: 5 },
  },
  {
    id: 'code_developer',
    name: 'Entwickler',
    description: 'Tippe 25 Code-Snippets',
    category: 'special',
    rarity: 'rare',
    icon: 'code',
    xpReward: 150,
    requirement: { type: 'code_snippets', value: 25 },
  },
  {
    id: 'code_ninja',
    name: 'Code-Ninja',
    description: 'Tippe 100 Code-Snippets',
    category: 'special',
    rarity: 'epic',
    icon: 'code',
    xpReward: 400,
    requirement: { type: 'code_snippets', value: 100 },
  },
  {
    id: 'level_5',
    name: 'Aufsteiger',
    description: 'Erreiche Level 5',
    category: 'special',
    rarity: 'common',
    icon: 'trophy',
    xpReward: 50,
    requirement: { type: 'level', value: 5 },
  },
  {
    id: 'level_10',
    name: 'Fortgeschritten',
    description: 'Erreiche Level 10',
    category: 'special',
    rarity: 'uncommon',
    icon: 'trophy',
    xpReward: 100,
    requirement: { type: 'level', value: 10 },
  },
  {
    id: 'level_15',
    name: 'Experte',
    description: 'Erreiche Level 15',
    category: 'special',
    rarity: 'rare',
    icon: 'trophy',
    xpReward: 200,
    requirement: { type: 'level', value: 15 },
  },
  {
    id: 'level_20',
    name: 'Meister',
    description: 'Erreiche Level 20',
    category: 'special',
    rarity: 'epic',
    icon: 'trophy',
    xpReward: 350,
    requirement: { type: 'level', value: 20 },
  },
  {
    id: 'level_25',
    name: 'Großmeister',
    description: 'Erreiche Level 25',
    category: 'special',
    rarity: 'legendary',
    icon: 'trophy',
    xpReward: 500,
    requirement: { type: 'level', value: 25 },
  },

  // Race Achievements
  {
    id: 'race_first_win',
    name: 'Erster Sieg',
    description: 'Gewinne dein erstes Rennen gegen die KI',
    category: 'race',
    rarity: 'common',
    icon: 'speedometer',
    xpReward: 50,
    requirement: { type: 'race_wins', value: 1 },
  },
  {
    id: 'race_10_wins',
    name: 'Rennfahrer',
    description: 'Gewinne 10 Rennen',
    category: 'race',
    rarity: 'uncommon',
    icon: 'speedometer',
    xpReward: 100,
    requirement: { type: 'race_wins', value: 10 },
  },
  {
    id: 'race_speed_demon',
    name: 'Geschwindigkeitsteufel',
    description: 'Erreiche 80 WPM in einem Rennen',
    category: 'race',
    rarity: 'rare',
    icon: 'flame',
    xpReward: 150,
    requirement: { type: 'race_wpm', value: 80 },
  },
  {
    id: 'race_100wpm',
    name: 'Unaufhaltbar',
    description: 'Erreiche 100 WPM in einem Rennen',
    category: 'race',
    rarity: 'epic',
    icon: 'flame',
    xpReward: 300,
    requirement: { type: 'race_wpm', value: 100 },
  },

  // Language Achievements
  {
    id: 'lang_rust',
    name: 'Rust-Enthusiast',
    description: 'Schreibe 5 Rust-Snippets',
    category: 'languages',
    rarity: 'uncommon',
    icon: 'code',
    xpReward: 75,
    requirement: { type: 'language_snippets', value: 5, language: 'rust' },
  },
  {
    id: 'lang_go',
    name: 'Gopher',
    description: 'Schreibe 5 Go-Snippets',
    category: 'languages',
    rarity: 'uncommon',
    icon: 'code',
    xpReward: 75,
    requirement: { type: 'language_snippets', value: 5, language: 'go' },
  },
  {
    id: 'lang_python',
    name: 'Pythonista',
    description: 'Schreibe 5 Python-Snippets',
    category: 'languages',
    rarity: 'uncommon',
    icon: 'code',
    xpReward: 75,
    requirement: { type: 'language_snippets', value: 5, language: 'python' },
  },
  {
    id: 'lang_polyglot',
    name: 'Polyglott',
    description: 'Schreibe Snippets in 5 verschiedenen Sprachen',
    category: 'languages',
    rarity: 'epic',
    icon: 'code',
    xpReward: 250,
    requirement: { type: 'code_snippets', value: 25 },
  },
  {
    id: 'lang_sql_expert',
    name: 'Datenbankprofi',
    description: 'Schreibe 10 SQL-Queries',
    category: 'languages',
    rarity: 'rare',
    icon: 'code',
    xpReward: 120,
    requirement: { type: 'language_snippets', value: 10, language: 'sql' },
  },

  // Speed milestones
  {
    id: 'speed_120',
    name: 'Schallmauer',
    description: 'Erreiche 120 WPM',
    category: 'speed',
    rarity: 'legendary',
    icon: 'speedometer',
    xpReward: 1000,
    requirement: { type: 'wpm', value: 120 },
    hidden: true,
  },
];

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

/**
 * Get rarity color
 */
export function getRarityColor(rarity: AchievementRarity): string {
  const colors: Record<AchievementRarity, string> = {
    common: '#9CA3AF',
    uncommon: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B',
  };
  return colors[rarity];
}

/**
 * Get rarity label (German)
 */
export function getRarityLabel(rarity: AchievementRarity): string {
  const labels: Record<AchievementRarity, string> = {
    common: 'Gewöhnlich',
    uncommon: 'Ungewöhnlich',
    rare: 'Selten',
    epic: 'Episch',
    legendary: 'Legendär',
  };
  return labels[rarity];
}

/**
 * Get category label (German)
 */
export function getCategoryLabel(category: AchievementCategory): string {
  const labels: Record<AchievementCategory, string> = {
    speed: 'Geschwindigkeit',
    accuracy: 'Genauigkeit',
    consistency: 'Beständigkeit',
    milestones: 'Meilensteine',
    special: 'Spezial',
    languages: 'Sprachen',
    race: 'Rennen',
  };
  return labels[category];
}
