export type NodeType = 'divider' | 'card';

export enum Difficulty {
  Again = 0, // Reset interval or decrease weight significantly
  Hard = 1,  // Small increase in interval
  Good = 2,  // Standard increase
  Easy = 3,  // Large increase
}

export interface CardData {
  id: string;
  nodeId: string;
  front: string;        // Markdown content for front
  back: string;         // Markdown content for back
  weight: number;       // Spaced repetition weight (default 1.0)
  easeFactor: number;   // SM-2 Ease Factor (default 2.5)
  interval: number;     // Days until next review
  reviewCount: number;  // Total reviews
  lastReviewed?: string;// ISO timestamp string
  nextReviewDate?: string; // ISO timestamp string
}

export interface DividerData {
  id: string;
  nodeId: string;
  description?: string;
  color?: string;       // Custom accent color
  icon?: string;        // Custom icon key
}

export interface NodeData {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null; // Null means top-level deck or folder
  createdAt: string;
  updatedAt: string;
  sortOrder?: number;       // Explicit position index for stable ordering across reloads
  card?: CardData;
  divider?: DividerData;
}

export interface DeckStats {
  totalCards: number;
  dueCards: number;
  newCards: number;
  learnedCards: number;
  averageEase: number;
}

export interface StudySessionState {
  deckNodeId: string;
  deckName: string;
  queue: NodeData[];
  currentIndex: number;
  isFlipped: boolean;
  reviewedCount: number;
  correctCount: number;
  startTime: number;
  isFinished: boolean;
}
