export interface CardSettingsData {
  minimumWeight: number; // default 1.0
  maximumWeight: number; // default 30.0
  defaultWeight: number; // default 20.0
  decayWeight: number;   // default 2.0
  decayDurationHours: number | null; // e.g. 24 for 1 day, or null for disabled
  lastDecayTime: string | null;
}

export interface DifficultySettingsData {
  againDelta: number; // default +7.0
  hardDelta: number;  // default +5.0
  goodDelta: number;  // default -2.0
  easyDelta: number;  // default -5.0
}

export const DEFAULT_CARD_SETTINGS: CardSettingsData = {
  minimumWeight: 1.0,
  maximumWeight: 30.0,
  defaultWeight: 20.0,
  decayWeight: 2.0,
  decayDurationHours: 24, // 1 day
  lastDecayTime: null,
};

export const DEFAULT_DIFFICULTY_SETTINGS: DifficultySettingsData = {
  againDelta: 7.0,
  hardDelta: 5.0,
  goodDelta: -2.0,
  easyDelta: -5.0,
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
