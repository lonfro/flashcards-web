'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { NodeData } from '../types/flashcard';
import {
  CardSettingsData,
  DEFAULT_DIFFICULTY_SETTINGS,
  DifficultySettingsData,
  formatRevisionDelay,
  REVISION_RATINGS,
} from '../types/cardSettings';
import { calculateNextReview, dealRevisionCard } from '../utils/spacedRepetition';
import { idbLogReview } from '../utils/db';
import { triggerDebouncedStatsUpload } from '../utils/googleDriveSync';
import { useLibrary, useSync } from '../context';
import { getDividerPath } from '../utils/storage';
import { XamlCardControl } from './XamlCardControl';
import { XamlCardEditControl } from './XamlCardEditControl';

interface XamlRevisionPageProps {
  selectedDividerNode: NodeData | null;
  cardsToRevise: NodeData[];
  cardSettings: CardSettingsData;
  difficultySettings?: DifficultySettingsData;
  onUpdateCard: (updatedNode: NodeData) => void;
  onGoToFlashcardsPage: () => void;
}

export function XamlRevisionPage({
  selectedDividerNode,
  cardsToRevise,
  cardSettings,
  difficultySettings = DEFAULT_DIFFICULTY_SETTINGS,
  onUpdateCard,
  onGoToFlashcardsPage,
}: XamlRevisionPageProps) {
  const { accessToken } = useSync();
  const { nodes } = useLibrary();
  const [currentId, setCurrentId] = useState(() => dealRevisionCard(cardsToRevise, null)?.id);
  const [isFlipped, setIsFlipped] = useState(false);
  const [editing, setEditing] = useState(false);

  const current = cardsToRevise.find((node) => node.id === currentId);
  const deckName = selectedDividerNode?.name ?? 'All Decks';

  useEffect(() => {
    if (current || cardsToRevise.length === 0) return;
    const nextAvailability = cardsToRevise.reduce((earliest, { card }) =>
      card ? Math.min(earliest, Date.parse(card.hideUntil ?? '') || 0) : earliest, Infinity
    );
    if (!Number.isFinite(nextAvailability)) return;
    let timer: number;
    const dealWhenReady = () => {
      const wait = nextAvailability - Date.now() + 1;
      if (wait > 0) {
        timer = window.setTimeout(dealWhenReady, Math.min(wait, 2_147_483_647));
        return;
      }
      setCurrentId(dealRevisionCard(cardsToRevise, null)?.id);
      setIsFlipped(false);
      setEditing(false);
    };
    timer = window.setTimeout(dealWhenReady, 0);
    return () => window.clearTimeout(timer);
  }, [current, cardsToRevise]);

  function rate(difficulty: number) {
    if (!current?.card || !isFlipped || editing) return;

    const now = Date.now();
    const reviewedAt = new Date(now).toISOString();
    const updated = {
      ...current,
      updatedAt: reviewedAt,
      card: {
        ...current.card,
        ...calculateNextReview(current.card, difficulty, cardSettings, difficultySettings, now),
      },
    };
    onUpdateCard(updated);

    void idbLogReview({
      id: crypto.randomUUID(),
      cardId: current.id,
      cardName: current.name,
      deckId: selectedDividerNode?.id ?? current.parentId,
      deckName,
      difficulty,
      difficultyName: REVISION_RATINGS[difficulty].name,
      reviewedAt,
      date: reviewedAt.slice(0, 10),
      weight: updated.card.weight,
    }).then(() => {
      if (accessToken) triggerDebouncedStatsUpload(accessToken);
    }).catch((error) => console.error('Failed to log review:', error));

    const updatedCards = cardsToRevise.map((node) => node.id === current.id ? updated : node);
    setCurrentId(dealRevisionCard(updatedCards, current.id, now)?.id);
    setIsFlipped(false);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey ||
          (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]'))) return;
      const difficulty = REVISION_RATINGS.findIndex(({ key }) => key === event.key);
      if (current && isFlipped && !editing && difficulty >= 0) {
        event.preventDefault();
        rate(difficulty);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!current?.card) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4 text-center">
        <h2 className="text-xl text-slate-200">
          {cardsToRevise.length ? 'All done!' : 'No cards to revise'}
        </h2>
        <p className="text-sm text-slate-400">
          {cardsToRevise.length
            ? 'No more cards are ready to revise. Come back later.'
            : 'Create cards or import a deck to begin revising.'}
        </p>
        <button onClick={onGoToFlashcardsPage} className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm flex items-center gap-2">
          Go to Flashcards <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 h-full flex flex-col items-center overflow-hidden p-3 sm:p-6">
      <div className="self-start flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300">
        <RefreshCw size={12} className="text-purple-400" />
        {deckName}
      </div>
      <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
        {editing ? (
          <XamlCardEditControl
            key={current.id}
            cardNode={current}
            dividerPath={getDividerPath(nodes, current.parentId)}
            onSave={(front, back) => {
              onUpdateCard({
                ...current,
                name: front.slice(0, 35).replace(/[#*`]/g, '') || current.name,
                updatedAt: new Date().toISOString(),
                card: { ...current.card!, front, back },
              });
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <XamlCardControl
            key={current.id}
            cardNode={current}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped((previous) => !previous)}
            onStartEditing={() => setEditing(true)}
            isEditButtonVisible={isFlipped}
            showFooterHint={false}
            cardSettings={cardSettings}
          />
        )}
      </div>
      {!editing && (isFlipped ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-xl shrink-0 pb-safe">
          {REVISION_RATINGS.map(({ name, key, color, delay }, index) => (
            <button
              key={key}
              onClick={() => rate(index)}
              title={`Press ${key}`}
              className="min-h-12 px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-sm font-semibold flex flex-col items-center justify-center"
              style={{ color }}
            >
              {name}
              <span className="text-xs font-normal">{formatRevisionDelay(difficultySettings[delay])}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 py-1">Tap the card or press Space to reveal the answer</p>
      ))}
    </div>
  );
}
