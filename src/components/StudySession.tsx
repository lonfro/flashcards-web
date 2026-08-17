'use client';

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, ArrowRight, CheckCircle2, AlertCircle, Clock, Zap, Sparkles } from 'lucide-react';
import { NodeData, Difficulty } from '../types/flashcard';
import { calculateNextReview } from '../utils/spacedRepetition';
import { CardFlipper } from './CardFlipper';

interface StudySessionProps {
  deckName: string;
  cards: NodeData[];
  onUpdateCard: (updatedNode: NodeData) => void;
  onFinishSession: () => void;
  onEditCard?: (cardNode: NodeData) => void;
}

export const StudySession: React.FC<StudySessionProps> = ({
  deckName,
  cards,
  onUpdateCard,
  onFinishSession,
  onEditCard,
}) => {
  const [queue, setQueue] = useState<NodeData[]>(cards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [reviewedCount, setReviewedCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentCardNode = queue[currentIndex];

  // Trigger celebratory confetti on completion
  useEffect(() => {
    if (isFinished) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#818cf8', '#c084fc', '#38bdf8', '#4ade80'],
      });
    }
  }, [isFinished]);

  const handleRateDifficulty = useCallback(
    (difficulty: Difficulty) => {
      if (!currentCardNode || !currentCardNode.card) return;

      // Calculate next review parameters using SM-2
      const updates = calculateNextReview(currentCardNode.card, difficulty);

      const updatedNode: NodeData = {
        ...currentCardNode,
        updatedAt: new Date().toISOString(),
        card: {
          ...currentCardNode.card,
          ...updates,
        },
      };

      onUpdateCard(updatedNode);
      setReviewedCount((prev) => prev + 1);

      if (difficulty !== Difficulty.Again) {
        setCorrectCount((prev) => prev + 1);
      }

      setIsFlipped(false);

      if (currentIndex + 1 < queue.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    },
    [currentCardNode, currentIndex, queue.length, onUpdateCard]
  );

  // Keyboard shortcut listener (Space to flip, 1-4 for difficulty)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      if (e.code === 'Space') {
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
  }, [isFlipped, isFinished, handleRateDifficulty]);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 rounded-3xl border border-slate-800 text-center max-w-lg mx-auto my-12">
        <AlertCircle size={48} className="text-amber-400 mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-slate-100 mb-2">No Flashcards Found</h3>
        <p className="text-slate-400 text-sm mb-6">
          This deck current has no flashcards. Create cards or select another deck to practice!
        </p>
        <button
          onClick={onFinishSession}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30"
        >
          Return to Deck Explorer
        </button>
      </div>
    );
  }

  if (isFinished) {
    const totalTimeSec = Math.round((Date.now() - startTime) / 1000);
    const mins = Math.floor(totalTimeSec / 60);
    const secs = totalTimeSec % 60;
    const accuracy = reviewedCount > 0 ? Math.round((correctCount / reviewedCount) * 100) : 100;

    return (
      <div className="flex flex-col items-center justify-center p-10 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 rounded-3xl border border-indigo-500/30 max-w-lg mx-auto my-8 text-center shadow-2xl backdrop-blur-2xl">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 mb-6">
          <Trophy size={40} className="text-white animate-pulse" />
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-2">Session Complete! 🎉</h2>
        <p className="text-slate-400 text-sm mb-8">Great job studying <span className="text-indigo-300 font-semibold">{deckName}</span></p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-center space-x-1.5 text-indigo-400 mb-1">
              <Sparkles size={16} />
              <span className="text-xs uppercase tracking-wider font-semibold">Cards</span>
            </div>
            <span className="text-2xl font-bold text-slate-100">{reviewedCount}</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-center space-x-1.5 text-emerald-400 mb-1">
              <CheckCircle2 size={16} />
              <span className="text-xs uppercase tracking-wider font-semibold">Accuracy</span>
            </div>
            <span className="text-2xl font-bold text-slate-100">{accuracy}%</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-center space-x-1.5 text-purple-400 mb-1">
              <Clock size={16} />
              <span className="text-xs uppercase tracking-wider font-semibold">Time</span>
            </div>
            <span className="text-2xl font-bold text-slate-100">
              {mins > 0 ? `${mins}m ${secs}s` : `${secs}s`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 w-full">
          <button
            onClick={() => {
              setQueue(cards);
              setCurrentIndex(0);
              setIsFlipped(false);
              setReviewedCount(0);
              setCorrectCount(0);
              setIsFinished(false);
            }}
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all flex items-center justify-center space-x-2 border border-slate-700"
          >
            <RotateCcw size={18} />
            <span>Study Again</span>
          </button>
          <button
            onClick={onFinishSession}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
          >
            <span>Finish</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / queue.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Session Top Bar */}
      <div className="w-full flex items-center justify-between bg-slate-900/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-800 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-indigo-300">{deckName}</h3>
          <span className="text-xs text-slate-400">
            Card {currentIndex + 1} of {queue.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center space-x-3 w-1/3">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400">{progressPercent}%</span>
        </div>
      </div>

      {/* Main Flashcard Component */}
      <CardFlipper
        cardNode={currentCardNode}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(!isFlipped)}
        onEdit={onEditCard}
      />

      {/* Rating Controls (Shown when card is flipped) */}
      <div className="w-full max-w-2xl mt-4 min-h-[70px] flex items-center justify-center">
        {!isFlipped ? (
          <button
            onClick={() => setIsFlipped(true)}
            className="w-full py-4 bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 text-lg tracking-wide border border-indigo-400/30"
          >
            <span>Show Answer</span>
            <kbd className="text-xs bg-indigo-950/60 px-2 py-0.5 rounded text-indigo-200 border border-indigo-400/40">
              Space
            </kbd>
          </button>
        ) : (
          <div className="grid grid-cols-4 gap-3 w-full">
            <button
              onClick={() => handleRateDifficulty(Difficulty.Again)}
              className="py-3 px-2 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 rounded-xl transition-all flex flex-col items-center justify-center text-rose-300 group shadow-lg shadow-rose-950/50"
            >
              <div className="flex items-center space-x-1 font-bold text-sm">
                <span>Again</span>
                <kbd className="text-[10px] bg-rose-900/80 px-1.5 py-0.5 rounded text-rose-200 border border-rose-400/30">1</kbd>
              </div>
              <span className="text-[10px] text-rose-400/80 mt-0.5">Reset</span>
            </button>

            <button
              onClick={() => handleRateDifficulty(Difficulty.Hard)}
              className="py-3 px-2 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 rounded-xl transition-all flex flex-col items-center justify-center text-amber-300 group shadow-lg shadow-amber-950/50"
            >
              <div className="flex items-center space-x-1 font-bold text-sm">
                <span>Hard</span>
                <kbd className="text-[10px] bg-amber-900/80 px-1.5 py-0.5 rounded text-amber-200 border border-amber-400/30">2</kbd>
              </div>
              <span className="text-[10px] text-amber-400/80 mt-0.5">Short Interval</span>
            </button>

            <button
              onClick={() => handleRateDifficulty(Difficulty.Good)}
              className="py-3 px-2 bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/40 rounded-xl transition-all flex flex-col items-center justify-center text-indigo-300 group shadow-lg shadow-indigo-950/50"
            >
              <div className="flex items-center space-x-1 font-bold text-sm">
                <span>Good</span>
                <kbd className="text-[10px] bg-indigo-900/80 px-1.5 py-0.5 rounded text-indigo-200 border border-indigo-400/30">3</kbd>
              </div>
              <span className="text-[10px] text-indigo-400/80 mt-0.5">Normal</span>
            </button>

            <button
              onClick={() => handleRateDifficulty(Difficulty.Easy)}
              className="py-3 px-2 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-xl transition-all flex flex-col items-center justify-center text-emerald-300 group shadow-lg shadow-emerald-950/50"
            >
              <div className="flex items-center space-x-1 font-bold text-sm">
                <span>Easy</span>
                <kbd className="text-[10px] bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-200 border border-emerald-400/30">4</kbd>
              </div>
              <span className="text-[10px] text-emerald-400/80 mt-0.5">Long Interval</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
