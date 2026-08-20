import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RefreshCw, Trophy, RotateCcw, ArrowRight, Shuffle } from 'lucide-react';
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

/**
 * Fisher-Yates shuffle algorithm to randomize revision queue order (matching WinUI 3 random deal)
 */
function shuffleCards(cards: NodeData[]): NodeData[] {
  const array = [...cards];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const XamlRevisionPage: React.FC<XamlRevisionPageProps> = ({
  selectedDividerNode,
  cardsToRevise,
  cardSettings,
  difficultySettings,
  onUpdateCard,
  onGoToFlashcardsPage,
}) => {
  const [queue, setQueue] = useState<NodeData[]>(() => shuffleCards(cardsToRevise));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const dividerKey = selectedDividerNode ? selectedDividerNode.id : '__root__';
  const lastDividerKeyRef = useRef<string>(dividerKey);

  useEffect(() => {
    // Only reset & shuffle queue when switching to a different deck/divider or on initial load
    if (lastDividerKeyRef.current !== dividerKey || queue.length === 0) {
      lastDividerKeyRef.current = dividerKey;
      setQueue(shuffleCards(cardsToRevise));
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsFinished(false);
    }
  }, [dividerKey, cardsToRevise.length]);

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
      const current = queue[currentIndex];
      if (!current || !current.card) return;

      const updates = calculateNextReview(current.card, difficulty, cardSettings, difficultySettings);
      const updatedNode: NodeData = {
        ...current,
        updatedAt: new Date().toISOString(),
        card: {
          ...current.card,
          ...updates,
        },
      };

      // Persist updated card weight to parent library
      onUpdateCard(updatedNode);

      // Update in local queue
      setQueue((prev) => {
        const next = [...prev];
        if (next[currentIndex]) {
          next[currentIndex] = updatedNode;
        }
        return next;
      });

      // Flip card back to front
      setIsFlipped(false);

      // Advance to next card
      if (currentIndex + 1 < queue.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    },
    [queue, currentIndex, cardSettings, difficultySettings, onUpdateCard]
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
      <div className="flex-1 h-full flex flex-col items-center justify-center p-4 sm:p-8 text-center select-none">
        <div className="max-w-md space-y-4">
          <h2 className="text-xl sm:text-2xl font-light text-slate-200">No cards to revise</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            There are currently no flashcards in your decks. Create cards or import a deck to begin cramming.
          </p>
          <button
            onClick={onGoToFlashcardsPage}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-all shadow-lg shadow-indigo-600/30 inline-flex items-center space-x-2 touch-manipulation"
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
      <div className="flex-1 h-full flex flex-col items-center justify-center p-4 sm:p-8 text-center select-none">
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full space-y-5 mx-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto border border-purple-500/30">
            <Trophy size={30} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Revision Complete! 🎉</h2>
          <p className="text-xs text-slate-400">
            You reviewed all {cardsToRevise.length} cards in {selectedDividerNode ? selectedDividerNode.name : 'All Decks'}.
          </p>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => {
                setQueue(shuffleCards(cardsToRevise));
                setCurrentIndex(0);
                setIsFlipped(false);
                setIsFinished(false);
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 inline-flex items-center space-x-2 touch-manipulation"
            >
              <RotateCcw size={14} />
              <span>Revise Again (Reshuffle)</span>
            </button>
            <button
              onClick={onGoToFlashcardsPage}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-all shadow-lg shadow-indigo-600/30 touch-manipulation"
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 1:1 WinUI CardViewModel.cs WeightPercentage calculation formula
  const maxW = cardSettings?.maximumWeight ?? 30.0;
  const minW = cardSettings?.minimumWeight ?? 1.0;
  const rawWeight = typeof currentCardNode?.card?.weight === 'number' ? currentCardNode.card.weight : (cardSettings?.defaultWeight ?? 20.0);
  const weightPercent = Math.min(
    100,
    Math.max(0, Math.round(((maxW - rawWeight) / (maxW - minW)) * 100))
  );

  return (
    <div className="flex-1 h-full flex flex-col justify-between items-center relative overflow-hidden select-none p-3 sm:p-6 bg-transparent">
      {/* Dynamic Header: Deck Badge (Left) + Learning Progress (Dead-Center) + Card Counter & Shuffle (Right) */}
      <div className="w-full flex items-center justify-between z-10 px-2 shrink-0 relative min-h-[36px] bg-transparent">
        {/* Left: Deck Badge */}
        <div className="px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-md backdrop-blur-md text-xs font-medium text-slate-300 flex items-center space-x-1.5 max-w-[130px] sm:max-w-[220px] truncate z-10">
          <RefreshCw size={12} className="text-purple-400 shrink-0" />
          <span className="truncate">{selectedDividerNode ? selectedDividerNode.name : 'All Decks (Root Tree)'}</span>
        </div>

        {/* Center: WinUI 3 Learning Progress Bar (Perfect Geometric Center Alignment) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center z-10 bg-transparent">
          <div
            className="flex items-center space-x-2 bg-slate-900/90 px-3 py-1 rounded-md border border-slate-800 shadow-sm"
            title={`Card learning progress: ${weightPercent}% (Weight: ${rawWeight})`}
          >
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Progress</span>
            <div className="w-16 sm:w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${weightPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-indigo-400">({weightPercent}%)</span>
          </div>
        </div>

        {/* Right: Shuffle & Counter Badge */}
        <div className="flex items-center space-x-1.5 shrink-0 z-10 bg-transparent">
          <button
            onClick={() => {
              setQueue(shuffleCards(cardsToRevise));
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="p-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors flex items-center justify-center touch-manipulation"
            title="Reshuffle cards in deck"
          >
            <Shuffle size={13} />
          </button>
          <span className="text-[11px] sm:text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
            {currentIndex + 1} / {queue.length}
          </span>
        </div>
      </div>

      {/* Center Card Viewport (min-h-0 prevents card from overflowing and pushing buttons offscreen) */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center py-2 bg-transparent">
        <XamlCardControl
          cardNode={currentCardNode}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
          showProgressBar={false}
          isEditButtonVisible={false}
          showFooterHint={false}
          cardSettings={cardSettings}
        />
      </div>

      {/* Rating Buttons Bar (Clean horizontal flex on PC, 2x2 grid on mobile) */}
      <div className="w-full max-w-2xl z-20 pb-safe pb-1 sm:pb-2 shrink-0 bg-transparent">
        {isFlipped ? (
          <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-2 sm:gap-3 transition-all animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={() => handleRateDifficulty(Difficulty.Again)}
              className="py-2.5 sm:py-2 px-3 sm:px-4 bg-slate-900 hover:bg-rose-950 text-rose-400 border border-rose-500/40 rounded-xl text-xs sm:text-sm font-semibold shadow-lg hover:border-rose-500 transition-all flex items-center justify-center space-x-1.5"
              title="Press 1"
            >
              <span className="font-mono opacity-60">(1)</span>
              <span>Again (+{difficultySettings?.againDelta ?? 7})</span>
            </button>
            <button
              onClick={() => handleRateDifficulty(Difficulty.Hard)}
              className="py-2.5 sm:py-2 px-3 sm:px-4 bg-slate-900 hover:bg-amber-950 text-amber-400 border border-amber-500/40 rounded-xl text-xs sm:text-sm font-semibold shadow-lg hover:border-amber-500 transition-all flex items-center justify-center space-x-1.5"
              title="Press 2"
            >
              <span className="font-mono opacity-60">(2)</span>
              <span>Hard (+{difficultySettings?.hardDelta ?? 5})</span>
            </button>
            <button
              onClick={() => handleRateDifficulty(Difficulty.Good)}
              className="py-2.5 sm:py-2 px-3 sm:px-4 bg-slate-900 hover:bg-indigo-950 text-indigo-400 border border-indigo-500/40 rounded-xl text-xs sm:text-sm font-semibold shadow-lg hover:border-indigo-500 transition-all flex items-center justify-center space-x-1.5"
              title="Press 3"
            >
              <span className="font-mono opacity-60">(3)</span>
              <span>Good ({difficultySettings?.goodDelta ?? -2})</span>
            </button>
            <button
              onClick={() => handleRateDifficulty(Difficulty.Easy)}
              className="py-2.5 sm:py-2 px-3 sm:px-4 bg-slate-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs sm:text-sm font-semibold shadow-lg hover:border-emerald-500 transition-all flex items-center justify-center space-x-1.5"
              title="Press 4"
            >
              <span className="font-mono opacity-60">(4)</span>
              <span>Easy ({difficultySettings?.easyDelta ?? -5})</span>
            </button>
          </div>
        ) : (
          <p className="text-[11px] sm:text-xs text-slate-500 text-center italic py-1">
            Click card or press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono text-[10px]">Space</kbd> to reveal answer
          </p>
        )}
      </div>
    </div>
  );
};
