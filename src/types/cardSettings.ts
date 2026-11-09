export interface CardSettingsData {
  minimumWeight: number; // default 1.0
  maximumWeight: number; // default 30.0
  defaultWeight: number; // default 20.0
  decayWeight: number;   // default 2.0
  decayDurationHours: number | null; // e.g. 24 for 1 day, or null for disabled
  lastDecayTime: string | null;
}

export const REVISION_RATINGS = [
  { name: 'Horrible', key: '1', weight: 'againDelta', delay: 'againDelayMinutes', color: '#ff4500' },
  { name: 'Bad', key: '2', weight: 'hardDelta', delay: 'hardDelayMinutes', color: '#ffa500' },
  { name: 'Good', key: '3', weight: 'goodDelta', delay: 'goodDelayMinutes', color: '#00ffff' },
  { name: 'Excellent', key: '4', weight: 'easyDelta', delay: 'easyDelayMinutes', color: '#00ff00' },
] as const;

export type RevisionRating = (typeof REVISION_RATINGS)[number];
export type DifficultySettingsData = Record<RevisionRating['weight'] | RevisionRating['delay'], number>;

export function formatRevisionDelay(minutes: number): string | null {
  for (const [size, unit] of [[1440, 'day'], [60, 'hour'], [1, 'minute']] as const) {
    const count = Math.floor(minutes / size);
    if (count > 0) return `${count} ${unit}${count === 1 ? '' : 's'}`;
  }
  return null;
}

export const DEFAULT_CARD_SETTINGS: CardSettingsData = {
  minimumWeight: 1.0,
  maximumWeight: 30.0,
  defaultWeight: 20.0,
  decayWeight: 2.0,
  decayDurationHours: null,
  lastDecayTime: null,
};

export const DEFAULT_DIFFICULTY_SETTINGS: DifficultySettingsData = {
  againDelta: 7.0,
  hardDelta: 5.0,
  goodDelta: -2.0,
  easyDelta: -5.0,
  againDelayMinutes: 3,
  hardDelayMinutes: 5,
  goodDelayMinutes: 8,
  easyDelayMinutes: 12,
};

/**
 * Calculates Days To Forget matching WinUI CardSettings.cs lines 25-31:
 * ((MaximumWeight - MinimumWeight) / DecayWeight) * (DecayDuration.TotalDays)
 */
export function calculateDaysToForget(
  minimumWeight: number,
  maximumWeight: number,
  decayWeight: number,
  decayDurationHours: number | null
): number | null {
  if (!decayDurationHours || decayWeight <= 0) return null;
  const totalDays = decayDurationHours / 24.0;
  const days = ((maximumWeight - minimumWeight) / decayWeight) * totalDays;
  return Math.round(days * 10) / 10;
}
