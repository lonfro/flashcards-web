import { CardData, Difficulty, NodeData } from '../types/flashcard';
import {
  CardSettingsData,
  DifficultySettingsData,
  DEFAULT_CARD_SETTINGS,
  DEFAULT_DIFFICULTY_SETTINGS,
} from '../types/cardSettings';

/**
 * Calculates next review parameters matching WinUI 3 SM-2 + DifficultySettings.cs & CardSettings.cs.
 */
export function calculateNextReview(
  card: CardData,
  difficulty: Difficulty,
  cardSettings: CardSettingsData = DEFAULT_CARD_SETTINGS,
  difficultySettings: DifficultySettingsData = DEFAULT_DIFFICULTY_SETTINGS
): Partial<CardData> {
  let { easeFactor, interval, reviewCount } = card;

  // Quality mapping for SM-2
  let quality = 0;
  switch (difficulty) {
    case Difficulty.Again:
      quality = 0;
      break;
    case Difficulty.Hard:
      quality = 3;
      break;
    case Difficulty.Good:
      quality = 4;
      break;
    case Difficulty.Easy:
      quality = 5;
      break;
  }

  // Update Ease Factor: EF' = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  if (quality < 3) {
    reviewCount = 0;
    interval = 1;
  } else {
    if (reviewCount === 0) {
      interval = 1;
    } else if (reviewCount === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    reviewCount += 1;
  }

  const now = new Date();
  const nextDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  // Weight calculation matching C# WinUI 3 DifficultySettings.cs & CardSettings.cs:
  let delta = 0;
  switch (difficulty) {
    case Difficulty.Again:
      delta = difficultySettings.againDelta; // default +7.0
      break;
    case Difficulty.Hard:
      delta = difficultySettings.hardDelta;  // default +5.0
      break;
    case Difficulty.Good:
      delta = difficultySettings.goodDelta;  // default -2.0
      break;
    case Difficulty.Easy:
      delta = difficultySettings.easyDelta;  // default -5.0
      break;
  }

  const currentWeight = typeof card.weight === 'number' ? card.weight : cardSettings.defaultWeight;
  const weight = Math.min(
    cardSettings.maximumWeight,
    Math.max(cardSettings.minimumWeight, currentWeight + delta)
  );

  return {
    easeFactor,
    interval,
    reviewCount,
    weight,
    lastReviewed: now.toISOString(),
    nextReviewDate: nextDate.toISOString(),
  };
}

/**
 * 1:1 Port of C# WinUI 3 WeightDecayService.cs:
 * Decays cards towards maximum weight when decay duration passes.
 */
export function applyWeightDecay(
  nodes: NodeData[],
  cardSettings: CardSettingsData
): { updatedNodes: NodeData[]; newLastDecayTime: string } | null {
  if (!cardSettings.decayDurationHours || cardSettings.decayWeight <= 0) return null;

  const now = Date.now();
  const lastDecay = cardSettings.lastDecayTime ? new Date(cardSettings.lastDecayTime).getTime() : now;
  const decayIntervalMs = cardSettings.decayDurationHours * 3600 * 1000;

  let elapsed = now - lastDecay;
  if (elapsed < decayIntervalMs) return null;

  let totalDecayWeight = 0;
  while (elapsed >= decayIntervalMs) {
    elapsed -= decayIntervalMs;
    totalDecayWeight += cardSettings.decayWeight;
  }

  const updatedNodes = nodes.map((node) => {
    if (node.type === 'card' && node.card) {
      const currentW = typeof node.card.weight === 'number' ? node.card.weight : cardSettings.defaultWeight;
      const newWeight = Math.min(
        cardSettings.maximumWeight,
        Math.max(cardSettings.minimumWeight, currentW + totalDecayWeight)
      );
      return {
        ...node,
        card: { ...node.card, weight: newWeight },
      };
    }
    return node;
  });

  const newLastDecayTime = new Date(now - elapsed).toISOString();
  return { updatedNodes, newLastDecayTime };
}
