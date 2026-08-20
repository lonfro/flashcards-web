export interface StudyLogEntry {
  id: string;
  cardId: string;
  cardName: string;
  deckId: string | null;
  deckName: string;
  difficulty: number; // 0: Again, 1: Hard, 2: Good, 3: Easy
  difficultyName: 'Again' | 'Hard' | 'Good' | 'Easy';
  reviewedAt: string; // ISO string
  date: string; // YYYY-MM-DD
  weight: number;
}

export interface DeckMasteryStat {
  deckId: string | null;
  deckName: string;
  totalCards: number;
  masteredCards: number; // Weight <= 10 (Mastered)
  learningCards: number; // Weight 11-24 (Learning)
  newOrStruggling: number; // Weight >= 25 (Needs Review)
  masteryPercentage: number;
}

export interface StudyStatsSummary {
  totalReviews: number;
  reviewsToday: number;
  streakDays: number;
  overallMasteryPercentage: number;
  difficultyCounts: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
  dailyActivity: {
    date: string;
    count: number;
    formattedDate: string;
  }[];
  deckMastery: DeckMasteryStat[];
}
