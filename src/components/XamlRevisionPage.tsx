'use client';

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { RefreshCw, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { NodeData, Difficulty } from '../types/flashcard';
import { CardSettingsData, DifficultySettingsData } from '../types/cardSettings';
import { calculateNextReview } from '../utils/spacedRepetition';
import { XamlCardControl } from './XamlCardControl';

interface XamlRevisionPageProps {
  selectedDividerNode: NodeData | null;
  cardsToRevise: NodeData[];
  cardSettings?: CardSettingsData;
  difficultySettings?: DifficultySettingsData;
  onUpdateCard: (updatedNode: NodeData) => void;
  onGoToFlashcardsPage: () => void;
}

export const XamlRevisionPage: React.FC<XamlRevisionPageProps> = ({
  selectedDividerNode,
  cardsToRevise,
  cardSettings,
  difficultySettings,
  onUpdateCard,
  onGoToFlashcardsPage,
}) => {
  const [queue, setQueue] = useState<NodeData[]>(cardsToRevise);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    setQueue(cardsToRevise);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
  }, [cardsToRevise, selectedDividerNode]);

  useEffect(() => {
    if (isFinished) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isFinished]);

  const currentCardNode = queue[currentIndex] || null;

  const handleRateDifficulty = useCallback(
    (difficulty: Difficulty) => {
      if (!currentCardNode || !currentCardNode.card) return;

      const updates = calculateNextReview(currentCardNode.card, difficulty, cardSettings, difficultySettings);
      const updatedNode: NodeData = {
        ...currentCardNode,
        updatedAt: new Date().toISOString(),
        card: {
          ...currentCardNode.card,
          ...updates,
        },
      };

      onUpdateCard(updatedNode);
      setIsFlipped(false);

      if (currentIndex + 1 < queue.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    },
    [currentCardNode, currentIndex, queue.length, cardSettings, difficultySettings, onUpdateCard]
  );

  // Keyboard accelerators matching WinUI XAML
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || !currentCardNode) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRateDifficulty(Difficulty.Again);
        if (e.key === '2') handleRateDifficulty(Difficulty.Hard);
        if (e.key === '3') handleRateDifficulty(Difficulty.Good);
        if (e.key === '4') handleRateDifficulty(Difficulty.Easy);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isFinished, currentCardNode, handleRateDifficulty]);

  // NO CARDS TO REVISE STATE
  if (cardsToRevise.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-light text-slate-200">No cards to revise</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            There are currently no flashcards in your decks. Create cards or import a deck to begin cramming.
          </p>
          <button
            onClick={onGoToFlashcardsPage}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-all shadow-lg shadow-indigo-600/30 inline-flex items-center space-x-2"
          >
            <span>Go to Flashcards</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // REVISION FINISHED STATE
  if (isFinished) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md space-y-5">
          <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto border border-purple-500/30">
            <Trophy size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Revision Complete! 🎉</h2>
          <p className="text-xs text-slate-400">
            You reviewed all {cardsToRevise.length} cards in {selectedDividerNode ? selectedDividerNode.name : 'All Decks'}.
          </p>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => {
                setQueue(cardsToRevise);
                setCurrentIndex(0);
                setIsFlipped(false);
                setIsFinished(false);
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 inline-flex items-center space-x-2"
            >
              <RotateCcw size={14} />
              <span>Revise Again</span>
            </button>
            <button
              onClick={onGoToFlashcardsPage}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-all shadow-lg shadow-indigo-600/30"
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col justify-between items-center relative overflow-hidden select-none p-8">
      {/* Dynamic Header Badge */}
      <div className="absolute top-6 left-8 flex items-center space-x-3 z-10">
        <div className="px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-md backdrop-blur-md text-xs font-medium text-slate-300 flex items-center space-x-2">
          <RefreshCw size={13} className="text-purple-400" />
          <span>{selectedDividerNode ? selectedDividerNode.name : 'All Decks (Root Tree)'}</span>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Card {currentIndex + 1} of {queue.length}
        </span>
      </div>

      {/* Center 550x325 Card Viewport */}
      <div className="flex-1 w-full flex items-center justify-center pt-8">
        <XamlCardControl
          cardNode={currentCardNode}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
          showProgressBar={false}
          isEditButtonVisible={false}
          cardSettings={cardSettings}
        />
      </div>

      {/* Rating Buttons Bar */}
      {isFlipped ? (
        <div className="flex items-center justify-center space-x-3 mb-4 z-20 transition-all animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => handleRateDifficulty(Difficulty.Again)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-rose-950 text-rose-400 border border-rose-500/40 rounded-lg text-xs font-semibold shadow-lg hover:border-rose-500 transition-all flex items-center space-x-1.5"
            title="Press 1"
          >
            <span className="font-mono opacity-60">(1)</span>
            <span>Again (+{difficultySettings?.againDelta ?? 7})</span>
          </button>
          <button
            onClick={() => handleRateDifficulty(Difficulty.Hard)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-amber-950 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-semibold shadow-lg hover:border-amber-500 transition-all flex items-center space-x-1.5"
            title="Press 2"
          >
            <span className="font-mono opacity-60">(2)</span>
            <span>Hard (+{difficultySettings?.hardDelta ?? 5})</span>
          </button>
          <button
            onClick={() => handleRateDifficulty(Difficulty.Good)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-indigo-950 text-indigo-400 border border-indigo-500/40 rounded-lg text-xs font-semibold shadow-lg hover:border-indigo-500 transition-all flex items-center space-x-1.5"
            title="Press 3"
          >
            <span className="font-mono opacity-60">(3)</span>
            <span>Good ({difficultySettings?.goodDelta ?? -2})</span>
          </button>
          <button
            onClick={() => handleRateDifficulty(Difficulty.Easy)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-semibold shadow-lg hover:border-emerald-500 transition-all flex items-center space-x-1.5"
            title="Press 4"
          >
            <span className="font-mono opacity-60">(4)</span>
            <span>Easy ({difficultySettings?.easyDelta ?? -5})</span>
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-500 mb-6 italic">Click card or press Space to reveal answer</p>
      )}
    </div>
  );
};
