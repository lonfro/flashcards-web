'use client';

import React from 'react';
import { Layers, Brain, CheckCircle, Clock, Zap } from 'lucide-react';
import { NodeData } from '../types/flashcard';

interface StatsDashboardProps {
  nodes: NodeData[];
  selectedDeckName: string;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ nodes, selectedDeckName }) => {
  const cards = nodes.filter((n) => n.type === 'card' && n.card);
  const decks = nodes.filter((n) => n.type === 'divider');

  const totalCards = cards.length;
  const learnedCards = cards.filter((c) => (c.card?.reviewCount || 0) >= 3).length;

  const now = new Date();
  const dueCards = cards.filter((c) => {
    if (!c.card?.nextReviewDate) return true;
    return new Date(c.card.nextReviewDate) <= now;
  }).length;

  const avgEase =
    totalCards > 0
      ? (
          cards.reduce((sum, c) => sum + (c.card?.easeFactor || 2.5), 0) / totalCards
        ).toFixed(2)
      : '2.50';

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800 p-6 backdrop-blur-xl animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-2">
            <Brain size={16} />
            <span>Deck Analytics & Learning Progress ({selectedDeckName})</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Card 1: Total Decks & Cards */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers size={22} />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-slate-100">{totalCards}</span>
              <p className="text-xs text-slate-400 font-medium">{decks.length} Decks Created</p>
            </div>
          </div>

          {/* Card 2: Due For Review */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-slate-100">{dueCards}</span>
              <p className="text-xs text-slate-400 font-medium">Cards Due Now</p>
            </div>
          </div>

          {/* Card 3: Learned Cards */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle size={22} />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-slate-100">{learnedCards}</span>
              <p className="text-xs text-slate-400 font-medium">Mastered Cards</p>
            </div>
          </div>

          {/* Card 4: SM-2 Average Ease */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap size={22} />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-slate-100">{avgEase}</span>
              <p className="text-xs text-slate-400 font-medium">Avg SM-2 Ease Factor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
