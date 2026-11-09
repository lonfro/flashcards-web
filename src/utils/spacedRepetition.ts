import { CardData, Difficulty, NodeData } from '../types/flashcard';
import {
  CardSettingsData,
  DifficultySettingsData,
  DEFAULT_CARD_SETTINGS,
  DEFAULT_DIFFICULTY_SETTINGS,
  REVISION_RATINGS,
} from '../types/cardSettings';

export function calculateNextReview(
  card: CardData,
  difficulty: Difficulty,
  cardSettings: CardSettingsData = DEFAULT_CARD_SETTINGS,
  difficultySettings: DifficultySettingsData = DEFAULT_DIFFICULTY_SETTINGS,
  now: number = Date.now()
): Partial<CardData> {
  const rating = REVISION_RATINGS[difficulty];
  return {
    weight: Math.min(cardSettings.maximumWeight, Math.max(
      cardSettings.minimumWeight, card.weight + difficultySettings[rating.weight]
    )),
    hideUntil: new Date(now + difficultySettings[rating.delay] * 60_000).toISOString(),
    lastReviewed: new Date(now).toISOString(),
    reviewCount: card.reviewCount + 1,
  };
}

export function dealRevisionCard(
  cards: NodeData[],
  previousId: string | null,
  now: number = Date.now(),
  random: number = Math.random()
): NodeData | null {
  const eligible = cards.filter(({ card }) =>
    card && (!card.hideUntil || Date.parse(card.hideUntil) < now)
  );
  if (eligible.length <= 1) return eligible[0] ?? null;

  const candidates = eligible.filter(({ id }) => id !== previousId);
  const totalWeight = candidates.reduce((sum, node) => sum + Math.max(0, node.card!.weight), 0);
  if (totalWeight === 0) return candidates[0];

  let remaining = random * totalWeight;
  for (const node of candidates) {
    remaining -= Math.max(0, node.card!.weight);
    if (remaining < 0) return node;
  }
  return candidates[candidates.length - 1];
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

  const elapsed = now - lastDecay;
  if (elapsed < decayIntervalMs) return null;

  const intervals = Math.floor(elapsed / decayIntervalMs);
  const totalDecayWeight = intervals * cardSettings.decayWeight;

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

  const newLastDecayTime = new Date(lastDecay + intervals * decayIntervalMs).toISOString();
  return { updatedNodes, newLastDecayTime };
}
