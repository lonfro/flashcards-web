'use client';

import React from 'react';
import { Sliders, RotateCcw, Flame, Clock } from 'lucide-react';
import {
  CardSettingsData,
  DifficultySettingsData,
  calculateDaysToForget,
  DEFAULT_CARD_SETTINGS,
  DEFAULT_DIFFICULTY_SETTINGS,
} from '../types/cardSettings';

interface CardSettingsSectionProps {
  cardSettings: CardSettingsData;
  difficultySettings: DifficultySettingsData;
  onUpdateCardSettings: (newSettings: CardSettingsData) => void;
  onUpdateDifficultySettings: (newSettings: DifficultySettingsData) => void;
  onResetCardSettings: () => void;
  onResetDifficultySettings: () => void;
}

export const CardSettingsSection: React.FC<CardSettingsSectionProps> = ({
  cardSettings,
  difficultySettings,
  onUpdateCardSettings,
  onUpdateDifficultySettings,
  onResetCardSettings,
  onResetDifficultySettings,
}) => {
  const daysToForget = calculateDaysToForget(
    cardSettings.minimumWeight,
    cardSettings.maximumWeight,
    cardSettings.decayWeight,
    cardSettings.decayDurationHours
  );

  return (
    <div className="space-y-6 select-none">
      {/* 1. Difficulty Delta Weights */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders size={18} className="text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">Difficulty Weights</h3>
              <p className="text-xs text-slate-400">
                Edit weight changes for each difficulty level. Higher weight = higher chance of reappearing.
              </p>
            </div>
          </div>
          <button
            onClick={onResetDifficultySettings}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 flex items-center space-x-1.5"
          >
            <RotateCcw size={13} />
            <span>Reset to default</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-400">Again (Horrible)</span>
              <p className="text-[10px] text-slate-500">Weight delta when answered incorrectly</p>
            </div>
            <input
              type="number"
              step="0.1"
              value={difficultySettings.againDelta}
              onChange={(e) =>
                onUpdateDifficultySettings({
                  ...difficultySettings,
                  againDelta: parseFloat(e.target.value) || 0,
                })
              }
              className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right font-mono text-xs text-rose-300 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-400">Hard (Bad)</span>
              <p className="text-[10px] text-slate-500">Weight delta when answered hard</p>
            </div>
            <input
              type="number"
              step="0.1"
              value={difficultySettings.hardDelta}
              onChange={(e) =>
                onUpdateDifficultySettings({
                  ...difficultySettings,
                  hardDelta: parseFloat(e.target.value) || 0,
                })
              }
              className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-400">Good (Good)</span>
              <p className="text-[10px] text-slate-500">Weight delta when answered good</p>
            </div>
            <input
              type="number"
              step="0.1"
              value={difficultySettings.goodDelta}
              onChange={(e) =>
                onUpdateDifficultySettings({
                  ...difficultySettings,
                  goodDelta: parseFloat(e.target.value) || 0,
                })
              }
              className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right font-mono text-xs text-indigo-300 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-400">Easy (Excellent)</span>
              <p className="text-[10px] text-slate-500">Weight delta when answered easy</p>
            </div>
            <input
              type="number"
              step="0.1"
              value={difficultySettings.easyDelta}
              onChange={(e) =>
                onUpdateDifficultySettings({
                  ...difficultySettings,
                  easyDelta: parseFloat(e.target.value) || 0,
                })
              }
              className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Card Settings & Decay Parameters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Flame size={18} className="text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">Card Weight & Decay Settings</h3>
              <p className="text-xs text-slate-400">
                Default weight for new cards, boundaries, and automatic weight decay rate over time.
              </p>
            </div>
          </div>
          <button
            onClick={onResetCardSettings}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 flex items-center space-x-1.5"
          >
            <RotateCcw size={13} />
            <span>Reset to default</span>
          </button>
        </div>

        <div className="space-y-4">
          {/* Default Weight */}
          <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Default card weight for new cards</h4>
              <p className="text-[11px] text-slate-400">Default initial weight assigned when creating new flashcards (WinUI default is 20.0)</p>
            </div>
            <input
              type="number"
              step="0.5"
              min={cardSettings.minimumWeight}
              max={cardSettings.maximumWeight}
              value={cardSettings.defaultWeight}
              onChange={(e) =>
                onUpdateCardSettings({
                  ...cardSettings,
                  defaultWeight: parseFloat(e.target.value) || 20.0,
                })
              }
              className="w-24 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-right font-mono text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Min & Max Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-3">
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Minimum card weight</h4>
                <p className="text-[11px] text-slate-400">Lower bound for cards (WinUI default is 1.0)</p>
              </div>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={cardSettings.minimumWeight}
                onChange={(e) =>
                  onUpdateCardSettings({
                    ...cardSettings,
                    minimumWeight: parseFloat(e.target.value) || 1.0,
                  })
                }
                className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right font-mono text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-3">
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Maximum card weight</h4>
                <p className="text-[11px] text-slate-400">Upper bound for cards (WinUI default is 30.0)</p>
              </div>
              <input
                type="number"
                step="0.5"
                min={cardSettings.minimumWeight}
                value={cardSettings.maximumWeight}
                onChange={(e) =>
                  onUpdateCardSettings({
                    ...cardSettings,
                    maximumWeight: parseFloat(e.target.value) || 30.0,
                  })
                }
                className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right font-mono text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Decay Amount & Days to Forget Calculation */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Card weight decay amount</h4>
                <p className="text-[11px] text-slate-400">
                  How much every card's weight increases by when the duration elapses.
                </p>
              </div>
              <input
                type="number"
                step="0.1"
                min="0"
                value={cardSettings.decayWeight}
                onChange={(e) =>
                  onUpdateCardSettings({
                    ...cardSettings,
                    decayWeight: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-24 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-right font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* WinUI 3 Days to Forget Banner */}
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80 flex items-center space-x-2 text-xs">
              <Clock size={14} className="text-indigo-400 shrink-0" />
              {daysToForget !== null ? (
                <span className="text-slate-300">
                  It will take <strong className="text-indigo-300 font-bold">{daysToForget} days</strong> to forget a memorized card.
                </span>
              ) : (
                <span className="text-slate-500 italic">Decay has been disabled.</span>
              )}
            </div>
          </div>

          {/* Decay Duration Select */}
          <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Card weight decay duration</h4>
              <p className="text-[11px] text-slate-400">Every card weight decays by decay weight each time this duration elapses</p>
            </div>
            <select
              value={cardSettings.decayDurationHours === null ? '0' : cardSettings.decayDurationHours.toString()}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateCardSettings({
                  ...cardSettings,
                  decayDurationHours: val === 0 ? null : val,
                });
              }}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            >
              <option value="0">Disabled</option>
              <option value="1">Every 1 Hour</option>
              <option value="12">Every 12 Hours</option>
              <option value="24">Every 24 Hours (1 Day)</option>
              <option value="48">Every 48 Hours (2 Days)</option>
              <option value="168">Every 7 Days (1 Week)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
