'use client';

import React from 'react';
import { Search, Play, Download, Upload, RotateCcw, BarChart3, Plus } from 'lucide-react';

interface NavbarProps {
  activeDeckName: string;
  totalCardsInDeck: number;
  onOpenSearch: () => void;
  onStartStudy: () => void;
  onOpenNewCard: () => void;
  onToggleStats: () => void;
  isStatsOpen: boolean;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeDeckName,
  totalCardsInDeck,
  onOpenSearch,
  onStartStudy,
  onOpenNewCard,
  onToggleStats,
  isStatsOpen,
  onExportJson,
  onImportJson,
  onResetData,
}) => {
  return (
    <header className="w-full bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
      {/* Title & Badge */}
      <div className="flex items-center space-x-3">
        <h2 className="text-lg font-bold text-slate-100">{activeDeckName}</h2>
        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono">
          {totalCardsInDeck} {totalCardsInDeck === 1 ? 'card' : 'cards'}
        </span>
      </div>

      {/* Action Buttons Group */}
      <div className="flex items-center space-x-2.5">
        {/* Cmd+K Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 px-3 py-1.5 bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-xl border border-slate-800 transition-colors"
        >
          <Search size={14} className="text-indigo-400" />
          <span>Search...</span>
          <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono">⌘K</kbd>
        </button>

        {/* Stats Dashboard toggle */}
        <button
          onClick={onToggleStats}
          title="Toggle Statistics Dashboard"
          className={`p-2 rounded-xl transition-colors ${
            isStatsOpen
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
          }`}
        >
          <BarChart3 size={18} />
        </button>

        {/* Export JSON */}
        <button
          onClick={onExportJson}
          title="Export Decks to JSON"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
        >
          <Download size={18} />
        </button>

        {/* Import JSON */}
        <label
          title="Import Decks from JSON"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
        >
          <Upload size={18} />
          <input type="file" accept=".json" onChange={onImportJson} className="hidden" />
        </label>

        {/* Reset Sample Data */}
        <button
          onClick={onResetData}
          title="Reset to Initial Sample Decks"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700/60 transition-colors"
        >
          <RotateCcw size={18} />
        </button>

        {/* New Card */}
        <button
          onClick={onOpenNewCard}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-xl transition-colors border border-slate-700 flex items-center space-x-1.5"
        >
          <Plus size={16} />
          <span>Add Card</span>
        </button>

        {/* Study Flashcards Button */}
        <button
          onClick={onStartStudy}
          disabled={totalCardsInDeck === 0}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 ${
            totalCardsInDeck === 0
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-800'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30'
          }`}
        >
          <Play size={16} fill="currentColor" />
          <span>Study Deck</span>
        </button>
      </div>
    </header>
  );
};
