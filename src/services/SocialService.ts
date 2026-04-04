/**
 * Social Service
 * Handles leaderboards, sharing, and data export/import
 */

import { StorageService, Store } from '../core';
import { User } from '../domain/models';
import { ACHIEVEMENTS, getAchievementById } from '../domain/models/Achievement';

// Leaderboard Entry Interface
interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  wpm: number;
  accuracy: number;
  level: number;
  streak: number;
  lessonsCompleted: number;
  achievements: number;
  isCurrentUser: boolean;
}

// Mock leaderboard data for demonstration
const MOCK_LEADERBOARD: Omit<LeaderboardEntry, 'isCurrentUser'>[] = [
  {
    id: 'user1',
    name: 'SpeedTyper_Pro',
    avatar: 'ST',
    wpm: 142,
    accuracy: 98,
    level: 25,
    streak: 45,
    lessonsCompleted: 180,
    achievements: 42,
  },
  {
    id: 'user2',
    name: 'CodeNinja',
    avatar: 'CN',
    wpm: 128,
    accuracy: 97,
    level: 22,
    streak: 30,
    lessonsCompleted: 156,
    achievements: 38,
  },
  {
    id: 'user3',
    name: 'KeyboardMaster',
    avatar: 'KM',
    wpm: 118,
    accuracy: 96,
    level: 20,
    streak: 28,
    lessonsCompleted: 142,
    achievements: 35,
  },
  {
    id: 'user4',
    name: 'TypingWizard',
    avatar: 'TW',
    wpm: 112,
    accuracy: 95,
    level: 18,
    streak: 21,
    lessonsCompleted: 128,
    achievements: 30,
  },
  {
    id: 'user5',
    name: 'SwiftFingers',
    avatar: 'SF',
    wpm: 105,
    accuracy: 94,
    level: 17,
    streak: 18,
    lessonsCompleted: 115,
    achievements: 28,
  },
  {
    id: 'user6',
    name: 'ByteRunner',
    avatar: 'BR',
    wpm: 98,
    accuracy: 93,
    level: 15,
    streak: 14,
    lessonsCompleted: 98,
    achievements: 24,
  },
  {
    id: 'user7',
    name: 'DigitalDash',
    avatar: 'DD',
    wpm: 92,
    accuracy: 92,
    level: 14,
    streak: 12,
    lessonsCompleted: 85,
    achievements: 22,
  },
  {
    id: 'user8',
    name: 'KeyStorm',
    avatar: 'KS',
    wpm: 88,
    accuracy: 91,
    level: 13,
    streak: 10,
    lessonsCompleted: 78,
    achievements: 20,
  },
  {
    id: 'user9',
    name: 'TypeTurbo',
    avatar: 'TT',
    wpm: 82,
    accuracy: 90,
    level: 12,
    streak: 8,
    lessonsCompleted: 65,
    achievements: 18,
  },
  {
    id: 'user10',
    name: 'CodeCrusher',
    avatar: 'CC',
    wpm: 76,
    accuracy: 89,
    level: 11,
    streak: 6,
    lessonsCompleted: 52,
    achievements: 15,
  },
];

type SortField = 'wpm' | 'accuracy' | 'level' | 'streak' | 'lessonsCompleted' | 'achievements';

class SocialServiceClass {
  private static instance: SocialServiceClass;

  private constructor() {}

  static getInstance(): SocialServiceClass {
    if (!SocialServiceClass.instance) {
      SocialServiceClass.instance = new SocialServiceClass();
    }
    return SocialServiceClass.instance;
  }

  /**
   * Get leaderboard with current user included
   */
  getLeaderboard(sortBy: SortField = 'wpm'): LeaderboardEntry[] {
    const user = Store.getState().user;

    // Create current user entry
    const currentUserEntry: LeaderboardEntry = {
      id: user.id,
      name: 'Du',
      avatar: 'DU',
      wpm: user.statistics.averageWPM,
      accuracy: user.statistics.averageAccuracy,
      level: user.level,
      streak: user.statistics.currentStreak,
      lessonsCompleted: user.statistics.totalLessonsCompleted,
      achievements: user.achievements.length,
      isCurrentUser: true,
    };

    // Combine mock data with current user
    const allEntries: LeaderboardEntry[] = [
      ...MOCK_LEADERBOARD.map(e => ({ ...e, isCurrentUser: false })),
      currentUserEntry,
    ];

    // Sort by specified field
    allEntries.sort((a, b) => b[sortBy] - a[sortBy]);

    return allEntries;
  }

  /**
   * Get current user's rank for a specific metric
   */
  getUserRank(sortBy: SortField = 'wpm'): { rank: number; total: number } {
    const leaderboard = this.getLeaderboard(sortBy);
    const userIndex = leaderboard.findIndex(e => e.isCurrentUser);
    return {
      rank: userIndex + 1,
      total: leaderboard.length,
    };
  }

