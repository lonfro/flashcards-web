'use client';

import React from 'react';
import { Sliders, RotateCcw, Flame, Clock } from 'lucide-react';
import {
  CardSettingsData,
  DifficultySettingsData,
  calculateDaysToForget,
  REVISION_RATINGS,
} from '../types/cardSettings';

interface CardSettingsSectionProps {
  cardSettings: CardSettingsData;
  difficultySettings: DifficultySettingsData;
  onUpdateCardSettings: (newSettings: CardSettingsData) => void;
  onUpdateDifficultySettings: (newSettings: DifficultySettingsData) => void;
  onResetCardSettings: () => void;
  onResetDifficultySettings: () => void;
}

export function DurationInput({ minutes, label, onChange }: {
  minutes: number;
  label: string;
  onChange: (minutes: number) => void;
}) {
  const units = [
    { name: 'Days', size: 1440, limit: 365, value: Math.floor(minutes / 1440) },
    { name: 'Hours', size: 60, limit: 23, value: Math.floor(minutes / 60) % 24 },
    { name: 'Minutes', size: 1, limit: 59, value: minutes % 60 },
  ];
  return (
    <div role="group" aria-label={label} className="grid grid-cols-3 gap-1">
      {units.map(({ name, size, limit, value }) => (
        <label key={name} className="text-xs text-slate-400">
          {name}
          <input
            type="number"
            min="0"
            max={limit}
            value={value}
            onChange={(event) => {
              const next = Math.max(0, Math.min(limit, Math.round(event.target.valueAsNumber || 0)));
              onChange(minutes + (next - value) * size);
            }}
            className="mt-1 w-full min-w-0 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200"
          />
        </label>
      ))}
    </div>
  );
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
              <h3 className="text-sm font-bold text-slate-100">Revision Difficulty</h3>
              <p className="text-xs text-slate-400">
                Set the weight change and time before a card can reappear for each rating.
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
          {REVISION_RATINGS.map(({ name, color, weight, delay }) => (
            <fieldset key={name} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
              <legend className="px-1 text-xs font-semibold" style={{ color }}>{name}</legend>
              <label className="flex items-center justify-between gap-2 text-xs text-slate-300">
                Weight change
                <input
                  type="number"
                  step="0.01"
                  value={difficultySettings[weight]}
                  onChange={(e) => onUpdateDifficultySettings({
                    ...difficultySettings,
                    [weight]: e.target.valueAsNumber || 0,
                  })}
                  className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right"
                />
              </label>
              <div className="space-y-1">
                <p className="text-xs text-slate-300">Hide card for</p>
                <DurationInput
                  label={`${name} delay`}
                  minutes={difficultySettings[delay]}
                  onChange={(minutes) => onUpdateDifficultySettings({ ...difficultySettings, [delay]: minutes })}
                />
              </div>
            </fieldset>
          ))}
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
                  defaultWeight: Math.min(cardSettings.maximumWeight, Math.max(
                    cardSettings.minimumWeight, e.target.valueAsNumber || cardSettings.minimumWeight
                  )),
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
                onChange={(event) => {
                  const minimumWeight = Math.max(0.1, Math.min(cardSettings.maximumWeight, event.target.valueAsNumber || 0.1));
                  onUpdateCardSettings({
                    ...cardSettings,
                    minimumWeight,
                    defaultWeight: Math.max(minimumWeight, cardSettings.defaultWeight),
                  });
                }}
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
                onChange={(event) => {
                  const maximumWeight = Math.max(cardSettings.minimumWeight, event.target.valueAsNumber || cardSettings.minimumWeight);
                  onUpdateCardSettings({
                    ...cardSettings,
                    maximumWeight,
                    defaultWeight: Math.min(maximumWeight, cardSettings.defaultWeight),
                    decayWeight: Math.min(maximumWeight, cardSettings.decayWeight),
                  });
                }}
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
                  How much every card’s weight increases by when the duration elapses.
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
                    decayWeight: Math.max(0, Math.min(cardSettings.maximumWeight, e.target.valueAsNumber || 0)),
                    lastDecayTime: null,
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

          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Card weight decay interval</h4>
              <p className="text-[11px] text-slate-400">Set all three values to zero to disable decay.</p>
            </div>
            <DurationInput
              label="Card weight decay interval"
              minutes={Math.round((cardSettings.decayDurationHours ?? 0) * 60)}
              onChange={(minutes) => onUpdateCardSettings({
                ...cardSettings,
                decayDurationHours: minutes ? minutes / 60 : null,
                lastDecayTime: null,
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
