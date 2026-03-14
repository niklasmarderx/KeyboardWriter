/**
 * QuotesService - Fetches inspirational and programming quotes from free APIs
 * Used to provide varied practice texts for typing exercises
 */

export interface Quote {
  text: string;
  author: string;
  source: 'quotable' | 'programming' | 'local';
}

// Lokale Programmier-Zitate als Fallback
const localProgrammingQuotes: Quote[] = [
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: 'Cory House',
    source: 'local',
  },
  {
    text: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson',
    source: 'local',
  },
  {
    text: 'Experience is the name everyone gives to their mistakes.',
    author: 'Oscar Wilde',
    source: 'local',
  },
  {
    text: 'In order to be irreplaceable, one must always be different.',
    author: 'Coco Chanel',
    source: 'local',
  },
  {
    text: 'Java is to JavaScript what car is to Carpet.',
    author: 'Chris Heilmann',
    source: 'local',
  },
  { text: 'Knowledge is power.', author: 'Francis Bacon', source: 'local' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman', source: 'local' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck', source: 'local' },
  {
    text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    author: 'Martin Fowler',
    source: 'local',
  },
  {
    text: 'Truth can only be found in one place: the code.',
    author: 'Robert C. Martin',
    source: 'local',
  },
  {
    text: 'Programs must be written for people to read, and only incidentally for machines to execute.',
    author: 'Harold Abelson',
    source: 'local',
  },
  {
    text: 'The best error message is the one that never shows up.',
    author: 'Thomas Fuchs',
    source: 'local',
  },
  {
    text: 'Debugging is twice as hard as writing the code in the first place.',
    author: 'Brian Kernighan',
    source: 'local',
  },
  {
    text: 'Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away.',
    author: 'Antoine de Saint-Exupéry',
    source: 'local',
  },
  { text: 'Code never lies, comments sometimes do.', author: 'Ron Jeffries', source: 'local' },
  {
    text: 'The most disastrous thing that you can ever learn is your first programming language.',
    author: 'Alan Kay',
    source: 'local',
  },
  {
    text: 'Measuring programming progress by lines of code is like measuring aircraft building progress by weight.',
    author: 'Bill Gates',
    source: 'local',
  },
  {
    text: 'Walking on water and developing software from a specification are easy if both are frozen.',
    author: 'Edward V. Berard',
    source: 'local',
  },
  { text: 'It works on my machine.', author: 'Every Developer Ever', source: 'local' },
  {
    text: 'There are only two hard things in Computer Science: cache invalidation and naming things.',
    author: 'Phil Karlton',
    source: 'local',
  },
];

// German proverbs and quotes
const localGermanQuotes: Quote[] = [
  { text: 'Übung macht den Meister.', author: 'Deutsches Sprichwort', source: 'local' },
  { text: 'Der Weg ist das Ziel.', author: 'Konfuzius', source: 'local' },
  { text: 'Wer rastet, der rostet.', author: 'Deutsches Sprichwort', source: 'local' },
  { text: 'Aller Anfang ist schwer.', author: 'Deutsches Sprichwort', source: 'local' },
  {
    text: 'Es ist noch kein Meister vom Himmel gefallen.',
    author: 'Deutsches Sprichwort',
    source: 'local',
  },
  { text: 'Ohne Fleiß kein Preis.', author: 'Deutsches Sprichwort', source: 'local' },
  { text: 'Geduld bringt Rosen.', author: 'Deutsches Sprichwort', source: 'local' },
  { text: 'Der Teufel steckt im Detail.', author: 'Deutsches Sprichwort', source: 'local' },
  { text: 'Viele Wege führen nach Rom.', author: 'Deutsches Sprichwort', source: 'local' },
  { text: 'Wissen ist Macht.', author: 'Francis Bacon', source: 'local' },
];

class QuotesServiceClass {
  private cachedQuotes: Quote[] = [];
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 Minuten

  /**
   * Fetch a random quote from the Quotable API
   */
  async fetchRandomQuote(): Promise<Quote> {
    try {
      const response = await fetch('https://api.quotable.io/random?maxLength=150');

      if (!response.ok) {
        throw new Error('API not available');
      }

      const data = (await response.json()) as { content: string; author: string };

      return {
        text: data.content,
        author: data.author,
        source: 'quotable',
      };
    } catch (error) {
      // Fallback to local quotes
      return this.getRandomLocalQuote();
    }
  }

  /**
   * Fetch multiple quotes from the Quotable API
   */
  async fetchMultipleQuotes(count: number = 10): Promise<Quote[]> {
    try {
      const response = await fetch(
        `https://api.quotable.io/quotes/random?limit=${count}&maxLength=150`
      );

      if (!response.ok) {
        throw new Error('API not available');
      }

      const data = (await response.json()) as Array<{ content: string; author: string }>;

      return data.map(item => ({
        text: item.content,
        author: item.author,
        source: 'quotable' as const,
      }));
    } catch (error) {
      // Fallback to local quotes
      return this.getRandomLocalQuotes(count);
    }
  }

  /**
   * Get quotes suitable for typing practice
   * Combines API quotes with local quotes for variety
   */
  async getTypingQuotes(count: number = 5): Promise<Quote[]> {
    const now = Date.now();

    // Use cache if fresh
    if (this.cachedQuotes.length >= count && now - this.lastFetch < this.CACHE_DURATION) {
      return this.shuffleArray(this.cachedQuotes).slice(0, count);
    }

    // Try to fetch from API
    const apiQuotes = await this.fetchMultipleQuotes(count);

    // Combine with local quotes for variety
    const localQuotes = this.getRandomLocalQuotes(3);

    this.cachedQuotes = [...apiQuotes, ...localQuotes];
    this.lastFetch = now;

    return this.shuffleArray(this.cachedQuotes).slice(0, count);
  }

  /**
   * Get a random local quote (programming focused)
   */
  getRandomLocalQuote(): Quote {
    const allLocal = [...localProgrammingQuotes, ...localGermanQuotes];
    return allLocal[Math.floor(Math.random() * allLocal.length)];
  }

  /**
   * Get multiple random local quotes
   */
  getRandomLocalQuotes(count: number): Quote[] {
    const allLocal = [...localProgrammingQuotes, ...localGermanQuotes];
    return this.shuffleArray(allLocal).slice(0, count);
  }

  /**
   * Get programming-specific quotes only
   */
  getProgrammingQuotes(count: number = 5): Quote[] {
    return this.shuffleArray([...localProgrammingQuotes]).slice(0, count);
  }

  /**
   * Get German quotes only
   */
  getGermanQuotes(count: number = 5): Quote[] {
    return this.shuffleArray([...localGermanQuotes]).slice(0, count);
  }

  /**
   * Convert quotes to simple text strings for typing practice
   */
  quotesToPracticeText(quotes: Quote[]): string[] {
    return quotes.map(q => `"${q.text}" - ${q.author}`);
  }

  /**
   * Shuffle array helper
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Export singleton
export const QuotesService = new QuotesServiceClass();