  /**
   * Export user data as JSON
   */
  exportAsJSON(): string {
    const user = Store.getState().user;
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      user: {
        id: user.id,
        level: user.level,
        xp: user.xp,
        statistics: user.statistics,
        achievements: user.achievements,
        settings: user.settings,
        createdAt: user.createdAt,
      },
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export statistics as CSV
   */
  exportStatisticsAsCSV(): string {
    const user = Store.getState().user;
    const stats = user.statistics;

    const headers = ['Metrik', 'Wert'];

    const practiceMinutes = Math.round(stats.totalPracticeTimeMs / 60000);

    const rows = [
      ['Durchschnitt WPM', stats.averageWPM.toString()],
      ['Höchste WPM', stats.peakWPM.toString()],
      ['Durchschnitt Genauigkeit (%)', stats.averageAccuracy.toString()],
      ['Gesamte Übungszeit (Min)', practiceMinutes.toString()],
      ['Abgeschlossene Lektionen', stats.totalLessonsCompleted.toString()],
      ['Getippte Tastenanschläge', stats.totalKeystrokes.toString()],
      ['Aktuelle Streak (Tage)', stats.currentStreak.toString()],
      ['Längste Streak (Tage)', stats.longestStreak.toString()],
      ['Gesamte Sessions', stats.totalSessions.toString()],
      ['Level', user.level.toString()],
      ['XP', user.xp.toString()],
    ];

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    return csv;
  }

  /**
   * Export achievements as CSV
   */
  exportAchievementsAsCSV(): string {
    const user = Store.getState().user;
    const unlockedIds = new Set(user.achievements);

    const headers = ['Achievement', 'Beschreibung', 'XP', 'Seltenheit', 'Status'];

    const rows = ACHIEVEMENTS.map(a => [
      `"${a.name}"`,
      `"${a.description}"`,
      a.xpReward.toString(),
      a.rarity,
      unlockedIds.has(a.id) ? 'Freigeschaltet' : 'Gesperrt',
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    return csv;
  }

  /**
   * Download data as file
   */
  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export all data as JSON file
   */
  downloadJSONExport(): void {
    const json = this.exportAsJSON();
    const date = new Date().toISOString().split('T')[0];
    this.downloadFile(json, `keyboardwriter-backup-${date}.json`, 'application/json');
  }

  /**
   * Export statistics as CSV file
   */
  downloadStatisticsCSV(): void {
    const csv = this.exportStatisticsAsCSV();
    const date = new Date().toISOString().split('T')[0];
    this.downloadFile(csv, `keyboardwriter-stats-${date}.csv`, 'text/csv');
  }

  /**
   * Export achievements as CSV file
   */
  downloadAchievementsCSV(): void {
    const csv = this.exportAchievementsAsCSV();
    const date = new Date().toISOString().split('T')[0];
    this.downloadFile(csv, `keyboardwriter-achievements-${date}.csv`, 'text/csv');
  }

  /**
   * Import data from JSON
   */
  importFromJSON(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString) as {
        version?: string;
        user?: Partial<User>;
      };

      if (!data.version || !data.user) {
        return { success: false, message: 'Ungültiges Backup-Format' };
      }

      // Validate required fields
      if (!data.user.id || !data.user.statistics) {
        return { success: false, message: 'Backup enthält unvollständige Daten' };
      }

      // Merge with current user (preserve some local settings)
      const currentUser = Store.getState().user;
      const mergedUser: User = {
        ...currentUser,
        ...data.user,
        id: currentUser.id, // Keep current ID
      } as User;

      // Save to store and storage
      Store.updateUser(mergedUser);
      StorageService.saveUser(mergedUser);

      return { success: true, message: 'Backup erfolgreich wiederhergestellt!' };
    } catch {
      return { success: false, message: 'Fehler beim Lesen der Backup-Datei' };
    }
  }

  /**
   * Share achievement via Web Share API
   */
  async shareAchievement(achievementId: string): Promise<boolean> {
    const achievement = getAchievementById(achievementId);
    if (!achievement) {
      return false;
    }

    const shareData = {
      title: 'TypeCraft Achievement!',
      text: `Ich habe "${achievement.name}" in TypeCraft freigeschaltet! (+${achievement.xpReward} XP)`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return true;
      } catch {
        // User cancelled or error
        return false;
      }
    }

    // Fallback: Copy to clipboard
    return this.copyToClipboard(shareData.text);
  }

  /**
   * Share statistics
   */
  async shareStatistics(): Promise<boolean> {
    const user = Store.getState().user;
    const stats = user.statistics;

    const text = `Meine TypeCraft Statistiken:
${stats.averageWPM} WPM (Durchschnitt)
${stats.averageAccuracy}% Genauigkeit
${stats.currentStreak} Tage Streak
${stats.totalLessonsCompleted} Lektionen abgeschlossen
Level ${user.level}`;

    const shareData = {
      title: 'Meine TypeCraft Statistiken',
      text,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return true;
      } catch {
        return false;
      }
    }

    return this.copyToClipboard(text);
  }

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch {
        document.body.removeChild(textarea);
        return false;
      }
    }
  }

  /**
   * Get unlocked achievements with full details
   */
  getUnlockedAchievements(): typeof ACHIEVEMENTS {
    const user = Store.getState().user;
    const unlockedIds = new Set(user.achievements);
    return ACHIEVEMENTS.filter(a => unlockedIds.has(a.id));
  }

  /**
   * Generate shareable image URL (placeholder)
   */
  generateShareableImageURL(): string {
    // In a real app, this would generate an actual image
    // For now, return a placeholder
    return (
      'data:image/svg+xml,' +
      encodeURIComponent(`
      <svg width="600" height="315" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1a1a2e"/>
        <text x="50%" y="40%" fill="#ffffff" font-size="32" text-anchor="middle" font-family="sans-serif">TypeCraft Pro</text>
        <text x="50%" y="60%" fill="#3b82f6" font-size="24" text-anchor="middle" font-family="sans-serif">Achievement Unlocked!</text>
      </svg>
    `)
    );
  }
}

export const SocialService = SocialServiceClass.getInstance();
